package com.college.sms.repository;

import com.college.sms.entity.Mark;
import com.college.sms.entity.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface MarkRepository extends JpaRepository<Mark, Long> {
    List<Mark> findByStudentAndSemester(Student student, Integer semester);
}
