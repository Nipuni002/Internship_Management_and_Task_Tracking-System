package com.internship.management.service;

import com.internship.management.dto.request.ProjectAssignmentRequest;
import com.internship.management.dto.request.ProjectRequest;
import com.internship.management.dto.response.ProjectResponse;
import com.internship.management.enums.ProjectStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.time.LocalDate;

public interface ProjectService {
    ProjectResponse createProject(ProjectRequest request);
    ProjectResponse updateProject(String id, ProjectRequest request);
    void deleteProject(String id);
    ProjectResponse getProjectById(String id);
    Page<ProjectResponse> getAllProjects(Pageable pageable, ProjectStatus status, LocalDate deadline, String technology, String search);
    ProjectResponse assignInterns(String id, ProjectAssignmentRequest request);
    ProjectResponse removeInterns(String id, ProjectAssignmentRequest request);
}
