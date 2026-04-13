import React, { useState, useMemo, useEffect } from 'react';
import axios from 'axios';
import { ShoppingCart, Search, Trash2, Tag, CreditCard, CheckCircle } from 'lucide-react';

const API_URL = 'http://localhost:5000/api';

export default function POS() {
  const [cart, setCart] = useState([]);
  const [saleType, setSaleType] = useState('retail'); // 'retail' or 'wholesale'
  const [discountPercent, setDiscountPercent] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  const [products, setProducts] = useState([]);
  const [inventory, setInventory] = useState([]);

  const fetchData = async () => {
    try {
      const [prodRes, invRes] = await Promise.all([
        axios.get(`${API_URL}/products`),
        axios.get(`${API_URL}/inventory`)
      ]);
      setProducts(prodRes.data);
      setInventory(invRes.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const inventoryItems = useMemo(() => {
    return inventory.map(inv => {
      const product = products.find(p => p.id === inv.productId) || {};
      return {
        ...inv,
        productName: product.name,
        sku: product.sku,
        category: product.category
      };
    }).filter(item =>
      item.productName &&
      (item.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
       (item.sku && item.sku.toLowerCase().includes(searchQuery.toLowerCase())))
    );
  }, [inventory, products, searchQuery]);

  // Cart operations
  const addToCart = (item) => {
    const existing = cart.find(c => c.inventoryId === item.id);
    if (existing) {
      if (existing.qty >= item.stockQty) return; // Can't add more than stock
      setCart(cart.map(c => c.inventoryId === item.id ? { ...c, qty: c.qty + 1 } : c));
    } else {
      if (item.stockQty < 1) return;
      setCart([...cart, {
        inventoryId: item.id,
        productId: item.productId,
        name: item.productName,
        size: item.size,
        color: item.color,
        retailPrice: item.retailPrice,
        wholesalePrice: item.wholesalePrice,
        qty: 1,
        maxQty: item.stockQty
      }]);
    }
  };

  const removeFromCart = (inventoryId) => setCart(cart.filter(c => c.inventoryId !== inventoryId));

  const updateQty = (inventoryId, newQty) => {
    setCart(cart.map(c => {
      if (c.inventoryId === inventoryId) {
        return { ...c, qty: Math.min(Math.max(1, newQty), c.maxQty) };
      }
      return c;
    }));
  };

  const subtotal = cart.reduce((acc, item) => acc + (item.qty * (saleType === 'retail' ? item.retailPrice : item.wholesalePrice)), 0);
  const discountAmount = (subtotal * discountPercent) / 100;
  const total = subtotal - discountAmount;

  const handleCheckout = async () => {
    if (cart.length === 0) return;

    try {
      // Create Sale Record
      await axios.post(`${API_URL}/sales`, {
        totalAmount: total,
        discount: discountAmount,
        type: saleType
      });

      // Update Inventory Quantities
      await Promise.all(cart.map(item => 
        axios.put(`${API_URL}/inventory/${item.inventoryId}/deduct`, { qty: item.qty })
      ));

      setCart([]);
      setShowSuccess(true);
      fetchData(); // Refresh inventory after sale
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error) {
      console.error("Checkout failed:", error);
      alert("Checkout failed. Check console.");
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-[calc(100vh-64px)] md:h-full bg-slate-50">
      {/* Product Selection Area */}
      <div className="flex-1 flex flex-col h-1/2 md:h-full overflow-hidden p-4 md:p-6 gap-4 md:gap-6">
        <header className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
          <div className="w-full md:w-auto text-center md:text-left">
            <h1 className="text-2xl font-bold text-gray-800">Point of Sale</h1>
          </div>
          <div className="flex w-full md:w-auto gap-2 p-1 bg-gray-100 rounded-xl overflow-hidden">
            <button
              className={`flex-1 md:flex-none px-6 py-2 rounded-lg font-semibold transition-all ${saleType === 'retail' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
              onClick={() => setSaleType('retail')}
            >
              Retail
            </button>
            <button
              className={`flex-1 md:flex-none px-6 py-2 rounded-lg font-semibold transition-all ${saleType === 'wholesale' ? 'bg-white text-purple-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
              onClick={() => setSaleType('wholesale')}
            >
              Wholesale
            </button>
          </div>
        </header>

        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search catalog by name or Item code..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white border border-gray-200 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 shadow-sm text-lg transition-all"
          />
        </div>

        <div className="flex-1 overflow-y-auto pb-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {inventoryItems.map(item => (
              <button
                key={item.id}
                onClick={() => addToCart(item)}
                disabled={item.stockQty < 1}
                className={`text-left p-4 rounded-2xl border transition-all ${item.stockQty < 1 ? 'opacity-50 cursor-not-allowed bg-gray-50 border-gray-200' : 'bg-white border-gray-100 hover:border-blue-300 hover:shadow-lg hover:-translate-y-1'}`}
              >
                <div className="flex justify-between items-start mb-2">
                  <span className="text-xs font-bold px-2 py-1 rounded bg-gray-100 text-gray-600">{item.sku}</span>
                  <span className={`text-xs font-bold px-2 py-1 rounded ${item.stockQty > 5 ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                    {item.stockQty} left
                  </span>
                </div>
                <h3 className="font-bold text-gray-800 line-clamp-2 mb-1">{item.productName}</h3>
                <p className="text-sm text-gray-500 mb-3">{item.size} • {item.color}</p>
                <div className="flex justify-between items-end">
                  <span className="text-lg font-black text-gray-900">
                    Rs.{(saleType === 'retail' ? Number(item.retailPrice) : Number(item.wholesalePrice)).toFixed(2)}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Cart Area */}
      <div className="w-full md:w-96 bg-white border-t md:border-t-0 md:border-l border-gray-200 shadow-xl flex flex-col z-10 h-1/2 md:h-full">
        <div className="p-4 md:p-6 border-b border-gray-100 flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center">
            <ShoppingCart size={20} />
          </div>
          <h2 className="text-xl font-bold text-gray-800">Current Order</h2>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50/50">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-gray-400">
              <ShoppingCart size={48} className="mb-4 opacity-20" />
              <p>Cart is empty</p>
            </div>
          ) : (
            cart.map(item => (
              <div key={item.inventoryId} className="bg-white p-3 rounded-xl shadow-sm border border-gray-100 flex gap-3">
                <div className="flex-1">
                  <h4 className="font-bold text-gray-800 text-sm">{item.name}</h4>
                  <p className="text-xs text-gray-500 mb-2">{item.size} • {item.color}</p>
                  <div className="flex items-center gap-2">
                    <button onClick={() => updateQty(item.inventoryId, item.qty - 1)} className="w-6 h-6 rounded-md bg-gray-100 text-gray-600 hover:bg-gray-200 flex items-center justify-center font-bold pb-0.5">-</button>
                    <span className="text-sm font-semibold w-6 text-center">{item.qty}</span>
                    <button onClick={() => updateQty(item.inventoryId, item.qty + 1)} className="w-6 h-6 rounded-md bg-gray-100 text-gray-600 hover:bg-gray-200 flex items-center justify-center font-bold pb-0.5">+</button>
                  </div>
                </div>
                <div className="flex flex-col items-end justify-between">
                  <button onClick={() => removeFromCart(item.inventoryId)} className="text-gray-300 hover:text-red-500 transition-colors">
                    <Trash2 size={16} />
                  </button>
                  <span className="font-bold text-gray-900">
                    Rs.{(item.qty * (saleType === 'retail' ? Number(item.retailPrice) : Number(item.wholesalePrice))).toFixed(2)}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="p-4 md:p-6 bg-white border-t border-gray-100 shadow-[0_-4px_20px_-10px_rgba(0,0,0,0.1)]">
          <div className="space-y-2 md:space-y-3 mb-4 md:mb-6">
            <div className="flex justify-between items-center">
              <span className="text-gray-500">Subtotal</span>
              <span className="font-semibold">Rs.{subtotal.toFixed(2)}</span>
            </div>

            <div className="flex items-center gap-2">
              <Tag size={16} className="text-gray-400" />
              <span className="text-gray-500 flex-1">Discount (%)</span>
              <input
                type="number"
                max="100" min="0"
                value={discountPercent}
                onChange={(e) => setDiscountPercent(Number(e.target.value))}
                className="w-16 text-right bg-gray-50 border border-gray-200 rounded-lg px-2 py-1 outline-none focus:border-blue-500"
              />
            </div>

            <div className="flex justify-between items-center text-sm">
              <span className="text-red-500">Discount Amount</span>
              <span className="text-red-500 font-medium">-Rs.{discountAmount.toFixed(2)}</span>
            </div>

            <div className="border-t border-gray-100 pt-3 flex justify-between items-end">
              <span className="text-lg font-bold text-gray-800">Total</span>
              <span className="text-3xl font-black text-gray-900">Rs.{total.toFixed(2)}</span>
            </div>
          </div>

          <button
            onClick={handleCheckout}
            disabled={cart.length === 0}
            className={`w-full py-4 rounded-xl font-bold flex justify-center items-center gap-2 transition-all shadow-lg ${cart.length === 0 ? 'bg-gray-100 text-gray-400 cursor-not-allowed shadow-none' : 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-600/30 active:scale-[0.98]'}`}
          >
            {showSuccess ? <><CheckCircle size={20} /> Order Complete</> : <><CreditCard size={20} /> Pay Now</>}
          </button>
        </div>
      </div>
    </div>
  );
}
