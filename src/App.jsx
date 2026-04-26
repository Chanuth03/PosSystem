import { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  NavLink,
  Navigate,
} from "react-router-dom";
import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  Users,
  Settings,
  Store,
  Menu,
  X,
  LogOut,
  UserCircle
} from "lucide-react";
import Dashboard from "./pages/Dashboard";
import POS from "./pages/POS";
import Inventory from "./pages/Inventory";
import Vendors from "./pages/Vendors";
import Login from "./pages/Login";
import SettingsPage from "./pages/Settings";
import { AuthContext } from "./context/AuthContext";
import { useContext } from "react";

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { activeUser, users, switchUser, loading } = useContext(AuthContext);

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-gray-50">Loading...</div>;

  const isAdmin = activeUser && activeUser.role === 'admin';

  const handleUserSwitch = (targetId) => {
    const targetUser = users.find(u => u.id === Number(targetId));
    if (targetUser && targetUser.role === 'admin' && activeUser?.role !== 'admin') {
      const pwd = window.prompt("Enter Admin Password:");
      if (pwd === "Admin@1234") {
        switchUser(targetId);
      } else {
        alert("Incorrect password!");
      }
    } else {
      switchUser(targetId);
    }
  };

  return (
    <Router>
      <div className="flex h-screen bg-gray-50/50 flex-col md:flex-row">
        {/* Mobile Header */}
        <div className="md:hidden flex justify-between items-center bg-white p-4 border-b border-gray-200 z-30 relative shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-500/30">
              <Store size={18} />
            </div>
            <h1 className="text-lg font-bold bg-gradient-to-r from-blue-700 to-blue-500 bg-clip-text text-transparent">
              FlowPOS
            </h1>
          </div>
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
          >
            <Menu size={24} />
          </button>
        </div>

        {/* Sidebar Overlay */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-40 md:hidden animate-in fade-in duration-200"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <aside
          className={`fixed md:static inset-y-0 left-0 w-72 md:w-64 bg-white border-r border-gray-200 flex flex-col transition-transform duration-300 shadow-2xl md:shadow-sm z-50 ${isSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}
        >
          <div className="p-6 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/30">
                <Store size={24} />
              </div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-blue-700 to-blue-500 bg-clip-text text-transparent">
                FlowPOS
              </h1>
            </div>
            <button
              className="md:hidden p-2 text-gray-500 hover:bg-gray-100 rounded-lg"
              onClick={() => setIsSidebarOpen(false)}
            >
              <X size={20} />
            </button>
          </div>

          <nav className="flex-1 px-4 space-y-2 mt-4 overflow-y-auto">
            {isAdmin && (
              <NavItem
                to="/"
                icon={<LayoutDashboard size={20} />}
                label="Dashboard"
                onClick={() => setIsSidebarOpen(false)}
              />
            )}
            <NavItem
              to="/pos"
              icon={<ShoppingCart size={20} />}
              label="Point of Sale"
              onClick={() => setIsSidebarOpen(false)}
            />
            {isAdmin && (
              <>
                <NavItem
                  to="/inventory"
                  icon={<Package size={20} />}
                  label="Inventory"
                  onClick={() => setIsSidebarOpen(false)}
                />
                <NavItem
                  to="/vendors"
                  icon={<Users size={20} />}
                  label="Vendors"
                  onClick={() => setIsSidebarOpen(false)}
                />
              </>
            )}
          </nav>

          <div className="p-4 border-t border-gray-100 space-y-2">
            <div className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 bg-gray-50 rounded-xl mb-2">
              <UserCircle size={20} className="text-blue-600 shrink-0" />
              <div className="flex-1 w-full overflow-hidden relative">
                <select 
                  className="w-full bg-transparent font-bold capitalize text-gray-900 outline-none cursor-pointer appearance-none relative z-10 pr-6"
                  value={activeUser.id}
                  onChange={(e) => handleUserSwitch(e.target.value)}
                >
                  {users.map(u => (
                    <option key={u.id} value={u.id}>{u.username} ({u.role})</option>
                  ))}
                </select>
                <div className="absolute right-0 top-1 text-gray-400 pointer-events-none">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                </div>
                <p className="text-xs text-gray-500 capitalize">{activeUser.role}</p>
              </div>
            </div>
            {isAdmin && (
              <NavLink to="/settings" onClick={() => setIsSidebarOpen(false)} className={({ isActive }) => `flex items-center gap-3 px-4 py-3 text-sm rounded-xl cursor-pointer transition-colors ${isActive ? "bg-blue-50 text-blue-700 font-semibold shadow-sm" : "text-gray-600 hover:bg-gray-50 font-medium"}`}>
                <Settings size={20} />
                <span>Settings</span>
              </NavLink>
            )}
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-slate-50/50">
          <Routes>
            <Route path="/pos" element={<POS />} />
            {isAdmin ? (
              <>
                <Route path="/" element={<Dashboard />} />
                <Route path="/inventory" element={<Inventory />} />
                <Route path="/vendors" element={<Vendors />} />
                <Route path="/settings" element={<SettingsPage />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </>
            ) : (
              <Route path="*" element={<Navigate to="/pos" replace />} />
            )}
          </Routes>
        </main>
      </div>
    </Router>
  );
}

function NavItem({ to, icon, label, onClick }) {
  return (
    <NavLink
      to={to}
      onClick={onClick}
      className={({ isActive }) =>
        `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
          isActive
            ? "bg-blue-50 text-blue-700 font-semibold shadow-sm shadow-blue-100"
            : "text-gray-600 hover:bg-gray-50 hover:text-gray-900 font-medium whitespace-nowrap"
        }`
      }
    >
      {icon}
      <span>{label}</span>
    </NavLink>
  );
}

export default App;
