package com.internship.management.config;

import com.internship.management.entity.User;
import com.internship.management.entity.Intern;
import com.internship.management.enums.Role;
import com.internship.management.enums.InternStatus;
import com.internship.management.repository.UserRepository;
import com.internship.management.repository.InternRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import java.time.LocalDate;

@Component
@RequiredArgsConstructor
public class DatabaseSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final InternRepository internRepository;
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

        // Seed Intern profile
        if (!internRepository.existsByEmail("intern@internship.com")) {
            Intern internProfile = Intern.builder()
                    .employeeId("EMP001")
                    .firstName("Intern")
                    .lastName("Developer")
                    .email("intern@internship.com")
                    .phone("1234567890")
                    .university("State University")
                    .degree("Computer Science")
                    .startDate(LocalDate.now())
                    .endDate(LocalDate.now().plusMonths(6))
                    .status(InternStatus.ACTIVE)
                    .build();
            internRepository.save(internProfile);
            System.out.println("Seeded Intern Profile: intern@internship.com / EMP001");
        }

        // Seed Intern user
        if (!userRepository.existsByEmail("intern@internship.com")) {
            User intern = new User();
            intern.setFirstName("Intern");
            intern.setLastName("Developer");
            intern.setEmail("intern@internship.com");
            intern.setPassword(passwordEncoder.encode("Password123!"));
            intern.setRole(Role.INTERN);
            intern.setStatus("ACTIVE");
            userRepository.save(intern);
            System.out.println("Seeded Intern user: intern@internship.com / Password123!");
        }
    }
}
