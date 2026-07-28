package com.internship.management.dto.request;

import com.internship.management.enums.ProjectStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProjectRequest {

    @NotBlank(message = "Project title is required")
    private String title;

    private String description;

    @Builder.Default
    private List<String> technology = new ArrayList<>();

    @NotNull(message = "Project deadline is required")
    private LocalDate deadline;

    @NotNull(message = "Project status is required")
    private ProjectStatus status;

    @Builder.Default
    private List<String> assignedInternIds = new ArrayList<>();
}
