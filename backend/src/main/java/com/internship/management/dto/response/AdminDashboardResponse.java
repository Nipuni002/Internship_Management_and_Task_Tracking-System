package com.internship.management.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AdminDashboardResponse {
    private long totalInterns;
    private long activeInterns;
    private long totalProjects;
    private long activeProjects;
    private long pendingTasks;
    private long completedTasks;
    private long overdueTasks;
    private long revisionRequiredTasks;
    private List<RecentActivity> recentActivities;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class RecentActivity {
        private String type; // e.g. "SUBMISSION", "DAILY_LOG", "USER_CREATION"
        private String title;
        private Instant timestamp;
    }
}
