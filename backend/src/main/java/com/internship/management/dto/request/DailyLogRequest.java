package com.internship.management.dto.request;

import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DailyLogRequest {

    @NotBlank(message = "Completed work description is required")
    private String completedWork;

    @NotBlank(message = "Current work description is required")
    private String currentWork;

    private String challenges;

    @NotNull(message = "Hours worked is required")
    @DecimalMin(value = "0.1", message = "Hours worked must be at least 0.1")
    @DecimalMax(value = "24.0", message = "Hours worked cannot exceed 24.0")
    private Double hoursWorked;

    private String nextDayPlan;

    @NotNull(message = "Date is required")
    private LocalDate date;
}
