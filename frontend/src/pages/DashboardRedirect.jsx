import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function DashboardRedirect() {
  const { user } = useAuth();

  if (!user) return <Navigate to="/login" />;

  const roleRoutes = {
    MANAGER: '/manager',
    SUPERVISOR: '/supervisor',
    CLERK: '/clerk',
    MECHANIC: '/mechanic',
    CUSTOMER: '/customer',
  };

  return <Navigate to={roleRoutes[user.role] || '/login'} />;
}
