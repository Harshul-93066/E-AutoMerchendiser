import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardRedirect from './pages/DashboardRedirect';
import ManagerDashboard from './pages/ManagerDashboard';
import SupervisorDashboard from './pages/SupervisorDashboard';
import ClerkDashboard from './pages/ClerkDashboard';
import MechanicDashboard from './pages/MechanicDashboard';
import CustomerDashboard from './pages/CustomerDashboard';
import ProtectedRoute from './components/common/ProtectedRoute';

// Manager components
import ManagerHome from './components/manager/ManagerHome';
import SalesReport from './components/manager/SalesReport';
import ServiceReport from './components/manager/ServiceReport';
import RevenueReport from './components/manager/RevenueReport';
import AddVehicle from './components/manager/AddVehicle';
import AddServiceCategory from './components/manager/AddServiceCategory';

// Supervisor components
import SupervisorHome from './components/supervisor/SupervisorHome';
import VehiclesForService from './components/supervisor/VehiclesForService';
import AllocateVehicle from './components/supervisor/AllocateVehicle';
import ServiceStatus from './components/supervisor/ServiceStatus';
import ApproveDelivery from './components/supervisor/ApproveDelivery';
import PendingDeliveries from './components/supervisor/PendingDeliveries';

// Clerk components
import ClerkHome from './components/clerk/ClerkHome';
import UploadServiceInfo from './components/clerk/UploadServiceInfo';
import RecordSale from './components/clerk/RecordSale';
import DeliveryDetails from './components/clerk/DeliveryDetails';
import GenerateBill from './components/clerk/GenerateBill';
import GenerateSalesBill from './components/clerk/GenerateSalesBill';

// Mechanic components
import MechanicHome from './components/mechanic/MechanicHome';
import AllocatedVehicles from './components/mechanic/AllocatedVehicles';
import UpdateStatus from './components/mechanic/UpdateStatus';

// Customer components
import CustomerHome from './components/customer/CustomerHome';
import VehicleStatus from './components/customer/VehicleStatus';

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/dashboard" element={<DashboardRedirect />} />

      {/* Manager Routes */}
      <Route path="/manager" element={<ProtectedRoute allowedRoles={['MANAGER']}><ManagerDashboard /></ProtectedRoute>}>
        <Route index element={<ManagerHome />} />
        <Route path="sales-report" element={<SalesReport />} />
        <Route path="service-report" element={<ServiceReport />} />
        <Route path="revenue" element={<RevenueReport />} />
        <Route path="add-vehicle" element={<AddVehicle />} />
        <Route path="add-service-category" element={<AddServiceCategory />} />
      </Route>

      {/* Supervisor Routes */}
      <Route path="/supervisor" element={<ProtectedRoute allowedRoles={['SUPERVISOR']}><SupervisorDashboard /></ProtectedRoute>}>
        <Route index element={<SupervisorHome />} />
        <Route path="vehicles" element={<VehiclesForService />} />
        <Route path="allocate" element={<AllocateVehicle />} />
        <Route path="status" element={<ServiceStatus />} />
        <Route path="approve" element={<ApproveDelivery />} />
        <Route path="pending-deliveries" element={<PendingDeliveries />} />
      </Route>

      {/* Clerk Routes */}
      <Route path="/clerk" element={<ProtectedRoute allowedRoles={['CLERK']}><ClerkDashboard /></ProtectedRoute>}>
        <Route index element={<ClerkHome />} />
        <Route path="upload-service" element={<UploadServiceInfo />} />
        <Route path="sales" element={<RecordSale />} />
        <Route path="delivery" element={<DeliveryDetails />} />
        <Route path="generate-bill" element={<GenerateBill />} />
        <Route path="generate-sales-bill" element={<GenerateSalesBill />} />
      </Route>

      {/* Mechanic Routes */}
      <Route path="/mechanic" element={<ProtectedRoute allowedRoles={['MECHANIC']}><MechanicDashboard /></ProtectedRoute>}>
        <Route index element={<MechanicHome />} />
        <Route path="allocated" element={<AllocatedVehicles />} />
        <Route path="update-status" element={<UpdateStatus />} />
      </Route>

      {/* Customer Routes */}
      <Route path="/customer" element={<ProtectedRoute allowedRoles={['CUSTOMER']}><CustomerDashboard /></ProtectedRoute>}>
        <Route index element={<CustomerHome />} />
        <Route path="vehicle-status" element={<VehicleStatus />} />
      </Route>

      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  );
}

export default App;
