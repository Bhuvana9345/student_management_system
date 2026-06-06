package com.college.sms.controller;

import com.college.sms.entity.Staff;
import com.college.sms.repository.StaffRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/staff")
public class StaffController {
    private final StaffRepository staff;
    public StaffController(StaffRepository staff) { this.staff = staff; }
    @GetMapping public Page<Staff> list(Pageable pageable) { return staff.findAll(pageable); }
    @PostMapping public Staff create(@RequestBody Staff input) { return staff.save(input); }
    @PutMapping("/{id}") public Staff update(@PathVariable Long id, @RequestBody Staff input) { input.setId(id); return staff.save(input); }
    @DeleteMapping("/{id}") public void delete(@PathVariable Long id) { staff.deleteById(id); }
}
