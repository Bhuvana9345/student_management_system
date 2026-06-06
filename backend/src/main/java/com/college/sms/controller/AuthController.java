package com.college.sms.controller;

import com.college.sms.dto.AuthRequest;
import com.college.sms.dto.AuthResponse;
import com.college.sms.dto.UserSummary;
import com.college.sms.entity.Role;
import com.college.sms.entity.User;
import com.college.sms.repository.StaffRepository;
import com.college.sms.repository.StudentRepository;
import com.college.sms.repository.UserRepository;
import com.college.sms.security.JwtService;
import jakarta.validation.Valid;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    private final AuthenticationManager authManager;
    private final JwtService jwt;
    private final UserRepository users;
    private final StudentRepository students;
    private final StaffRepository staff;
    private final PasswordEncoder encoder;
    public AuthController(AuthenticationManager authManager, JwtService jwt, UserRepository users, StudentRepository students, StaffRepository staff, PasswordEncoder encoder) {
        this.authManager = authManager; this.jwt = jwt; this.users = users; this.students = students; this.staff = staff; this.encoder = encoder;
    }

    @PostMapping("/login")
    public AuthResponse login(@Valid @RequestBody AuthRequest request) {
        if (request.role() == Role.STUDENT) return studentLogin(request);
        if (request.role() == Role.STAFF) return staffLogin(request);
        var auth = authManager.authenticate(new UsernamePasswordAuthenticationToken(request.email(), request.password()));
        User user = users.findByEmail(request.email()).orElseThrow();
        if (request.role() != null && user.getRole() != request.role()) throw new IllegalArgumentException("Role does not match this account");
        return new AuthResponse(jwt.generateToken((org.springframework.security.core.userdetails.User) auth.getPrincipal()), new UserSummary(user.getId(), user.getName(), user.getEmail(), user.getRole()));
    }

    @PostMapping("/register")
    public UserSummary register(@Valid @RequestBody User user) {
        user.setPassword(encoder.encode(user.getPassword()));
        User saved = users.save(user);
        return new UserSummary(saved.getId(), saved.getName(), saved.getEmail(), saved.getRole());
    }

    private AuthResponse studentLogin(AuthRequest request) {
        var student = students.findByRegisterNumber(request.email()).orElseThrow(() -> new IllegalArgumentException("Student register number not found"));
        if (student.getDob() == null || !student.getDob().toString().equals(request.password())) {
            throw new IllegalArgumentException("Invalid date of birth. Use YYYY-MM-DD format.");
        }
        User loginUser = ensureRoleUser(student.getRegisterNumber() + "@student.local", student.getName(), Role.STUDENT);
        var principal = new org.springframework.security.core.userdetails.User(loginUser.getEmail(), loginUser.getPassword(), java.util.List.of(new org.springframework.security.core.authority.SimpleGrantedAuthority("ROLE_STUDENT")));
        return new AuthResponse(jwt.generateToken(principal), new UserSummary(student.getId(), student.getName(), student.getRegisterNumber(), Role.STUDENT));
    }

    private AuthResponse staffLogin(AuthRequest request) {
        var staffMember = staff.findByStaffId(request.email()).orElseThrow(() -> new IllegalArgumentException("Staff ID not found"));
        if (staffMember.getName() == null || !staffMember.getName().equalsIgnoreCase(request.password())) {
            throw new IllegalArgumentException("Invalid staff name");
        }
        User loginUser = ensureRoleUser(staffMember.getStaffId() + "@staff.local", staffMember.getName(), Role.STAFF);
        var principal = new org.springframework.security.core.userdetails.User(loginUser.getEmail(), loginUser.getPassword(), java.util.List.of(new org.springframework.security.core.authority.SimpleGrantedAuthority("ROLE_STAFF")));
        return new AuthResponse(jwt.generateToken(principal), new UserSummary(staffMember.getId(), staffMember.getName(), staffMember.getStaffId(), Role.STAFF));
    }

    private User ensureRoleUser(String email, String name, Role role) {
        return users.findByEmail(email).orElseGet(() -> {
            User user = new User();
            user.setName(name);
            user.setEmail(email);
            user.setPassword(encoder.encode("role-login"));
            user.setRole(role);
            return users.save(user);
        });
    }
}
