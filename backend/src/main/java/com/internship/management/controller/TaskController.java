package com.internship.management.controller;

import com.internship.management.dto.request.TaskAssignmentRequest;
import com.internship.management.dto.request.TaskRequest;
import com.internship.management.dto.request.TaskStatusRequest;
import com.internship.management.dto.response.TaskResponse;
import com.internship.management.enums.Priority;
import com.internship.management.enums.TaskStatus;
import com.internship.management.response.ApiResponse;
import com.internship.management.service.TaskService;
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
@RequestMapping("/api/tasks")
@RequiredArgsConstructor
public class TaskController {

    private final TaskService taskService;

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<TaskResponse>> createTask(@Valid @RequestBody TaskRequest request) {
        TaskResponse response = taskService.createTask(request);
        return new ResponseEntity<>(ApiResponse.success("Task created successfully", response), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<TaskResponse>> updateTask(
            @PathVariable String id,
            @Valid @RequestBody TaskRequest request
    ) {
        TaskResponse response = taskService.updateTask(id, request);
        return ResponseEntity.ok(ApiResponse.success("Task updated successfully", response));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Void>> deleteTask(@PathVariable String id) {
        taskService.deleteTask(id);
        return ResponseEntity.ok(ApiResponse.success("Task deleted successfully"));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'INTERN')")
    public ResponseEntity<ApiResponse<TaskResponse>> getTaskById(@PathVariable String id) {
        TaskResponse response = taskService.getTaskById(id);
        return ResponseEntity.ok(ApiResponse.success("Task fetched successfully", response));
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'INTERN')")
    public ResponseEntity<ApiResponse<Page<TaskResponse>>> getAllTasks(
            Pageable pageable,
            @RequestParam(required = false) TaskStatus status,
            @RequestParam(required = false) Priority priority,
            @RequestParam(required = false) LocalDate deadline,
            @RequestParam(required = false) String projectId,
            @RequestParam(required = false) String assignedInternId,
            @RequestParam(required = false) String search
    ) {
        Page<TaskResponse> response = taskService.getAllTasks(pageable, status, priority, deadline, projectId, assignedInternId, search);
        return ResponseEntity.ok(ApiResponse.success("Tasks fetched successfully", response));
    }

    @PatchMapping("/{id}/status")
    @PreAuthorize("hasAnyRole('ADMIN', 'INTERN')")
    public ResponseEntity<ApiResponse<TaskResponse>> updateTaskStatus(
            @PathVariable String id,
            @Valid @RequestBody TaskStatusRequest request
    ) {
        TaskResponse response = taskService.updateTaskStatus(id, request);
        return ResponseEntity.ok(ApiResponse.success("Task status updated successfully", response));
    }

    @PatchMapping("/{id}/assign")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<TaskResponse>> assignTask(
            @PathVariable String id,
            @Valid @RequestBody TaskAssignmentRequest request
    ) {
        TaskResponse response = taskService.assignTask(id, request);
        return ResponseEntity.ok(ApiResponse.success("Task assigned successfully", response));
    }
}
