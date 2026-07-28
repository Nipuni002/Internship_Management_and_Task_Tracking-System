package com.internship.management.service.impl;

import com.internship.management.dto.request.TaskAssignmentRequest;
import com.internship.management.dto.request.TaskRequest;
import com.internship.management.dto.request.TaskStatusRequest;
import com.internship.management.dto.response.TaskResponse;
import com.internship.management.entity.Intern;
import com.internship.management.entity.Task;
import com.internship.management.enums.Priority;
import com.internship.management.enums.TaskStatus;
import com.internship.management.exception.ResourceNotFoundException;
import com.internship.management.repository.InternRepository;
import com.internship.management.repository.ProjectRepository;
import com.internship.management.repository.TaskRepository;
import com.internship.management.service.TaskService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.support.PageableExecutionUtils;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class TaskServiceImpl implements TaskService {

    private final TaskRepository taskRepository;
    private final ProjectRepository projectRepository;
    private final InternRepository internRepository;
    private final MongoTemplate mongoTemplate;

    @Override
    public TaskResponse createTask(TaskRequest request) {
        validateProjectAndIntern(request.getProjectId(), request.getAssignedInternId());

        Task task = Task.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .priority(request.getPriority())
                .deadline(request.getDeadline())
                .status(request.getStatus())
                .projectId(request.getProjectId())
                .assignedInternId(request.getAssignedInternId())
                .build();

        return mapToResponse(taskRepository.save(task));
    }

    @Override
    public TaskResponse updateTask(String id, TaskRequest request) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found with id: " + id));

        validateProjectAndIntern(request.getProjectId(), request.getAssignedInternId());

        task.setTitle(request.getTitle());
        task.setDescription(request.getDescription());
        task.setPriority(request.getPriority());
        task.setDeadline(request.getDeadline());
        task.setStatus(request.getStatus());
        task.setProjectId(request.getProjectId());
        task.setAssignedInternId(request.getAssignedInternId());

        return mapToResponse(taskRepository.save(task));
    }

    @Override
    public void deleteTask(String id) {
        if (!taskRepository.existsById(id)) {
            throw new ResourceNotFoundException("Task not found with id: " + id);
        }
        taskRepository.deleteById(id);
    }

    @Override
    public TaskResponse getTaskById(String id) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found with id: " + id));

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        boolean isAdmin = authentication.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));

        if (!isAdmin) {
            String email = authentication.getName();
            Intern intern = internRepository.findByEmail(email)
                    .orElseThrow(() -> new ResourceNotFoundException("Intern record not found for email: " + email));
            if (!task.getAssignedInternId().equals(intern.getId())) {
                throw new AccessDeniedException("You are not authorized to view this task");
            }
        }

        return mapToResponse(task);
    }

    @Override
    public Page<TaskResponse> getAllTasks(
            Pageable pageable, TaskStatus status, Priority priority, LocalDate deadline, String projectId, String assignedInternId, String search) {
        
        Query query = new Query();
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        boolean isAdmin = authentication.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));

        if (!isAdmin) {
            String email = authentication.getName();
            Intern intern = internRepository.findByEmail(email)
                    .orElseThrow(() -> new ResourceNotFoundException("Intern record not found for email: " + email));
            query.addCriteria(Criteria.where("assignedInternId").is(intern.getId()));
        } else {
            if (assignedInternId != null && !assignedInternId.isBlank()) {
                query.addCriteria(Criteria.where("assignedInternId").is(assignedInternId));
            }
        }

        if (status != null) {
            query.addCriteria(Criteria.where("status").is(status));
        }
        if (priority != null) {
            query.addCriteria(Criteria.where("priority").is(priority));
        }
        if (deadline != null) {
            query.addCriteria(Criteria.where("deadline").lte(deadline));
        }
        if (projectId != null && !projectId.isBlank()) {
            query.addCriteria(Criteria.where("projectId").is(projectId));
        }
        if (search != null && !search.isBlank()) {
            Criteria searchCriteria = new Criteria().orOperator(
                    Criteria.where("title").regex(search, "i"),
                    Criteria.where("description").regex(search, "i")
            );
            query.addCriteria(searchCriteria);
        }

        long total = mongoTemplate.count(query, Task.class);
        query.with(pageable);

        List<Task> tasks = mongoTemplate.find(query, Task.class);
        List<TaskResponse> content = tasks.stream()
                .map(this::mapToResponse)
                .toList();

        return PageableExecutionUtils.getPage(content, pageable, () -> total);
    }

    @Override
    public TaskResponse updateTaskStatus(String id, TaskStatusRequest request) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found with id: " + id));

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        boolean isAdmin = authentication.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));

        if (!isAdmin) {
            String email = authentication.getName();
            Intern intern = internRepository.findByEmail(email)
                    .orElseThrow(() -> new ResourceNotFoundException("Intern record not found for email: " + email));

            if (!task.getAssignedInternId().equals(intern.getId())) {
                throw new AccessDeniedException("You are not authorized to update status for this task");
            }

            // Interns can only set status to IN_PROGRESS or SUBMITTED
            if (request.getStatus() != TaskStatus.IN_PROGRESS && request.getStatus() != TaskStatus.SUBMITTED) {
                throw new IllegalArgumentException("Interns are only allowed to update status to IN_PROGRESS or SUBMITTED");
            }

            task.setStatus(request.getStatus());
            if (request.getStatus() == TaskStatus.SUBMITTED) {
                task.setSubmissionLink(request.getSubmissionLink());
            }
        } else {
            task.setStatus(request.getStatus());
            if (request.getFeedback() != null) {
                task.setFeedback(request.getFeedback());
            }
        }

        return mapToResponse(taskRepository.save(task));
    }

    @Override
    public TaskResponse assignTask(String id, TaskAssignmentRequest request) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found with id: " + id));

        if (!internRepository.existsById(request.getAssignedInternId())) {
            throw new ResourceNotFoundException("Intern not found with id: " + request.getAssignedInternId());
        }

        task.setAssignedInternId(request.getAssignedInternId());
        return mapToResponse(taskRepository.save(task));
    }

    private void validateProjectAndIntern(String projectId, String internId) {
        if (!projectRepository.existsById(projectId)) {
            throw new ResourceNotFoundException("Project not found with id: " + projectId);
        }
        if (!internRepository.existsById(internId)) {
            throw new ResourceNotFoundException("Intern not found with id: " + internId);
        }
    }

    private TaskResponse mapToResponse(Task task) {
        return TaskResponse.builder()
                .id(task.getId())
                .title(task.getTitle())
                .description(task.getDescription())
                .priority(task.getPriority())
                .deadline(task.getDeadline())
                .status(task.getStatus())
                .projectId(task.getProjectId())
                .assignedInternId(task.getAssignedInternId())
                .submissionLink(task.getSubmissionLink())
                .feedback(task.getFeedback())
                .createdAt(task.getCreatedAt())
                .updatedAt(task.getUpdatedAt())
                .build();
    }
}
