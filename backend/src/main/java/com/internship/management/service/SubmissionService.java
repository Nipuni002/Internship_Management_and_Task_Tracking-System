package com.internship.management.service;

import com.internship.management.dto.request.SubmissionRequest;
import com.internship.management.dto.request.SubmissionReviewRequest;
import com.internship.management.dto.response.SubmissionResponse;
import com.internship.management.enums.SubmissionStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface SubmissionService {
    SubmissionResponse createSubmission(SubmissionRequest request);
    SubmissionResponse updateSubmission(String id, SubmissionRequest request);
    SubmissionResponse getSubmissionById(String id);
    Page<SubmissionResponse> getAllSubmissions(Pageable pageable, SubmissionStatus status, String taskId);
    SubmissionResponse approveSubmission(String id, SubmissionReviewRequest request);
    SubmissionResponse rejectSubmission(String id, SubmissionReviewRequest request);
    SubmissionResponse requestRevision(String id, SubmissionReviewRequest request);
}
