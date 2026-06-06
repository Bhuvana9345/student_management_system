package com.college.sms.dto;

public record MarkResponse(
        Long id,
        String registerNumber,
        String studentName,
        String courseName,
        Integer semester,
        Double internalMarks,
        Double externalMarks,
        Double total,
        String grade,
        Double gpa
) {}
