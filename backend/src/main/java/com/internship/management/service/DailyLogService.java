package com.internship.management.service;

import com.internship.management.dto.request.DailyLogRequest;
import com.internship.management.dto.response.DailyLogResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.time.LocalDate;

public interface DailyLogService {
    DailyLogResponse createLog(DailyLogRequest request);
    DailyLogResponse updateLog(String id, DailyLogRequest request);
    void deleteLog(String id);
    DailyLogResponse getLogById(String id);
    Page<DailyLogResponse> getAllLogs(Pageable pageable, LocalDate date, String internId, Integer month, Integer year);
}
