package com.internship.management.controller;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.internship.management.dto.request.LoginRequest;
import com.internship.management.dto.request.RegisterRequest;
import com.internship.management.dto.response.LoginResponse;
import com.internship.management.dto.response.RegisterResponse;
import com.internship.management.entity.User;
import com.internship.management.enums.Role;
import com.internship.management.repository.UserRepository;
import com.internship.management.response.ApiResponse;
import com.internship.management.response.ErrorResponse;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
public class AuthControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private ObjectMapper objectMapper;

    private String testEmail;
    private String testPassword;

    @BeforeEach
    public void setUp() {
        testEmail = "test-" + UUID.randomUUID() + "@example.com";
        testPassword = "password123";
    }

    @AfterEach
    public void tearDown() {
        // Clean up test user
        userRepository.findByEmail(testEmail).ifPresent(user -> userRepository.delete(user));
    }

    @Test
    public void testAuthAndExceptionWorkflow() throws Exception {
        // 1. User Registration with Validation Error
        RegisterRequest invalidRequest = RegisterRequest.builder()
                .firstName("") // blank
                .lastName("User")
                .email("invalid-email") // invalid email
                .password("123") // too short
                .role(null) // null
                .build();

        MvcResult validationResult = mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(invalidRequest)))
                .andExpect(status().isBadRequest())
                .andReturn();

        ErrorResponse validationResponse = objectMapper.readValue(
                validationResult.getResponse().getContentAsString(),
                ErrorResponse.class
        );

        assertFalse(validationResponse.isSuccess());
        assertEquals(400, validationResponse.getStatus());
        assertEquals("Bad Request", validationResponse.getError());
        assertEquals("Validation Failed", validationResponse.getMessage());
        assertNotNull(validationResponse.getErrors());
        assertTrue(validationResponse.getErrors().containsKey("firstName"));
        assertTrue(validationResponse.getErrors().containsKey("email"));
        assertTrue(validationResponse.getErrors().containsKey("password"));
        assertTrue(validationResponse.getErrors().containsKey("role"));

        // 2. Successful User Registration
        RegisterRequest registerRequest = RegisterRequest.builder()
                .firstName("Test")
                .lastName("User")
                .email(testEmail)
                .password(testPassword)
                .role(Role.INTERN)
                .build();

        MvcResult regResult = mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(registerRequest)))
                .andExpect(status().isCreated())
                .andReturn();

        ApiResponse<RegisterResponse> regApiResponse = objectMapper.readValue(
                regResult.getResponse().getContentAsString(),
                new TypeReference<ApiResponse<RegisterResponse>>() {}
        );

        assertTrue(regApiResponse.isSuccess());
        assertEquals("User registered successfully", regApiResponse.getMessage());
        assertNotNull(regApiResponse.getData());
        assertEquals(testEmail, regApiResponse.getData().getUser().getEmail());
        assertNull(regApiResponse.getData().getUser().getPassword(), "Password hash must be nullified in response");

        // Verify password encryption in database
        User dbUser = userRepository.findByEmail(testEmail).orElse(null);
        assertNotNull(dbUser);
        assertTrue(passwordEncoder.matches(testPassword, dbUser.getPassword()), "Password must be BCrypt-encrypted in database");

        // 3. Duplicate Registration Check (Conflict)
        MvcResult duplicateResult = mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(registerRequest)))
                .andExpect(status().isConflict())
                .andReturn();

        ErrorResponse duplicateResponse = objectMapper.readValue(
                duplicateResult.getResponse().getContentAsString(),
                ErrorResponse.class
        );

        assertFalse(duplicateResponse.isSuccess());
        assertEquals(409, duplicateResponse.getStatus());
        assertEquals("Conflict", duplicateResponse.getError());
        assertEquals("Email is already in use", duplicateResponse.getMessage());

        // 4. User Login with Bad Credentials
        LoginRequest badLoginRequest = new LoginRequest(testEmail, "wrongpassword");
        MvcResult badLoginResult = mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(badLoginRequest)))
                .andExpect(status().isUnauthorized())
                .andReturn();

        ErrorResponse badLoginResponse = objectMapper.readValue(
                badLoginResult.getResponse().getContentAsString(),
                ErrorResponse.class
        );

        assertFalse(badLoginResponse.isSuccess());
        assertEquals(401, badLoginResponse.getStatus());
        assertEquals("Unauthorized", badLoginResponse.getError());
        assertEquals("Invalid email or password", badLoginResponse.getMessage());

        // 5. Successful User Login
        LoginRequest loginRequest = new LoginRequest(testEmail, testPassword);

        MvcResult loginResult = mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(loginRequest)))
                .andExpect(status().isOk())
                .andReturn();

        ApiResponse<LoginResponse> loginApiResponse = objectMapper.readValue(
                loginResult.getResponse().getContentAsString(),
                new TypeReference<ApiResponse<LoginResponse>>() {}
        );

        assertTrue(loginApiResponse.isSuccess());
        assertEquals("Login successful", loginApiResponse.getMessage());
        assertNotNull(loginApiResponse.getData());
        assertNotNull(loginApiResponse.getData().getAccessToken(), "JWT access token should be generated");
        assertEquals("Bearer", loginApiResponse.getData().getTokenType());
        assertEquals(testEmail, loginApiResponse.getData().getEmail());
        assertEquals("INTERN", loginApiResponse.getData().getRole());

        String token = loginApiResponse.getData().getAccessToken();

        // 6. Protected Endpoint Access (Authorized)
        MvcResult meResult = mockMvc.perform(get("/api/auth/me")
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andReturn();

        ApiResponse<User> meApiResponse = objectMapper.readValue(
                meResult.getResponse().getContentAsString(),
                new TypeReference<ApiResponse<User>>() {}
        );

        assertTrue(meApiResponse.isSuccess());
        assertEquals("Current user fetched successfully", meApiResponse.getMessage());
        assertNotNull(meApiResponse.getData());
        assertEquals(testEmail, meApiResponse.getData().getEmail());
        assertNull(meApiResponse.getData().getPassword(), "Password should be cleared in profile retrieval response");

        // 7. Unauthorized Request Handling (No Token)
        MvcResult unauthorizedResult = mockMvc.perform(get("/api/auth/me"))
                .andExpect(status().isUnauthorized())
                .andReturn();

        ErrorResponse unauthorizedResponse = objectMapper.readValue(
                unauthorizedResult.getResponse().getContentAsString(),
                ErrorResponse.class
        );

        assertFalse(unauthorizedResponse.isSuccess());
        assertEquals(401, unauthorizedResponse.getStatus());
        assertEquals("Unauthorized", unauthorizedResponse.getError());
        assertTrue(unauthorizedResponse.getMessage().contains("Access Denied"));
    }
}
