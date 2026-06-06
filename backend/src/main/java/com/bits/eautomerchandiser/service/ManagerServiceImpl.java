package com.bits.eautomerchandiser.service;

import com.bits.eautomerchandiser.model.ServiceCategory;
import com.bits.eautomerchandiser.model.VehicleModel;
import com.bits.eautomerchandiser.repository.ServiceCategoryRepository;
import com.bits.eautomerchandiser.repository.VehicleModelRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.dao.DataIntegrityViolationException;
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
    public void deleteVehicleModel(Long id) {
        if (!vehicleModelRepository.existsById(id)) {
            throw new RuntimeException("Vehicle model not found");
        }
        try {
            vehicleModelRepository.deleteById(id);
        } catch (DataIntegrityViolationException ex) {
            throw new RuntimeException("Vehicle model is in use and cannot be deleted");
        }
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
    public void deleteServiceCategory(Long id) {
        if (!serviceCategoryRepository.existsById(id)) {
            throw new RuntimeException("Service category not found");
        }
        try {
            serviceCategoryRepository.deleteById(id);
        } catch (DataIntegrityViolationException ex) {
            throw new RuntimeException("Service category is in use and cannot be deleted");
        }
    }
}