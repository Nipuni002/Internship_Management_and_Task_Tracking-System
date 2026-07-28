package com.internship.management.controller;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.internship.management.dto.request.ProjectAssignmentRequest;
import com.internship.management.dto.request.ProjectRequest;
import com.internship.management.dto.response.ProjectResponse;
import com.internship.management.entity.Intern;
import com.internship.management.entity.Project;
import com.internship.management.entity.User;
import com.internship.management.enums.InternStatus;
import com.internship.management.enums.ProjectStatus;
import com.internship.management.enums.Role;
import com.internship.management.repository.InternRepository;
import com.internship.management.repository.ProjectRepository;
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
import java.util.Collections;
import java.util.List;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
public class ProjectControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ProjectRepository projectRepository;

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
    private Intern savedIntern;

    private final List<String> createdProjectIds = new ArrayList<>();

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

        // Create and save test intern user
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

        // Create and save a test Intern record
        Intern intern = Intern.builder()
                .employeeId("EMP-" + UUID.randomUUID().toString().substring(0, 8))
                .firstName("Test")
                .lastName("Intern")
                .email("test-intern-" + UUID.randomUUID() + "@example.com")
                .phone("+94771112223")
                .university("UOM")
                .degree("CS")
                .startDate(LocalDate.now())
                .endDate(LocalDate.now().plusMonths(6))
                .status(InternStatus.ACTIVE)
                .build();
        savedIntern = internRepository.save(intern);
    }

    @AfterEach
    public void tearDown() {
        // Clean up created projects
        for (String id : createdProjectIds) {
            projectRepository.deleteById(id);
        }

        // Clean up created intern
        if (savedIntern != null) {
            internRepository.delete(savedIntern);
        }

        // Clean up users
        if (savedAdminUser != null) {
            userRepository.delete(savedAdminUser);
        }
        if (savedInternUser != null) {
            userRepository.delete(savedInternUser);
        }
    }

    @Test
    public void testProjectCRUDAndAssignmentWorkflow() throws Exception {
        ProjectRequest projectRequest = ProjectRequest.builder()
                .title("Intern Management System")
                .description("Backend development module")
                .technology(List.of("Java", "Spring Boot", "MongoDB"))
                .deadline(LocalDate.now().plusMonths(3))
                .status(ProjectStatus.ACTIVE)
                .assignedInternIds(new ArrayList<>())
                .build();

        // 1. Role Authorization Checks
        // Request without token -> 401 Unauthorized
        mockMvc.perform(post("/api/projects")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(projectRequest)))
                .andExpect(status().isUnauthorized());

        // Request with INTERN role -> 403 Forbidden
        mockMvc.perform(post("/api/projects")
                        .header("Authorization", "Bearer " + internToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(projectRequest)))
                .andExpect(status().isForbidden());

        // 2. Successful Project Creation
        MvcResult createResult = mockMvc.perform(post("/api/projects")
                        .header("Authorization", "Bearer " + adminToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(projectRequest)))
                .andExpect(status().isCreated())
                .andReturn();

        ApiResponse<ProjectResponse> createResponse = objectMapper.readValue(
                createResult.getResponse().getContentAsString(),
                new TypeReference<ApiResponse<ProjectResponse>>() {}
        );

        assertTrue(createResponse.isSuccess());
        assertNotNull(createResponse.getData());
        assertNotNull(createResponse.getData().getId());
        assertEquals("Intern Management System", createResponse.getData().getTitle());

        String projectId = createResponse.getData().getId();
        createdProjectIds.add(projectId);

        // 3. Get Project by ID
        MvcResult getResult = mockMvc.perform(get("/api/projects/" + projectId)
                        .header("Authorization", "Bearer " + adminToken))
                .andExpect(status().isOk())
                .andReturn();

        ApiResponse<ProjectResponse> getResponse = objectMapper.readValue(
                getResult.getResponse().getContentAsString(),
                new TypeReference<ApiResponse<ProjectResponse>>() {}
        );

        assertTrue(getResponse.isSuccess());
        assertEquals("Intern Management System", getResponse.getData().getTitle());

        // 4. Update Project
        projectRequest.setTitle("IMS Updated");
        projectRequest.setTechnology(List.of("Java", "Spring Boot", "MongoDB", "Docker"));

        MvcResult updateResult = mockMvc.perform(put("/api/projects/" + projectId)
                        .header("Authorization", "Bearer " + adminToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(projectRequest)))
                .andExpect(status().isOk())
                .andReturn();

        ApiResponse<ProjectResponse> updateResponse = objectMapper.readValue(
                updateResult.getResponse().getContentAsString(),
                new TypeReference<ApiResponse<ProjectResponse>>() {}
        );

        assertTrue(updateResponse.isSuccess());
        assertEquals("IMS Updated", updateResponse.getData().getTitle());
        assertTrue(updateResponse.getData().getTechnology().contains("Docker"));

        // 5. Assign Intern (Valid ID)
        ProjectAssignmentRequest assignmentRequest = new ProjectAssignmentRequest(List.of(savedIntern.getId()));
        MvcResult assignResult = mockMvc.perform(patch("/api/projects/" + projectId + "/assign")
                        .header("Authorization", "Bearer " + adminToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(assignmentRequest)))
                .andExpect(status().isOk())
                .andReturn();

        ApiResponse<ProjectResponse> assignResponse = objectMapper.readValue(
                assignResult.getResponse().getContentAsString(),
                new TypeReference<ApiResponse<ProjectResponse>>() {}
        );

        assertTrue(assignResponse.isSuccess());
        assertTrue(assignResponse.getData().getAssignedInternIds().contains(savedIntern.getId()));

        // 6. Assign Intern (Invalid ID -> 404 Not Found)
        ProjectAssignmentRequest invalidAssignmentRequest = new ProjectAssignmentRequest(List.of("non-existent-id"));
        mockMvc.perform(patch("/api/projects/" + projectId + "/assign")
                        .header("Authorization", "Bearer " + adminToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(invalidAssignmentRequest)))
                .andExpect(status().isNotFound());

        // 7. Remove Intern
        MvcResult removeResult = mockMvc.perform(patch("/api/projects/" + projectId + "/remove")
                        .header("Authorization", "Bearer " + adminToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(assignmentRequest)))
                .andExpect(status().isOk())
                .andReturn();

        ApiResponse<ProjectResponse> removeResponse = objectMapper.readValue(
                removeResult.getResponse().getContentAsString(),
                new TypeReference<ApiResponse<ProjectResponse>>() {}
        );

        assertTrue(removeResponse.isSuccess());
        assertFalse(removeResponse.getData().getAssignedInternIds().contains(savedIntern.getId()));

        // 8. Search & Filtering & Pagination
        MvcResult searchResult = mockMvc.perform(get("/api/projects?search=IMS&technology=Java")
                        .header("Authorization", "Bearer " + adminToken))
                .andExpect(status().isOk())
                .andReturn();

        String body = searchResult.getResponse().getContentAsString();
        assertTrue(body.contains("IMS Updated"));

        // 9. Delete Project
        mockMvc.perform(delete("/api/projects/" + projectId)
                        .header("Authorization", "Bearer " + adminToken))
                .andExpect(status().isOk());

        // Verify delete makes getById return 404
        mockMvc.perform(get("/api/projects/" + projectId)
                        .header("Authorization", "Bearer " + adminToken))
                .andExpect(status().isNotFound());
    }
}
