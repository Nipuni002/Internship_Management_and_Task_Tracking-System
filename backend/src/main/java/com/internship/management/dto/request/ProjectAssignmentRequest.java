package com.internship.management.dto.request;

import jakarta.validation.constraints.NotEmpty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProjectAssignmentRequest {

    @NotEmpty(message = "Intern IDs list cannot be empty")
    private List<String> internIds;
}
