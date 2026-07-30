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

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

@RestController
@RequestMapping("/api/submissions")
@RequiredArgsConstructor
@Tag(name = "Submissions", description = "Endpoints for task submissions and admin reviews")
public class SubmissionController {

    private final SubmissionService submissionService;

    @PostMapping
    @PreAuthorize("hasRole('INTERN')")
    @Operation(summary = "Submit task", description = "Allows interns to submit completed tasks with a link/notes.")
    @io.swagger.v3.oas.annotations.responses.ApiResponses(value = {
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "201", description = "Submission created successfully"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "Invalid request details"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "401", description = "Unauthorized"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "403", description = "Forbidden - Requires INTERN role")
    })
    public ResponseEntity<ApiResponse<SubmissionResponse>> createSubmission(@Valid @RequestBody SubmissionRequest request) {
        SubmissionResponse response = submissionService.createSubmission(request);
        return new ResponseEntity<>(ApiResponse.success("Submission created successfully", response), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('INTERN')")
    @Operation(summary = "Update submission", description = "Allows interns to update their task submission details prior to final review.")
    @io.swagger.v3.oas.annotations.responses.ApiResponses(value = {
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Submission updated successfully"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "Invalid request details"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "401", description = "Unauthorized"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "403", description = "Forbidden - Requires INTERN role"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Submission not found")
    })
    public ResponseEntity<ApiResponse<SubmissionResponse>> updateSubmission(
            @PathVariable String id,
            @Valid @RequestBody SubmissionRequest request
    ) {
        SubmissionResponse response = submissionService.updateSubmission(id, request);
        return ResponseEntity.ok(ApiResponse.success("Submission updated successfully", response));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'INTERN')")
    @Operation(summary = "Get submission by ID", description = "Retrieves details of a specific task submission.")
    @io.swagger.v3.oas.annotations.responses.ApiResponses(value = {
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Submission fetched successfully"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "401", description = "Unauthorized"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Submission not found")
    })
    public ResponseEntity<ApiResponse<SubmissionResponse>> getSubmissionById(@PathVariable String id) {
        SubmissionResponse response = submissionService.getSubmissionById(id);
        return ResponseEntity.ok(ApiResponse.success("Submission fetched successfully", response));
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'INTERN')")
    @Operation(summary = "Get all submissions", description = "Retrieves paginated list of task submissions, filterable by status and taskId.")
    @io.swagger.v3.oas.annotations.responses.ApiResponses(value = {
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Submissions fetched successfully"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "401", description = "Unauthorized")
    })
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
    @Operation(summary = "Approve submission", description = "Approves a task submission with feedback. Admin access only.")
    @io.swagger.v3.oas.annotations.responses.ApiResponses(value = {
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Submission approved successfully"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "Invalid request details"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "401", description = "Unauthorized"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "403", description = "Forbidden - Admin role required"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Submission not found")
    })
    public ResponseEntity<ApiResponse<SubmissionResponse>> approveSubmission(
            @PathVariable String id,
            @Valid @RequestBody SubmissionReviewRequest request
    ) {
        SubmissionResponse response = submissionService.approveSubmission(id, request);
        return ResponseEntity.ok(ApiResponse.success("Submission approved successfully", response));
    }

    @PatchMapping("/{id}/reject")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Reject submission", description = "Rejects a task submission with feedback. Admin access only.")
    @io.swagger.v3.oas.annotations.responses.ApiResponses(value = {
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Submission rejected successfully"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "Invalid request details"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "401", description = "Unauthorized"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "403", description = "Forbidden - Admin role required"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Submission not found")
    })
    public ResponseEntity<ApiResponse<SubmissionResponse>> rejectSubmission(
            @PathVariable String id,
            @Valid @RequestBody SubmissionReviewRequest request
    ) {
        SubmissionResponse response = submissionService.rejectSubmission(id, request);
        return ResponseEntity.ok(ApiResponse.success("Submission rejected successfully", response));
    }

    @PatchMapping("/{id}/revision")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Request revision", description = "Requests a revision for a task submission with feedback. Admin access only.")
    @io.swagger.v3.oas.annotations.responses.ApiResponses(value = {
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Revision requested successfully"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "Invalid request details"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "401", description = "Unauthorized"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "403", description = "Forbidden - Admin role required"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Submission not found")
    })
    public ResponseEntity<ApiResponse<SubmissionResponse>> requestRevision(
            @PathVariable String id,
            @Valid @RequestBody SubmissionReviewRequest request
    ) {
        SubmissionResponse response = submissionService.requestRevision(id, request);
        return ResponseEntity.ok(ApiResponse.success("Revision requested successfully", response));
    }
}
