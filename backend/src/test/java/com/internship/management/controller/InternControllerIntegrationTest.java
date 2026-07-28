package com.internship.management.controller;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.internship.management.dto.request.InternRequest;
import com.internship.management.dto.response.InternResponse;
import com.internship.management.entity.Intern;
import com.internship.management.entity.User;
import com.internship.management.enums.InternStatus;
import com.internship.management.enums.Role;
import com.internship.management.repository.InternRepository;
import com.internship.management.repository.UserRepository;
import com.internship.management.response.ApiResponse;
import com.internship.management.response.ErrorResponse;
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
public class InternControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private InternRepository internRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtService jwtService;

    @Autowired
    private ObjectMapper objectMapper;

    private String adminToken;
    private String internToken;
    private User savedAdminUser;
    private User savedInternUser;
    private final List<String> createdInternIds = new ArrayList<>();

    @BeforeEach
    public void setUp() {
        // Create and save test admin user to DB
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

        // Create and save test intern user to DB
        User internUser = User.builder()
                .firstName("Intern")
                .lastName("Test")
                .email("intern-test-" + UUID.randomUUID() + "@example.com")
                .password("password123")
                .role(Role.INTERN)
                .status("ACTIVE")
                .build();
        savedInternUser = userRepository.save(internUser);
        internToken = jwtService.generateToken(new CustomUserDetails(savedInternUser));
    }

    @AfterEach
    public void tearDown() {
        // Clean up created interns from database
        for (String id : createdInternIds) {
            internRepository.deleteById(id);
        }
        
        // Clean up created users from database
        if (savedAdminUser != null) {
            userRepository.delete(savedAdminUser);
        }
        if (savedInternUser != null) {
            userRepository.delete(savedInternUser);
        }
    }

    @Test
    public void testRoleBasedAccessAndCRUDWorkflow() throws Exception {
        String testEmail = "intern-" + UUID.randomUUID() + "@example.com";
        String testEmpId = "EMP-" + UUID.randomUUID().toString().substring(0, 8);

        InternRequest internRequest = InternRequest.builder()
                .employeeId(testEmpId)
                .firstName("John")
                .lastName("Doe")
                .email(testEmail)
                .phone("+94771234567")
                .university("University of Moratuwa")
                .degree("Computer Science")
                .startDate(LocalDate.of(2026, 1, 1))
                .endDate(LocalDate.of(2026, 6, 30))
                .status(InternStatus.ACTIVE)
                .build();

        // 1. JWT Protection Checks
        // Request without token -> 401 Unauthorized
        mockMvc.perform(post("/api/interns")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(internRequest)))
                .andExpect(status().isUnauthorized());

        // Request with INTERN role -> 403 Forbidden
        mockMvc.perform(post("/api/interns")
                        .header("Authorization", "Bearer " + internToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(internRequest)))
                .andExpect(status().isForbidden());

        // 2. Validation Checks (Bad Request)
        InternRequest invalidRequest = InternRequest.builder()
                .employeeId("") // Blank
                .firstName("John")
                .lastName("Doe")
                .email("not-an-email") // Invalid email
                .phone("123") // Invalid phone format
                .university("UOM")
                .degree("CS")
                .startDate(null) // Null
                .endDate(LocalDate.of(2026, 6, 30))
                .status(null) // Null
                .build();

        mockMvc.perform(post("/api/interns")
                        .header("Authorization", "Bearer " + adminToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(invalidRequest)))
                .andExpect(status().isBadRequest());

        // 3. Successful Intern Creation (ADMIN Token)
        MvcResult createResult = mockMvc.perform(post("/api/interns")
                        .header("Authorization", "Bearer " + adminToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(internRequest)))
                .andExpect(status().isCreated())
                .andReturn();

        ApiResponse<InternResponse> createResponse = objectMapper.readValue(
                createResult.getResponse().getContentAsString(),
                new TypeReference<ApiResponse<InternResponse>>() {}
        );

        assertTrue(createResponse.isSuccess());
        assertNotNull(createResponse.getData());
        assertNotNull(createResponse.getData().getId());
        assertEquals(testEmail, createResponse.getData().getEmail());
        assertEquals(InternStatus.ACTIVE, createResponse.getData().getStatus());

        String internId = createResponse.getData().getId();
        createdInternIds.add(internId);

        // 4. Duplicate Email Check (Conflict)
        InternRequest duplicateEmailRequest = InternRequest.builder()
                .employeeId("EMP-DIFF")
                .firstName("Jane")
                .lastName("Doe")
                .email(testEmail) // Duplicate email
                .phone("+94777654321")
                .university("University of Kelaniya")
                .degree("Software Engineering")
                .startDate(LocalDate.of(2026, 1, 1))
                .endDate(LocalDate.of(2026, 6, 30))
                .status(InternStatus.ACTIVE)
                .build();

        mockMvc.perform(post("/api/interns")
                        .header("Authorization", "Bearer " + adminToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(duplicateEmailRequest)))
                .andExpect(status().isConflict());

        // 5. Get Intern by ID
        MvcResult getResult = mockMvc.perform(get("/api/interns/" + internId)
                        .header("Authorization", "Bearer " + adminToken))
                .andExpect(status().isOk())
                .andReturn();

        ApiResponse<InternResponse> getResponse = objectMapper.readValue(
                getResult.getResponse().getContentAsString(),
                new TypeReference<ApiResponse<InternResponse>>() {}
        );

        assertTrue(getResponse.isSuccess());
        assertEquals("John", getResponse.getData().getFirstName());

        // 6. Update Intern
        internRequest.setFirstName("Johnny");
        MvcResult updateResult = mockMvc.perform(put("/api/interns/" + internId)
                        .header("Authorization", "Bearer " + adminToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(internRequest)))
                .andExpect(status().isOk())
                .andReturn();

        ApiResponse<InternResponse> updateResponse = objectMapper.readValue(
                updateResult.getResponse().getContentAsString(),
                new TypeReference<ApiResponse<InternResponse>>() {}
        );

        assertTrue(updateResponse.isSuccess());
        assertEquals("Johnny", updateResponse.getData().getFirstName());

        // 7. Deactivate Intern
        MvcResult deactivateResult = mockMvc.perform(patch("/api/interns/" + internId + "/deactivate")
                        .header("Authorization", "Bearer " + adminToken))
                .andExpect(status().isOk())
                .andReturn();

        ApiResponse<InternResponse> deactivateResponse = objectMapper.readValue(
                deactivateResult.getResponse().getContentAsString(),
                new TypeReference<ApiResponse<InternResponse>>() {}
        );

        assertTrue(deactivateResponse.isSuccess());
        assertEquals(InternStatus.INACTIVE, deactivateResponse.getData().getStatus());

        // 8. Activate Intern
        MvcResult activateResult = mockMvc.perform(patch("/api/interns/" + internId + "/activate")
                        .header("Authorization", "Bearer " + adminToken))
                .andExpect(status().isOk())
                .andReturn();

        ApiResponse<InternResponse> activateResponse = objectMapper.readValue(
                activateResult.getResponse().getContentAsString(),
                new TypeReference<ApiResponse<InternResponse>>() {}
        );

        assertTrue(activateResponse.isSuccess());
        assertEquals(InternStatus.ACTIVE, activateResponse.getData().getStatus());

        // 9. Dynamic Search and Filtering
        // Get all interns and check pagination
        MvcResult searchResult = mockMvc.perform(get("/api/interns?search=Johnny&university=Moratuwa")
                        .header("Authorization", "Bearer " + adminToken))
                .andExpect(status().isOk())
                .andReturn();

        // Custom parser check
        String searchBody = searchResult.getResponse().getContentAsString();
        assertTrue(searchBody.contains("Johnny"));
        assertTrue(searchBody.contains("Moratuwa"));

        // 10. Delete Intern
        mockMvc.perform(delete("/api/interns/" + internId)
                        .header("Authorization", "Bearer " + adminToken))
                .andExpect(status().isOk());

        // Verify delete makes getById return 404
        mockMvc.perform(get("/api/interns/" + internId)
                        .header("Authorization", "Bearer " + adminToken))
                .andExpect(status().isNotFound());
    }
}
