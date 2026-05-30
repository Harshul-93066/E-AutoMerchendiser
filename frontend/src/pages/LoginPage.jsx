import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axiosConfig';

const ROLES = [
  { role: 'MANAGER', label: 'Manager', icon: '📊', color: 'bg-purple-100 border-purple-400', activeColor: 'bg-purple-500 text-white', hint: 'manager@test.com' },
  { role: 'SUPERVISOR', label: 'Supervisor', icon: '🔧', color: 'bg-blue-100 border-blue-400', activeColor: 'bg-blue-500 text-white', hint: 'supervisor@test.com' },
  { role: 'CLERK', label: 'Clerk', icon: '📋', color: 'bg-green-100 border-green-400', activeColor: 'bg-green-500 text-white', hint: 'clerk@test.com' },
  { role: 'MECHANIC', label: 'Mechanic', icon: '⚙️', color: 'bg-orange-100 border-orange-400', activeColor: 'bg-orange-500 text-white', hint: 'mechanic1@test.com' },
  { role: 'CUSTOMER', label: 'Customer', icon: '🛵', color: 'bg-teal-100 border-teal-400', activeColor: 'bg-teal-500 text-white', hint: 'customer@test.com' },
];

export default function LoginPage() {
  const [selectedRole, setSelectedRole] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleRoleSelect = (roleObj) => {
    setSelectedRole(roleObj);
    setEmail(roleObj.hint);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await api.post('/auth/login', { email, password });
      login(res.data);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#1a1a2e]">
      <div className="bg-[#16213e] p-6 rounded-lg shadow-lg border border-gray-700 w-full max-w-xl">
        <div className="flex justify-center mb-4">
          <img src="/logo.png" alt="Merch Guru" className="h-48 w-auto" />
        </div>

        {/* Role Selection */}
        <p className="text-sm font-medium text-gray-400 mb-3 text-center">Select your role to continue</p>
        <div className="grid grid-cols-5 gap-2 mb-6">
          {ROLES.map((r) => (
            <button
              key={r.role}
              onClick={() => handleRoleSelect(r)}
              className={`flex flex-col items-center py-3 px-1 rounded-lg border-2 transition cursor-pointer text-center
                ${selectedRole?.role === r.role
                  ? r.activeColor + ' border-transparent shadow-md scale-105'
                  : r.color + ' hover:shadow-sm'
                }`}
            >
              <span className="text-2xl mb-1">{r.icon}</span>
              <span className="text-xs font-semibold">{r.label}</span>
            </button>
          ))}
        </div>

        {/* Login Form - shown after role selected */}
        {selectedRole && (
          <>
            <div className="text-center mb-4">
              <span className="text-sm text-gray-400">Logging in as </span>
              <span className="font-semibold text-purple-400">{selectedRole.label}</span>
            </div>

            {error && (
              <div className="bg-red-100 text-red-700 px-5 py-2 rounded mb-4 text-sm">{error}</div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full border border-gray-600 rounded bg-[#0f3460] text-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full border border-gray-600 rounded bg-[#0f3460] text-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full bg-purple-700 text-white py-2 rounded hover:bg-purple-900 transition"
              >
                Login as {selectedRole.label}
              </button>
            </form>
          </>
        )}

        <p className="text-center mt-4 text-sm text-gray-400">
          Don't have an account?{' '}
          <Link to="/register" className="text-purple-400 hover:underline">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}
