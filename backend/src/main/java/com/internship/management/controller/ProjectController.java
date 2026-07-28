package com.internship.management.controller;

import com.internship.management.dto.request.ProjectAssignmentRequest;
import com.internship.management.dto.request.ProjectRequest;
import com.internship.management.dto.response.ProjectResponse;
import com.internship.management.enums.ProjectStatus;
import com.internship.management.response.ApiResponse;
import com.internship.management.service.ProjectService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;

@RestController
@RequestMapping("/api/projects")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class ProjectController {

    private final ProjectService projectService;

    @PostMapping
    public ResponseEntity<ApiResponse<ProjectResponse>> createProject(@Valid @RequestBody ProjectRequest request) {
        ProjectResponse response = projectService.createProject(request);
        return new ResponseEntity<>(ApiResponse.success("Project created successfully", response), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<ProjectResponse>> updateProject(
            @PathVariable String id,
            @Valid @RequestBody ProjectRequest request
    ) {
        ProjectResponse response = projectService.updateProject(id, request);
        return ResponseEntity.ok(ApiResponse.success("Project updated successfully", response));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteProject(@PathVariable String id) {
        projectService.deleteProject(id);
        return ResponseEntity.ok(ApiResponse.success("Project deleted successfully"));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ProjectResponse>> getProjectById(@PathVariable String id) {
        ProjectResponse response = projectService.getProjectById(id);
        return ResponseEntity.ok(ApiResponse.success("Project fetched successfully", response));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<Page<ProjectResponse>>> getAllProjects(
            Pageable pageable,
            @RequestParam(required = false) ProjectStatus status,
            @RequestParam(required = false) LocalDate deadline,
            @RequestParam(required = false) String technology,
            @RequestParam(required = false) String search
    ) {
        Page<ProjectResponse> response = projectService.getAllProjects(pageable, status, deadline, technology, search);
        return ResponseEntity.ok(ApiResponse.success("Projects fetched successfully", response));
    }

    @PatchMapping("/{id}/assign")
    public ResponseEntity<ApiResponse<ProjectResponse>> assignInterns(
            @PathVariable String id,
            @Valid @RequestBody ProjectAssignmentRequest request
    ) {
        ProjectResponse response = projectService.assignInterns(id, request);
        return ResponseEntity.ok(ApiResponse.success("Interns assigned to project successfully", response));
    }

    @PatchMapping("/{id}/remove")
    public ResponseEntity<ApiResponse<ProjectResponse>> removeInterns(
            @PathVariable String id,
            @Valid @RequestBody ProjectAssignmentRequest request
    ) {
        ProjectResponse response = projectService.removeInterns(id, request);
        return ResponseEntity.ok(ApiResponse.success("Interns removed from project successfully", response));
    }
}
