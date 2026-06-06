package com.college.sms.controller;

import com.college.sms.dto.FeeRequest;
import com.college.sms.dto.FeeResponse;
import com.college.sms.entity.Fee;
import com.college.sms.entity.FeeStatus;
import com.college.sms.exception.ResourceNotFoundException;
import com.college.sms.repository.FeeRepository;
import com.college.sms.repository.StudentRepository;
import com.college.sms.service.ActivityService;
import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.borders.Border;
import com.itextpdf.layout.borders.SolidBorder;
import com.itextpdf.layout.element.Cell;
import com.itextpdf.layout.element.Image;
import com.itextpdf.layout.element.Paragraph;
import com.itextpdf.layout.element.Table;
import com.itextpdf.layout.properties.TextAlignment;
import com.itextpdf.layout.properties.UnitValue;
import com.itextpdf.layout.properties.VerticalAlignment;
import com.itextpdf.io.image.ImageDataFactory;
import org.springframework.core.io.ClassPathResource;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import java.io.ByteArrayOutputStream;
import java.io.InputStream;
import java.util.Map;

@RestController
@RequestMapping("/api/fees")
public class FeesController {
    private static final String COLLEGE_NAME = "CampusERP College";
    private static final String COLLEGE_ADDRESS = "No. 18, Rajiv Gandhi Salai (OMR), Thoraipakkam, Chennai - 600097, Tamil Nadu";
    private static final String COLLEGE_CONTACT = "Phone: +91 44 2456 7890 | Email: office@campuserpcollege.edu.in | Web: www.campuserpcollege.edu.in";
    private final FeeRepository fees;
    private final StudentRepository students;
    private final ActivityService activity;
    public FeesController(FeeRepository fees, StudentRepository students, ActivityService activity) {
        this.fees = fees; this.students = students; this.activity = activity;
    }
    @GetMapping public Page<FeeResponse> list(Pageable pageable) { return fees.findAll(pageable).map(this::toResponse); }
    @PostMapping
    public FeeResponse save(@RequestBody FeeRequest request) {
        var student = students.findById(request.studentId()).orElseThrow(() -> new ResourceNotFoundException("Student not found"));
        Fee fee = new Fee();
        fee.setStudent(student);
        fee.setAmount(request.amount());
        fee.setStatus(request.status());
        fee.setPaymentMode(request.paymentMode());
        activity.log("Updated fee status for " + student.getName());
        return toResponse(fees.save(fee));
    }
    @GetMapping("/summary")
    public Map<String, Object> summary() {
        return Map.of("paidCount", fees.countByStatus(FeeStatus.PAID), "unpaidCount", fees.countByStatus(FeeStatus.UNPAID), "totalCollected", fees.totalCollected());
    }
    @GetMapping("/{id}/receipt")
    public ResponseEntity<byte[]> receipt(@PathVariable Long id) throws Exception {
        Fee fee = fees.findById(id).orElseThrow(() -> new ResourceNotFoundException("Fee not found"));
        ByteArrayOutputStream out = new ByteArrayOutputStream();
        Document doc = new Document(new PdfDocument(new PdfWriter(out)));
        doc.add(new Paragraph(COLLEGE_NAME).setBold().setFontSize(16).setTextAlignment(TextAlignment.CENTER));
        doc.add(new Paragraph(COLLEGE_ADDRESS).setFontSize(9).setTextAlignment(TextAlignment.CENTER));
        doc.add(new Paragraph(COLLEGE_CONTACT).setFontSize(9).setTextAlignment(TextAlignment.CENTER));
        doc.add(new Paragraph(" ").setBorderBottom(new SolidBorder(1)));
        doc.add(new Paragraph("Student Copy").setFontSize(10).setTextAlignment(TextAlignment.CENTER));
        doc.add(new Paragraph("Official Receipt").setBold().setFontSize(15).setTextAlignment(TextAlignment.CENTER));

        Table info = new Table(UnitValue.createPercentArray(new float[]{50, 50})).useAllAvailableWidth();
        info.addCell(cleanCell("Student Name: " + fee.getStudent().getName()));
        info.addCell(cleanCell("Roll No: " + fee.getStudent().getId()));
        info.addCell(cleanCell("Register No: " + fee.getStudent().getRegisterNumber()));
        info.addCell(cleanCell("Department: " + fee.getStudent().getDepartment()));
        info.addCell(cleanCell("Year: " + (fee.getStudent().getYear() == null ? "" : fee.getStudent().getYear())));
        info.addCell(cleanCell("Date: " + fee.getPaymentDate()));
        info.addCell(cleanCell("Receipt No: " + String.format("%05d", fee.getId())));
        info.addCell(cleanCell("Payment Mode: " + (fee.getPaymentMode() == null ? "Cash" : fee.getPaymentMode())));
        doc.add(info);

        Table bill = new Table(UnitValue.createPercentArray(new float[]{10, 65, 25})).useAllAvailableWidth();
        bill.addHeaderCell(headerCell("S.No."));
        bill.addHeaderCell(headerCell("Bill Item"));
        bill.addHeaderCell(headerCell("Amount"));
        bill.addCell(bodyCell("1"));
        bill.addCell(bodyCell("Tuition Fees"));
        bill.addCell(bodyCell("Rs. " + fee.getAmount()).setTextAlignment(TextAlignment.RIGHT));
        doc.add(new Paragraph("\n"));
        doc.add(bill);

        doc.add(new Paragraph("Total: Rs. " + fee.getAmount()).setBold().setTextAlignment(TextAlignment.RIGHT));
        doc.add(new Paragraph("Received with thanks a sum of Rs. " + fee.getAmount() + " as payment towards college fees on " + fee.getPaymentDate() + ".")
                .setFontSize(10));

        Table footer = new Table(UnitValue.createPercentArray(new float[]{50, 50})).useAllAvailableWidth();
        footer.addCell(cleanCell("\n\n\nPrinted By: ADMIN").setHeight(105).setVerticalAlignment(VerticalAlignment.BOTTOM));
        footer.addCell(signatureCell());
        doc.add(new Paragraph("\n"));
        doc.add(footer);
        doc.add(new Paragraph("Printed on " + fee.getPaymentDate()).setFontSize(8).setTextAlignment(TextAlignment.RIGHT));
        doc.close();
        return ResponseEntity.ok().header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=receipt-" + id + ".pdf").contentType(MediaType.APPLICATION_PDF).body(out.toByteArray());
    }
    private FeeResponse toResponse(Fee fee) {
        return new FeeResponse(fee.getId(), fee.getStudent().getName(), fee.getAmount(), fee.getStatus(), fee.getPaymentMode(), fee.getPaymentDate());
    }

