package com.internship.management.dto.request;

import com.internship.management.enums.TaskStatus;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TaskStatusRequest {

    @NotNull(message = "Task status is required")
    private TaskStatus status;

    private String submissionLink;

    private String feedback;
}
