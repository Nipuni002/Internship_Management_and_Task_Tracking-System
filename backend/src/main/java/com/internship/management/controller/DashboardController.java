package com.internship.management.controller;

import com.internship.management.dto.response.AdminDashboardResponse;
import com.internship.management.dto.response.InternDashboardResponse;
import com.internship.management.response.ApiResponse;
import com.internship.management.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
@Tag(name = "Dashboard", description = "Endpoints for Admin and Intern dashboards")
public class DashboardController {

    private final DashboardService dashboardService;

    @GetMapping("/admin")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Get Admin dashboard data", description = "Fetches stats, count of interns, tasks, projects, pending reviews, and recent activities for the admin dashboard.")
    @io.swagger.v3.oas.annotations.responses.ApiResponses(value = {
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Admin dashboard fetched successfully"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "401", description = "Unauthorized"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "403", description = "Forbidden - Requires ADMIN role")
    })
    public ResponseEntity<ApiResponse<AdminDashboardResponse>> getAdminDashboard() {
        AdminDashboardResponse response = dashboardService.getAdminDashboard();
        return ResponseEntity.ok(ApiResponse.success("Admin dashboard fetched successfully", response));
    }

    @GetMapping("/intern")
    @PreAuthorize("hasRole('INTERN')")
    @Operation(summary = "Get Intern dashboard data", description = "Fetches task stats, daily log summaries, and overall internship progress for the authenticated intern.")
    @io.swagger.v3.oas.annotations.responses.ApiResponses(value = {
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Intern dashboard fetched successfully"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "401", description = "Unauthorized"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "403", description = "Forbidden - Requires INTERN role")
    })
    public ResponseEntity<ApiResponse<InternDashboardResponse>> getInternDashboard() {
        InternDashboardResponse response = dashboardService.getInternDashboard();
        return ResponseEntity.ok(ApiResponse.success("Intern dashboard fetched successfully", response));
    }
}
