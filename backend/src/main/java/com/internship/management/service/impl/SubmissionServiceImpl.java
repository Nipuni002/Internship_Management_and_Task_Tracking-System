package com.internship.management.service.impl;

import com.internship.management.dto.request.SubmissionRequest;
import com.internship.management.dto.request.SubmissionReviewRequest;
import com.internship.management.dto.response.SubmissionResponse;
import com.internship.management.entity.Intern;
import com.internship.management.entity.Submission;
import com.internship.management.entity.Task;
import com.internship.management.enums.SubmissionStatus;
import com.internship.management.enums.TaskStatus;
import com.internship.management.exception.ResourceNotFoundException;
import com.internship.management.repository.InternRepository;
import com.internship.management.repository.SubmissionRepository;
import com.internship.management.repository.TaskRepository;
import com.internship.management.service.SubmissionService;
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

import java.util.List;

@Service
@RequiredArgsConstructor
public class SubmissionServiceImpl implements SubmissionService {

    private final SubmissionRepository submissionRepository;
    private final TaskRepository taskRepository;
    private final InternRepository internRepository;
    private final MongoTemplate mongoTemplate;

    @Override
    public SubmissionResponse createSubmission(SubmissionRequest request) {
        Intern intern = getCurrentIntern();

        Task task = taskRepository.findById(request.getTaskId())
                .orElseThrow(() -> new ResourceNotFoundException("Task not found with id: " + request.getTaskId()));

        if (!task.getAssignedInternId().equals(intern.getId())) {
            throw new AccessDeniedException("You are not authorized to submit work for this task");
        }

        Submission submission = Submission.builder()
                .taskId(request.getTaskId())
                .githubLink(request.getGithubLink())
                .documentLink(request.getDocumentLink())
                .notes(request.getNotes())
                .status(SubmissionStatus.PENDING)
                .build();

        Submission saved = submissionRepository.save(submission);

        // Auto-update task status
        task.setStatus(TaskStatus.SUBMITTED);
        task.setSubmissionLink(request.getGithubLink() != null ? request.getGithubLink() : request.getDocumentLink());
        taskRepository.save(task);

        return mapToResponse(saved);
    }

    @Override
    public SubmissionResponse updateSubmission(String id, SubmissionRequest request) {
        Submission submission = submissionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Submission not found with id: " + id));

        Task task = taskRepository.findById(submission.getTaskId())
                .orElseThrow(() -> new ResourceNotFoundException("Task not found with id: " + submission.getTaskId()));

        Intern intern = getCurrentIntern();
        if (!task.getAssignedInternId().equals(intern.getId())) {
            throw new AccessDeniedException("You are not authorized to update this submission");
        }

        if (submission.getStatus() == SubmissionStatus.APPROVED || submission.getStatus() == SubmissionStatus.REJECTED) {
            throw new IllegalArgumentException("Cannot update a submission that has already been " + submission.getStatus());
        }

        submission.setGithubLink(request.getGithubLink());
        submission.setDocumentLink(request.getDocumentLink());
        submission.setNotes(request.getNotes());
        submission.setStatus(SubmissionStatus.PENDING); // Reset to pending for supervisor review

        Submission saved = submissionRepository.save(submission);

        // Update task status back to submitted
        task.setStatus(TaskStatus.SUBMITTED);
        task.setSubmissionLink(request.getGithubLink() != null ? request.getGithubLink() : request.getDocumentLink());
        taskRepository.save(task);

        return mapToResponse(saved);
    }

