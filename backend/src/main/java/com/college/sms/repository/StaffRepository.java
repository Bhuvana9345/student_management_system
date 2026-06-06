package com.college.sms.repository;

import com.college.sms.entity.Staff;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface StaffRepository extends JpaRepository<Staff, Long> {
    Optional<Staff> findByStaffId(String staffId);
}
