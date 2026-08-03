package com.internship.management.controller;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.internship.management.dto.response.AdminDashboardResponse;
import com.internship.management.dto.response.InternDashboardResponse;
import com.internship.management.entity.*;
import com.internship.management.enums.*;
import com.internship.management.repository.*;
import com.internship.management.response.ApiResponse;
import com.internship.management.security.CustomUserDetails;
import com.internship.management.service.JwtService;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
public class DashboardControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private InternRepository internRepository;

    @Autowired
    private ProjectRepository projectRepository;

    @Autowired
    private TaskRepository taskRepository;

    @Autowired
    private DailyLogRepository dailyLogRepository;

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
    private Project savedProject;
    private Task savedTask;
    private List<DailyLog> savedLogs = new ArrayList<>();

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

        // Create and save test intern user & record
        String email = "intern-test-" + UUID.randomUUID() + "@example.com";
        User internUser = User.builder()
                .firstName("Intern")
                .lastName("Test")
                .email(email)
                .password("password123")
                .role(Role.INTERN)
                .status("ACTIVE")
                .build();
        savedInternUser = userRepository.save(internUser);
        internToken = jwtService.generateToken(new CustomUserDetails(savedInternUser));

        Intern intern = Intern.builder()
                .employeeId("EMP-" + UUID.randomUUID().toString().substring(0, 8))
                .firstName("John")
                .lastName("Doe")
                .email(email)
                .phone("+94771234567")
                .university("UOM")
                .degree("CS")
                .startDate(LocalDate.now().minusMonths(1))
                .endDate(LocalDate.now().plusMonths(5))
                .status(InternStatus.ACTIVE)
                .build();
        savedIntern = internRepository.save(intern);

        // Create and save Project
        Project project = Project.builder()
                .title("IMS System")
                .description("Task tracking project")
                .technology(List.of("Java", "MongoDB"))
                .deadline(LocalDate.now().plusMonths(2))
                .status(ProjectStatus.ACTIVE)
                .assignedInternIds(List.of(savedIntern.getId()))
                .build();
        savedProject = projectRepository.save(project);

        // Create and save Task (Assigned to Intern, Status COMPLETED with Feedback)
        Task task = Task.builder()
                .title("Implement Authentication")
                .description("Write security configs")
                .priority(Priority.HIGH)
                .deadline(LocalDate.now().plusWeeks(1))
                .status(TaskStatus.COMPLETED)
                .projectId(savedProject.getId())
                .assignedInternId(savedIntern.getId())
                .feedback("Excellent work on JWT authentication!")
                .build();
        savedTask = taskRepository.save(task);

        // Create and save Daily logs
        DailyLog log1 = DailyLog.builder()
                .internId(savedIntern.getId())
                .completedWork("Worked on task 1")
                .currentWork("Implementing tests")
                .hoursWorked(4.5)
                .date(LocalDate.now().minusDays(1))
                .build();
        DailyLog log2 = DailyLog.builder()
                .internId(savedIntern.getId())
                .completedWork("Finished test cases")
                .currentWork("Fixed compile errors")
                .hoursWorked(5.5)
                .date(LocalDate.now())
                .build();
        savedLogs.add(dailyLogRepository.save(log1));
        savedLogs.add(dailyLogRepository.save(log2));
    }

    @AfterEach
    public void tearDown() {
        // Clean up logs
        for (DailyLog log : savedLogs) {
            dailyLogRepository.delete(log);
        }

        // Clean up task
        if (savedTask != null) {
            taskRepository.delete(savedTask);
        }

        // Clean up project
        if (savedProject != null) {
            projectRepository.delete(savedProject);
        }

        // Clean up intern
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
    public void testAdminAndInternDashboardRetrieval() throws Exception {
        // 1. JWT Protection Checks
        mockMvc.perform(get("/api/dashboard/admin"))
                .andExpect(status().isUnauthorized());

        mockMvc.perform(get("/api/dashboard/intern"))
                .andExpect(status().isUnauthorized());

        // 2. Admin Dashboard Privilege Checks
        // Intern attempts to view Admin dashboard -> 403 Forbidden
        mockMvc.perform(get("/api/dashboard/admin")
                        .header("Authorization", "Bearer " + internToken))
                .andExpect(status().isForbidden());

        // Admin retrieves Admin dashboard successfully -> 200 OK
        MvcResult adminResult = mockMvc.perform(get("/api/dashboard/admin")
                        .header("Authorization", "Bearer " + adminToken))
                .andExpect(status().isOk())
                .andReturn();

        ApiResponse<AdminDashboardResponse> adminResponse = objectMapper.readValue(
                adminResult.getResponse().getContentAsString(),
                new TypeReference<ApiResponse<AdminDashboardResponse>>() {}
        );

        assertTrue(adminResponse.isSuccess());
        assertNotNull(adminResponse.getData());
        assertTrue(adminResponse.getData().getTotalInterns() >= 1);
        assertTrue(adminResponse.getData().getTotalProjects() >= 1);
        assertEquals(1, adminResponse.getData().getCompletedTasks());
        assertNotNull(adminResponse.getData().getRecentActivities());

        // 3. Intern Dashboard Privilege Checks
        // Admin attempts to view Intern dashboard -> 403 Forbidden
        mockMvc.perform(get("/api/dashboard/intern")
                        .header("Authorization", "Bearer " + adminToken))
                .andExpect(status().isForbidden());

        // Intern retrieves Intern dashboard successfully -> 200 OK
        MvcResult internResult = mockMvc.perform(get("/api/dashboard/intern")
                        .header("Authorization", "Bearer " + internToken))
                .andExpect(status().isOk())
                .andReturn();

        ApiResponse<InternDashboardResponse> internResponse = objectMapper.readValue(
                internResult.getResponse().getContentAsString(),
                new TypeReference<ApiResponse<InternDashboardResponse>>() {}
        );

        assertTrue(internResponse.isSuccess());
        assertNotNull(internResponse.getData());
        assertEquals(1, internResponse.getData().getAssignedProjects());
        assertEquals(1, internResponse.getData().getAssignedTasks());
        assertEquals(1, internResponse.getData().getCompletedTasks());
        assertEquals("Excellent work on JWT authentication!", internResponse.getData().getLatestFeedback());
        assertNotNull(internResponse.getData().getDailyLogSummary());
        assertEquals(2, internResponse.getData().getDailyLogSummary().getTotalLogsSubmitted());
        assertEquals(10.0, internResponse.getData().getDailyLogSummary().getTotalHoursWorked(), 0.001);
    }
}
