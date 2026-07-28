package com.internship.management.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SubmissionRequest {

    @NotBlank(message = "Task ID is required")
    private String taskId;

    private String githubLink;

    private String documentLink;

    private String notes;
}
