import { Outlet } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import Sidebar from '../components/common/Sidebar';

const links = [
  { path: '/manager/sales-report', label: 'Sales Report' },
  { path: '/manager/service-report', label: 'Service Report' },
  { path: '/manager/revenue', label: 'Revenue' },
  { path: '/manager/vehicle-prices', label: 'Vehicle Prices' },
  { path: '/manager/service-charges', label: 'Service Charges' },
];

export default function ManagerDashboard() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="flex">
        <Sidebar links={links} />
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
