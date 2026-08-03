package com.internship.management.service.impl;

import com.internship.management.dto.request.LoginRequest;
import com.internship.management.dto.request.RegisterRequest;
import com.internship.management.dto.response.LoginResponse;
import com.internship.management.dto.response.RegisterResponse;
import com.internship.management.entity.User;
import com.internship.management.repository.UserRepository;
import com.internship.management.security.CustomUserDetails;
import com.internship.management.service.AuthenticationService;
import com.internship.management.service.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import com.internship.management.exception.DuplicateResourceException;
import com.internship.management.exception.ResourceNotFoundException;
import com.internship.management.exception.UnauthorizedException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthenticationServiceImpl implements AuthenticationService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;

    @Override
    public RegisterResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new DuplicateResourceException("Email is already in use");
        }

        User user = User.builder()
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(request.getRole())
                .status("ACTIVE") // Default status for new users
                .build();

        User savedUser = userRepository.save(user);
        savedUser.setPassword(null); // Clear password hash before returning response

        return RegisterResponse.builder()
                .message("User registered successfully")
                .user(savedUser)
                .build();
    }

    @Override
    public LoginResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + request.getEmail()));

        // Check if this is the user's first-time login
        if ("FIRST_TIME_LOGIN".equals(user.getPassword())) {
            if (request.getPassword() == null || request.getPassword().isBlank()) {
                throw new IllegalArgumentException("Password cannot be blank for first-time password setup");
            }
            // Encrypt and save the user's entered password as their permanent password
            user.setPassword(passwordEncoder.encode(request.getPassword()));
            user = userRepository.save(user);
        } else {
            // Standard authentication check for subsequent logins
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            request.getEmail(),
                            request.getPassword()
                    )
            );
        }

        CustomUserDetails userDetails = new CustomUserDetails(user);
        String jwtToken = jwtService.generateToken(userDetails);

        return LoginResponse.builder()
                .accessToken(jwtToken)
                .tokenType("Bearer")
                .userId(user.getId())
                .fullName(user.getFirstName() + " " + user.getLastName())
                .email(user.getEmail())
                .role(user.getRole().name())
                .build();
    }

    @Override
    public User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated() || authentication instanceof AnonymousAuthenticationToken) {
            throw new UnauthorizedException("No user is currently authenticated");
        }

        String email = authentication.getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));

        user.setPassword(null); // Clear password hash
        return user;
    }

    @Override
    public boolean isFirstTimeLogin(String email) {
        return userRepository.findByEmail(email)
                .map(user -> "FIRST_TIME_LOGIN".equals(user.getPassword()))
                .orElse(false);
    }
}
