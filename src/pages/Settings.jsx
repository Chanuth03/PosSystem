import React, { useState, useEffect, useContext } from 'react';
import { Store, UserPlus, Key, Save, Edit2, Trash2, X } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('shop');

  return (
    <div className="p-4 md:p-8 space-y-6 md:space-y-8 h-full flex flex-col">
      <header>
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Settings</h1>
        <p className="text-gray-500 mt-1">Manage system configurations and user access.</p>
      </header>

      {/* Tabs */}
      <div className="flex gap-2 p-1 bg-white border border-gray-200 rounded-xl w-fit shadow-sm">
        <button 
          onClick={() => setActiveTab('shop')}
          className={`px-6 py-2.5 rounded-lg font-semibold transition-all flex gap-2 items-center ${activeTab === 'shop' ? 'bg-blue-50 text-blue-700 shadow-sm' : 'text-gray-500 hover:text-gray-800'}`}
        >
          <Store size={18}/> Shop Details
        </button>
        <button 
          onClick={() => setActiveTab('users')}
          className={`px-6 py-2.5 rounded-lg font-semibold transition-all flex gap-2 items-center ${activeTab === 'users' ? 'bg-blue-50 text-blue-700 shadow-sm' : 'text-gray-500 hover:text-gray-800'}`}
        >
          <Key size={18} /> User Access
        </button>
      </div>

      <div className="flex-1 overflow-y-auto pb-8">
        {activeTab === 'shop' ? <ShopSettings /> : <UserManagement />}
      </div>
    </div>
  );
}

function ShopSettings() {
  const [shopConfigs, setShopConfigs] = useState({
    shopName: 'FlowPOS Global',
    address: '123 Main Street, City Center',
    phone: '011-2345678',
    currency: 'Rs.',
    taxRate: '0'
  });

  useEffect(() => {
    const saved = localStorage.getItem('flowpos_shop_settings');
    if (saved) {
      setShopConfigs(JSON.parse(saved));
    }
  }, []);

  const handleSave = () => {
    localStorage.setItem('flowpos_shop_settings', JSON.stringify(shopConfigs));
    alert("Shop Settings Saved Successfully!");
  };

  return (
    <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100 max-w-3xl">
      <h2 className="text-xl font-bold text-gray-800 mb-6 border-b border-gray-100 pb-4">Receipt Information</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Shop Name</label>
          <input type="text" value={shopConfigs.shopName} onChange={(e) => setShopConfigs({...shopConfigs, shopName: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-blue-500 transition-all focus:ring-4 focus:ring-blue-500/10" />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Contact Number</label>
          <input type="text" value={shopConfigs.phone} onChange={(e) => setShopConfigs({...shopConfigs, phone: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-blue-500 transition-all focus:ring-4 focus:ring-blue-500/10" />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-semibold text-gray-700 mb-2">Shop Address</label>
          <input type="text" value={shopConfigs.address} onChange={(e) => setShopConfigs({...shopConfigs, address: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-blue-500 transition-all focus:ring-4 focus:ring-blue-500/10" />
        </div>
      </div>

      <h2 className="text-xl font-bold text-gray-800 mb-6 border-b border-gray-100 pb-4">Billing Configuration</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Currency Symbol</label>
          <input type="text" value={shopConfigs.currency} onChange={(e) => setShopConfigs({...shopConfigs, currency: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-blue-500 transition-all focus:ring-4 focus:ring-blue-500/10" />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Default Tax Rate (%)</label>
          <input type="number" value={shopConfigs.taxRate} onChange={(e) => setShopConfigs({...shopConfigs, taxRate: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-blue-500 transition-all focus:ring-4 focus:ring-blue-500/10" />
        </div>
      </div>

      <div className="mt-8 flex justify-end">
        <button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-blue-500/30 transition-all flex items-center gap-2 group">
          <Save size={18} className="group-hover:scale-110 transition-transform"/> Save Settings
        </button>
      </div>
    </div>
  );
}

function UserManagement() {
  const { users, saveUsers, activeUser } = useContext(AuthContext);
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  
  const [formData, setFormData] = useState({ username: '', role: 'cashier' });

  const handleOpenModal = (user = null) => {
    if (user) {
      setEditingUser(user);
      setFormData({ username: user.username, role: user.role });
    } else {
      setEditingUser(null);
      setFormData({ username: '', role: 'cashier' });
    }
    setShowModal(true);
  };

  const handleSave = () => {
    if (!formData.username.trim()) return;

    if (editingUser) {
      saveUsers(users.map(u => u.id === editingUser.id ? { ...u, ...formData } : u));
    } else {
      const newUser = {
        id: Date.now(),
        ...formData,
        lastActive: 'Never'
      };
      saveUsers([...users, newUser]);
    }
    setShowModal(false);
  };

  const handleDelete = (id) => {
    if (confirm("Are you sure you want to remove this user?")) {
      saveUsers(users.filter(u => u.id !== id));
    }
  };

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden max-w-4xl">
      <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
        <h2 className="text-xl font-bold text-gray-800">System Users</h2>
        <button onClick={() => handleOpenModal()} className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-bold shadow-lg shadow-blue-500/20 transition-all flex items-center gap-2">
          <UserPlus size={18} /> Add User
        </button>
      </div>
      
      <div className="p-0">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 text-gray-500 text-sm font-semibold uppercase tracking-wider border-b border-gray-100">
              <th className="p-4 pl-6">Username</th>
              <th className="p-4">Role</th>
              <th className="p-4">Last Active</th>
              <th className="p-4 text-right pr-6">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {users.map(u => (
              <tr key={u.id} className="hover:bg-slate-50 transition-colors group">
                <td className="p-4 pl-6 font-bold text-gray-800">
                  {u.username}
                  {activeUser?.id === u.id && <span className="ml-2 text-[10px] bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full uppercase">You</span>}
                </td>
                <td className="p-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${u.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-green-100 text-green-700'}`}>
                    {u.role.toUpperCase()}
                  </span>
                </td>
                <td className="p-4 text-gray-500 text-sm">{u.lastActive}</td>
                <td className="p-4 text-right pr-6 space-x-2">
                  <button onClick={() => handleOpenModal(u)} className="text-gray-400 hover:text-blue-600 transition-colors p-2 rounded-lg hover:bg-blue-50">
                    <Edit2 size={18} />
                  </button>
                  {u.id !== activeUser?.id && u.role !== 'admin' && (
                    <button onClick={() => handleDelete(u.id)} className="text-gray-400 hover:text-red-600 transition-colors p-2 rounded-lg hover:bg-red-50">
                      <Trash2 size={18} />
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
            <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <h3 className="font-bold text-gray-800">{editingUser ? 'Edit User' : 'Add New User'}</h3>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-200">
                <X size={20} />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Username</label>
                <input required type="text" value={formData.username} onChange={e => setFormData({...formData, username: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10" placeholder="e.g. jdoe"/>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Role</label>
                <select value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10">
                  <option value="cashier">Cashier</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div className="pt-4 flex gap-3">
                <button onClick={() => setShowModal(false)} className="flex-1 bg-white border border-gray-200 text-gray-700 py-3 rounded-xl font-bold hover:bg-gray-50 transition-colors">Cancel</button>
                <button onClick={handleSave} className="flex-1 bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/30">Save User</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
