import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const options = [
  { path: '/supervisor/vehicles', label: 'Vehicles for Service', description: 'View vehicles registered for servicing', icon: '🚙' },
  { path: '/supervisor/allocate', label: 'Allocate to Mechanic', description: 'Assign vehicles to available mechanics', icon: '👨‍🔧' },
  { path: '/supervisor/status', label: 'Service Status', description: 'Monitor real-time service progress', icon: '📈' },
  { path: '/supervisor/approve', label: 'Approve Service', description: 'Review and approve completed services', icon: '✅' },
  { path: '/supervisor/pending-deliveries', label: 'Pending Deliveries', description: 'Track deliveries awaiting completion', icon: '📦' },
];

export default function SupervisorHome() {
  const { user } = useAuth();

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Welcome, {user?.fullName || 'Supervisor'}</h1>
        <p className="text-gray-600 mt-2">Oversee vehicle servicing - allocate work, track progress, and approve deliveries.</p>
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
