package com.internship.management.dto.request;

import com.internship.management.enums.Priority;
import com.internship.management.enums.TaskStatus;
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
public class TaskRequest {

    @NotBlank(message = "Task title is required")
    private String title;

    private String description;

    @NotNull(message = "Task priority is required")
    private Priority priority;

    @NotNull(message = "Task deadline is required")
    private LocalDate deadline;

    @NotNull(message = "Task status is required")
    private TaskStatus status;

    @NotBlank(message = "Project ID is required")
    private String projectId;

    @NotBlank(message = "Assigned intern ID is required")
    private String assignedInternId;
}
