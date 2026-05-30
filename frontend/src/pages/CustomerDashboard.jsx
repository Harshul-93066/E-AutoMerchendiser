import { Outlet } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import Sidebar from '../components/common/Sidebar';

const links = [
  { path: '/customer', label: 'Home', end: true },
  { path: '/customer/vehicle-status', label: 'Vehicle Status' },
];

export default function CustomerDashboard() {
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
