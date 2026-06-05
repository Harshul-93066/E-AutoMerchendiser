package com.bits.eautomerchandiser.service;

import com.bits.eautomerchandiser.model.ServiceCategory;
import com.bits.eautomerchandiser.model.VehicleModel;
import com.bits.eautomerchandiser.repository.ServiceCategoryRepository;
import com.bits.eautomerchandiser.repository.VehicleModelRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ManagerServiceImpl implements ManagerService {

    private final VehicleModelRepository vehicleModelRepository;
    private final ServiceCategoryRepository serviceCategoryRepository;

    @Override
    public List<VehicleModel> getAllVehicleModels() {
        return vehicleModelRepository.findAll();
    }

    @Override
    @Transactional
    public VehicleModel addVehicleModel(VehicleModel model) {
        return vehicleModelRepository.save(model);
    }

    @Override
    @Transactional
    public VehicleModel updateVehiclePrice(Long id, Double price) {
        VehicleModel model = vehicleModelRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Vehicle model not found"));
        model.setPrice(price);
        return vehicleModelRepository.save(model);
    }

    @Override
    public List<ServiceCategory> getAllServiceCategories() {
        return serviceCategoryRepository.findAll();
    }

    @Override
    @Transactional
    public ServiceCategory addServiceCategory(ServiceCategory category) {
        return serviceCategoryRepository.save(category);
    }

    @Override
    @Transactional
    public ServiceCategory updateServiceCharges(Long id, Double charges) {
        ServiceCategory category = serviceCategoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Service category not found"));
        category.setCharges(charges);
        return serviceCategoryRepository.save(category);
    }
}