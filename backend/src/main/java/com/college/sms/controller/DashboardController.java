package com.college.sms.controller;

import com.college.sms.entity.AttendanceStatus;
import com.college.sms.entity.FeeStatus;
import com.college.sms.repository.AttendanceRepository;
import com.college.sms.repository.CourseRepository;
import com.college.sms.repository.FeeRepository;
import com.college.sms.repository.StudentRepository;
import com.college.sms.service.ActivityService;
import org.springframework.web.bind.annotation.*;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {
    private final StudentRepository students;
    private final CourseRepository courses;
    private final AttendanceRepository attendance;
    private final FeeRepository fees;
    private final ActivityService activity;
    public DashboardController(StudentRepository students, CourseRepository courses, AttendanceRepository attendance, FeeRepository fees, ActivityService activity) {
        this.students = students; this.courses = courses; this.attendance = attendance; this.fees = fees; this.activity = activity;
    }
    @GetMapping
    public Map<String, Object> stats() {
        long attendanceTotal = attendance.count();
        long present = attendance.countByStatus(AttendanceStatus.PRESENT);
        long feeTotal = fees.count();
        long paid = fees.countByStatus(FeeStatus.PAID);
        Map<String, Long> departments = new LinkedHashMap<>();
        List.of("CSE", "ECE", "EEE", "MECH", "CIVIL", "BCA", "B.Sc Computer Science", "B.Sc Mathematics", "B.Sc Physics", "B.Sc Chemistry", "B.Com", "BBA", "BA English", "BA Tamil", "BA History", "BA Economics")
                .forEach(d -> departments.put(d, students.countByDepartment(d)));
        return Map.of(
                "totalStudents", students.count(),
                "totalCourses", courses.count(),
                "attendancePercentage", attendanceTotal == 0 ? 0 : Math.round((present * 10000.0) / attendanceTotal) / 100.0,
                "feeCollectionStatus", feeTotal == 0 ? 0 : Math.round((paid * 10000.0) / feeTotal) / 100.0,
                "departmentCounts", departments,
                "months", List.of("Jan", "Feb", "Mar", "Apr", "May", "Jun"),
                "attendanceTrend", List.of(82, 86, 88, 91, 87, 93),
                "recentActivities", activity.recent()
        );
    }
}
