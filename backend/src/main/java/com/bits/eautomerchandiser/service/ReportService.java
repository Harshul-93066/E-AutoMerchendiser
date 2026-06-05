package com.bits.eautomerchandiser.service;

import java.util.List;
import java.util.Map;

public interface ReportService {
    
    // Sales Reports
    Map<String, Object> getSalesReport(String period, Integer month, Integer year);
    List<Map<String, Object>> getSalesByModel(String period, Integer month, Integer year);
    List<Map<String, Object>> getSalesByMake(String period, Integer month, Integer year);
    
    // Service Reports
    Map<String, Object> getServiceReport(String period, Integer month, Integer year);
    
    // Revenue Reports
    Map<String, Object> getSalesRevenue(String period, Integer month, Integer year);
    Map<String, Object> getServiceRevenue(String period, Integer month, Integer year);
    
    // Mechanic Report
    List<Map<String, Object>> getMechanicWiseReport();
}