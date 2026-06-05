package com.bits.eautomerchandiser.controller;

import com.bits.eautomerchandiser.dto.DeliveryRequest;
import com.bits.eautomerchandiser.dto.SalesRequest;
import com.bits.eautomerchandiser.dto.ServiceRecordRequest;
import com.bits.eautomerchandiser.model.*;
import com.bits.eautomerchandiser.service.ClerkService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/clerk")
@RequiredArgsConstructor
public class ClerkController {

    private final ClerkService clerkService;

    @PostMapping("/service-records")
    public ResponseEntity<ServiceRecord> createServiceRecord(@Valid @RequestBody ServiceRecordRequest request) {
        return ResponseEntity.ok(clerkService.createServiceRecord(request));
    }

    @GetMapping("/service-records")
    public ResponseEntity<List<ServiceRecord>> getAllServiceRecords() {
        return ResponseEntity.ok(clerkService.getAllServiceRecords());
    }

    @GetMapping("/service-records/{id}/bill")
    public ResponseEntity<Map<String, Object>> generateBill(@PathVariable Long id) {
        return ResponseEntity.ok(clerkService.generateServiceBill(id));
    }

    @PostMapping("/sales")
    public ResponseEntity<SalesTransaction> recordSale(@Valid @RequestBody SalesRequest request, Authentication auth) {
        Long clerkId = (Long) auth.getCredentials();
        return ResponseEntity.ok(clerkService.recordSale(request, clerkId));
    }

    @PostMapping("/deliveries")
    public ResponseEntity<DeliveryRecord> recordDelivery(@Valid @RequestBody DeliveryRequest request, Authentication auth) {
        Long clerkId = (Long) auth.getCredentials();
        return ResponseEntity.ok(clerkService.recordDelivery(request, clerkId));
    }

    @GetMapping("/deliveries")
    public ResponseEntity<List<DeliveryRecord>> getAllDeliveries() {
        return ResponseEntity.ok(clerkService.getAllDeliveries());
    }

    @GetMapping("/sales")
    public ResponseEntity<List<SalesTransaction>> getSalesWithoutDelivery() {
        return ResponseEntity.ok(clerkService.getSalesWithoutDelivery());
    }

    @GetMapping("/vehicle-models")
    public ResponseEntity<List<VehicleModel>> getVehicleModels() {
        return ResponseEntity.ok(clerkService.getVehicleModels());
    }

    @GetMapping("/service-categories")
    public ResponseEntity<List<ServiceCategory>> getServiceCategories() {
        return ResponseEntity.ok(clerkService.getServiceCategories());
    }

    @GetMapping("/customers")
    public ResponseEntity<List<User>> getCustomers() {
        return ResponseEntity.ok(clerkService.getCustomers());
    }

    @GetMapping("/sales/all")
    public ResponseEntity<List<SalesTransaction>> getAllSales() {
        return ResponseEntity.ok(clerkService.getAllSales());
    }

    @GetMapping("/sales/{id}/bill")
    public ResponseEntity<Map<String, Object>> generateSalesBill(@PathVariable Long id) {
        return ResponseEntity.ok(clerkService.generateSalesBill(id));
    }
}