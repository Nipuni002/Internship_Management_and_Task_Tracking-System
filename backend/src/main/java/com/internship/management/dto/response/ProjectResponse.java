package com.internship.management.dto.response;

import com.internship.management.enums.ProjectStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.time.LocalDate;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProjectResponse {
    private String id;
    private String title;
    private String description;
    private List<String> technology;
    private LocalDate deadline;
    private ProjectStatus status;
    private List<String> assignedInternIds;
    private Instant createdAt;
    private Instant updatedAt;
}
