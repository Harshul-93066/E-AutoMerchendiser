import { Outlet } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import Sidebar from '../components/common/Sidebar';

const links = [
  { path: '/clerk/upload-service', label: 'Upload Service Info' },
  { path: '/clerk/sales', label: 'Record Sale' },
  { path: '/clerk/delivery', label: 'Delivery Details' },
  { path: '/clerk/generate-bill', label: 'Generate Service Bill' },
  { path: '/clerk/generate-sales-bill', label: 'Generate Sales Bill' },
];

export default function ClerkDashboard() {
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
