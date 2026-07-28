package com.internship.management.service.impl;

import com.internship.management.dto.request.DailyLogRequest;
import com.internship.management.dto.response.DailyLogResponse;
import com.internship.management.entity.DailyLog;
import com.internship.management.entity.Intern;
import com.internship.management.exception.ResourceNotFoundException;
import com.internship.management.repository.DailyLogRepository;
import com.internship.management.repository.InternRepository;
import com.internship.management.service.DailyLogService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.support.PageableExecutionUtils;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class DailyLogServiceImpl implements DailyLogService {

    private final DailyLogRepository dailyLogRepository;
    private final InternRepository internRepository;
    private final MongoTemplate mongoTemplate;

    @Override
    public DailyLogResponse createLog(DailyLogRequest request) {
        validateDate(request.getDate());

        Intern intern = getCurrentIntern();

        DailyLog dailyLog = DailyLog.builder()
                .internId(intern.getId())
                .completedWork(request.getCompletedWork())
                .currentWork(request.getCurrentWork())
                .challenges(request.getChallenges())
                .hoursWorked(request.getHoursWorked())
                .nextDayPlan(request.getNextDayPlan())
                .date(request.getDate())
                .build();

        return mapToResponse(dailyLogRepository.save(dailyLog));
    }

    @Override
    public DailyLogResponse updateLog(String id, DailyLogRequest request) {
        validateDate(request.getDate());

        DailyLog dailyLog = dailyLogRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Daily log not found with id: " + id));

        verifyOwnership(dailyLog.getInternId(), "You are not authorized to update this daily log");

        dailyLog.setCompletedWork(request.getCompletedWork());
        dailyLog.setCurrentWork(request.getCurrentWork());
        dailyLog.setChallenges(request.getChallenges());
        dailyLog.setHoursWorked(request.getHoursWorked());
        dailyLog.setNextDayPlan(request.getNextDayPlan());
        dailyLog.setDate(request.getDate());

        return mapToResponse(dailyLogRepository.save(dailyLog));
    }

    @Override
    public void deleteLog(String id) {
        DailyLog dailyLog = dailyLogRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Daily log not found with id: " + id));

        verifyOwnership(dailyLog.getInternId(), "You are not authorized to delete this daily log");

        dailyLogRepository.deleteById(id);
    }

    @Override
    public DailyLogResponse getLogById(String id) {
        DailyLog dailyLog = dailyLogRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Daily log not found with id: " + id));

        verifyOwnership(dailyLog.getInternId(), "You are not authorized to view this daily log");

        return mapToResponse(dailyLog);
    }

    @Override
    public Page<DailyLogResponse> getAllLogs(Pageable pageable, LocalDate date, String internId, Integer month, Integer year) {
        Query query = new Query();
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        boolean isAdmin = authentication.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));

        if (!isAdmin) {
            // Intern can only view their own logs
            Intern intern = getCurrentIntern();
            query.addCriteria(Criteria.where("internId").is(intern.getId()));
        } else {
            // Admin can view all logs, and filter by internId if provided
            if (internId != null && !internId.isBlank()) {
                query.addCriteria(Criteria.where("internId").is(internId));
            }
        }

        if (date != null) {
            query.addCriteria(Criteria.where("date").is(date));
        }

        if (month != null) {
            int filterYear = (year != null) ? year : LocalDate.now().getYear();
            LocalDate start = LocalDate.of(filterYear, month, 1);
            LocalDate end = start.withDayOfMonth(start.lengthOfMonth());
            query.addCriteria(Criteria.where("date").gte(start).lte(end));
        }

        long total = mongoTemplate.count(query, DailyLog.class);
        query.with(pageable);

        List<DailyLog> logs = mongoTemplate.find(query, DailyLog.class);
        List<DailyLogResponse> content = logs.stream()
                .map(this::mapToResponse)
                .toList();

        return PageableExecutionUtils.getPage(content, pageable, () -> total);
    }

    private Intern getCurrentIntern() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        return internRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Intern record not found for email: " + email));
    }

    private void verifyOwnership(String logInternId, String accessDeniedMessage) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        boolean isAdmin = authentication.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));

        if (!isAdmin) {
            Intern intern = getCurrentIntern();
            if (!logInternId.equals(intern.getId())) {
                throw new AccessDeniedException(accessDeniedMessage);
            }
        }
    }

    private void validateDate(LocalDate date) {
        if (date.isAfter(LocalDate.now())) {
            throw new IllegalArgumentException("Daily log date cannot be in the future");
        }
    }

    private DailyLogResponse mapToResponse(DailyLog dailyLog) {
        return DailyLogResponse.builder()
                .id(dailyLog.getId())
                .internId(dailyLog.getInternId())
                .completedWork(dailyLog.getCompletedWork())
                .currentWork(dailyLog.getCurrentWork())
                .challenges(dailyLog.getChallenges())
                .hoursWorked(dailyLog.getHoursWorked())
                .nextDayPlan(dailyLog.getNextDayPlan())
                .date(dailyLog.getDate())
                .createdAt(dailyLog.getCreatedAt())
                .build();
    }
}
