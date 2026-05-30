import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-indigo-700 text-white shadow-lg w-full h-20">
      <div className="w-full h-full px-15 flex items-center justify-between">
        <Link to="/dashboard" className="flex items-center h-full">
          <img src="/navlogo.png" alt="Merch Guru" className="h-14 w-auto block" />
        </Link>
        {user && (
          <div className="flex items-center gap-3 mr-1">
            <span className="text-sm bg-indigo-500 px-3 py-1 rounded-full">
              {user.role} - {user.fullName}
            </span>
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded text-sm"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}
