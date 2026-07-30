package com.internship.management.config;

import com.internship.management.entity.User;
import com.internship.management.enums.Role;
import com.internship.management.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class DatabaseSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        // Seed Admin user
        if (!userRepository.existsByEmail("admin@internship.com")) {
            User admin = User.builder()
                    .firstName("Admin")
                    .lastName("System")
                    .email("admin@internship.com")
                    .password(passwordEncoder.encode("Password123!"))
                    .role(Role.ADMIN)
                    .status("ACTIVE")
                    .build();
            userRepository.save(admin);
            System.out.println("Seeded Admin user: admin@internship.com / Password123!");
        }

        // Seed Intern user
        if (!userRepository.existsByEmail("intern@internship.com")) {
            User intern = User.builder()
                    .firstName("Intern")
                    .lastName("Developer")
                    .email("intern@internship.com")
                    .password(passwordEncoder.encode("Password123!"))
                    .role(Role.INTERN)
                    .status("ACTIVE")
                    .build();
            userRepository.save(intern);
            System.out.println("Seeded Intern user: intern@internship.com / Password123!");
        }
    }
}
