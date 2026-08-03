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
public class TaskAssignmentRequest {

    @NotBlank(message = "Assigned intern ID is required")
    private String assignedInternId;
}
