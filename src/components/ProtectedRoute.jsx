import { Navigate } from "react-router-dom/dist";
import useAuthStore from "../store/authStore"

const ProtectedRoute = ({ children }) => {
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
    return isAuthenticated ? children : <Navigate to="/login" replace />;
};

export default ProtectedRoute;