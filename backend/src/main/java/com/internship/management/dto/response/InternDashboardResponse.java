package com.internship.management.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class InternDashboardResponse {
    private long assignedProjects;
    private long assignedTasks;
    private long pendingTasks;
    private long completedTasks;
    private String latestFeedback;
    private DailyLogSummary dailyLogSummary;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class DailyLogSummary {
        private long totalLogsSubmitted;
        private double totalHoursWorked;
    }
}
