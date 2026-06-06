package com.college.sms.repository;

import com.college.sms.entity.Attendance;
import com.college.sms.entity.AttendanceStatus;
import com.college.sms.entity.Student;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface AttendanceRepository extends JpaRepository<Attendance, Long> {
    Optional<Attendance> findByStudentAndDate(Student student, LocalDate date);
    Page<Attendance> findByDate(LocalDate date, Pageable pageable);
    long countByStatus(AttendanceStatus status);
    long countByStudentAndStatus(Student student, AttendanceStatus status);
    long countByStudent(Student student);
    List<Attendance> findByDateBetween(LocalDate start, LocalDate end);
}
