package com.internship.management.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import io.swagger.v3.oas.annotations.media.Schema;

import java.time.Instant;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Schema(description = "Standard structure for all API responses")
public class ApiResponse<T> {
    @Schema(description = "Indicates whether the request was successful", example = "true")
    private boolean success;

    @Schema(description = "Descriptive message regarding response status", example = "Operation completed successfully")
    private String message;

    @Schema(description = "Payload of the response")
    private T data;

    @Schema(description = "Timestamp when the response was generated")
    private Instant timestamp;

    public static <T> ApiResponse<T> success(String message, T data) {
        return ApiResponse.<T>builder()
                .success(true)
                .message(message)
                .data(data)
                .timestamp(Instant.now())
                .build();
    }

    public static <T> ApiResponse<T> success(String message) {
        return success(message, null);
    }
}
