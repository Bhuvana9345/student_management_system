package com.college.sms.controller;

import com.college.sms.entity.Student;
import com.college.sms.exception.ResourceNotFoundException;
import com.college.sms.repository.StudentRepository;
import com.college.sms.service.ActivityService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.*;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.nio.file.Files;
import java.nio.file.Path;

@RestController
@RequestMapping("/api/students")
public class StudentController {
    private final StudentRepository students;
    private final ActivityService activity;
    @Value("${app.upload-dir}") private String uploadDir;
    public StudentController(StudentRepository students, ActivityService activity) { this.students = students; this.activity = activity; }

    @GetMapping
    public Page<Student> list(@RequestParam(defaultValue = "") String search, @RequestParam(defaultValue = "") String department, Pageable pageable) {
        if (!search.isBlank()) return students.findByNameContainingIgnoreCaseOrRegisterNumberContainingIgnoreCaseOrEmailContainingIgnoreCase(search, search, search, pageable);
        if (!department.isBlank()) return students.findByDepartment(department, pageable);
        return students.findAll(pageable);
    }
    @GetMapping("/{id}") public Student get(@PathVariable Long id) { return students.findById(id).orElseThrow(() -> new ResourceNotFoundException("Student not found")); }
    @PostMapping public Student create(@Valid @RequestBody Student student) { activity.log("Added student " + student.getName()); return students.save(student); }
    @PutMapping("/{id}") public Student update(@PathVariable Long id, @Valid @RequestBody Student input) { input.setId(id); activity.log("Updated student " + input.getName()); return students.save(input); }
    @DeleteMapping("/{id}") public void delete(@PathVariable Long id) { students.deleteById(id); activity.log("Deleted student #" + id); }
    @PostMapping("/{id}/photo")
    public Student upload(@PathVariable Long id, @RequestParam MultipartFile file) throws Exception {
        Student student = get(id);
        Files.createDirectories(Path.of(uploadDir));
        Path path = Path.of(uploadDir, id + "-" + file.getOriginalFilename());
        file.transferTo(path);
        student.setProfilePhotoPath(path.toString());
        return students.save(student);
    }

    @GetMapping("/{id}/photo")
    public ResponseEntity<byte[]> photo(@PathVariable Long id) throws Exception {
        Student student = get(id);
        if (student.getProfilePhotoPath() == null || student.getProfilePhotoPath().isBlank()) {
            throw new ResourceNotFoundException("Photo not uploaded");
        }
        Path path = Path.of(student.getProfilePhotoPath());
        if (!Files.exists(path)) throw new ResourceNotFoundException("Photo file not found");
        String contentType = Files.probeContentType(path);
        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(contentType == null ? "image/jpeg" : contentType))
                .body(Files.readAllBytes(path));
    }
}
