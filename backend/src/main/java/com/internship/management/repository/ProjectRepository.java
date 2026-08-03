package com.internship.management.repository;

import com.internship.management.entity.Project;
import com.internship.management.enums.ProjectStatus;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProjectRepository extends MongoRepository<Project, String> {
    List<Project> findByStatus(ProjectStatus status);
    List<Project> findByAssignedInternIdsContaining(String internId);
}
