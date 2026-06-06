package com.college.sms.repository;

import com.college.sms.entity.Fee;
import com.college.sms.entity.FeeStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.math.BigDecimal;

public interface FeeRepository extends JpaRepository<Fee, Long> {
    long countByStatus(FeeStatus status);
    @Query("select coalesce(sum(f.amount), 0) from Fee f where f.status = com.college.sms.entity.FeeStatus.PAID")
    BigDecimal totalCollected();
}
