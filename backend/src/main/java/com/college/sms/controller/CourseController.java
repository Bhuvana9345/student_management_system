package com.college.sms.controller;

import com.college.sms.entity.Course;
import com.college.sms.exception.ResourceNotFoundException;
import com.college.sms.repository.CourseRepository;
import com.college.sms.service.ActivityService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/courses")
public class CourseController {
    private final CourseRepository courses;
    private final ActivityService activity;
    public CourseController(CourseRepository courses, ActivityService activity) { this.courses = courses; this.activity = activity; }
    @GetMapping public Page<Course> list(Pageable pageable) { return courses.findAll(pageable); }
    @GetMapping("/{id}") public Course get(@PathVariable Long id) { return courses.findById(id).orElseThrow(() -> new ResourceNotFoundException("Course not found")); }
    @PostMapping public Course create(@Valid @RequestBody Course course) { activity.log("Added course " + course.getName()); return courses.save(course); }
    @PutMapping("/{id}") public Course update(@PathVariable Long id, @Valid @RequestBody Course course) { course.setId(id); activity.log("Updated course " + course.getName()); return courses.save(course); }
    @DeleteMapping("/{id}") public void delete(@PathVariable Long id) { courses.deleteById(id); activity.log("Deleted course #" + id); }
}
