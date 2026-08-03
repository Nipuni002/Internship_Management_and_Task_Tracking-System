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

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

@RestController
@RequestMapping("/api/interns")
@RequiredArgsConstructor
@Tag(name = "Interns", description = "Endpoints for managing intern profiles")
public class InternController {

    private final InternService internService;

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Create an intern profile", description = "Creates a new intern profile and user account. Admin access only.")
    @io.swagger.v3.oas.annotations.responses.ApiResponses(value = {
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "201", description = "Intern profile created successfully"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "Invalid request details"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "401", description = "Unauthorized"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "403", description = "Forbidden - Admin role required"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "409", description = "Conflict - User already exists or validation issue")
    })
    public ResponseEntity<ApiResponse<InternResponse>> createIntern(@Valid @RequestBody InternRequest request) {
        InternResponse response = internService.createIntern(request);
        return new ResponseEntity<>(ApiResponse.success("Intern created successfully", response), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Update an intern profile", description = "Updates details of an existing intern profile. Admin access only.")
    @io.swagger.v3.oas.annotations.responses.ApiResponses(value = {
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Intern profile updated successfully"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "Invalid request details"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "401", description = "Unauthorized"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "403", description = "Forbidden - Admin role required"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Intern profile not found")
    })
    public ResponseEntity<ApiResponse<InternResponse>> updateIntern(
            @PathVariable String id,
            @Valid @RequestBody InternRequest request
    ) {
        InternResponse response = internService.updateIntern(id, request);
        return ResponseEntity.ok(ApiResponse.success("Intern updated successfully", response));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Delete an intern profile", description = "Permanently deletes an intern profile and user account. Admin access only.")
    @io.swagger.v3.oas.annotations.responses.ApiResponses(value = {
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Intern profile deleted successfully"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "401", description = "Unauthorized"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "403", description = "Forbidden - Admin role required"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Intern profile not found")
    })
    public ResponseEntity<ApiResponse<Void>> deleteIntern(@PathVariable String id) {
        internService.deleteIntern(id);
        return ResponseEntity.ok(ApiResponse.success("Intern deleted successfully"));
    }

    @GetMapping("/me")
    @PreAuthorize("hasAnyRole('ADMIN', 'INTERN')")
    @Operation(summary = "Get current logged-in intern profile", description = "Fetches the full intern profile of the currently authenticated user (Intern or Admin).")
    @io.swagger.v3.oas.annotations.responses.ApiResponses(value = {
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Intern profile fetched successfully"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "401", description = "Unauthorized"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Intern profile not found for the user")
    })
    public ResponseEntity<ApiResponse<InternResponse>> getCurrentInternProfile() {
        InternResponse response = internService.getCurrentInternProfile();
        return ResponseEntity.ok(ApiResponse.success("Current intern profile fetched successfully", response));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Get intern profile by ID", description = "Fetches detailed intern profile info. Admin access only.")
    @io.swagger.v3.oas.annotations.responses.ApiResponses(value = {
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Intern profile fetched successfully"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "401", description = "Unauthorized"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "403", description = "Forbidden - Admin role required"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Intern profile not found")
    })
    public ResponseEntity<ApiResponse<InternResponse>> getInternById(@PathVariable String id) {
        InternResponse response = internService.getInternById(id);
        return ResponseEntity.ok(ApiResponse.success("Intern fetched successfully", response));
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Get all intern profiles", description = "Retrieves a paginated list of intern profiles with optional filters. Admin access only.")
    @io.swagger.v3.oas.annotations.responses.ApiResponses(value = {
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Interns fetched successfully"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "401", description = "Unauthorized"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "403", description = "Forbidden - Admin role required")
    })
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
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Activate an intern profile", description = "Changes intern account status to active. Admin access only.")
    @io.swagger.v3.oas.annotations.responses.ApiResponses(value = {
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Intern profile activated successfully"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "401", description = "Unauthorized"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "403", description = "Forbidden - Admin role required"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Intern profile not found")
    })
    public ResponseEntity<ApiResponse<InternResponse>> activateIntern(@PathVariable String id) {
        InternResponse response = internService.activateIntern(id);
        return ResponseEntity.ok(ApiResponse.success("Intern activated successfully", response));
    }

    @PatchMapping("/{id}/deactivate")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Deactivate an intern profile", description = "Changes intern account status to inactive. Admin access only.")
    @io.swagger.v3.oas.annotations.responses.ApiResponses(value = {
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Intern profile deactivated successfully"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "401", description = "Unauthorized"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "403", description = "Forbidden - Admin role required"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Intern profile not found")
    })
    public ResponseEntity<ApiResponse<InternResponse>> deactivateIntern(@PathVariable String id) {
        InternResponse response = internService.deactivateIntern(id);
        return ResponseEntity.ok(ApiResponse.success("Intern deactivated successfully", response));
    }
}
