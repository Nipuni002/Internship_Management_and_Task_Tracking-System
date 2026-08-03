package com.internship.management.repository;

import com.internship.management.entity.Submission;
import com.internship.management.enums.SubmissionStatus;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SubmissionRepository extends MongoRepository<Submission, String> {
    List<Submission> findByTaskId(String taskId);
    List<Submission> findByStatus(SubmissionStatus status);
}
