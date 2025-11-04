import { Link, useNavigate } from "react-router-dom";
import { LogOut, Home, LayoutDashboard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

const AdminNavbar = () => {
  const navigate = useNavigate();
  const [adminName, setAdminName] = useState("");

  useEffect(() => {
    const name = localStorage.getItem("adminName") || "Admin";
    setAdminName(name);
  }, []);

  const logoutHandler = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("adminName");
    navigate("/login");
  };

  return (
    <header className="fixed top-0 left-0 w-full bg-white border-b shadow-sm z-50">
      <div className="px-6 py-3 flex items-center justify-between">
        
        {/* Logo */}
        <Link to="/admin/dashboard" className="text-lg font-bold text-primary">
          Jaihind Sports Admin
        </Link>

        {/* Menu */}
        <nav className="flex items-center gap-4">
          
          <Link
            to="/"
            className="text-gray-600 hover:text-primary flex items-center gap-1"
          >
            <Home className="w-4 h-4" /> Store
          </Link>

          <Link
            to="/admin/dashboard"
            className="text-gray-600 hover:text-primary flex items-center gap-1"
          >
            <LayoutDashboard className="w-4 h-4" /> Dashboard
          </Link>

          {/* Admin Name */}
          <span className="font-medium text-sm bg-primary text-white px-3 py-1 rounded-full">
            {adminName}
          </span>

          {/* Logout */}
          <Button
            variant="destructive"
            size="sm"
            className="flex items-center gap-1"
            onClick={logoutHandler}
          >
            <LogOut className="w-4 h-4" /> Logout
          </Button>

        </nav>
      </div>
    </header>
  );
};

export default AdminNavbar;
