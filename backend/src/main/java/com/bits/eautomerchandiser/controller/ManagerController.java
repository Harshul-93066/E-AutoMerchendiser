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

    @GetMapping("/service-categories")
    public ResponseEntity<List<ServiceCategory>> getServiceCategories() {
        return ResponseEntity.ok(managerService.getAllServiceCategories());
    }

    @PostMapping("/vehicle-models")
    public ResponseEntity<VehicleModel> addVehicleModel(@RequestBody VehicleModel model) {
        return ResponseEntity.ok(managerService.addVehicleModel(model));
    }

    @DeleteMapping("/vehicle-models/{id}")
    public ResponseEntity<Map<String, String>> deleteVehicleModel(@PathVariable Long id) {
        managerService.deleteVehicleModel(id);
        return ResponseEntity.ok(Map.of("message", "Vehicle model deleted successfully"));
    }

    @PostMapping("/service-categories")
    public ResponseEntity<ServiceCategory> addServiceCategory(@RequestBody ServiceCategory category) {
        return ResponseEntity.ok(managerService.addServiceCategory(category));
    }

    @DeleteMapping("/service-categories/{id}")
    public ResponseEntity<Map<String, String>> deleteServiceCategory(@PathVariable Long id) {
        managerService.deleteServiceCategory(id);
        return ResponseEntity.ok(Map.of("message", "Service category deleted successfully"));
    }
}