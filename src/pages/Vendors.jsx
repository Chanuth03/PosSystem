import React, { useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db';
import { Users, Plus, Phone, Search } from 'lucide-react';

export default function Vendors() {
  const vendors = useLiveQuery(() => db.vendors.toArray()) || [];
  const [showAddModal, setShowAddModal] = useState(false);

  return (
    <div className="p-8 h-full flex flex-col">
      <header className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Vendors</h1>
          <p className="text-gray-500 mt-1">Manage your suppliers and vendors.</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-medium shadow-lg shadow-indigo-600/20 transition-all flex items-center gap-2 group"
        >
          <Plus className="group-hover:rotate-90 transition-transform" />
          Add Vendor
        </button>
      </header>

      <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 mb-6 relative">
        <Search className="absolute left-7 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
        <input 
          type="text" 
          placeholder="Search vendors..." 
          className="w-full pl-12 pr-4 py-3 rounded-xl bg-gray-50 border-none focus:ring-2 focus:ring-indigo-500 transition-shadow outline-none text-gray-700" 
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {vendors.length === 0 ? (
          <div className="col-span-full py-16 text-center bg-white rounded-3xl border border-dashed border-gray-300">
            <Users size={48} className="mx-auto text-gray-300 mb-4" />
            <h3 className="text-xl font-bold text-gray-700 mb-1">No Vendors Found</h3>
            <p className="text-gray-500">Add a vendor to start tracking your suppliers.</p>
          </div>
        ) : (
          vendors.map(vendor => (
            <div key={vendor.id} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-lg transition-shadow group">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-xl uppercase">
                  {vendor.name.charAt(0)}
                </div>
                <button className="text-gray-400 hover:text-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity">
                  Edit
                </button>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-1">{vendor.name}</h3>
              <div className="flex items-center gap-2 text-gray-600">
                <Phone size={16} className="text-gray-400" />
                <span>{vendor.phone}</span>
              </div>
              
              <div className="mt-6 pt-4 border-t border-gray-50 flex justify-between items-center bg-gray-50/50 -mx-6 -mb-6 p-6 rounded-b-2xl">
                <span className="text-sm font-medium text-gray-500">Active Supplier</span>
                <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></span>
              </div>
            </div>
          ))
        )}
      </div>

      {showAddModal && (
        <AddVendorModal onClose={() => setShowAddModal(false)} />
      )}
    </div>
  );
}

function AddVendorModal({ onClose }) {
  const [formData, setFormData] = useState({ name: '', phone: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await db.vendors.add(formData);
      onClose();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="p-6 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-900">Add New Vendor</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">✕</button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Vendor Name</label>
              <input required type="text" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-indigo-500"
                onChange={e => setFormData({...formData, name: e.target.value})} />
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Phone Number</label>
              <input required type="tel" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-indigo-500"
                onChange={e => setFormData({...formData, phone: e.target.value})} />
            </div>
          </div>
          
          <div className="mt-8 flex justify-end gap-3">
            <button type="button" onClick={onClose} className="px-6 py-2.5 rounded-xl font-medium text-gray-600 hover:bg-gray-100 transition-colors">
              Cancel
            </button>
            <button type="submit" className="px-6 py-2.5 rounded-xl font-medium text-white bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-500/20 transition-all">
              Save Vendor
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
