package com.bits.eautomerchandiser.controller;

import com.bits.eautomerchandiser.model.ServiceAllocation;
import com.bits.eautomerchandiser.service.MechanicService;
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

    private final MechanicService mechanicService;

    @GetMapping("/allocated")
    public ResponseEntity<List<ServiceAllocation>> getAllocatedVehicles(Authentication auth) {
        Long mechanicId = (Long) auth.getCredentials();
        return ResponseEntity.ok(mechanicService.getAllocatedVehicles(mechanicId));
    }

    @GetMapping("/active")
    public ResponseEntity<List<ServiceAllocation>> getActiveVehicles(Authentication auth) {
        Long mechanicId = (Long) auth.getCredentials();
        return ResponseEntity.ok(mechanicService.getActiveVehicles(mechanicId));
    }

    @PutMapping("/service-records/{id}/status")
    public ResponseEntity<Map<String, String>> updateStatus(@PathVariable Long id, @RequestBody Map<String, String> body) {
        mechanicService.updateServiceStatus(id, body.get("status"));
        return ResponseEntity.ok(Map.of("message", "Status updated to " + body.get("status")));
    }

    @PutMapping("/service-records/{id}/work-info")
    public ResponseEntity<Map<String, String>> updateWorkInfo(@PathVariable Long id, @RequestBody Map<String, String> body) {
        mechanicService.updateWorkDescription(id, body.get("workDescription"));
        return ResponseEntity.ok(Map.of("message", "Work info updated"));
    }
}