package com.college.sms.dto;

import com.college.sms.entity.AttendanceStatus;
import java.time.LocalDate;

public record AttendanceRequest(Long studentId, LocalDate date, AttendanceStatus status) {}
