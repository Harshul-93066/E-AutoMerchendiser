package com.bits.eautomerchandiser.service;

import com.bits.eautomerchandiser.dto.DeliveryRequest;
import com.bits.eautomerchandiser.dto.SalesRequest;
import com.bits.eautomerchandiser.dto.ServiceRecordRequest;
import com.bits.eautomerchandiser.model.*;

import java.util.List;
import java.util.Map;

public interface ClerkService {
    
    // Service Record operations
    ServiceRecord createServiceRecord(ServiceRecordRequest request);
    List<ServiceRecord> getAllServiceRecords();
    Map<String, Object> generateServiceBill(Long serviceRecordId);
    
    // Sales operations
    SalesTransaction recordSale(SalesRequest request, Long clerkId);
    List<SalesTransaction> getSalesWithoutDelivery();
    List<SalesTransaction> getAllSales();
    Map<String, Object> generateSalesBill(Long saleId);
    
    // Delivery operations
    DeliveryRecord recordDelivery(DeliveryRequest request, Long clerkId);
    List<DeliveryRecord> getAllDeliveries();
    
    // Reference data
    List<VehicleModel> getVehicleModels();
    List<ServiceCategory> getServiceCategories();
    List<User> getCustomers();
}