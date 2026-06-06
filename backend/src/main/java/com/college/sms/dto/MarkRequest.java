package com.college.sms.dto;

public record MarkRequest(Long studentId, Long courseId, Integer semester, Double internalMarks, Double externalMarks) {}
