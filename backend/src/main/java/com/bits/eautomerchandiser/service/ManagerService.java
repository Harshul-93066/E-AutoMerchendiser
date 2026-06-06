package com.bits.eautomerchandiser.service;

import com.bits.eautomerchandiser.model.ServiceCategory;
import com.bits.eautomerchandiser.model.VehicleModel;

import java.util.List;

public interface ManagerService {
    
    // Vehicle Model operations
    List<VehicleModel> getAllVehicleModels();
    VehicleModel addVehicleModel(VehicleModel model);
    void deleteVehicleModel(Long id);
    
    // Service Category operations
    List<ServiceCategory> getAllServiceCategories();
    ServiceCategory addServiceCategory(ServiceCategory category);
    void deleteServiceCategory(Long id);
}