package com.bits.eautomerchandiser.controller;

import com.bits.eautomerchandiser.model.SalesTransaction;
import com.bits.eautomerchandiser.model.ServiceRecord;
import com.bits.eautomerchandiser.service.CustomerService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/customer")
@RequiredArgsConstructor
public class CustomerController {

    private final CustomerService customerService;

    @GetMapping("/vehicle-status")
    public ResponseEntity<List<ServiceRecord>> getVehicleStatus(Authentication auth) {
        Long customerId = (Long) auth.getCredentials();
        return ResponseEntity.ok(customerService.getVehicleStatus(customerId));
    }

    @GetMapping("/purchases")
    public ResponseEntity<List<SalesTransaction>> getPurchases(Authentication auth) {
        Long customerId = (Long) auth.getCredentials();
        return ResponseEntity.ok(customerService.getPurchaseHistory(customerId));
    }
}