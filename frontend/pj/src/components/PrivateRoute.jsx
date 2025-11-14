import { Navigate } from "react-router-dom";
import { useProfileQuery } from "../services/authApi";

export default function PrivateRoute({ children }) {
  const { isLoading, isError } = useProfileQuery();

  // 🔥 Still loading → show simple loader
  if (isLoading) {
    return (
      <div className="p-4 text-center">
        <p className="text-gray-600">Checking authentication...</p>
      </div>
    );
  }

  // ❌ If error → Not logged in → redirect to login
  if (isError) {
    return <Navigate to="/login" replace />;
  }

  // ✔ Logged in → show protected page
  return children;
}
