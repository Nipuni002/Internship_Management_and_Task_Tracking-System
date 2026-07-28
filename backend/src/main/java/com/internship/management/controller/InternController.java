package com.internship.management.controller;

import com.internship.management.dto.request.InternRequest;
import com.internship.management.dto.response.InternResponse;
import com.internship.management.enums.InternStatus;
import com.internship.management.response.ApiResponse;
import com.internship.management.service.InternService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/interns")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class InternController {

    private final InternService internService;

    @PostMapping
    public ResponseEntity<ApiResponse<InternResponse>> createIntern(@Valid @RequestBody InternRequest request) {
        InternResponse response = internService.createIntern(request);
        return new ResponseEntity<>(ApiResponse.success("Intern created successfully", response), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<InternResponse>> updateIntern(
            @PathVariable String id,
            @Valid @RequestBody InternRequest request
    ) {
        InternResponse response = internService.updateIntern(id, request);
        return ResponseEntity.ok(ApiResponse.success("Intern updated successfully", response));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteIntern(@PathVariable String id) {
        internService.deleteIntern(id);
        return ResponseEntity.ok(ApiResponse.success("Intern deleted successfully"));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<InternResponse>> getInternById(@PathVariable String id) {
        InternResponse response = internService.getInternById(id);
        return ResponseEntity.ok(ApiResponse.success("Intern fetched successfully", response));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<Page<InternResponse>>> getAllInterns(
            Pageable pageable,
            @RequestParam(required = false) InternStatus status,
            @RequestParam(required = false) String university,
            @RequestParam(required = false) String degree,
            @RequestParam(required = false) String search
    ) {
        Page<InternResponse> response = internService.getAllInterns(pageable, status, university, degree, search);
        return ResponseEntity.ok(ApiResponse.success("Interns fetched successfully", response));
    }

    @PatchMapping("/{id}/activate")
    public ResponseEntity<ApiResponse<InternResponse>> activateIntern(@PathVariable String id) {
        InternResponse response = internService.activateIntern(id);
        return ResponseEntity.ok(ApiResponse.success("Intern activated successfully", response));
    }

    @PatchMapping("/{id}/deactivate")
    public ResponseEntity<ApiResponse<InternResponse>> deactivateIntern(@PathVariable String id) {
        InternResponse response = internService.deactivateIntern(id);
        return ResponseEntity.ok(ApiResponse.success("Intern deactivated successfully", response));
    }
}
