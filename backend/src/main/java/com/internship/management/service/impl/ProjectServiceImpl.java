package com.internship.management.service.impl;

import com.internship.management.dto.request.ProjectAssignmentRequest;
import com.internship.management.dto.request.ProjectRequest;
import com.internship.management.dto.response.ProjectResponse;
import com.internship.management.entity.Project;
import com.internship.management.enums.ProjectStatus;
import com.internship.management.exception.ResourceNotFoundException;
import com.internship.management.repository.InternRepository;
import com.internship.management.repository.ProjectRepository;
import com.internship.management.service.ProjectService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.support.PageableExecutionUtils;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ProjectServiceImpl implements ProjectService {

    private final ProjectRepository projectRepository;
    private final InternRepository internRepository;
    private final MongoTemplate mongoTemplate;

    @Override
    public ProjectResponse createProject(ProjectRequest request) {
        validateInternIds(request.getAssignedInternIds());

        Project project = Project.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .technology(request.getTechnology() != null ? request.getTechnology() : new ArrayList<>())
                .deadline(request.getDeadline())
                .status(request.getStatus())
                .assignedInternIds(request.getAssignedInternIds() != null ? request.getAssignedInternIds() : new ArrayList<>())
                .build();

        return mapToResponse(projectRepository.save(project));
    }

    @Override
    public ProjectResponse updateProject(String id, ProjectRequest request) {
        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found with id: " + id));

        validateInternIds(request.getAssignedInternIds());

        project.setTitle(request.getTitle());
        project.setDescription(request.getDescription());
        project.setTechnology(request.getTechnology() != null ? request.getTechnology() : new ArrayList<>());
        project.setDeadline(request.getDeadline());
        project.setStatus(request.getStatus());
        project.setAssignedInternIds(request.getAssignedInternIds() != null ? request.getAssignedInternIds() : new ArrayList<>());

        return mapToResponse(projectRepository.save(project));
    }

    @Override
    public void deleteProject(String id) {
        if (!projectRepository.existsById(id)) {
            throw new ResourceNotFoundException("Project not found with id: " + id);
        }
        projectRepository.deleteById(id);
    }

    @Override
    public ProjectResponse getProjectById(String id) {
        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found with id: " + id));
        return mapToResponse(project);
    }

    @Override
    public Page<ProjectResponse> getAllProjects(
            Pageable pageable, ProjectStatus status, LocalDate deadline, String technology, String search) {
        Query query = new Query();

        if (status != null) {
            query.addCriteria(Criteria.where("status").is(status));
        }
        if (deadline != null) {
            // Filter projects where deadline is less than or equal to the specified date
            query.addCriteria(Criteria.where("deadline").lte(deadline));
        }
        if (technology != null && !technology.isBlank()) {
            query.addCriteria(Criteria.where("technology").regex(technology, "i"));
        }
        if (search != null && !search.isBlank()) {
            Criteria searchCriteria = new Criteria().orOperator(
                    Criteria.where("title").regex(search, "i"),
                    Criteria.where("technology").regex(search, "i")
            );
            query.addCriteria(searchCriteria);
        }

        long total = mongoTemplate.count(query, Project.class);
        query.with(pageable);

        List<Project> projects = mongoTemplate.find(query, Project.class);
        List<ProjectResponse> content = projects.stream()
                .map(this::mapToResponse)
                .toList();

        return PageableExecutionUtils.getPage(content, pageable, () -> total);
    }

    @Override
    public ProjectResponse assignInterns(String id, ProjectAssignmentRequest request) {
        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found with id: " + id));

        validateInternIds(request.getInternIds());

        List<String> assigned = project.getAssignedInternIds();
        if (assigned == null) {
            assigned = new ArrayList<>();
        }
        for (String internId : request.getInternIds()) {
            if (!assigned.contains(internId)) {
                assigned.add(internId);
            }
        }
        project.setAssignedInternIds(assigned);
        return mapToResponse(projectRepository.save(project));
    }

    @Override
    public ProjectResponse removeInterns(String id, ProjectAssignmentRequest request) {
        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found with id: " + id));

        List<String> assigned = project.getAssignedInternIds();
        if (assigned != null) {
            assigned.removeAll(request.getInternIds());
            project.setAssignedInternIds(assigned);
        }
        return mapToResponse(projectRepository.save(project));
    }

    private void validateInternIds(List<String> internIds) {
        if (internIds != null) {
            for (String internId : internIds) {
                if (!internRepository.existsById(internId)) {
                    throw new ResourceNotFoundException("Intern not found with ID: " + internId);
                }
            }
        }
    }

    private ProjectResponse mapToResponse(Project project) {
        return ProjectResponse.builder()
                .id(project.getId())
                .title(project.getTitle())
                .description(project.getDescription())
                .technology(project.getTechnology())
                .deadline(project.getDeadline())
                .status(project.getStatus())
                .assignedInternIds(project.getAssignedInternIds())
                .createdAt(project.getCreatedAt())
                .updatedAt(project.getUpdatedAt())
                .build();
    }
}