    private void addRow(Table table, String label, String value) {
        table.addCell(new Cell().add(new Paragraph(label).setBold()));
        table.addCell(new Cell().add(new Paragraph(value == null ? "" : value)));
    }

    private Cell cleanCell(String text) {
        return new Cell().add(new Paragraph(text).setFontSize(10)).setBorder(Border.NO_BORDER);
    }

    private Cell headerCell(String text) {
        return new Cell().add(new Paragraph(text).setBold().setFontSize(10));
    }

    private Cell bodyCell(String text) {
        return new Cell().add(new Paragraph(text).setFontSize(10));
    }

    private Cell signatureCell() {
        Cell cell = new Cell()
                .setBorder(Border.NO_BORDER)
                .setTextAlignment(TextAlignment.RIGHT)
                .setHeight(105)
                .setVerticalAlignment(VerticalAlignment.BOTTOM);
        try {
            ClassPathResource resource = new ClassPathResource("signature.png");
            if (resource.exists()) {
                try (InputStream input = resource.getInputStream()) {
                    Image signature = new Image(ImageDataFactory.create(input.readAllBytes()))
                            .setWidth(95)
                            .setAutoScaleHeight(true);
                    cell.add(signature);
                }
            }
        } catch (Exception ignored) {
            // If the image is missing, the receipt still prints with the signature label.
        }
        cell.add(new Paragraph("Authorized Signatory").setFontSize(9));
        return cell;
    }
}
