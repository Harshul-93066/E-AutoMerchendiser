package com.bits.eautomerchandiser.service;

import com.bits.eautomerchandiser.dto.AllocationRequest;
import com.bits.eautomerchandiser.model.*;
import com.bits.eautomerchandiser.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class SupervisorServiceImpl implements SupervisorService {

    private final ServiceRecordRepository serviceRecordRepository;
    private final ServiceAllocationRepository serviceAllocationRepository;
    private final DeliveryRecordRepository deliveryRecordRepository;
    private final UserRepository userRepository;

    @Override
    public List<ServiceRecord> getServiceRecords(String status) {
        if (status != null) {
            return serviceRecordRepository.findByStatus(ServiceStatus.valueOf(status));
        }
        return serviceRecordRepository.findAll();
    }

    @Override
    public List<Map<String, Object>> getServiceStatus() {
        List<ServiceRecord> records = serviceRecordRepository.findAll();
        List<Map<String, Object>> result = new ArrayList<>();
        
        for (ServiceRecord record : records) {
            Map<String, Object> item = new HashMap<>();
            item.put("id", record.getId());
            item.put("vehicleNumber", record.getVehicleNumber());
            item.put("modelName", record.getModelName());
            item.put("make", record.getMake());
            item.put("status", record.getStatus());
            item.put("customer", record.getCustomer() != null ? record.getCustomer().getFullName() : null);
            
            // Get allocated mechanic
            var allocation = serviceAllocationRepository.findByServiceRecordId(record.getId());
            item.put("mechanicName", allocation.map(a -> a.getMechanic().getFullName()).orElse(null));
            result.add(item);
        }
        return result;
    }

    @Override
    public List<User> getMechanics() {
        return userRepository.findByRole(Role.MECHANIC);
    }

    @Override
    @Transactional
    public ServiceAllocation allocateVehicle(AllocationRequest request) {
        ServiceRecord record = serviceRecordRepository.findById(request.getServiceRecordId())
                .orElseThrow(() -> new RuntimeException("Service record not found"));
        User mechanic = userRepository.findById(request.getMechanicId())
                .orElseThrow(() -> new RuntimeException("Mechanic not found"));

        record.setStatus(ServiceStatus.ALLOCATED);
        serviceRecordRepository.save(record);

        ServiceAllocation allocation = ServiceAllocation.builder()
                .serviceRecord(record)
                .mechanic(mechanic)
                .allocatedDate(LocalDate.now())
                .notes(request.getNotes())
                .build();

        return serviceAllocationRepository.save(allocation);
    }

    @Override
    @Transactional
    public void approveForDelivery(Long serviceRecordId) {
        ServiceRecord record = serviceRecordRepository.findById(serviceRecordId)
                .orElseThrow(() -> new RuntimeException("Service record not found"));

        record.setStatus(ServiceStatus.APPROVED_FOR_DELIVERY);
        serviceRecordRepository.save(record);
    }

    @Override
    public List<DeliveryRecord> getPendingDeliveries() {
        return deliveryRecordRepository.findByApprovalStatus(DeliveryApprovalStatus.PENDING_APPROVAL);
    }

    @Override
    @Transactional
    public void approveDelivery(Long deliveryId) {
        DeliveryRecord delivery = deliveryRecordRepository.findById(deliveryId)
                .orElseThrow(() -> new RuntimeException("Delivery record not found"));

        delivery.setApprovalStatus(DeliveryApprovalStatus.APPROVED);
        deliveryRecordRepository.save(delivery);

        // Update service record status if exists
        if (delivery.getServiceRecord() != null) {
            ServiceRecord sr = delivery.getServiceRecord();
            sr.setStatus(ServiceStatus.DELIVERED);
            serviceRecordRepository.save(sr);
        }
    }

    @Override
    @Transactional
    public void rejectDelivery(Long deliveryId) {
        DeliveryRecord delivery = deliveryRecordRepository.findById(deliveryId)
                .orElseThrow(() -> new RuntimeException("Delivery record not found"));

        delivery.setApprovalStatus(DeliveryApprovalStatus.REJECTED);
        deliveryRecordRepository.save(delivery);
    }
}