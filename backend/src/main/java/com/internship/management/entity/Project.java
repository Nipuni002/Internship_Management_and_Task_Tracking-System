package com.internship.management.entity;

import com.internship.management.enums.ProjectStatus;
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
import java.util.ArrayList;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Document(collection = "projects")
public class Project {

    @Id
    private String id;

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

    @CreatedDate
    private Instant createdAt;

    @LastModifiedDate
    private Instant updatedAt;
}
