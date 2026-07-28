package com.internship.management.service;

import com.internship.management.dto.request.TaskAssignmentRequest;
import com.internship.management.dto.request.TaskRequest;
import com.internship.management.dto.request.TaskStatusRequest;
import com.internship.management.dto.response.TaskResponse;
import com.internship.management.enums.Priority;
import com.internship.management.enums.TaskStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.time.LocalDate;

public interface TaskService {
    TaskResponse createTask(TaskRequest request);
    TaskResponse updateTask(String id, TaskRequest request);
    void deleteTask(String id);
    TaskResponse getTaskById(String id);
    Page<TaskResponse> getAllTasks(Pageable pageable, TaskStatus status, Priority priority, LocalDate deadline, String projectId, String assignedInternId, String search);
    TaskResponse updateTaskStatus(String id, TaskStatusRequest request);
    TaskResponse assignTask(String id, TaskAssignmentRequest request);
}
