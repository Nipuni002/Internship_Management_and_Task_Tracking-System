package com.internship.management.controller;

import com.internship.management.dto.request.LoginRequest;
import com.internship.management.dto.request.RegisterRequest;
import com.internship.management.dto.response.LoginResponse;
import com.internship.management.dto.response.RegisterResponse;
import com.internship.management.entity.User;
import com.internship.management.response.ApiResponse;
import com.internship.management.service.AuthenticationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@Tag(name = "Authentication", description = "Authentication and registration endpoints")
public class AuthController {

    private final AuthenticationService authenticationService;

    @PostMapping("/register")
    @Operation(summary = "Register a new user", description = "Registers a new user (admin or intern) in the system.")
    @io.swagger.v3.oas.annotations.responses.ApiResponses(value = {
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "201", description = "User registered successfully"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "Invalid request validation or request body"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "409", description = "User with given email already exists")
    })
    public ResponseEntity<ApiResponse<RegisterResponse>> register(@Valid @RequestBody RegisterRequest request) {
        RegisterResponse response = authenticationService.register(request);
        return new ResponseEntity<>(ApiResponse.success("User registered successfully", response), HttpStatus.CREATED);
    }

    @PostMapping("/login")
    @Operation(summary = "Login user", description = "Authenticates user and returns JWT access token.")
    @io.swagger.v3.oas.annotations.responses.ApiResponses(value = {
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Login successful"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "401", description = "Invalid credentials")
    })
    public ResponseEntity<ApiResponse<LoginResponse>> login(@Valid @RequestBody LoginRequest request) {
        LoginResponse response = authenticationService.login(request);
        return ResponseEntity.ok(ApiResponse.success("Login successful", response));
    }

    @GetMapping("/me")
    @Operation(summary = "Get current user profile", description = "Fetches the profile details of the currently logged-in user.")
    @io.swagger.v3.oas.annotations.responses.ApiResponses(value = {
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Current user fetched successfully"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "401", description = "Unauthorized - JWT token is missing or invalid")
    })
    public ResponseEntity<ApiResponse<User>> getCurrentUser() {
        User user = authenticationService.getCurrentUser();
        return ResponseEntity.ok(ApiResponse.success("Current user fetched successfully", user));
    }

    @GetMapping("/check-first-time")
    @Operation(summary = "Check if user is first-time login", description = "Checks if the user exists and is logging in for the first time (needs password setup).")
    @io.swagger.v3.oas.annotations.responses.ApiResponses(value = {
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Checked successfully")
    })
    public ResponseEntity<ApiResponse<Boolean>> checkFirstTimeLogin(@RequestParam String email) {
        boolean isFirstTime = authenticationService.isFirstTimeLogin(email);
        return ResponseEntity.ok(ApiResponse.success("Status checked successfully", isFirstTime));
    }
}
