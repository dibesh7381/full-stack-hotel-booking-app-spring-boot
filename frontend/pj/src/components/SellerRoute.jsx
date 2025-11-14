import { useProfileQuery } from "../services/authApi";
import { Navigate } from "react-router-dom";

export default function SellerRoute({ children }) {
  const { data, isLoading } = useProfileQuery();

  if (isLoading) return <p>Loading...</p>;

  const role = data?.data?.role;

  // ❌ If not seller → block access
  if (role !== "SELLER") {
    return <Navigate to="/profile" replace />;
  }

  return children;
}
