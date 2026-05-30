import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const options = [
  { path: '/manager/sales-report', label: 'Sales Report', description: 'View detailed vehicle sales reports and analytics', icon: '📊' },
  { path: '/manager/service-report', label: 'Service Report', description: 'Track service records and performance metrics', icon: '🔧' },
  { path: '/manager/revenue', label: 'Revenue', description: 'Monitor revenue from sales and services', icon: '💰' },
  { path: '/manager/add-vehicle', label: 'Add New Vehicle', description: 'Add new vehicles to the inventory', icon: '🚗' },
  { path: '/manager/add-service-category', label: 'Add Service Category', description: 'Create and manage service categories', icon: '📋' },
];

export default function ManagerHome() {
  const { user } = useAuth();

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Welcome, {user?.fullName || 'Manager'}</h1>
        <p className="text-gray-600 mt-2">Manage your automobile showroom - track sales, services, and revenue all in one place.</p>
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
