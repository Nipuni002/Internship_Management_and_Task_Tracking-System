package com.internship.management.dto.response;

import com.internship.management.enums.SubmissionStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SubmissionResponse {
    private String id;
    private String taskId;
    private String githubLink;
    private String documentLink;
    private String notes;
    private String feedback;
    private SubmissionStatus status;
    private Instant submittedAt;
}
