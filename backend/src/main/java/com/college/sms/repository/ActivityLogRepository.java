package com.college.sms.repository;

import com.college.sms.entity.ActivityLog;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ActivityLogRepository extends JpaRepository<ActivityLog, Long> {
    List<ActivityLog> findTop8ByOrderByCreatedAtDesc();
}
