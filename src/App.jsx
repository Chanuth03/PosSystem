import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  Users,
  Settings,
  Store
} from 'lucide-react';
import Dashboard from './pages/Dashboard';
import POS from './pages/POS';
import Inventory from './pages/Inventory';
import Vendors from './pages/Vendors';

function App() {
  return (
    <Router>
      <div className="flex h-screen bg-gray-50/50">
        {/* Sidebar */}
        <aside className="w-64 bg-white border-r border-gray-200 flex flex-col transition-all duration-300 shadow-sm">
          <div className="p-6 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/30">
              <Store size={24} />
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-blue-700 to-blue-500 bg-clip-text text-transparent">MyPOS</h1>
          </div>

          <nav className="flex-1 px-4 space-y-2 mt-4">
            <NavItem to="/" icon={<LayoutDashboard size={20} />} label="Dashboard" />
            <NavItem to="/pos" icon={<ShoppingCart size={20} />} label="Point of Sale" />
            <NavItem to="/inventory" icon={<Package size={20} />} label="Inventory" />
            <NavItem to="/vendors" icon={<Users size={20} />} label="Vendors" />
          </nav>

          <div className="p-4 border-t border-gray-100">
            <div className="flex items-center gap-3 px-4 py-3 text-sm text-gray-600 hover:bg-gray-50 rounded-xl cursor-pointer transition-colors">
              <Settings size={20} />
              <span className="font-medium">Settings</span>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-auto bg-slate-50/50">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/pos" element={<POS />} />
            <Route path="/inventory" element={<Inventory />} />
            <Route path="/vendors" element={<Vendors />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

function NavItem({ to, icon, label }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${isActive
          ? 'bg-blue-50 text-blue-700 font-semibold shadow-sm shadow-blue-100'
          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 font-medium whitespace-nowrap'
        }`
      }
    >
      {icon}
      <span>{label}</span>
    </NavLink>
  );
}

export default App;
