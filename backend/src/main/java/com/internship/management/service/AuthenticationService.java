package com.internship.management.service;

import com.internship.management.dto.request.LoginRequest;
import com.internship.management.dto.request.RegisterRequest;
import com.internship.management.dto.response.LoginResponse;
import com.internship.management.dto.response.RegisterResponse;
import com.internship.management.entity.User;

public interface AuthenticationService {
    RegisterResponse register(RegisterRequest request);
    LoginResponse login(LoginRequest request);
    User getCurrentUser();
    boolean isFirstTimeLogin(String email);
    void resetPassword(String email, String employeeId, String newPassword);
}
