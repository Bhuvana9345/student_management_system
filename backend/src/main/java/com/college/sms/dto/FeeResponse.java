package com.college.sms.dto;

import com.college.sms.entity.FeeStatus;
import java.math.BigDecimal;
import java.time.LocalDate;

public record FeeResponse(Long id, String studentName, BigDecimal amount, FeeStatus status, String paymentMode, LocalDate paymentDate) {}
