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

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final DashboardService dashboardService;

    @GetMapping("/admin")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<AdminDashboardResponse>> getAdminDashboard() {
        AdminDashboardResponse response = dashboardService.getAdminDashboard();
        return ResponseEntity.ok(ApiResponse.success("Admin dashboard fetched successfully", response));
    }

    @GetMapping("/intern")
    @PreAuthorize("hasRole('INTERN')")
    public ResponseEntity<ApiResponse<InternDashboardResponse>> getInternDashboard() {
        InternDashboardResponse response = dashboardService.getInternDashboard();
        return ResponseEntity.ok(ApiResponse.success("Intern dashboard fetched successfully", response));
    }
}
