package com.bits.eautomerchandiser.service;

import com.bits.eautomerchandiser.model.ServiceAllocation;
import com.bits.eautomerchandiser.model.ServiceRecord;
import com.bits.eautomerchandiser.model.ServiceStatus;
import com.bits.eautomerchandiser.repository.ServiceAllocationRepository;
import com.bits.eautomerchandiser.repository.ServiceRecordRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class MechanicServiceImpl implements MechanicService {

    private final ServiceAllocationRepository serviceAllocationRepository;
    private final ServiceRecordRepository serviceRecordRepository;

    @Override
    public List<ServiceAllocation> getAllocatedVehicles(Long mechanicId) {
        return serviceAllocationRepository.findAllByMechanicId(mechanicId);
    }

    @Override
    public List<ServiceAllocation> getActiveVehicles(Long mechanicId) {
        return serviceAllocationRepository.findActiveByMechanicId(mechanicId);
    }

    @Override
    @Transactional
    public void updateServiceStatus(Long serviceRecordId, String status) {
        ServiceRecord record = serviceRecordRepository.findById(serviceRecordId)
                .orElseThrow(() -> new RuntimeException("Service record not found"));

        record.setStatus(ServiceStatus.valueOf(status));
        serviceRecordRepository.save(record);
    }

    @Override
    @Transactional
    public void updateWorkDescription(Long serviceRecordId, String workDescription) {
        ServiceRecord record = serviceRecordRepository.findById(serviceRecordId)
                .orElseThrow(() -> new RuntimeException("Service record not found"));

        record.setWorkDescription(workDescription);
        serviceRecordRepository.save(record);
    }
}