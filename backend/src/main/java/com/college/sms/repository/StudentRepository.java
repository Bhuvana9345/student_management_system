package com.college.sms.repository;

import com.college.sms.entity.Student;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface StudentRepository extends JpaRepository<Student, Long> {
    Page<Student> findByNameContainingIgnoreCaseOrRegisterNumberContainingIgnoreCaseOrEmailContainingIgnoreCase(String name, String registerNumber, String email, Pageable pageable);
    Page<Student> findByDepartment(String department, Pageable pageable);
    Optional<Student> findByRegisterNumber(String registerNumber);
    long countByDepartment(String department);
}
