package com.college.sms.controller;

import com.college.sms.repository.StudentRepository;
import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.element.Paragraph;
import org.apache.poi.ss.usermodel.CellStyle;
import org.apache.poi.ss.usermodel.Font;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import java.io.ByteArrayOutputStream;

@RestController
@RequestMapping("/api/reports")
public class ReportsController {
    private final StudentRepository students;
    public ReportsController(StudentRepository students) { this.students = students; }

    @GetMapping("/{type}/excel")
    public ResponseEntity<byte[]> excel(@PathVariable String type) throws Exception {
        try (XSSFWorkbook workbook = new XSSFWorkbook(); ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            var sheet = workbook.createSheet(type);
            String[] headers = {
                    "Student ID",
                    "Register Number",
                    "Student Name",
                    "Department",
                    "Email",
                    "Phone Number",
                    "Gender",
                    "Full Address",
                    "Academic Year",
                    "Date of Birth",
                    "Profile Photo Path",
                    "Created At"
            };
            CellStyle headerStyle = workbook.createCellStyle();
            Font headerFont = workbook.createFont();
            headerFont.setBold(true);
            headerStyle.setFont(headerFont);
            var header = sheet.createRow(0);
            for (int i = 0; i < headers.length; i++) {
                header.createCell(i).setCellValue(headers[i]);
                header.getCell(i).setCellStyle(headerStyle);
            }
            int rowIndex = 1;
            for (var student : students.findAll()) {
                var row = sheet.createRow(rowIndex++);
                row.createCell(0).setCellValue(student.getId() == null ? "" : student.getId().toString());
                row.createCell(1).setCellValue(value(student.getRegisterNumber()));
                row.createCell(2).setCellValue(value(student.getName()));
                row.createCell(3).setCellValue(value(student.getDepartment()));
                row.createCell(4).setCellValue(value(student.getEmail()));
                row.createCell(5).setCellValue(value(student.getPhoneNumber()));
                row.createCell(6).setCellValue(value(student.getGender()));
                row.createCell(7).setCellValue(value(student.getAddress()));
                row.createCell(8).setCellValue(student.getYear() == null ? "" : student.getYear().toString());
                row.createCell(9).setCellValue(student.getDob() == null ? "" : student.getDob().toString());
                row.createCell(10).setCellValue(value(student.getProfilePhotoPath()));
                row.createCell(11).setCellValue(student.getCreatedAt() == null ? "" : student.getCreatedAt().toString());
            }
            for (int i = 0; i < headers.length; i++) {
                sheet.autoSizeColumn(i);
            }
            sheet.createFreezePane(0, 1);
            workbook.write(out);
            return ResponseEntity.ok().header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=" + type + ".xlsx").contentType(MediaType.parseMediaType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")).body(out.toByteArray());
        }
    }

    @GetMapping("/{type}/pdf")
    public ResponseEntity<byte[]> pdf(@PathVariable String type) throws Exception {
        ByteArrayOutputStream out = new ByteArrayOutputStream();
        Document doc = new Document(new PdfDocument(new PdfWriter(out)));
        doc.add(new Paragraph("CampusERP " + type + " Report").setBold().setFontSize(18));
        students.findAll().forEach(s -> doc.add(new Paragraph(
                "ID: " + s.getId()
                        + " | Register: " + value(s.getRegisterNumber())
                        + " | Name: " + value(s.getName())
                        + " | Department: " + value(s.getDepartment())
                        + " | Email: " + value(s.getEmail())
                        + " | Phone: " + value(s.getPhoneNumber())
                        + " | Gender: " + value(s.getGender())
                        + " | Year: " + (s.getYear() == null ? "" : s.getYear())
                        + " | DOB: " + (s.getDob() == null ? "" : s.getDob())
        )));
        doc.close();
        return ResponseEntity.ok().contentType(MediaType.APPLICATION_PDF).body(out.toByteArray());
    }

    private String value(String input) {
        return input == null ? "" : input;
    }
}
