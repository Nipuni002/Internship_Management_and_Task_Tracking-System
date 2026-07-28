package com.internship.management.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DailyLogResponse {
    private String id;
    private String internId;
    private String completedWork;
    private String currentWork;
    private String challenges;
    private Double hoursWorked;
    private String nextDayPlan;
    private LocalDate date;
    private Instant createdAt;
}
