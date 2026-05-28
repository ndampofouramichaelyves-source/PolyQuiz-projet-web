import { Navigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';

export const ProtectedRoute = ({ children }) => {
  const { pseudonym } = useUser();
  if (!pseudonym) {
    return <Navigate to="/" replace />;
  }
  return children;
};