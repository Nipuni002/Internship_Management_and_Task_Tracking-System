package com.internship.management.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.Instant;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Document(collection = "daily_logs")
public class DailyLog {

    @Id
    private String id;

    @NotBlank(message = "Intern ID is required")
    private String internId;

    @NotBlank(message = "Completed work description is required")
    private String completedWork;

    @NotBlank(message = "Current work description is required")
    private String currentWork;

    private String challenges;

    @NotNull(message = "Hours worked is required")
    @DecimalMin(value = "0.1", message = "Hours worked must be at least 0.1")
    private Double hoursWorked;

    private String nextDayPlan;

    @NotNull(message = "Date is required")
    private LocalDate date;

    @CreatedDate
    private Instant createdAt;
}
