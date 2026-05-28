package com.bits.eautomerchandiser.controller;

import com.bits.eautomerchandiser.dto.AllocationRequest;
import com.bits.eautomerchandiser.model.*;
import com.bits.eautomerchandiser.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/supervisor")
@RequiredArgsConstructor
public class SupervisorController {

    private final ServiceRecordRepository serviceRecordRepository;
    private final ServiceAllocationRepository serviceAllocationRepository;
    private final DeliveryRecordRepository deliveryRecordRepository;
    private final UserRepository userRepository;

    @GetMapping("/service-records")
    public ResponseEntity<List<ServiceRecord>> getServiceRecords(@RequestParam(required = false) String status) {
        if (status != null) {
            return ResponseEntity.ok(serviceRecordRepository.findByStatus(ServiceStatus.valueOf(status)));
        }
        return ResponseEntity.ok(serviceRecordRepository.findAll());
    }

    @GetMapping("/mechanics")
    public ResponseEntity<List<User>> getMechanics() {
        return ResponseEntity.ok(userRepository.findByRole(Role.MECHANIC));
    }

    @PostMapping("/allocate")
    public ResponseEntity<ServiceAllocation> allocateVehicle(@RequestBody AllocationRequest request) {
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

        return ResponseEntity.ok(serviceAllocationRepository.save(allocation));
    }

    @GetMapping("/service-status")
    public ResponseEntity<List<Map<String, Object>>> getServiceStatus() {
        List<ServiceRecord> records = serviceRecordRepository.findAll();
        List<Map<String, Object>> result = new java.util.ArrayList<>();
        for (ServiceRecord record : records) {
            Map<String, Object> item = new java.util.HashMap<>();
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
        return ResponseEntity.ok(result);
    }

    @PutMapping("/approve/{id}")
    public ResponseEntity<Map<String, String>> approveForDelivery(@PathVariable Long id) {
        ServiceRecord record = serviceRecordRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Service record not found"));

        record.setStatus(ServiceStatus.APPROVED_FOR_DELIVERY);
        serviceRecordRepository.save(record);

        return ResponseEntity.ok(Map.of("message", "Vehicle approved for delivery"));
    }

    @GetMapping("/pending-deliveries")
    public ResponseEntity<List<DeliveryRecord>> getPendingDeliveries() {
        return ResponseEntity.ok(deliveryRecordRepository.findByApprovalStatus(DeliveryApprovalStatus.PENDING_APPROVAL));
    }

    @PutMapping("/approve-delivery/{id}")
    public ResponseEntity<Map<String, String>> approveDeliveryRecord(@PathVariable Long id) {
        DeliveryRecord delivery = deliveryRecordRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Delivery record not found"));

        delivery.setApprovalStatus(DeliveryApprovalStatus.APPROVED);
        deliveryRecordRepository.save(delivery);

        if (delivery.getServiceRecord() != null) {
            ServiceRecord sr = delivery.getServiceRecord();
            sr.setStatus(ServiceStatus.DELIVERED);
            serviceRecordRepository.save(sr);
        }

        return ResponseEntity.ok(Map.of("message", "Delivery approved successfully"));
    }

    @PutMapping("/reject-delivery/{id}")
    public ResponseEntity<Map<String, String>> rejectDeliveryRecord(@PathVariable Long id) {
        DeliveryRecord delivery = deliveryRecordRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Delivery record not found"));

        delivery.setApprovalStatus(DeliveryApprovalStatus.REJECTED);
        deliveryRecordRepository.save(delivery);

        return ResponseEntity.ok(Map.of("message", "Delivery rejected"));
    }
}
