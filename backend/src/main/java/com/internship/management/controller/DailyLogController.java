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

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

import java.time.LocalDate;

@RestController
@RequestMapping("/api/logs")
@RequiredArgsConstructor
@Tag(name = "Daily Logs", description = "Endpoints for managing daily logs by interns")
public class DailyLogController {

    private final DailyLogService dailyLogService;

    @PostMapping
    @PreAuthorize("hasRole('INTERN')")
    @Operation(summary = "Create daily log", description = "Submits a new daily log representing work done by the authenticated intern.")
    @io.swagger.v3.oas.annotations.responses.ApiResponses(value = {
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "201", description = "Daily log created successfully"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "Invalid request details"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "401", description = "Unauthorized - JWT token is missing or invalid"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "403", description = "Forbidden - Requires INTERN role")
    })
    public ResponseEntity<ApiResponse<DailyLogResponse>> createLog(@Valid @RequestBody DailyLogRequest request) {
        DailyLogResponse response = dailyLogService.createLog(request);
        return new ResponseEntity<>(ApiResponse.success("Daily log created successfully", response), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('INTERN')")
    @Operation(summary = "Update daily log", description = "Updates an existing daily log by ID.")
    @io.swagger.v3.oas.annotations.responses.ApiResponses(value = {
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Daily log updated successfully"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "Invalid request details"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "401", description = "Unauthorized"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "403", description = "Forbidden - Requires INTERN role or log ownership"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Daily log not found")
    })
    public ResponseEntity<ApiResponse<DailyLogResponse>> updateLog(
            @PathVariable String id,
            @Valid @RequestBody DailyLogRequest request
    ) {
        DailyLogResponse response = dailyLogService.updateLog(id, request);
        return ResponseEntity.ok(ApiResponse.success("Daily log updated successfully", response));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'INTERN')")
    @Operation(summary = "Delete daily log", description = "Deletes a daily log by ID. Can be performed by an admin, or the owner intern.")
    @io.swagger.v3.oas.annotations.responses.ApiResponses(value = {
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Daily log deleted successfully"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "401", description = "Unauthorized"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "403", description = "Forbidden - Requires ADMIN/INTERN role"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Daily log not found")
    })
    public ResponseEntity<ApiResponse<Void>> deleteLog(@PathVariable String id) {
        dailyLogService.deleteLog(id);
        return ResponseEntity.ok(ApiResponse.success("Daily log deleted successfully"));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'INTERN')")
    @Operation(summary = "Get daily log by ID", description = "Fetches details of a specific daily log.")
    @io.swagger.v3.oas.annotations.responses.ApiResponses(value = {
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Daily log fetched successfully"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "401", description = "Unauthorized"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Daily log not found")
    })
    public ResponseEntity<ApiResponse<DailyLogResponse>> getLogById(@PathVariable String id) {
        DailyLogResponse response = dailyLogService.getLogById(id);
        return ResponseEntity.ok(ApiResponse.success("Daily log fetched successfully", response));
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'INTERN')")
    @Operation(summary = "Get all daily logs (filtered/paginated)", description = "Retrieves all daily logs with filters like date, internId, month, year.")
    @io.swagger.v3.oas.annotations.responses.ApiResponses(value = {
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Daily logs fetched successfully"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "401", description = "Unauthorized")
    })
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
