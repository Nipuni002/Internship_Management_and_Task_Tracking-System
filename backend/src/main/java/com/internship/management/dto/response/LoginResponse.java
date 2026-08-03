package com.internship.management.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import io.swagger.v3.oas.annotations.media.Schema;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Schema(description = "Response containing JWT token and authenticated user profile details")
public class LoginResponse {
    @Schema(description = "JWT Bearer access token used to access secured APIs", example = "eyJhbGciOiJIUzI1NiJ9...")
    private String accessToken;

    @Schema(description = "Type of authorization token", example = "Bearer")
    private String tokenType;

    @Schema(description = "Unique database identifier of the user", example = "60c72b2f9b1d8e2d8c8b4567")
    private String userId;

    @Schema(description = "Full name of the user", example = "John Doe")
    private String fullName;

    @Schema(description = "Email address of the user", example = "john.doe@example.com")
    private String email;

    @Schema(description = "Role of the user", example = "ROLE_INTERN")
    private String role;
}
