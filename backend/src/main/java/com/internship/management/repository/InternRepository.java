package com.internship.management.repository;

import com.internship.management.entity.Intern;
import com.internship.management.enums.InternStatus;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface InternRepository extends MongoRepository<Intern, String> {
    Optional<Intern> findByEmail(String email);
    Optional<Intern> findByEmployeeId(String employeeId);
    List<Intern> findByStatus(InternStatus status);
    boolean existsByEmail(String email);
    boolean existsByEmployeeId(String employeeId);
}
