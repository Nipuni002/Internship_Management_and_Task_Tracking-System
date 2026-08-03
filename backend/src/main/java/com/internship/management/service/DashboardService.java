package com.internship.management.service;

import com.internship.management.dto.response.AdminDashboardResponse;
import com.internship.management.dto.response.InternDashboardResponse;

public interface DashboardService {
    AdminDashboardResponse getAdminDashboard();
    InternDashboardResponse getInternDashboard();
}
