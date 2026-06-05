package com.bits.eautomerchandiser.service;

import com.bits.eautomerchandiser.repository.SalesTransactionRepository;
import com.bits.eautomerchandiser.repository.ServiceAllocationRepository;
import com.bits.eautomerchandiser.repository.ServiceRecordRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class ReportServiceImpl implements ReportService {

    private final SalesTransactionRepository salesTransactionRepository;
    private final ServiceRecordRepository serviceRecordRepository;
    private final ServiceAllocationRepository serviceAllocationRepository;

    @Override
    public Map<String, Object> getSalesReport(String period, Integer month, Integer year) {
        LocalDate[] range = getDateRange(period, month, year);
        var sales = salesTransactionRepository.findBySaleDateBetween(range[0], range[1]);

        Map<String, Object> report = new HashMap<>();
        report.put("period", period);
        report.put("startDate", range[0]);
        report.put("endDate", range[1]);
        report.put("totalSales", sales.size());
        report.put("sales", sales);
        return report;
    }

    @Override
    public List<Map<String, Object>> getSalesByModel(String period, Integer month, Integer year) {
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
        return response;
    }

    @Override
    public List<Map<String, Object>> getSalesByMake(String period, Integer month, Integer year) {
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
        return response;
    }

    @Override
    public Map<String, Object> getServiceReport(String period, Integer month, Integer year) {
        LocalDate[] range = getDateRange(period, month, year);
        Long count = serviceRecordRepository.countServicedByDateRange(range[0], range[1]);
        var records = serviceRecordRepository.findByDateRange(range[0], range[1]);

        Map<String, Object> report = new HashMap<>();
        report.put("period", period);
        report.put("startDate", range[0]);
        report.put("endDate", range[1]);
        report.put("totalServiced", count);
        report.put("records", records);
        return report;
    }

    @Override
    public Map<String, Object> getSalesRevenue(String period, Integer month, Integer year) {
        LocalDate[] range = getDateRange(period, month, year);
        Double revenue = salesTransactionRepository.getSalesRevenueByDateRange(range[0], range[1]);

        Map<String, Object> report = new HashMap<>();
        report.put("period", period);
        report.put("startDate", range[0]);
        report.put("endDate", range[1]);
        report.put("revenue", revenue);
        return report;
    }

    @Override
    public Map<String, Object> getServiceRevenue(String period, Integer month, Integer year) {
        LocalDate[] range = getDateRange(period, month, year);
        Double revenue = serviceRecordRepository.getServiceRevenueByDateRange(range[0], range[1]);

        Map<String, Object> report = new HashMap<>();
        report.put("period", period);
        report.put("startDate", range[0]);
        report.put("endDate", range[1]);
        report.put("revenue", revenue);
        return report;
    }

    @Override
    public List<Map<String, Object>> getMechanicWiseReport() {
        List<Object[]> results = serviceAllocationRepository.getMechanicWiseServiceCount();
        List<Map<String, Object>> response = new ArrayList<>();
        for (Object[] row : results) {
            Map<String, Object> entry = new HashMap<>();
            entry.put("mechanicName", row[0]);
            entry.put("serviceCount", row[1]);
            response.add(entry);
        }
        return response;
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