package com.internship.management.repository;

import com.internship.management.entity.Task;
import com.internship.management.enums.TaskStatus;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface TaskRepository extends MongoRepository<Task, String> {
    List<Task> findByProjectId(String projectId);
    List<Task> findByAssignedInternId(String internId);
    List<Task> findByDeadlineBeforeAndStatusNot(LocalDate deadline, TaskStatus status);
    List<Task> findByAssignedInternIdAndStatus(String internId, TaskStatus status);
}
