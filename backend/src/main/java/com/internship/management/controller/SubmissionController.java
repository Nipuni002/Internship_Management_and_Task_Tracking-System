package com.internship.management.controller;

import com.internship.management.dto.request.SubmissionRequest;
import com.internship.management.dto.request.SubmissionReviewRequest;
import com.internship.management.dto.response.SubmissionResponse;
import com.internship.management.enums.SubmissionStatus;
import com.internship.management.response.ApiResponse;
import com.internship.management.service.SubmissionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/submissions")
@RequiredArgsConstructor
public class SubmissionController {

    private final SubmissionService submissionService;

    @PostMapping
    @PreAuthorize("hasRole('INTERN')")
    public ResponseEntity<ApiResponse<SubmissionResponse>> createSubmission(@Valid @RequestBody SubmissionRequest request) {
        SubmissionResponse response = submissionService.createSubmission(request);
        return new ResponseEntity<>(ApiResponse.success("Submission created successfully", response), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('INTERN')")
    public ResponseEntity<ApiResponse<SubmissionResponse>> updateSubmission(
            @PathVariable String id,
            @Valid @RequestBody SubmissionRequest request
    ) {
        SubmissionResponse response = submissionService.updateSubmission(id, request);
        return ResponseEntity.ok(ApiResponse.success("Submission updated successfully", response));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'INTERN')")
    public ResponseEntity<ApiResponse<SubmissionResponse>> getSubmissionById(@PathVariable String id) {
        SubmissionResponse response = submissionService.getSubmissionById(id);
        return ResponseEntity.ok(ApiResponse.success("Submission fetched successfully", response));
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'INTERN')")
    public ResponseEntity<ApiResponse<Page<SubmissionResponse>>> getAllSubmissions(
            Pageable pageable,
            @RequestParam(required = false) SubmissionStatus status,
            @RequestParam(required = false) String taskId
    ) {
        Page<SubmissionResponse> response = submissionService.getAllSubmissions(pageable, status, taskId);
        return ResponseEntity.ok(ApiResponse.success("Submissions fetched successfully", response));
    }

    @PatchMapping("/{id}/approve")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<SubmissionResponse>> approveSubmission(
            @PathVariable String id,
            @Valid @RequestBody SubmissionReviewRequest request
    ) {
        SubmissionResponse response = submissionService.approveSubmission(id, request);
        return ResponseEntity.ok(ApiResponse.success("Submission approved successfully", response));
    }

    @PatchMapping("/{id}/reject")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<SubmissionResponse>> rejectSubmission(
            @PathVariable String id,
            @Valid @RequestBody SubmissionReviewRequest request
    ) {
        SubmissionResponse response = submissionService.rejectSubmission(id, request);
        return ResponseEntity.ok(ApiResponse.success("Submission rejected successfully", response));
    }

    @PatchMapping("/{id}/revision")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<SubmissionResponse>> requestRevision(
            @PathVariable String id,
            @Valid @RequestBody SubmissionReviewRequest request
    ) {
        SubmissionResponse response = submissionService.requestRevision(id, request);
        return ResponseEntity.ok(ApiResponse.success("Revision requested successfully", response));
    }
}
