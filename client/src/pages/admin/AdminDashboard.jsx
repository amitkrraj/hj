import React, { useState, useEffect } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { FaLock, FaBoxOpen, FaTags, FaImages, FaCog, FaChartLine, FaArrowLeft, FaSignOutAlt } from "react-icons/fa";
import { isAuthenticated, verifyPassword, logout, isLockedOut, getLockoutRemaining, refreshSession } from "../../utils/security";

const AdminLogin = ({ onLogin }) => {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [lockoutTime, setLockoutTime] = useState(0);

  useEffect(() => {
    const checkLockout = () => {
      if (isLockedOut()) {
        setLockoutTime(getLockoutRemaining());
      } else {
        setLockoutTime(0);
      }
    };
    
    checkLockout();
    const interval = setInterval(checkLockout, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const result = await verifyPassword(password);
    
    if (result.success) {
      onLogin();
    } else {
      setError(result.error);
      if (result.locked) {
        setLockoutTime(getLockoutRemaining());
      }
    }
    
    setLoading(false);
    setPassword("");
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4">
      <div className="absolute inset-0 opacity-20 overflow-hidden">
        <div className="absolute top-20 left-20 w-40 h-40 border border-amber-400 rounded-full"></div>
        <div className="absolute bottom-20 right-20 w-60 h-60 border border-amber-400 rounded-full"></div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-8 shadow-2xl max-w-sm w-full relative z-10">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
            <FaLock className="text-white text-2xl" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800">Admin Access</h1>
          <p className="text-gray-500 text-sm mt-1">Enter password to manage your store</p>
        </div>

        {lockoutTime > 0 ? (
          <div className="text-center py-4">
            <p className="text-red-600 font-medium mb-2">Account Locked</p>
            <p className="text-gray-500 text-sm">Try again in {formatTime(lockoutTime)}</p>
          </div>
        ) : (
          <>
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-4 text-sm">
                {error}
              </div>
            )}

            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter admin password"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-amber-400"
              autoFocus
              disabled={loading}
            />

            <button
              type="submit"
              disabled={loading || !password}
              className="w-full py-3 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-lg font-semibold hover:from-amber-600 hover:to-amber-700 transition-all disabled:opacity-50"
            >
              {loading ? "Verifying..." : "Unlock"}
            </button>
          </>
        )}

        <Link to="/" className="block text-center text-gray-500 text-sm mt-4 hover:text-amber-600 transition-colors">
          ← Back to Home
        </Link>
      </form>
    </div>
  );
};

const AdminDashboard = () => {
  const [authenticated, setAuthenticated] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    setAuthenticated(isAuthenticated());
  }, [location]);

  useEffect(() => {
    if (authenticated) {
      const interval = setInterval(() => {
        if (!isAuthenticated()) {
          setAuthenticated(false);
        } else {
          refreshSession();
        }
      }, 60000);
      return () => clearInterval(interval);
    }
  }, [authenticated]);

  const handleLogout = () => {
    logout();
    setAuthenticated(false);
    navigate("/admin");
  };

  if (!authenticated) {
    return <AdminLogin onLogin={() => setAuthenticated(true)} />;
  }

  const menuItems = [
    { path: "/admin/products", icon: FaBoxOpen, label: "Products" },
    { path: "/admin/categories", icon: FaTags, label: "Categories" },
    { path: "/admin/hero-images", icon: FaImages, label: "Hero Images" },
    { path: "/admin/rates", icon: FaChartLine, label: "Rates" },
    { path: "/admin/settings", icon: FaCog, label: "Site Settings" },
  ];

  const currentPath = location.pathname;

  return (
    <div className="min-h-screen bg-gray-100 flex">
      <aside className="w-64 admin-sidebar text-white flex-shrink-0 hidden lg:flex flex-col">
        <div className="p-6 border-b border-gray-700">
          <h1 className="text-xl font-bold">Admin Panel</h1>
          <p className="text-gray-400 text-sm">Hira Jewellers</p>
        </div>

        <nav className="flex-1 py-4">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-6 py-3 transition-colors ${
                currentPath === item.path
                  ? "bg-amber-500 text-white"
                  : "text-gray-300 hover:bg-gray-800"
              }`}
            >
              <item.icon size={18} />
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-700">
          <Link
            to="/"
            className="flex items-center gap-2 px-4 py-2 text-gray-400 hover:text-white transition-colors text-sm"
          >
            <FaArrowLeft size={14} />
            Back to Site
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 text-gray-400 hover:text-red-400 transition-colors text-sm w-full"
          >
            <FaSignOutAlt size={14} />
            Logout
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col">
        <header className="bg-white shadow-sm px-6 py-4 flex items-center justify-between lg:hidden">
          <h1 className="font-bold text-gray-800">Admin Panel</h1>
          <button onClick={handleLogout} className="text-gray-500 hover:text-red-500">
            <FaSignOutAlt size={18} />
          </button>
        </header>

        <nav className="bg-white border-b px-4 py-2 flex gap-2 overflow-x-auto lg:hidden">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap text-sm ${
                currentPath === item.path
                  ? "bg-amber-500 text-white"
                  : "bg-gray-100 text-gray-600"
              }`}
            >
              <item.icon size={14} />
              {item.label}
            </Link>
          ))}
        </nav>

        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
