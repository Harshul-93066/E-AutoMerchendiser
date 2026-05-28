package com.bits.eautomerchandiser.controller;

import com.bits.eautomerchandiser.repository.SalesTransactionRepository;
import com.bits.eautomerchandiser.repository.ServiceAllocationRepository;
import com.bits.eautomerchandiser.repository.ServiceRecordRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.*;

@RestController
@RequestMapping("/api/reports")
@RequiredArgsConstructor
public class ReportController {

    private final SalesTransactionRepository salesTransactionRepository;
    private final ServiceRecordRepository serviceRecordRepository;
    private final ServiceAllocationRepository serviceAllocationRepository;

    @GetMapping("/sales")
    public ResponseEntity<Map<String, Object>> getSalesReport(
            @RequestParam String period,
            @RequestParam(required = false) Integer month,
            @RequestParam(required = false) Integer year) {

        LocalDate[] range = getDateRange(period, month, year);
        var sales = salesTransactionRepository.findBySaleDateBetween(range[0], range[1]);

        Map<String, Object> report = new HashMap<>();
        report.put("period", period);
        report.put("startDate", range[0]);
        report.put("endDate", range[1]);
        report.put("totalSales", sales.size());
        report.put("sales", sales);
        return ResponseEntity.ok(report);
    }

    @GetMapping("/sales/model-wise")
    public ResponseEntity<List<Map<String, Object>>> getSalesByModel(
            @RequestParam String period,
            @RequestParam(required = false) Integer month,
            @RequestParam(required = false) Integer year) {

        LocalDate[] range = getDateRange(period, month, year);
        List<Object[]> results = salesTransactionRepository.getSalesGroupedByModel(range[0], range[1]);

        List<Map<String, Object>> response = new ArrayList<>();
        for (Object[] row : results) {
            Map<String, Object> entry = new HashMap<>();
            entry.put("modelName", row[0]);
            entry.put("count", row[1]);
            entry.put("revenue", row[2]);
            response.add(entry);
        }
        return ResponseEntity.ok(response);
    }

    @GetMapping("/sales/make-wise")
    public ResponseEntity<List<Map<String, Object>>> getSalesByMake(
            @RequestParam String period,
            @RequestParam(required = false) Integer month,
            @RequestParam(required = false) Integer year) {

        LocalDate[] range = getDateRange(period, month, year);
        List<Object[]> results = salesTransactionRepository.getSalesGroupedByMake(range[0], range[1]);

        List<Map<String, Object>> response = new ArrayList<>();
        for (Object[] row : results) {
            Map<String, Object> entry = new HashMap<>();
            entry.put("make", row[0]);
            entry.put("count", row[1]);
            entry.put("revenue", row[2]);
            response.add(entry);
        }
        return ResponseEntity.ok(response);
    }

    @GetMapping("/services")
    public ResponseEntity<Map<String, Object>> getServiceReport(
            @RequestParam String period,
            @RequestParam(required = false) Integer month,
            @RequestParam(required = false) Integer year) {

        LocalDate[] range = getDateRange(period, month, year);
        Long count = serviceRecordRepository.countServicedByDateRange(range[0], range[1]);
        var records = serviceRecordRepository.findByDateRange(range[0], range[1]);

        Map<String, Object> report = new HashMap<>();
        report.put("period", period);
        report.put("startDate", range[0]);
        report.put("endDate", range[1]);
        report.put("totalServiced", count);
        report.put("records", records);
        return ResponseEntity.ok(report);
    }

    @GetMapping("/revenue/sales")
    public ResponseEntity<Map<String, Object>> getSalesRevenue(
            @RequestParam String period,
            @RequestParam(required = false) Integer month,
            @RequestParam(required = false) Integer year) {

        LocalDate[] range = getDateRange(period, month, year);
        Double revenue = salesTransactionRepository.getSalesRevenueByDateRange(range[0], range[1]);

        Map<String, Object> report = new HashMap<>();
        report.put("period", period);
        report.put("startDate", range[0]);
        report.put("endDate", range[1]);
        report.put("revenue", revenue);
        return ResponseEntity.ok(report);
    }

    @GetMapping("/revenue/services")
    public ResponseEntity<Map<String, Object>> getServiceRevenue(
            @RequestParam String period,
            @RequestParam(required = false) Integer month,
            @RequestParam(required = false) Integer year) {

        LocalDate[] range = getDateRange(period, month, year);
        Double revenue = serviceRecordRepository.getServiceRevenueByDateRange(range[0], range[1]);

        Map<String, Object> report = new HashMap<>();
        report.put("period", period);
        report.put("startDate", range[0]);
        report.put("endDate", range[1]);
        report.put("revenue", revenue);
        return ResponseEntity.ok(report);
    }

    @GetMapping("/mechanic-wise")
    public ResponseEntity<List<Map<String, Object>>> getMechanicWiseReport() {
        List<Object[]> results = serviceAllocationRepository.getMechanicWiseServiceCount();
        List<Map<String, Object>> response = new ArrayList<>();
        for (Object[] row : results) {
            Map<String, Object> entry = new HashMap<>();
            entry.put("mechanicName", row[0]);
            entry.put("serviceCount", row[1]);
            response.add(entry);
        }
        return ResponseEntity.ok(response);
    }

    private LocalDate[] getDateRange(String period, Integer month, Integer year) {
        LocalDate now = LocalDate.now();
        int y = (year != null) ? year : now.getYear();
        int m = (month != null) ? month : now.getMonthValue();

        LocalDate start, end;
        switch (period.toUpperCase()) {
            case "MONTHLY":
                start = LocalDate.of(y, m, 1);
                end = start.plusMonths(1).minusDays(1);
                break;
            case "HALF_YEARLY":
                if (m <= 6) {
                    start = LocalDate.of(y, 1, 1);
                    end = LocalDate.of(y, 6, 30);
                } else {
                    start = LocalDate.of(y, 7, 1);
                    end = LocalDate.of(y, 12, 31);
                }
                break;
            case "ANNUALLY":
                start = LocalDate.of(y, 1, 1);
                end = LocalDate.of(y, 12, 31);
                break;
            default:
                start = LocalDate.of(y, 1, 1);
                end = LocalDate.of(y, 12, 31);
        }
        return new LocalDate[]{start, end};
    }
}
