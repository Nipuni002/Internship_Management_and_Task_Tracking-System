package com.internship.management.entity;

import com.internship.management.enums.SubmissionStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.Instant;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Document(collection = "submissions")
public class Submission {

    @Id
    private String id;

    @NotBlank(message = "Task ID is required")
    private String taskId;

    private String githubLink;

    private String documentLink;

    private String notes;

    private String feedback;

    @NotNull(message = "Submission status is required")
    private SubmissionStatus status;

    @CreatedDate
    private Instant submittedAt;
}
