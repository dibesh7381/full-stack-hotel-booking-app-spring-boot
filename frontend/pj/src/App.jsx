import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Profile from "./pages/Profile";
import BecomeSeller from "./pages/BecomeSeller";
import SellerDashboard from "./pages/SellerDashboard";

import PrivateRoute from "./components/PrivateRoute";
import SellerRoute from "./components/SellerRoute";

// ⭐ IMPORT ViewHotelsPage
import ViewHotelsPage from "./pages/ViewHotelsPage";

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <Routes>
        {/* PUBLIC */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* ⭐ PRIVATE — ONLY LOGGED-IN USERS */}
        <Route
          path="/hotels"
          element={
            <PrivateRoute>
              <ViewHotelsPage />
            </PrivateRoute>
          }
        />

        {/* PRIVATE ROUTES */}
        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          }
        />

        <Route
          path="/become-seller"
          element={
            <PrivateRoute>
              <BecomeSeller />
            </PrivateRoute>
          }
        />

        {/* SELLER ONLY */}
        <Route
          path="/seller/dashboard"
          element={
            <PrivateRoute>
              <SellerRoute>
                <SellerDashboard />
              </SellerRoute>
            </PrivateRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}



