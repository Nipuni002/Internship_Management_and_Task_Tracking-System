package com.internship.management.controller;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.internship.management.dto.request.TaskAssignmentRequest;
import com.internship.management.dto.request.TaskRequest;
import com.internship.management.dto.request.TaskStatusRequest;
import com.internship.management.dto.response.TaskResponse;
import com.internship.management.entity.Intern;
import com.internship.management.entity.Project;
import com.internship.management.entity.Task;
import com.internship.management.entity.User;
import com.internship.management.enums.InternStatus;
import com.internship.management.enums.Priority;
import com.internship.management.enums.ProjectStatus;
import com.internship.management.enums.Role;
import com.internship.management.enums.TaskStatus;
import com.internship.management.repository.InternRepository;
import com.internship.management.repository.ProjectRepository;
import com.internship.management.repository.TaskRepository;
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
public class TaskControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

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

    private final List<String> createdTaskIds = new ArrayList<>();

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

        // Create and save a Project
        Project project = Project.builder()
                .title("IMS Project")
                .description("Project for testing task CRUD")
                .technology(List.of("Java", "MongoDB"))
                .deadline(LocalDate.now().plusMonths(3))
                .status(ProjectStatus.ACTIVE)
                .build();
        savedProject = projectRepository.save(project);
    }

    @AfterEach
    public void tearDown() {
        // Clean up tasks
        for (String id : createdTaskIds) {
            taskRepository.deleteById(id);
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
    public void testTaskCRUDAndRoleSecurityWorkflow() throws Exception {
        TaskRequest taskRequest = TaskRequest.builder()
                .title("Implement Authentication")
                .description("Write security configs")
                .priority(Priority.HIGH)
                .deadline(LocalDate.now().plusWeeks(1))
                .status(TaskStatus.TODO)
                .projectId(savedProject.getId())
                .assignedInternId(savedIntern1.getId())
                .build();

        // 1. Role Authorization Checks
        // Request without token -> 401 Unauthorized
        mockMvc.perform(post("/api/tasks")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(taskRequest)))
                .andExpect(status().isUnauthorized());

        // Request with INTERN role -> 403 Forbidden
        mockMvc.perform(post("/api/tasks")
                        .header("Authorization", "Bearer " + internToken1)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(taskRequest)))
                .andExpect(status().isForbidden());

        // 2. Successful Task Creation (ADMIN Token)
        MvcResult createResult = mockMvc.perform(post("/api/tasks")
                        .header("Authorization", "Bearer " + adminToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(taskRequest)))
                .andExpect(status().isCreated())
                .andReturn();

        ApiResponse<TaskResponse> createResponse = objectMapper.readValue(
                createResult.getResponse().getContentAsString(),
                new TypeReference<ApiResponse<TaskResponse>>() {}
        );

        assertTrue(createResponse.isSuccess());
        assertNotNull(createResponse.getData());
        assertNotNull(createResponse.getData().getId());
        assertEquals("Implement Authentication", createResponse.getData().getTitle());

        String taskId = createResponse.getData().getId();
        createdTaskIds.add(taskId);

        // 3. Get Task by ID (Intern 1 can read since it is assigned to them)
        MvcResult getResult = mockMvc.perform(get("/api/tasks/" + taskId)
                        .header("Authorization", "Bearer " + internToken1))
                .andExpect(status().isOk())
                .andReturn();

        ApiResponse<TaskResponse> getResponse = objectMapper.readValue(
                getResult.getResponse().getContentAsString(),
                new TypeReference<ApiResponse<TaskResponse>>() {}
        );

        assertTrue(getResponse.isSuccess());
        assertEquals("Implement Authentication", getResponse.getData().getTitle());

        // Get Task by ID (Intern 2 CANNOT read since it is assigned to Intern 1 -> 403 Forbidden)
        mockMvc.perform(get("/api/tasks/" + taskId)
                        .header("Authorization", "Bearer " + internToken2))
                .andExpect(status().isForbidden());

        // 4. Update Task (ADMIN only)
        taskRequest.setTitle("Implement Auth v2");
        MvcResult updateResult = mockMvc.perform(put("/api/tasks/" + taskId)
                        .header("Authorization", "Bearer " + adminToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(taskRequest)))
                .andExpect(status().isOk())
                .andReturn();

        ApiResponse<TaskResponse> updateResponse = objectMapper.readValue(
                updateResult.getResponse().getContentAsString(),
                new TypeReference<ApiResponse<TaskResponse>>() {}
        );

        assertTrue(updateResponse.isSuccess());
        assertEquals("Implement Auth v2", updateResponse.getData().getTitle());

        // 5. Intern Task List Filter Checking
        // Create another task assigned to Intern 2
        Task task2 = Task.builder()
                .title("Write Unit Tests")
                .description("Write controller tests")
                .priority(Priority.MEDIUM)
                .deadline(LocalDate.now().plusWeeks(2))
                .status(TaskStatus.TODO)
                .projectId(savedProject.getId())
                .assignedInternId(savedIntern2.getId())
                .build();
        Task savedTask2 = taskRepository.save(task2);
        createdTaskIds.add(savedTask2.getId());

        // Request list as Intern 1
        MvcResult listResult = mockMvc.perform(get("/api/tasks")
                        .header("Authorization", "Bearer " + internToken1))
                .andExpect(status().isOk())
                .andReturn();

        String bodyContent = listResult.getResponse().getContentAsString();
        assertTrue(bodyContent.contains("Implement Auth v2"));
        assertFalse(bodyContent.contains("Write Unit Tests"), "Intern 1 should not see tasks assigned to Intern 2");

        // 6. Status Transitions Checking
        // Intern 1 sets status to IN_PROGRESS (success)
        TaskStatusRequest progressRequest = new TaskStatusRequest(TaskStatus.IN_PROGRESS, null, null);
        mockMvc.perform(patch("/api/tasks/" + taskId + "/status")
                        .header("Authorization", "Bearer " + internToken1)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(progressRequest)))
                .andExpect(status().isOk());

        // Intern 1 attempts to set status to COMPLETED directly (fails with HTTP 400 Bad Request)
        TaskStatusRequest completeRequest = new TaskStatusRequest(TaskStatus.COMPLETED, null, null);
        mockMvc.perform(patch("/api/tasks/" + taskId + "/status")
                        .header("Authorization", "Bearer " + internToken1)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(completeRequest)))
                .andExpect(status().isBadRequest());

        // Intern 1 submits completion with a GitHub link (success)
        TaskStatusRequest submitRequest = new TaskStatusRequest(TaskStatus.SUBMITTED, "https://github.com/test", null);
        MvcResult submitResult = mockMvc.perform(patch("/api/tasks/" + taskId + "/status")
                        .header("Authorization", "Bearer " + internToken1)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(submitRequest)))
                .andExpect(status().isOk())
                .andReturn();

        ApiResponse<TaskResponse> submitResponse = objectMapper.readValue(
                submitResult.getResponse().getContentAsString(),
                new TypeReference<ApiResponse<TaskResponse>>() {}
        );

        assertEquals(TaskStatus.SUBMITTED, submitResponse.getData().getStatus());
        assertEquals("https://github.com/test", submitResponse.getData().getSubmissionLink());

        // Admin approves completion (success)
        mockMvc.perform(patch("/api/tasks/" + taskId + "/status")
                        .header("Authorization", "Bearer " + adminToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(completeRequest)))
                .andExpect(status().isOk());

        // 7. Reassign Task (ADMIN only)
        TaskAssignmentRequest reassignRequest = new TaskAssignmentRequest(savedIntern2.getId());
        MvcResult reassignResult = mockMvc.perform(patch("/api/tasks/" + taskId + "/assign")
                        .header("Authorization", "Bearer " + adminToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(reassignRequest)))
                .andExpect(status().isOk())
                .andReturn();

        ApiResponse<TaskResponse> reassignResponse = objectMapper.readValue(
                reassignResult.getResponse().getContentAsString(),
                new TypeReference<ApiResponse<TaskResponse>>() {}
        );

        assertEquals(savedIntern2.getId(), reassignResponse.getData().getAssignedInternId());

        // 8. Delete Task (ADMIN only)
        mockMvc.perform(delete("/api/tasks/" + taskId)
                        .header("Authorization", "Bearer " + adminToken))
                .andExpect(status().isOk());

        // Verify delete returns 404
        mockMvc.perform(get("/api/tasks/" + taskId)
                        .header("Authorization", "Bearer " + adminToken))
                .andExpect(status().isNotFound());
    }
}
