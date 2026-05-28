package com.bits.eautomerchandiser.controller;

import com.bits.eautomerchandiser.model.ServiceCategory;
import com.bits.eautomerchandiser.model.VehicleModel;
import com.bits.eautomerchandiser.repository.ServiceCategoryRepository;
import com.bits.eautomerchandiser.repository.VehicleModelRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/manager")
@RequiredArgsConstructor
public class ManagerController {

    private final VehicleModelRepository vehicleModelRepository;
    private final ServiceCategoryRepository serviceCategoryRepository;

    @GetMapping("/vehicle-models")
    public ResponseEntity<List<VehicleModel>> getVehicleModels() {
        return ResponseEntity.ok(vehicleModelRepository.findAll());
    }

    @PutMapping("/vehicle-models/{id}/price")
    public ResponseEntity<VehicleModel> updateVehiclePrice(@PathVariable Long id, @RequestBody Map<String, Double> body) {
        VehicleModel model = vehicleModelRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Vehicle model not found"));
        model.setPrice(body.get("price"));
        return ResponseEntity.ok(vehicleModelRepository.save(model));
    }

    @GetMapping("/service-categories")
    public ResponseEntity<List<ServiceCategory>> getServiceCategories() {
        return ResponseEntity.ok(serviceCategoryRepository.findAll());
    }

    @PutMapping("/service-categories/{id}/charges")
    public ResponseEntity<ServiceCategory> updateServiceCharges(@PathVariable Long id, @RequestBody Map<String, Double> body) {
        ServiceCategory category = serviceCategoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Service category not found"));
        category.setCharges(body.get("charges"));
        return ResponseEntity.ok(serviceCategoryRepository.save(category));
    }

    @PostMapping("/vehicle-models")
    public ResponseEntity<VehicleModel> addVehicleModel(@RequestBody VehicleModel model) {
        return ResponseEntity.ok(vehicleModelRepository.save(model));
    }

    @PostMapping("/service-categories")
    public ResponseEntity<ServiceCategory> addServiceCategory(@RequestBody ServiceCategory category) {
        return ResponseEntity.ok(serviceCategoryRepository.save(category));
    }
}
