package com.bits.eautomerchandiser.repository;

import com.bits.eautomerchandiser.model.VehicleModel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface VehicleModelRepository extends JpaRepository<VehicleModel, Long> {
    List<VehicleModel> findByMake(String make);
    List<VehicleModel> findByModelName(String modelName);
}
