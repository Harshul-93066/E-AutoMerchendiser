import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const options = [
  { path: '/mechanic/allocated', label: 'Allocated Vehicles', description: 'View all vehicles assigned to you', icon: '🚗' },
  { path: '/mechanic/update-status', label: 'Update Status', description: 'Update service progress on active vehicles', icon: '🔄' },
];

export default function MechanicHome() {
  const { user } = useAuth();

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Welcome, {user?.fullName || 'Mechanic'}</h1>
        <p className="text-gray-600 mt-2">View your assigned vehicles and update service progress.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
