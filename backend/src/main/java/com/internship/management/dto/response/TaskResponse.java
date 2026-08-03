package com.internship.management.dto.response;

import com.internship.management.enums.Priority;
import com.internship.management.enums.TaskStatus;
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
public class TaskResponse {
    private String id;
    private String title;
    private String description;
    private Priority priority;
    private LocalDate deadline;
    private TaskStatus status;
    private String projectId;
    private String assignedInternId;
    private String submissionLink;
    private String feedback;
    private Instant createdAt;
    private Instant updatedAt;
}
