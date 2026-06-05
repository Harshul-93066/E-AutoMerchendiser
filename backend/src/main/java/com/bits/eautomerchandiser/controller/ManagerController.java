package com.bits.eautomerchandiser.controller;

import com.bits.eautomerchandiser.model.ServiceCategory;
import com.bits.eautomerchandiser.model.VehicleModel;
import com.bits.eautomerchandiser.service.ManagerService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/manager")
@RequiredArgsConstructor
public class ManagerController {

    private final ManagerService managerService;

    @GetMapping("/vehicle-models")
    public ResponseEntity<List<VehicleModel>> getVehicleModels() {
        return ResponseEntity.ok(managerService.getAllVehicleModels());
    }

    @PutMapping("/vehicle-models/{id}/price")
    public ResponseEntity<VehicleModel> updateVehiclePrice(@PathVariable Long id, @RequestBody Map<String, Double> body) {
        return ResponseEntity.ok(managerService.updateVehiclePrice(id, body.get("price")));
    }

    @GetMapping("/service-categories")
    public ResponseEntity<List<ServiceCategory>> getServiceCategories() {
        return ResponseEntity.ok(managerService.getAllServiceCategories());
    }

    @PutMapping("/service-categories/{id}/charges")
    public ResponseEntity<ServiceCategory> updateServiceCharges(@PathVariable Long id, @RequestBody Map<String, Double> body) {
        return ResponseEntity.ok(managerService.updateServiceCharges(id, body.get("charges")));
    }

    @PostMapping("/vehicle-models")
    public ResponseEntity<VehicleModel> addVehicleModel(@RequestBody VehicleModel model) {
        return ResponseEntity.ok(managerService.addVehicleModel(model));
    }

    @PostMapping("/service-categories")
    public ResponseEntity<ServiceCategory> addServiceCategory(@RequestBody ServiceCategory category) {
        return ResponseEntity.ok(managerService.addServiceCategory(category));
    }
}