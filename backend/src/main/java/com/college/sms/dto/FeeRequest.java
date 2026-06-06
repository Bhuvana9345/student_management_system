package com.college.sms.dto;

import com.college.sms.entity.FeeStatus;
import java.math.BigDecimal;

public record FeeRequest(Long studentId, BigDecimal amount, FeeStatus status, String paymentMode) {}
