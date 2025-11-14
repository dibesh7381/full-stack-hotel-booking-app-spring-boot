import { Link, useNavigate } from "react-router-dom";
import { useLogoutMutation, useProfileQuery } from "../services/authApi";
import { Menu, X } from "lucide-react";
import { useState } from "react";

export default function Navbar() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const { data, isSuccess } = useProfileQuery();
  const [logout] = useLogoutMutation();

  const role = data?.data?.role;

  const handleLogout = async () => {
    await logout().unwrap();
    setOpen(false);
    navigate("/login");
  };

  return (
    <>
      {/* NAVBAR TOP */}
      <nav className="bg-blue-600 text-white p-4 shadow">
        <div className="max-w-6xl mx-auto flex justify-between items-center">

          {/* Logo */}
          <Link to="/" className="text-xl font-bold">
            HotelApp
          </Link>

          {/* Mobile Hamburger */}
          <button className="md:hidden" onClick={() => setOpen(true)}>
            <Menu size={28} />
          </button>

          {/* DESKTOP MENU */}
          <div className="hidden md:flex gap-6 items-center">

            <Link to="/">Home</Link>

            {/* ⭐ Only logged-in user can see Hotels */}
            {isSuccess && (
              <Link to="/hotels">Hotels</Link>
            )}

            <Link to="/profile">Profile</Link>

            {/* SELLER Dashboard */}
            {isSuccess && role === "SELLER" && (
              <Link
                to="/seller/dashboard"
                className="bg-green-400 text-black px-3 py-1 rounded"
              >
                Seller Dashboard
              </Link>
            )}

            {/* Become Seller */}
            {isSuccess && role === "USER" && (
              <Link
                to="/become-seller"
                className="bg-yellow-400 text-black px-3 py-1 rounded"
              >
                Become Seller
              </Link>
            )}

            {/* Login | Signup or Logout */}
            {!isSuccess ? (
              <>
                <Link to="/login">Login</Link>
                <Link to="/signup">Signup</Link>
              </>
            ) : (
              <button
                onClick={handleLogout}
                className="bg-white text-blue-600 px-3 py-1 rounded"
              >
                Logout
              </button>
            )}

          </div>
        </div>
      </nav>

      {/* BACKDROP for drawer */}
      {open && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setOpen(false)}
        ></div>
      )}

      {/* SIDE DRAWER */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-blue-700 text-white p-5 z-50 transform 
        transition-transform duration-300 md:hidden
        ${open ? "translate-x-0" : "-translate-x-full"}`}
      >

        {/* Drawer Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">Menu</h2>
          <button onClick={() => setOpen(false)}>
            <X size={26} />
          </button>
        </div>

        {/* DRAWER LINKS */}
        <div className="flex flex-col gap-5 text-lg">

          <Link to="/" onClick={() => setOpen(false)}>Home</Link>

          {/* ⭐ Only logged-in users will see Hotels link */}
          {isSuccess && (
            <Link to="/hotels" onClick={() => setOpen(false)}>
              Hotels
            </Link>
          )}

          <Link to="/profile" onClick={() => setOpen(false)}>
            Profile
          </Link>

          {/* SELLER Dashboard */}
          {isSuccess && role === "SELLER" && (
            <Link
              to="/seller/dashboard"
              onClick={() => setOpen(false)}
              className="bg-green-400 text-black px-3 py-1 rounded text-center"
            >
              Seller Dashboard
            </Link>
          )}

          {/* Become Seller */}
          {isSuccess && role === "USER" && (
            <Link
              to="/become-seller"
              onClick={() => setOpen(false)}
              className="bg-yellow-400 text-black px-3 py-1 rounded text-center"
            >
              Become Seller
            </Link>
          )}

          {/* Auth Buttons */}
          {!isSuccess ? (
            <>
              <Link to="/login" onClick={() => setOpen(false)}>Login</Link>
              <Link to="/signup" onClick={() => setOpen(false)}>Signup</Link>
            </>
          ) : (
            <button
              onClick={handleLogout}
              className="bg-white text-blue-700 px-3 py-1 rounded"
            >
              Logout
            </button>
          )}

        </div>
      </div>
    </>
  );
}