    @Override
    public SubmissionResponse getSubmissionById(String id) {
        Submission submission = submissionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Submission not found with id: " + id));

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        boolean isAdmin = authentication.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));

        if (!isAdmin) {
            Task task = taskRepository.findById(submission.getTaskId())
                    .orElseThrow(() -> new ResourceNotFoundException("Task not found for submission"));
            Intern intern = getCurrentIntern();
            if (!task.getAssignedInternId().equals(intern.getId())) {
                throw new AccessDeniedException("You are not authorized to view this submission");
            }
        }

        return mapToResponse(submission);
    }

    @Override
    public Page<SubmissionResponse> getAllSubmissions(Pageable pageable, SubmissionStatus status, String taskId) {
        Query query = new Query();
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        boolean isAdmin = authentication.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));

        if (!isAdmin) {
            // Intern: view own submissions
            Intern intern = getCurrentIntern();
            List<Task> tasks = taskRepository.findByAssignedInternId(intern.getId());
            List<String> taskIds = tasks.stream().map(Task::getId).toList();
            query.addCriteria(Criteria.where("taskId").in(taskIds));
        } else {
            // Admin: filter by taskId if provided
            if (taskId != null && !taskId.isBlank()) {
                query.addCriteria(Criteria.where("taskId").is(taskId));
            }
        }

        if (status != null) {
            query.addCriteria(Criteria.where("status").is(status));
        }

        long total = mongoTemplate.count(query, Submission.class);
        query.with(pageable);

        List<Submission> submissions = mongoTemplate.find(query, Submission.class);
        List<SubmissionResponse> content = submissions.stream()
                .map(this::mapToResponse)
                .toList();

        return PageableExecutionUtils.getPage(content, pageable, () -> total);
    }

    @Override
    public SubmissionResponse approveSubmission(String id, SubmissionReviewRequest request) {
        return transitionSubmission(id, SubmissionStatus.APPROVED, TaskStatus.COMPLETED, request.getFeedback());
    }

    @Override
    public SubmissionResponse rejectSubmission(String id, SubmissionReviewRequest request) {
        return transitionSubmission(id, SubmissionStatus.REJECTED, TaskStatus.TODO, request.getFeedback());
    }

    @Override
    public SubmissionResponse requestRevision(String id, SubmissionReviewRequest request) {
        return transitionSubmission(id, SubmissionStatus.REVISION_REQUIRED, TaskStatus.REVISION_REQUIRED, request.getFeedback());
    }

    private SubmissionResponse transitionSubmission(String id, SubmissionStatus subStatus, TaskStatus taskStatus, String feedback) {
        Submission submission = submissionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Submission not found with id: " + id));

        Task task = taskRepository.findById(submission.getTaskId())
                .orElseThrow(() -> new ResourceNotFoundException("Task not found for submission"));

        submission.setStatus(subStatus);
        submission.setFeedback(feedback);
        Submission saved = submissionRepository.save(submission);

        // Update task state
        task.setStatus(taskStatus);
        task.setFeedback(feedback);
        taskRepository.save(task);

        return mapToResponse(saved);
    }

    @Override
    public void deleteSubmission(String id) {
        Submission submission = submissionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Submission not found with id: " + id));

        Task task = taskRepository.findById(submission.getTaskId())
                .orElseThrow(() -> new ResourceNotFoundException("Task not found for submission"));

        Intern intern = getCurrentIntern();
        if (!task.getAssignedInternId().equals(intern.getId())) {
            throw new AccessDeniedException("You are not authorized to delete this submission");
        }

        if (submission.getStatus() == SubmissionStatus.APPROVED || submission.getStatus() == SubmissionStatus.REJECTED) {
            throw new IllegalArgumentException("Cannot delete a submission that has already been " + submission.getStatus());
        }

        submissionRepository.delete(submission);

        // Update task state back to TODO
        task.setStatus(TaskStatus.TODO);
        task.setSubmissionLink(null);
        task.setFeedback(null);
        taskRepository.save(task);
    }

    private Intern getCurrentIntern() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        return internRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Intern record not found for email: " + email));
    }

    private SubmissionResponse mapToResponse(Submission submission) {
        return SubmissionResponse.builder()
                .id(submission.getId())
                .taskId(submission.getTaskId())
                .githubLink(submission.getGithubLink())
                .documentLink(submission.getDocumentLink())
                .notes(submission.getNotes())
                .feedback(submission.getFeedback())
                .status(submission.getStatus())
                .submittedAt(submission.getSubmittedAt())
                .build();
    }
}
