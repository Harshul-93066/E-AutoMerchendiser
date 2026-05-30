import { Outlet } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import Sidebar from '../components/common/Sidebar';

const links = [
  { path: '/supervisor', label: 'Home', end: true },
  { path: '/supervisor/vehicles', label: 'Vehicles for Service' },
  { path: '/supervisor/allocate', label: 'Allocate to Mechanic' },
  { path: '/supervisor/status', label: 'Service Status' },
  { path: '/supervisor/approve', label: 'Approve Service' },
  { path: '/supervisor/pending-deliveries', label: 'Pending Deliveries' },
];

export default function SupervisorDashboard() {
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
