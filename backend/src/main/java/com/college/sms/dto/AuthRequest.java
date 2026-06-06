package com.college.sms.dto;

import com.college.sms.entity.Role;
import jakarta.validation.constraints.NotBlank;

public record AuthRequest(@NotBlank String email, @NotBlank String password, Role role) {}
