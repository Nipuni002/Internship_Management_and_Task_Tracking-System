package com.internship.management.entity;

import com.internship.management.enums.Priority;
import com.internship.management.enums.TaskStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.mapping.Document;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.Instant;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Document(collection = "tasks")
public class Task {

    @Id
    private String id;

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

    private String submissionLink;

    private String feedback;

    @CreatedDate
    private Instant createdAt;

    @LastModifiedDate
    private Instant updatedAt;
}
