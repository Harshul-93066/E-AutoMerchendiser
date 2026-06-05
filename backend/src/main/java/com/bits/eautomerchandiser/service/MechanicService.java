package com.bits.eautomerchandiser.service;

import com.bits.eautomerchandiser.model.ServiceAllocation;

import java.util.List;

public interface MechanicService {
    
    // Allocation queries
    List<ServiceAllocation> getAllocatedVehicles(Long mechanicId);
    List<ServiceAllocation> getActiveVehicles(Long mechanicId);
    
    // Service operations
    void updateServiceStatus(Long serviceRecordId, String status);
    void updateWorkDescription(Long serviceRecordId, String workDescription);
}