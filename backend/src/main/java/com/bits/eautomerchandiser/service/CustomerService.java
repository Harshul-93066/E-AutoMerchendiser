package com.bits.eautomerchandiser.service;

import com.bits.eautomerchandiser.model.SalesTransaction;
import com.bits.eautomerchandiser.model.ServiceRecord;

import java.util.List;

public interface CustomerService {
    
    List<ServiceRecord> getVehicleStatus(Long customerId);
    List<SalesTransaction> getPurchaseHistory(Long customerId);
}