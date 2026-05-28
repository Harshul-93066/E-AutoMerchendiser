package com.bits.eautomerchandiser.controller;

import com.bits.eautomerchandiser.model.ServiceAllocation;
import com.bits.eautomerchandiser.model.ServiceRecord;
import com.bits.eautomerchandiser.model.ServiceStatus;
import com.bits.eautomerchandiser.repository.ServiceAllocationRepository;
import com.bits.eautomerchandiser.repository.ServiceRecordRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/mechanic")
@RequiredArgsConstructor
public class MechanicController {

    private final ServiceAllocationRepository serviceAllocationRepository;
    private final ServiceRecordRepository serviceRecordRepository;

    @GetMapping("/allocated")
    public ResponseEntity<List<ServiceAllocation>> getAllocatedVehicles(Authentication auth) {
        Long mechanicId = (Long) auth.getCredentials();
        return ResponseEntity.ok(serviceAllocationRepository.findActiveByMechanicId(mechanicId));
    }

    @PutMapping("/service-records/{id}/status")
    public ResponseEntity<Map<String, String>> updateStatus(@PathVariable Long id, @RequestBody Map<String, String> body) {
        ServiceRecord record = serviceRecordRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Service record not found"));

        String status = body.get("status");
        record.setStatus(ServiceStatus.valueOf(status));
        serviceRecordRepository.save(record);

        return ResponseEntity.ok(Map.of("message", "Status updated to " + status));
    }

    @PutMapping("/service-records/{id}/work-info")
    public ResponseEntity<Map<String, String>> updateWorkInfo(@PathVariable Long id, @RequestBody Map<String, String> body) {
        ServiceRecord record = serviceRecordRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Service record not found"));

        record.setWorkDescription(body.get("workDescription"));
        serviceRecordRepository.save(record);

        return ResponseEntity.ok(Map.of("message", "Work info updated"));
    }
}
