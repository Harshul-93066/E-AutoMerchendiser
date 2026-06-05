package com.bits.eautomerchandiser.controller;

import com.bits.eautomerchandiser.service.ReportService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/reports")
@RequiredArgsConstructor
public class ReportController {

    private final ReportService reportService;

    @GetMapping("/sales")
    public ResponseEntity<Map<String, Object>> getSalesReport(
            @RequestParam String period,
            @RequestParam(required = false) Integer month,
            @RequestParam(required = false) Integer year) {
        return ResponseEntity.ok(reportService.getSalesReport(period, month, year));
    }

    @GetMapping("/sales/model-wise")
    public ResponseEntity<List<Map<String, Object>>> getSalesByModel(
            @RequestParam String period,
            @RequestParam(required = false) Integer month,
            @RequestParam(required = false) Integer year) {
        return ResponseEntity.ok(reportService.getSalesByModel(period, month, year));
    }

    @GetMapping("/sales/make-wise")
    public ResponseEntity<List<Map<String, Object>>> getSalesByMake(
            @RequestParam String period,
            @RequestParam(required = false) Integer month,
            @RequestParam(required = false) Integer year) {
        return ResponseEntity.ok(reportService.getSalesByMake(period, month, year));
    }

    @GetMapping("/services")
    public ResponseEntity<Map<String, Object>> getServiceReport(
            @RequestParam String period,
            @RequestParam(required = false) Integer month,
            @RequestParam(required = false) Integer year) {
        return ResponseEntity.ok(reportService.getServiceReport(period, month, year));
    }

    @GetMapping("/revenue/sales")
    public ResponseEntity<Map<String, Object>> getSalesRevenue(
            @RequestParam String period,
            @RequestParam(required = false) Integer month,
            @RequestParam(required = false) Integer year) {
        return ResponseEntity.ok(reportService.getSalesRevenue(period, month, year));
    }

    @GetMapping("/revenue/services")
    public ResponseEntity<Map<String, Object>> getServiceRevenue(
            @RequestParam String period,
            @RequestParam(required = false) Integer month,
            @RequestParam(required = false) Integer year) {
        return ResponseEntity.ok(reportService.getServiceRevenue(period, month, year));
    }

    @GetMapping("/mechanic-wise")
    public ResponseEntity<List<Map<String, Object>>> getMechanicWiseReport() {
        return ResponseEntity.ok(reportService.getMechanicWiseReport());
    }
}