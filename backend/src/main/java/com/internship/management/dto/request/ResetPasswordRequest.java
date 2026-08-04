package com.internship.management.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import io.swagger.v3.oas.annotations.media.Schema;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Request body for resetting password")
public class ResetPasswordRequest {

    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    @Schema(description = "User's registered email address", example = "intern@internship.com")
    private String email;

    @NotBlank(message = "Employee ID is required")
    @Schema(description = "User's employee ID", example = "EMP123")
    private String employeeId;

    @NotBlank(message = "New password is required")
    @Size(min = 6, message = "Password must be at least 6 characters long")
    @Schema(description = "User's new password", example = "NewPassword123!")
    private String newPassword;
}
