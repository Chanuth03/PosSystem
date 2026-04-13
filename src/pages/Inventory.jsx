import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Search, Filter, Box } from 'lucide-react';

const API_URL = 'http://localhost:5000/api';

export default function Inventory() {
  const [products, setProducts] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [vendors, setVendors] = useState([]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const fetchData = async () => {
    try {
      const [prodRes, invRes, vendRes] = await Promise.all([
        axios.get(`${API_URL}/products`),
        axios.get(`${API_URL}/inventory`),
        axios.get(`${API_URL}/vendors`)
      ]);
      setProducts(prodRes.data);
      setInventory(invRes.data);
      setVendors(vendRes.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="p-8 h-full flex flex-col">
      <header className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Inventory</h1>
          <p className="text-gray-500 mt-1">Manage your products, sourcing, and stock variants.</p>
        </div>
        <button
          onClick={() => {
            setEditingProduct(null);
            setShowAddModal(true);
          }}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-medium shadow-lg shadow-indigo-600/20 transition-all flex items-center gap-2 group"
        >
          <Plus className="group-hover:rotate-90 transition-transform" />
          Add Product
        </button>
      </header>

      {/* Filters */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 mb-6 flex gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search products by name or Item Item code..."
            className="w-full pl-12 pr-4 py-3 rounded-xl bg-gray-50 border-none focus:ring-2 focus:ring-indigo-500 transition-shadow outline-none text-gray-700"
          />
        </div>
        <button className="flex items-center gap-2 px-6 py-3 bg-gray-50 text-gray-700 rounded-xl hover:bg-gray-100 font-medium transition-colors">
          <Filter size={20} />
          Filters
        </button>
      </div>

      {/* Table */}
      <div className="flex-1 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/80 border-b border-gray-100 text-gray-500 text-sm font-semibold uppercase tracking-wider">
                <th className="p-4 pl-6">Product details</th>
                <th className="p-4">Item code</th>
                <th className="p-4">Type</th>
                <th className="p-4">Variants</th>
                <th className="p-4">Total Stock</th>
                <th className="p-4 text-right pr-6">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {products.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center p-12 text-gray-400">
                    <Box size={48} className="mx-auto mb-4 opacity-50" />
                    <p className="text-lg font-medium">No products found</p>
                    <p className="text-sm mt-1">Add a new product to get started.</p>
                  </td>
                </tr>
              ) : (
                products.map(p => {
                  const productInventory = inventory.filter(inv => inv.productId === p.id);
                  const totalStock = productInventory.reduce((acc, curr) => acc + curr.stockQty, 0);

                  return (
                    <tr key={p.id} className="hover:bg-slate-50/50 transition-colors group">
                      <td className="p-4 pl-6">
                        <p className="font-bold text-gray-900">{p.name}</p>
                        <p className="text-sm text-gray-500">{p.category}</p>
                      </td>
                      <td className="p-4 text-gray-600 font-mono text-sm">{p.sku}</td>
                      <td className="p-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${p.type === 'manufactured' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
                          {p.type === 'manufactured' ? 'In-house' : 'Vendor'}
                        </span>
                      </td>
                      <td className="p-4 text-gray-600">
                        {productInventory.length} variants
                      </td>
                      <td className="p-4">
                        <span className={`font-semibold ${totalStock < 10 ? 'text-red-500' : 'text-emerald-600'}`}>
                          {totalStock} units
                        </span>
                      </td>
                      <td className="p-4 text-right pr-6">
                        <button 
                          onClick={() => {
                            setEditingProduct({ product: p, inventory: productInventory[0] });
                            setShowAddModal(true);
                          }}
                          className="text-indigo-600 hover:text-indigo-900 font-medium text-sm px-4 py-2 hover:bg-indigo-50 rounded-lg transition-colors"
                        >
                          Manage
                        </button>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showAddModal && (
        <ProductModal 
          onClose={() => setShowAddModal(false)}
          onSuccess={() => {
            setShowAddModal(false);
            fetchData();
          }}
          vendors={vendors} 
          editingData={editingProduct}
        />
      )}
    </div>
  );
}

function ProductModal({ onClose, onSuccess, vendors, editingData }) {
  const [formData, setFormData] = useState({
    name: editingData ? editingData.product.name : '', 
    category: editingData ? editingData.product.category : '', 
    type: editingData ? editingData.product.type : 'vendor', 
    vendorId: editingData ? editingData.product.vendorId || '' : '', 
    sku: editingData ? editingData.product.sku : '',
    size: editingData && editingData.inventory ? editingData.inventory.size : 'M', 
    color: editingData && editingData.inventory ? editingData.inventory.color : 'Black', 
    stockQty: editingData && editingData.inventory ? editingData.inventory.stockQty : 0, 
    costPrice: editingData && editingData.inventory ? editingData.inventory.costPrice : 0, 
    retailPrice: editingData && editingData.inventory ? editingData.inventory.retailPrice : 0, 
    wholesalePrice: editingData && editingData.inventory ? editingData.inventory.wholesalePrice : 0
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingData) {
        // Update Product
        await axios.put(`${API_URL}/products/${editingData.product.id}`, {
          name: formData.name, category: formData.category, type: formData.type, vendorId: formData.vendorId, sku: formData.sku
        });

        // Update Inventory variant (assuming modifying the primary first one for simplicity here)
        if (editingData.inventory) {
          await axios.put(`${API_URL}/inventory/${editingData.inventory.id}`, {
            size: formData.size, color: formData.color,
            stockQty: Number(formData.stockQty), costPrice: Number(formData.costPrice),
            retailPrice: Number(formData.retailPrice), wholesalePrice: Number(formData.wholesalePrice)
          });
        }
      } else {
        const productRes = await axios.post(`${API_URL}/products`, {
          name: formData.name, category: formData.category, type: formData.type, vendorId: formData.vendorId, sku: formData.sku
        });
        const productId = productRes.data.id;

        await axios.post(`${API_URL}/inventory`, {
          productId, size: formData.size, color: formData.color,
          stockQty: Number(formData.stockQty), costPrice: Number(formData.costPrice),
          retailPrice: Number(formData.retailPrice), wholesalePrice: Number(formData.wholesalePrice)
        });
      }
      
      onSuccess();
    } catch (error) {
      console.error(error);
      alert("Failed to add product");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="p-6 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-900">{editingData ? 'Edit Product & Stock' : 'Add New Product'}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors font-bold">✕</button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-2 gap-6">
            <div className="col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Product Name</label>
              <input required type="text" value={formData.name} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                onChange={e => setFormData({ ...formData, name: e.target.value })} />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Category</label>
              <input required type="text" value={formData.category} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 outline-none"
                onChange={e => setFormData({ ...formData, category: e.target.value })} />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Item code</label>
              <input required type="text" value={formData.sku} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 outline-none"
                onChange={e => setFormData({ ...formData, sku: e.target.value })} />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Sourcing Type</label>
              <select className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 outline-none"
                value={formData.type}
                onChange={e => setFormData({ ...formData, type: e.target.value })}>
                <option value="vendor">Vendor Bought</option>
                <option value="manufactured">In-house Manufactured</option>
              </select>
            </div>

            {formData.type === 'vendor' && (
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Vendor</label>
                <select className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 outline-none"
                  value={formData.vendorId}
                  onChange={e => setFormData({ ...formData, vendorId: e.target.value || null })}>
                  <option value="">Select Vendor</option>
                  {vendors.map(v => <option key={v.id} value={v.id}>{v.name}</option>)}
                </select>
              </div>
            )}

            <div className="col-span-2 mt-4 pt-4 border-t border-gray-100">
              <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">Initial Variant & Pricing</h3>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Size</label>
              <input type="text" value={formData.size} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 outline-none"
                onChange={e => setFormData({ ...formData, size: e.target.value })} />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Color</label>
              <input type="text" value={formData.color} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 outline-none"
                onChange={e => setFormData({ ...formData, color: e.target.value })} />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Stock Quantity</label>
              <input required type="number" value={formData.stockQty} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 outline-none"
                onChange={e => setFormData({ ...formData, stockQty: e.target.value })} />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Total Cost Price</label>
              <input required type="number" step="0.01" value={formData.costPrice} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 outline-none"
                onChange={e => setFormData({ ...formData, costPrice: e.target.value })} />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Retail Price</label>
              <input required type="number" step="0.01" value={formData.retailPrice} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 outline-none"
                onChange={e => setFormData({ ...formData, retailPrice: e.target.value })} />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Wholesale Price</label>
              <input required type="number" step="0.01" value={formData.wholesalePrice} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 outline-none"
                onChange={e => setFormData({ ...formData, wholesalePrice: e.target.value })} />
            </div>
          </div>

          <div className="mt-8 flex justify-end gap-3">
            <button type="button" onClick={onClose} className="px-6 py-2.5 rounded-xl font-medium text-gray-600 hover:bg-gray-100 transition-colors">
              Cancel
            </button>
            <button type="submit" className="px-6 py-2.5 rounded-xl font-medium text-white bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-500/20 transition-all">
              {editingData ? 'Update Product' : 'Save Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
