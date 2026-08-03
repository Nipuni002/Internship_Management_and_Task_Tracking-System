package com.internship.management.service.impl;

import com.internship.management.dto.request.InternRequest;
import com.internship.management.dto.response.InternResponse;
import com.internship.management.entity.Intern;
import com.internship.management.entity.User;
import com.internship.management.enums.InternStatus;
import com.internship.management.enums.Role;
import com.internship.management.exception.DuplicateResourceException;
import com.internship.management.exception.ResourceNotFoundException;
import com.internship.management.exception.UnauthorizedException;
import com.internship.management.repository.InternRepository;
import com.internship.management.repository.UserRepository;
import com.internship.management.service.InternService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.support.PageableExecutionUtils;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class InternServiceImpl implements InternService {

    private final InternRepository internRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final MongoTemplate mongoTemplate;

    @Override
    public InternResponse createIntern(InternRequest request) {
        if (internRepository.existsByEmail(request.getEmail())) {
            throw new DuplicateResourceException("Email is already in use");
        }
        if (internRepository.existsByEmployeeId(request.getEmployeeId())) {
            throw new DuplicateResourceException("Employee ID is already in use");
        }

        Intern intern = Intern.builder()
                .employeeId(request.getEmployeeId())
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .email(request.getEmail())
                .phone(request.getPhone())
                .university(request.getUniversity())
                .degree(request.getDegree())
                .startDate(request.getStartDate())
                .endDate(request.getEndDate())
                .status(request.getStatus())
                .build();

        Intern savedIntern = internRepository.save(intern);

        // Synchronize creation: Save corresponding User entity for logins
        User user = User.builder()
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .email(request.getEmail())
                .password("FIRST_TIME_LOGIN") // Sentinel string for first-time password setup
                .role(Role.INTERN)
                .status("ACTIVE")
                .build();
        userRepository.save(user);

        return mapToResponse(savedIntern);
    }

    @Override
    public InternResponse updateIntern(String id, InternRequest request) {
        Intern intern = internRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Intern not found with id: " + id));

        String oldEmail = intern.getEmail();

        if (!intern.getEmail().equals(request.getEmail()) && internRepository.existsByEmail(request.getEmail())) {
            throw new DuplicateResourceException("Email is already in use");
        }
        if (!intern.getEmployeeId().equals(request.getEmployeeId()) && internRepository.existsByEmployeeId(request.getEmployeeId())) {
            throw new DuplicateResourceException("Employee ID is already in use");
        }

        intern.setEmployeeId(request.getEmployeeId());
        intern.setFirstName(request.getFirstName());
        intern.setLastName(request.getLastName());
        intern.setEmail(request.getEmail());
        intern.setPhone(request.getPhone());
        intern.setUniversity(request.getUniversity());
        intern.setDegree(request.getDegree());
        intern.setStartDate(request.getStartDate());
        intern.setEndDate(request.getEndDate());
        intern.setStatus(request.getStatus());

        Intern savedIntern = internRepository.save(intern);

        // Synchronize update: Update matching User profile
        userRepository.findByEmail(oldEmail).ifPresent(user -> {
            user.setFirstName(request.getFirstName());
            user.setLastName(request.getLastName());
            user.setEmail(request.getEmail());
            user.setStatus(request.getStatus() == InternStatus.ACTIVE ? "ACTIVE" : "INACTIVE");
            userRepository.save(user);
        });

        return mapToResponse(savedIntern);
    }

    @Override
    public void deleteIntern(String id) {
        Intern intern = internRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Intern not found with id: " + id));

        internRepository.deleteById(id);

        // Synchronize deletion: Delete associated User account
        userRepository.findByEmail(intern.getEmail()).ifPresent(user -> {
            userRepository.deleteById(user.getId());
        });
    }

    @Override
    public InternResponse getInternById(String id) {
        Intern intern = internRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Intern not found with id: " + id));
        return mapToResponse(intern);
    }

    @Override
    public Page<InternResponse> getAllInterns(Pageable pageable, InternStatus status, String university, String degree, String search) {
        Query query = new Query();

        if (status != null) {
            query.addCriteria(Criteria.where("status").is(status));
        }
        if (university != null && !university.isBlank()) {
            query.addCriteria(Criteria.where("university").regex(university, "i"));
        }
        if (degree != null && !degree.isBlank()) {
            query.addCriteria(Criteria.where("degree").regex(degree, "i"));
        }
        if (search != null && !search.isBlank()) {
            Criteria nameOrEmailCriteria = new Criteria().orOperator(
                    Criteria.where("firstName").regex(search, "i"),
                    Criteria.where("lastName").regex(search, "i"),
                    Criteria.where("email").regex(search, "i")
            );
            query.addCriteria(nameOrEmailCriteria);
        }

        long total = mongoTemplate.count(query, Intern.class);
        query.with(pageable);

        List<Intern> interns = mongoTemplate.find(query, Intern.class);
        List<InternResponse> content = interns.stream()
                .map(this::mapToResponse)
                .toList();

        return PageableExecutionUtils.getPage(content, pageable, () -> total);
    }

    @Override
    public InternResponse activateIntern(String id) {
        Intern intern = internRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Intern not found with id: " + id));
        intern.setStatus(InternStatus.ACTIVE);
        Intern saved = internRepository.save(intern);

        userRepository.findByEmail(saved.getEmail()).ifPresent(user -> {
            user.setStatus("ACTIVE");
            userRepository.save(user);
        });

        return mapToResponse(saved);
    }

    @Override
    public InternResponse deactivateIntern(String id) {
        Intern intern = internRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Intern not found with id: " + id));
        intern.setStatus(InternStatus.INACTIVE);
        Intern saved = internRepository.save(intern);

        userRepository.findByEmail(saved.getEmail()).ifPresent(user -> {
            user.setStatus("INACTIVE");
            userRepository.save(user);
        });

        return mapToResponse(saved);
    }

    @Override
    public InternResponse getCurrentInternProfile() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new UnauthorizedException("No user is currently authenticated");
        }
        String email = authentication.getName();
        Intern intern = internRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Intern profile not found for email: " + email));
        return mapToResponse(intern);
    }

    private InternResponse mapToResponse(Intern intern) {
        return InternResponse.builder()
                .id(intern.getId())
                .employeeId(intern.getEmployeeId())
                .firstName(intern.getFirstName())
                .lastName(intern.getLastName())
                .email(intern.getEmail())
                .phone(intern.getPhone())
                .university(intern.getUniversity())
                .degree(intern.getDegree())
                .startDate(intern.getStartDate())
                .endDate(intern.getEndDate())
                .status(intern.getStatus())
                .createdAt(intern.getCreatedAt())
                .updatedAt(intern.getUpdatedAt())
                .build();
    }
}
