package com.college.sms.controller;

import com.college.sms.dto.MarkRequest;
import com.college.sms.dto.MarkResponse;
import com.college.sms.entity.Mark;
import com.college.sms.exception.ResourceNotFoundException;
import com.college.sms.repository.CourseRepository;
import com.college.sms.repository.MarkRepository;
import com.college.sms.repository.StudentRepository;
import com.college.sms.service.ActivityService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/marks")
public class MarksController {
    private final MarkRepository marks;
    private final StudentRepository students;
    private final CourseRepository courses;
    private final ActivityService activity;
    public MarksController(MarkRepository marks, StudentRepository students, CourseRepository courses, ActivityService activity) {
        this.marks = marks; this.students = students; this.courses = courses; this.activity = activity;
    }
    @GetMapping public Page<MarkResponse> list(Pageable pageable) { return marks.findAll(pageable).map(this::toResponse); }
    @PostMapping
    public MarkResponse save(@RequestBody MarkRequest request) {
        var student = students.findById(request.studentId()).orElseThrow(() -> new ResourceNotFoundException("Student not found"));
        var course = courses.findById(request.courseId()).orElseThrow(() -> new ResourceNotFoundException("Course not found"));
        Mark mark = new Mark();
        mark.setStudent(student);
        mark.setCourse(course);
        mark.setSemester(request.semester());
        mark.setInternalMarks(request.internalMarks());
        mark.setExternalMarks(request.externalMarks());
        double total = request.internalMarks() + request.externalMarks();
        mark.setTotal(total);
        mark.setGrade(grade(total));
        mark.setGpa(gpa(total));
        activity.log("Saved marks for " + student.getName());
        return toResponse(marks.save(mark));
    }
    @GetMapping("/results/{studentId}")
    public List<MarkResponse> result(@PathVariable Long studentId, @RequestParam Integer semester) {
        var student = students.findById(studentId).orElseThrow(() -> new ResourceNotFoundException("Student not found"));
        return marks.findByStudentAndSemester(student, semester).stream().map(this::toResponse).toList();
    }
    private MarkResponse toResponse(Mark mark) {
        return new MarkResponse(
                mark.getId(),
                mark.getStudent().getRegisterNumber(),
                mark.getStudent().getName(),
                mark.getCourse().getName(),
                mark.getSemester(),
                mark.getInternalMarks(),
                mark.getExternalMarks(),
                mark.getTotal(),
                mark.getGrade(),
                mark.getGpa()
        );
    }
    private String grade(double total) {
        if (total >= 90) return "A+";
        if (total >= 80) return "A";
        if (total >= 70) return "B";
        if (total >= 60) return "C";
        if (total >= 50) return "D";
        return "F";
    }
    private double gpa(double total) { return Math.round(Math.min(10, total / 10) * 100.0) / 100.0; }
}
