import { Navigate } from "react-router-dom";
import { getLocalStorage } from "../api";

const ProtectedRoute = ({ children }) => {
  const token = getLocalStorage("token");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;