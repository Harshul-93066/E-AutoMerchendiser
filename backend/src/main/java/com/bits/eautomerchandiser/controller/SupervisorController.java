package com.bits.eautomerchandiser.controller;

import com.bits.eautomerchandiser.dto.AllocationRequest;
import com.bits.eautomerchandiser.model.*;
import com.bits.eautomerchandiser.service.SupervisorService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/supervisor")
@RequiredArgsConstructor
public class SupervisorController {

    private final SupervisorService supervisorService;

    @GetMapping("/service-records")
    public ResponseEntity<List<ServiceRecord>> getServiceRecords(@RequestParam(required = false) String status) {
        return ResponseEntity.ok(supervisorService.getServiceRecords(status));
    }

    @GetMapping("/mechanics")
    public ResponseEntity<List<User>> getMechanics() {
        return ResponseEntity.ok(supervisorService.getMechanics());
    }

    @PostMapping("/allocate")
    public ResponseEntity<ServiceAllocation> allocateVehicle(@RequestBody AllocationRequest request) {
        return ResponseEntity.ok(supervisorService.allocateVehicle(request));
    }

    @GetMapping("/service-status")
    public ResponseEntity<List<Map<String, Object>>> getServiceStatus() {
        return ResponseEntity.ok(supervisorService.getServiceStatus());
    }

    @PutMapping("/approve/{id}")
    public ResponseEntity<Map<String, String>> approveForDelivery(@PathVariable Long id) {
        supervisorService.approveForDelivery(id);
        return ResponseEntity.ok(Map.of("message", "Vehicle approved for delivery"));
    }

    @GetMapping("/pending-deliveries")
    public ResponseEntity<List<DeliveryRecord>> getPendingDeliveries() {
        return ResponseEntity.ok(supervisorService.getPendingDeliveries());
    }

    @PutMapping("/approve-delivery/{id}")
    public ResponseEntity<Map<String, String>> approveDeliveryRecord(@PathVariable Long id) {
        supervisorService.approveDelivery(id);
        return ResponseEntity.ok(Map.of("message", "Delivery approved successfully"));
    }

    @PutMapping("/reject-delivery/{id}")
    public ResponseEntity<Map<String, String>> rejectDeliveryRecord(@PathVariable Long id) {
        supervisorService.rejectDelivery(id);
        return ResponseEntity.ok(Map.of("message", "Delivery rejected"));
    }
}