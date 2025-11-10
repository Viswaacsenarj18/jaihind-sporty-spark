import { LayoutDashboard, Box, Receipt } from "lucide-react";
import { Link } from "react-router-dom";

export function AdminLayout({ children }) {
  return (
    <div className="flex min-h-screen">

      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 text-white p-4">
        <h2 className="text-xl font-bold mb-6">Admin Panel</h2>

        <nav className="space-y-2">
          <Link to="/admin" className="flex items-center gap-2">
            <LayoutDashboard size={18} /> Dashboard
          </Link>

          <Link to="/admin/products" className="flex items-center gap-2">
            <Box size={18} /> Products
          </Link>

          <Link to="/admin/orders" className="flex items-center gap-2">
            <Receipt size={18} /> Orders
          </Link>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 bg-gray-100">
        {children}
      </main>

    </div>
  );
}
