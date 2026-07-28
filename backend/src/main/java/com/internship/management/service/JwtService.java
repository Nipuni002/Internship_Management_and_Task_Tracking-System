package com.internship.management.service;

import org.springframework.security.core.userdetails.UserDetails;

public interface JwtService {
    String generateToken(UserDetails userDetails);
    String extractUsername(String token);
    boolean isTokenExpired(String token);
    boolean validateToken(String token, UserDetails userDetails);
}
