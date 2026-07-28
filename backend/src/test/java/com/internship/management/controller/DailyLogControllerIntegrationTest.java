package com.internship.management.controller;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.internship.management.dto.request.DailyLogRequest;
import com.internship.management.dto.response.DailyLogResponse;
import com.internship.management.entity.Intern;
import com.internship.management.entity.User;
import com.internship.management.enums.InternStatus;
import com.internship.management.enums.Role;
import com.internship.management.repository.DailyLogRepository;
import com.internship.management.repository.InternRepository;
import com.internship.management.repository.UserRepository;
import com.internship.management.response.ApiResponse;
import com.internship.management.security.CustomUserDetails;
import com.internship.management.service.JwtService;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
public class DailyLogControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private DailyLogRepository dailyLogRepository;

    @Autowired
    private InternRepository internRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtService jwtService;

    @Autowired
    private ObjectMapper objectMapper;

    private String adminToken;
    private String internToken1;
    private String internToken2;

    private User savedAdminUser;
    private User savedInternUser1;
    private User savedInternUser2;

    private Intern savedIntern1;
    private Intern savedIntern2;

    private final List<String> createdLogIds = new ArrayList<>();

    @BeforeEach
    public void setUp() {
        // Create and save test admin user
        User adminUser = User.builder()
                .firstName("Admin")
                .lastName("Test")
                .email("admin-test-" + UUID.randomUUID() + "@example.com")
                .password("password123")
                .role(Role.ADMIN)
                .status("ACTIVE")
                .build();
        savedAdminUser = userRepository.save(adminUser);
        adminToken = jwtService.generateToken(new CustomUserDetails(savedAdminUser));

        // Create and save test intern 1 user & record
        String email1 = "intern1-" + UUID.randomUUID() + "@example.com";
        User internUser1 = User.builder()
                .firstName("InternOne")
                .lastName("Test")
                .email(email1)
                .password("password123")
                .role(Role.INTERN)
                .status("ACTIVE")
                .build();
        savedInternUser1 = userRepository.save(internUser1);
        internToken1 = jwtService.generateToken(new CustomUserDetails(savedInternUser1));

        Intern intern1 = Intern.builder()
                .employeeId("EMP-1-" + UUID.randomUUID().toString().substring(0, 4))
                .firstName("Intern")
                .lastName("One")
                .email(email1)
                .phone("+94771111111")
                .university("UOM")
                .degree("CS")
                .startDate(LocalDate.now().minusMonths(1))
                .endDate(LocalDate.now().plusMonths(5))
                .status(InternStatus.ACTIVE)
                .build();
        savedIntern1 = internRepository.save(intern1);

        // Create and save test intern 2 user & record
        String email2 = "intern2-" + UUID.randomUUID() + "@example.com";
        User internUser2 = User.builder()
                .firstName("InternTwo")
                .lastName("Test")
                .email(email2)
                .password("password123")
                .role(Role.INTERN)
                .status("ACTIVE")
                .build();
        savedInternUser2 = userRepository.save(internUser2);
        internToken2 = jwtService.generateToken(new CustomUserDetails(savedInternUser2));

        Intern intern2 = Intern.builder()
                .employeeId("EMP-2-" + UUID.randomUUID().toString().substring(0, 4))
                .firstName("Intern")
                .lastName("Two")
                .email(email2)
                .phone("+94772222222")
                .university("UCSC")
                .degree("IS")
                .startDate(LocalDate.now().minusMonths(1))
                .endDate(LocalDate.now().plusMonths(5))
                .status(InternStatus.ACTIVE)
                .build();
        savedIntern2 = internRepository.save(intern2);
    }

    @AfterEach
    public void tearDown() {
        // Clean up logs
        for (String id : createdLogIds) {
            dailyLogRepository.deleteById(id);
        }

        // Clean up interns
        if (savedIntern1 != null) {
            internRepository.delete(savedIntern1);
        }
        if (savedIntern2 != null) {
            internRepository.delete(savedIntern2);
        }

        // Clean up users
        if (savedAdminUser != null) {
            userRepository.delete(savedAdminUser);
        }
        if (savedInternUser1 != null) {
            userRepository.delete(savedInternUser1);
        }
        if (savedInternUser2 != null) {
            userRepository.delete(savedInternUser2);
        }
    }

    @Test
    public void testDailyLogCRUDAndRolePermissions() throws Exception {
        DailyLogRequest logRequest = DailyLogRequest.builder()
                .completedWork("Completed module 7 tests")
                .currentWork("Implementing module 8 logic")
                .challenges("Resolving MongoDB date queries")
                .hoursWorked(7.5)
                .nextDayPlan("Write module 8 tests")
                .date(LocalDate.now())
                .build();

        // 1. Role Authorization Checks
        // Request without token -> 401 Unauthorized
        mockMvc.perform(post("/api/logs")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(logRequest)))
                .andExpect(status().isUnauthorized());

        // Admin attempting to create work log -> 403 Forbidden (create log is restricted to INTERN)
        mockMvc.perform(post("/api/logs")
                        .header("Authorization", "Bearer " + adminToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(logRequest)))
                .andExpect(status().isForbidden());

        // 2. Future Date Validation (Bad Request)
        DailyLogRequest futureLogRequest = DailyLogRequest.builder()
                .completedWork("Future work")
                .currentWork("Future work")
                .hoursWorked(8.0)
                .date(LocalDate.now().plusDays(1)) // Future Date
                .build();

        mockMvc.perform(post("/api/logs")
                        .header("Authorization", "Bearer " + internToken1)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(futureLogRequest)))
                .andExpect(status().isBadRequest());

        // 3. Successful Daily Log Creation (Intern 1 Token)
        MvcResult createResult = mockMvc.perform(post("/api/logs")
                        .header("Authorization", "Bearer " + internToken1)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(logRequest)))
                .andExpect(status().isCreated())
                .andReturn();

        ApiResponse<DailyLogResponse> createResponse = objectMapper.readValue(
                createResult.getResponse().getContentAsString(),
                new TypeReference<ApiResponse<DailyLogResponse>>() {}
        );

        assertTrue(createResponse.isSuccess());
        assertNotNull(createResponse.getData());
        assertNotNull(createResponse.getData().getId());
        assertEquals("Completed module 7 tests", createResponse.getData().getCompletedWork());
        assertEquals(savedIntern1.getId(), createResponse.getData().getInternId());

        String logId = createResponse.getData().getId();
        createdLogIds.add(logId);

        // 4. Update Log Ownership Restriction
        // Intern 2 attempts to update Intern 1's log -> 403 Forbidden / Access Denied
        logRequest.setCompletedWork("Hacked completed work");
        mockMvc.perform(put("/api/logs/" + logId)
                        .header("Authorization", "Bearer " + internToken2)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(logRequest)))
                .andExpect(status().isForbidden());

        // Intern 1 updates their own log -> 200 OK
        logRequest.setCompletedWork("Completed module 7 tests successfully");
        MvcResult updateResult = mockMvc.perform(put("/api/logs/" + logId)
                        .header("Authorization", "Bearer " + internToken1)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(logRequest)))
                .andExpect(status().isOk())
                .andReturn();

        ApiResponse<DailyLogResponse> updateResponse = objectMapper.readValue(
                updateResult.getResponse().getContentAsString(),
                new TypeReference<ApiResponse<DailyLogResponse>>() {}
        );

        assertTrue(updateResponse.isSuccess());
        assertEquals("Completed module 7 tests successfully", updateResponse.getData().getCompletedWork());

        // 5. Get Log Details Ownership Restriction
        // Intern 2 attempts to read Intern 1's log details -> 403 Forbidden / Access Denied
        mockMvc.perform(get("/api/logs/" + logId)
                        .header("Authorization", "Bearer " + internToken2))
                .andExpect(status().isForbidden());

        // Intern 1 reads their own log details -> 200 OK
        mockMvc.perform(get("/api/logs/" + logId)
                        .header("Authorization", "Bearer " + internToken1))
                .andExpect(status().isOk());

        // ADMIN reads Intern 1's log details -> 200 OK
        mockMvc.perform(get("/api/logs/" + logId)
                        .header("Authorization", "Bearer " + adminToken))
                .andExpect(status().isOk());

        // 6. List Logs Filtering
        // Intern 2 creates their own log
        DailyLogRequest logRequest2 = DailyLogRequest.builder()
                .completedWork("Completed log 2")
                .currentWork("Working on logs")
                .hoursWorked(6.0)
                .date(LocalDate.now())
                .build();
        MvcResult createResult2 = mockMvc.perform(post("/api/logs")
                        .header("Authorization", "Bearer " + internToken2)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(logRequest2)))
                .andExpect(status().isCreated())
                .andReturn();

        ApiResponse<DailyLogResponse> createResponse2 = objectMapper.readValue(
                createResult2.getResponse().getContentAsString(),
                new TypeReference<ApiResponse<DailyLogResponse>>() {}
        );
        createdLogIds.add(createResponse2.getData().getId());

        // Request list as Intern 1 -> only gets Intern 1's log
        MvcResult listResult = mockMvc.perform(get("/api/logs")
                        .header("Authorization", "Bearer " + internToken1))
                .andExpect(status().isOk())
                .andReturn();

        String listBody1 = listResult.getResponse().getContentAsString();
        assertTrue(listBody1.contains("Completed module 7 tests successfully"));
        assertFalse(listBody1.contains("Completed log 2"), "Intern 1 should not see Intern 2's daily log");

        // Request list as ADMIN -> gets all logs, filter by Month
        int currentMonthValue = LocalDate.now().getMonthValue();
        MvcResult adminListResult = mockMvc.perform(get("/api/logs?month=" + currentMonthValue)
                        .header("Authorization", "Bearer " + adminToken))
                .andExpect(status().isOk())
                .andReturn();

        String adminBody = adminListResult.getResponse().getContentAsString();
        assertTrue(adminBody.contains("Completed module 7 tests successfully"));
        assertTrue(adminBody.contains("Completed log 2"));

        // 7. Delete Log
        // Intern 2 attempts to delete Intern 1's log -> 403 Forbidden
        mockMvc.perform(delete("/api/logs/" + logId)
                        .header("Authorization", "Bearer " + internToken2))
                .andExpect(status().isForbidden());

        // Intern 1 deletes their own log -> 200 OK
        mockMvc.perform(delete("/api/logs/" + logId)
                        .header("Authorization", "Bearer " + internToken1))
                .andExpect(status().isOk());

        // Verify log is deleted
        mockMvc.perform(get("/api/logs/" + logId)
                        .header("Authorization", "Bearer " + adminToken))
                .andExpect(status().isNotFound());
    }
}
