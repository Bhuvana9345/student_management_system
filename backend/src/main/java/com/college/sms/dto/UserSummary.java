package com.college.sms.dto;

import com.college.sms.entity.Role;

public record UserSummary(Long id, String name, String email, Role role) {}
