import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const options = [
  { path: '/clerk/upload-service', label: 'Upload Service Info', description: 'Register vehicles for servicing', icon: '📝' },
  { path: '/clerk/sales', label: 'Record Sale', description: 'Record new vehicle sales transactions', icon: '🛒' },
  { path: '/clerk/delivery', label: 'Delivery Details', description: 'Manage vehicle delivery information', icon: '🚚' },
  { path: '/clerk/generate-bill', label: 'Generate Service Bill', description: 'Generate bills for completed services', icon: '🧾' },
  { path: '/clerk/generate-sales-bill', label: 'Generate Sales Bill', description: 'Generate bills for vehicle purchases', icon: '💳' },
];

export default function ClerkHome() {
  const { user } = useAuth();

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Welcome, {user?.fullName || 'Clerk'}</h1>
        <p className="text-gray-600 mt-2">Handle day-to-day operations - service registration, sales, deliveries, and billing.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {options.map((option) => (
          <Link
            key={option.path}
            to={option.path}
            className="block p-6 bg-white rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-shadow hover:border-indigo-400"
          >
            <div className="text-3xl mb-3">{option.icon}</div>
            <h3 className="text-lg font-semibold text-gray-900">{option.label}</h3>
            <p className="text-gray-600 text-sm mt-1">{option.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
