package com.college.sms.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "marks")
public class Mark {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @ManyToOne(optional = false) private Student student;
    @ManyToOne(optional = false) private Course course;
    private Integer semester;
    private Double internalMarks;
    private Double externalMarks;
    private Double total;
    private String grade;
    private Double gpa;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Student getStudent() { return student; }
    public void setStudent(Student student) { this.student = student; }
    public Course getCourse() { return course; }
    public void setCourse(Course course) { this.course = course; }
    public Integer getSemester() { return semester; }
    public void setSemester(Integer semester) { this.semester = semester; }
    public Double getInternalMarks() { return internalMarks; }
    public void setInternalMarks(Double internalMarks) { this.internalMarks = internalMarks; }
    public Double getExternalMarks() { return externalMarks; }
    public void setExternalMarks(Double externalMarks) { this.externalMarks = externalMarks; }
    public Double getTotal() { return total; }
    public void setTotal(Double total) { this.total = total; }
    public String getGrade() { return grade; }
    public void setGrade(String grade) { this.grade = grade; }
    public Double getGpa() { return gpa; }
    public void setGpa(Double gpa) { this.gpa = gpa; }
}
