package com.internship.management.controller;

import com.internship.management.dto.request.DailyLogRequest;
import com.internship.management.dto.response.DailyLogResponse;
import com.internship.management.response.ApiResponse;
import com.internship.management.service.DailyLogService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;

@RestController
@RequestMapping("/api/logs")
@RequiredArgsConstructor
public class DailyLogController {

    private final DailyLogService dailyLogService;

    @PostMapping
    @PreAuthorize("hasRole('INTERN')")
    public ResponseEntity<ApiResponse<DailyLogResponse>> createLog(@Valid @RequestBody DailyLogRequest request) {
        DailyLogResponse response = dailyLogService.createLog(request);
        return new ResponseEntity<>(ApiResponse.success("Daily log created successfully", response), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('INTERN')")
    public ResponseEntity<ApiResponse<DailyLogResponse>> updateLog(
            @PathVariable String id,
            @Valid @RequestBody DailyLogRequest request
    ) {
        DailyLogResponse response = dailyLogService.updateLog(id, request);
        return ResponseEntity.ok(ApiResponse.success("Daily log updated successfully", response));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'INTERN')")
    public ResponseEntity<ApiResponse<Void>> deleteLog(@PathVariable String id) {
        dailyLogService.deleteLog(id);
        return ResponseEntity.ok(ApiResponse.success("Daily log deleted successfully"));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'INTERN')")
    public ResponseEntity<ApiResponse<DailyLogResponse>> getLogById(@PathVariable String id) {
        DailyLogResponse response = dailyLogService.getLogById(id);
        return ResponseEntity.ok(ApiResponse.success("Daily log fetched successfully", response));
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'INTERN')")
    public ResponseEntity<ApiResponse<Page<DailyLogResponse>>> getAllLogs(
            Pageable pageable,
            @RequestParam(required = false) LocalDate date,
            @RequestParam(required = false) String internId,
            @RequestParam(required = false) Integer month,
            @RequestParam(required = false) Integer year
    ) {
        Page<DailyLogResponse> response = dailyLogService.getAllLogs(pageable, date, internId, month, year);
        return ResponseEntity.ok(ApiResponse.success("Daily logs fetched successfully", response));
    }
}
