package com.internship.management.dto.response;

import com.internship.management.enums.InternStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class InternResponse {
    private String id;
    private String employeeId;
    private String firstName;
    private String lastName;
    private String email;
    private String phone;
    private String university;
    private String degree;
    private LocalDate startDate;
    private LocalDate endDate;
    private InternStatus status;
    private Instant createdAt;
    private Instant updatedAt;
}
