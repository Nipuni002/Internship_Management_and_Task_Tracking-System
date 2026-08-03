package com.internship.management.controller;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.internship.management.dto.request.SubmissionRequest;
import com.internship.management.dto.request.SubmissionReviewRequest;
import com.internship.management.dto.response.SubmissionResponse;
import com.internship.management.entity.Intern;
import com.internship.management.entity.Project;
import com.internship.management.entity.Submission;
import com.internship.management.entity.Task;
import com.internship.management.entity.User;
import com.internship.management.enums.InternStatus;
import com.internship.management.enums.Priority;
import com.internship.management.enums.ProjectStatus;
import com.internship.management.enums.Role;
import com.internship.management.enums.SubmissionStatus;
import com.internship.management.enums.TaskStatus;
import com.internship.management.repository.InternRepository;
import com.internship.management.repository.ProjectRepository;
import com.internship.management.repository.SubmissionRepository;
import com.internship.management.repository.TaskRepository;
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
public class SubmissionControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private SubmissionRepository submissionRepository;

    @Autowired
    private TaskRepository taskRepository;

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
    private String internToken1;
    private String internToken2;

    private User savedAdminUser;
    private User savedInternUser1;
    private User savedInternUser2;

    private Intern savedIntern1;
    private Intern savedIntern2;

    private Project savedProject;
    private Task savedTask1;
    private Task savedTask2;

    private final List<String> createdSubmissionIds = new ArrayList<>();

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
                .startDate(LocalDate.now())
                .endDate(LocalDate.now().plusMonths(6))
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
                .startDate(LocalDate.now())
                .endDate(LocalDate.now().plusMonths(6))
                .status(InternStatus.ACTIVE)
                .build();
        savedIntern2 = internRepository.save(intern2);

        // Create and save Project
        Project project = Project.builder()
                .title("IMS Project")
                .description("Project for testing task CRUD")
                .technology(List.of("Java", "MongoDB"))
                .deadline(LocalDate.now().plusMonths(3))
                .status(ProjectStatus.ACTIVE)
                .build();
        savedProject = projectRepository.save(project);

        // Create and save Task 1 (Assigned to Intern 1)
        Task task1 = Task.builder()
                .title("Implement Authentication")
                .description("Write security configs")
                .priority(Priority.HIGH)
                .deadline(LocalDate.now().plusWeeks(1))
                .status(TaskStatus.TODO)
                .projectId(savedProject.getId())
                .assignedInternId(savedIntern1.getId())
                .build();
        savedTask1 = taskRepository.save(task1);

        // Create and save Task 2 (Assigned to Intern 2)
        Task task2 = Task.builder()
                .title("Write Unit Tests")
                .description("Write controller tests")
                .priority(Priority.MEDIUM)
                .deadline(LocalDate.now().plusWeeks(2))
                .status(TaskStatus.TODO)
                .projectId(savedProject.getId())
                .assignedInternId(savedIntern2.getId())
                .build();
        savedTask2 = taskRepository.save(task2);
    }

    @AfterEach
    public void tearDown() {
        // Clean up submissions
        for (String id : createdSubmissionIds) {
            submissionRepository.deleteById(id);
        }

        // Clean up tasks
        if (savedTask1 != null) {
            taskRepository.delete(savedTask1);
        }
        if (savedTask2 != null) {
            taskRepository.delete(savedTask2);
        }

        // Clean up project
        if (savedProject != null) {
            projectRepository.delete(savedProject);
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
    public void testSubmissionCRUDAndSupervisorTransitions() throws Exception {
        SubmissionRequest subRequest = SubmissionRequest.builder()
                .taskId(savedTask1.getId())
                .githubLink("https://github.com/intern1/auth")
                .documentLink("https://docs.google.com/doc1")
                .notes("Completed all tests")
                .build();

        // 1. Role Authorization Checks
        // Request without token -> 401 Unauthorized
        mockMvc.perform(post("/api/submissions")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(subRequest)))
                .andExpect(status().isUnauthorized());

        // Admin attempting to create submission -> 403 Forbidden (create log is restricted to INTERN)
        mockMvc.perform(post("/api/submissions")
                        .header("Authorization", "Bearer " + adminToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(subRequest)))
                .andExpect(status().isForbidden());

        // 2. Submit Task Work
        // Intern 2 attempts to submit work for Task 1 (fails with 403 Forbidden)
        mockMvc.perform(post("/api/submissions")
                        .header("Authorization", "Bearer " + internToken2)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(subRequest)))
                .andExpect(status().isForbidden());

        // Intern 1 submits work for Task 1 -> 201 Created
        MvcResult createResult = mockMvc.perform(post("/api/submissions")
                        .header("Authorization", "Bearer " + internToken1)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(subRequest)))
                .andExpect(status().isCreated())
                .andReturn();

        ApiResponse<SubmissionResponse> createResponse = objectMapper.readValue(
                createResult.getResponse().getContentAsString(),
                new TypeReference<ApiResponse<SubmissionResponse>>() {}
        );

        assertTrue(createResponse.isSuccess());
        assertNotNull(createResponse.getData());
        assertNotNull(createResponse.getData().getId());
        assertEquals(SubmissionStatus.PENDING, createResponse.getData().getStatus());

        String subId = createResponse.getData().getId();
        createdSubmissionIds.add(subId);

        // Verify task status transitioned to SUBMITTED
        Task updatedTask = taskRepository.findById(savedTask1.getId()).orElseThrow();
        assertEquals(TaskStatus.SUBMITTED, updatedTask.getStatus());
        assertEquals("https://github.com/intern1/auth", updatedTask.getSubmissionLink());

        // 3. Update Submission Ownership Restriction
        // Intern 2 attempts to update Intern 1's submission -> 403 Forbidden
        subRequest.setNotes("Hacked notes");
        mockMvc.perform(put("/api/submissions/" + subId)
                        .header("Authorization", "Bearer " + internToken2)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(subRequest)))
                .andExpect(status().isForbidden());

        // Intern 1 updates their own submission -> 200 OK
        subRequest.setNotes("Completed all tests with Docker");
        MvcResult updateResult = mockMvc.perform(put("/api/submissions/" + subId)
                        .header("Authorization", "Bearer " + internToken1)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(subRequest)))
                .andExpect(status().isOk())
                .andReturn();

        ApiResponse<SubmissionResponse> updateResponse = objectMapper.readValue(
                updateResult.getResponse().getContentAsString(),
                new TypeReference<ApiResponse<SubmissionResponse>>() {}
        );

        assertTrue(updateResponse.isSuccess());
        assertEquals("Completed all tests with Docker", updateResponse.getData().getNotes());

        // 4. Get Submission Details Ownership Restriction
        // Intern 2 attempts to read Intern 1's submission -> 403 Forbidden
        mockMvc.perform(get("/api/submissions/" + subId)
                        .header("Authorization", "Bearer " + internToken2))
                .andExpect(status().isForbidden());

        // Intern 1 reads their own submission -> 200 OK
        mockMvc.perform(get("/api/submissions/" + subId)
                        .header("Authorization", "Bearer " + internToken1))
                .andExpect(status().isOk());

        // Admin reads Intern 1's submission -> 200 OK
        mockMvc.perform(get("/api/submissions/" + subId)
                        .header("Authorization", "Bearer " + adminToken))
                .andExpect(status().isOk());

        // 5. Supervisor Review Transition Checks
        SubmissionReviewRequest reviewRequest = new SubmissionReviewRequest("Need to document API endpoints");

        // Intern 1 attempts to approve (fails with 403 Forbidden)
        mockMvc.perform(patch("/api/submissions/" + subId + "/approve")
                        .header("Authorization", "Bearer " + internToken1)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(reviewRequest)))
                .andExpect(status().isForbidden());

        // Admin requests revision -> 200 OK
        MvcResult revisionResult = mockMvc.perform(patch("/api/submissions/" + subId + "/revision")
                        .header("Authorization", "Bearer " + adminToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(reviewRequest)))
                .andExpect(status().isOk())
                .andReturn();

        ApiResponse<SubmissionResponse> revisionResponse = objectMapper.readValue(
                revisionResult.getResponse().getContentAsString(),
                new TypeReference<ApiResponse<SubmissionResponse>>() {}
        );

        assertEquals(SubmissionStatus.REVISION_REQUIRED, revisionResponse.getData().getStatus());
        assertEquals("Need to document API endpoints", revisionResponse.getData().getFeedback());

        // Verify task status is REVISION_REQUIRED
        Task revisionTask = taskRepository.findById(savedTask1.getId()).orElseThrow();
        assertEquals(TaskStatus.REVISION_REQUIRED, revisionTask.getStatus());
        assertEquals("Need to document API endpoints", revisionTask.getFeedback());

        // Intern 1 updates the submission -> status becomes PENDING again
        subRequest.setNotes("Documented API endpoints");
        mockMvc.perform(put("/api/submissions/" + subId)
                        .header("Authorization", "Bearer " + internToken1)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(subRequest)))
                .andExpect(status().isOk());

        // Admin approves submission -> 200 OK
        reviewRequest.setFeedback("Looks great!");
        MvcResult approveResult = mockMvc.perform(patch("/api/submissions/" + subId + "/approve")
                        .header("Authorization", "Bearer " + adminToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(reviewRequest)))
                .andExpect(status().isOk())
                .andReturn();

        ApiResponse<SubmissionResponse> approveResponse = objectMapper.readValue(
                approveResult.getResponse().getContentAsString(),
                new TypeReference<ApiResponse<SubmissionResponse>>() {}
        );

        assertEquals(SubmissionStatus.APPROVED, approveResponse.getData().getStatus());

        // Verify parent task status transitioned to COMPLETED
        Task completedTask = taskRepository.findById(savedTask1.getId()).orElseThrow();
        assertEquals(TaskStatus.COMPLETED, completedTask.getStatus());

        // 6. Intern attempts to edit an approved submission -> 400 Bad Request
        mockMvc.perform(put("/api/submissions/" + subId)
                        .header("Authorization", "Bearer " + internToken1)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(subRequest)))
                .andExpect(status().isBadRequest());
    }
}
