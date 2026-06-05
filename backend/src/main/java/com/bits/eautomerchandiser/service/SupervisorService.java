package com.bits.eautomerchandiser.service;

import com.bits.eautomerchandiser.dto.AllocationRequest;
import com.bits.eautomerchandiser.model.DeliveryRecord;
import com.bits.eautomerchandiser.model.ServiceAllocation;
import com.bits.eautomerchandiser.model.ServiceRecord;
import com.bits.eautomerchandiser.model.User;

import java.util.List;
import java.util.Map;

public interface SupervisorService {
    
    // Service Record operations
    List<ServiceRecord> getServiceRecords(String status);
    List<Map<String, Object>> getServiceStatus();
    
    // Allocation operations
    List<User> getMechanics();
    ServiceAllocation allocateVehicle(AllocationRequest request);
    
    // Approval operations
    void approveForDelivery(Long serviceRecordId);
    List<DeliveryRecord> getPendingDeliveries();
    void approveDelivery(Long deliveryId);
    void rejectDelivery(Long deliveryId);
}