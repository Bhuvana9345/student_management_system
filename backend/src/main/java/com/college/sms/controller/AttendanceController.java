package com.college.sms.controller;

import com.college.sms.dto.AttendanceRequest;
import com.college.sms.entity.Attendance;
import com.college.sms.entity.AttendanceStatus;
import com.college.sms.exception.ResourceNotFoundException;
import com.college.sms.repository.AttendanceRepository;
import com.college.sms.repository.StudentRepository;
import com.college.sms.service.ActivityService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDate;
import java.util.Map;

@RestController
@RequestMapping("/api/attendance")
public class AttendanceController {
    private final AttendanceRepository attendance;
    private final StudentRepository students;
    private final ActivityService activity;
    public AttendanceController(AttendanceRepository attendance, StudentRepository students, ActivityService activity) {
        this.attendance = attendance; this.students = students; this.activity = activity;
    }
    @GetMapping
    public Page<Attendance> list(@RequestParam(required = false) LocalDate date, Pageable pageable) {
        return date == null ? attendance.findAll(pageable) : attendance.findByDate(date, pageable);
    }
    @PostMapping("/mark")
    public Attendance mark(@RequestBody AttendanceRequest request) {
        var student = students.findById(request.studentId()).orElseThrow(() -> new ResourceNotFoundException("Student not found"));
        Attendance row = attendance.findByStudentAndDate(student, request.date()).orElseGet(Attendance::new);
        row.setStudent(student);
        row.setDate(request.date());
        row.setStatus(request.status());
        activity.log("Marked " + student.getName() + " as " + request.status());
        return attendance.save(row);
    }
    @GetMapping("/report")
    public Map<String, Object> report(@RequestParam Long studentId) {
        var student = students.findById(studentId).orElseThrow(() -> new ResourceNotFoundException("Student not found"));
        long total = attendance.countByStudent(student);
        long present = attendance.countByStudentAndStatus(student, AttendanceStatus.PRESENT);
        double percentage = total == 0 ? 0 : Math.round((present * 10000.0) / total) / 100.0;
        return Map.of("student", student.getName(), "totalDays", total, "presentDays", present, "percentage", percentage);
    }
}
