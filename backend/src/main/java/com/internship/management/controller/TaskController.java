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

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

import java.time.LocalDate;

@RestController
@RequestMapping("/api/tasks")
@RequiredArgsConstructor
@Tag(name = "Tasks", description = "Endpoints for managing and assigning tasks")
public class TaskController {

    private final TaskService taskService;

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Create task", description = "Creates a new task. Admin access only.")
    @io.swagger.v3.oas.annotations.responses.ApiResponses(value = {
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "201", description = "Task created successfully"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "Invalid request details"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "401", description = "Unauthorized"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "403", description = "Forbidden - Admin role required")
    })
    public ResponseEntity<ApiResponse<TaskResponse>> createTask(@Valid @RequestBody TaskRequest request) {
        TaskResponse response = taskService.createTask(request);
        return new ResponseEntity<>(ApiResponse.success("Task created successfully", response), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Update task", description = "Updates details of an existing task. Admin access only.")
    @io.swagger.v3.oas.annotations.responses.ApiResponses(value = {
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Task updated successfully"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "Invalid request details"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "401", description = "Unauthorized"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "403", description = "Forbidden - Admin role required"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Task not found")
    })
    public ResponseEntity<ApiResponse<TaskResponse>> updateTask(
            @PathVariable String id,
            @Valid @RequestBody TaskRequest request
    ) {
        TaskResponse response = taskService.updateTask(id, request);
        return ResponseEntity.ok(ApiResponse.success("Task updated successfully", response));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Delete task", description = "Deletes a task by ID. Admin access only.")
    @io.swagger.v3.oas.annotations.responses.ApiResponses(value = {
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Task deleted successfully"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "401", description = "Unauthorized"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "403", description = "Forbidden - Admin role required"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Task not found")
    })
    public ResponseEntity<ApiResponse<Void>> deleteTask(@PathVariable String id) {
        taskService.deleteTask(id);
        return ResponseEntity.ok(ApiResponse.success("Task deleted successfully"));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'INTERN')")
    @Operation(summary = "Get task by ID", description = "Retrieves details of a specific task.")
    @io.swagger.v3.oas.annotations.responses.ApiResponses(value = {
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Task fetched successfully"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "401", description = "Unauthorized"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Task not found")
    })
    public ResponseEntity<ApiResponse<TaskResponse>> getTaskById(@PathVariable String id) {
        TaskResponse response = taskService.getTaskById(id);
        return ResponseEntity.ok(ApiResponse.success("Task fetched successfully", response));
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'INTERN')")
    @Operation(summary = "Get all tasks", description = "Retrieves a paginated list of tasks with filters like status, priority, deadline, projectId, and assignedInternId.")
    @io.swagger.v3.oas.annotations.responses.ApiResponses(value = {
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Tasks fetched successfully"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "401", description = "Unauthorized")
    })
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
    @Operation(summary = "Update task status", description = "Updates status of a specific task.")
    @io.swagger.v3.oas.annotations.responses.ApiResponses(value = {
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Task status updated successfully"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "Invalid request details"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "401", description = "Unauthorized"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Task not found")
    })
    public ResponseEntity<ApiResponse<TaskResponse>> updateTaskStatus(
            @PathVariable String id,
            @Valid @RequestBody TaskStatusRequest request
    ) {
        TaskResponse response = taskService.updateTaskStatus(id, request);
        return ResponseEntity.ok(ApiResponse.success("Task status updated successfully", response));
    }

    @PatchMapping("/{id}/assign")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Assign task to intern", description = "Assigns a task to an intern ID. Admin access only.")
    @io.swagger.v3.oas.annotations.responses.ApiResponses(value = {
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Task assigned successfully"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "Invalid request details"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "401", description = "Unauthorized"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "403", description = "Forbidden - Admin role required"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Task not found")
    })
    public ResponseEntity<ApiResponse<TaskResponse>> assignTask(
            @PathVariable String id,
            @Valid @RequestBody TaskAssignmentRequest request
    ) {
        TaskResponse response = taskService.assignTask(id, request);
        return ResponseEntity.ok(ApiResponse.success("Task assigned successfully", response));
    }
}
