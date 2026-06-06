package com.college.sms;

import com.college.sms.entity.Role;
import com.college.sms.entity.User;
import com.college.sms.entity.Course;
import com.college.sms.repository.CourseRepository;
import com.college.sms.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.password.PasswordEncoder;

@SpringBootApplication
public class StudentManagementSystemApplication {
    public static void main(String[] args) {
        SpringApplication.run(StudentManagementSystemApplication.class, args);
    }

    @Bean
    CommandLineRunner seedAdmin(UserRepository users, CourseRepository courses, PasswordEncoder encoder) {
        return args -> {
            if (users.findByEmail("admin@college.edu").isEmpty()) {
                User admin = new User();
                admin.setName("System Administrator");
                admin.setEmail("admin@college.edu");
                admin.setPassword(encoder.encode("password"));
                admin.setRole(Role.ADMIN);
                users.save(admin);
            }
            String[] groups = {"CSE", "ECE", "EEE", "MECH", "CIVIL", "BCA", "B.Sc Computer Science", "B.Sc Mathematics", "B.Sc Physics", "B.Sc Chemistry", "B.Com", "BBA", "BA English", "BA Tamil", "BA History", "BA Economics"};
            for (String group : groups) {
                String code = group.replaceAll("\\s+", "-").replace(".", "").toUpperCase();
                if (courses.findByCode(code).isEmpty()) {
                    Course course = new Course();
                    course.setCode(code);
                    course.setName(group);
                    course.setAssignedFaculty("");
                    course.setDuration("");   
                    course.setDescription("Academic group");
                    courses.save(course);
                }
            }
        };
    }
}
