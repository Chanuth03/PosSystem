import React from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db';
import { TrendingUp, AlertTriangle, DollarSign, PackageOpen, ShoppingCart } from 'lucide-react';

export default function Dashboard() {
  const sales = useLiveQuery(() => db.sales.toArray()) || [];
  const inventory = useLiveQuery(() => db.inventory.toArray()) || [];

  const todaySales = sales.filter(s => new Date(s.date).toDateString() === new Date().toDateString());
  const dailyRevenue = todaySales.reduce((acc, curr) => acc + curr.totalAmount, 0);

  const lowStockItems = inventory.filter(item => item.stockQty < 10);

  return (
    <div className="p-8 space-y-8 h-full">
      <header>
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Overview</h1>
        <p className="text-gray-500 mt-1">Here's what's happening today.</p>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Daily Revenue"
          value={`Rs.${dailyRevenue.toFixed(2)}`}
          icon={<DollarSign className="text-emerald-500" size={24} />}
          trend="+12.5%"
          trendUp={true}
          bg="bg-emerald-50"
        />
        <StatCard
          title="Total Sales (Today)"
          value={todaySales.length}
          icon={<TrendingUp className="text-blue-500" size={24} />}
          trend="+5.2%"
          trendUp={true}
          bg="bg-blue-50"
        />
        <StatCard
          title="Low Stock Items"
          value={lowStockItems.length}
          icon={<AlertTriangle className="text-amber-500" size={24} />}
          subtitle="Needs attention"
          bg="bg-amber-50"
        />
        <StatCard
          title="Total Inventory"
          value={inventory.reduce((acc, item) => acc + item.stockQty, 0)}
          icon={<PackageOpen className="text-indigo-500" size={24} />}
          bg="bg-indigo-50"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Low Stock Alerts */}
        <div className="col-span-1 lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
            <h2 className="text-lg font-bold text-gray-800">Low Stock Alerts</h2>
            <span className="bg-amber-100 text-amber-800 text-xs font-semibold px-2.5 py-1 rounded-full">
              {lowStockItems.length} items
            </span>
          </div>
          <div className="p-0">
            {lowStockItems.length > 0 ? (
              <ul className="divide-y divide-gray-100">
                {lowStockItems.slice(0, 5).map(item => (
                  <li key={item.id} className="p-4 hover:bg-slate-50 transition-colors flex justify-between items-center">
                    <div>
                      <p className="font-semibold text-gray-800">Product #{item.productId}</p>
                      <p className="text-sm text-gray-500">Size: {item.size} | Color: {item.color}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-amber-600 font-bold bg-amber-50 px-3 py-1 rounded-full text-sm">
                        {item.stockQty} left
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="p-8 text-center text-gray-500 flex flex-col items-center">
                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-3">
                  <PackageOpen opacity={0.5} />
                </div>
                <p>All stock levels are optimal</p>
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="col-span-1 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-bold text-gray-800 mb-4">Quick Actions</h2>
          <div className="space-y-3">
            <button className="w-full flex items-center gap-3 p-3 text-left rounded-xl hover:bg-blue-50 group transition-all text-blue-700 bg-blue-50/50 font-medium">
              <div className="bg-blue-100 p-2 rounded-lg group-hover:scale-110 transition-transform">
                <ShoppingCart size={18} />
              </div>
              New Sale
            </button>
            <button className="w-full flex items-center gap-3 p-3 text-left rounded-xl hover:bg-indigo-50 group transition-all text-indigo-700 bg-indigo-50/50 font-medium">
              <div className="bg-indigo-100 p-2 rounded-lg group-hover:scale-110 transition-transform">
                <PackageOpen size={18} />
              </div>
              Add Product
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, trend, trendUp, subtitle, bg }) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow relative overflow-hidden group">
      <div className={`absolute -right-6 -top-6 w-24 h-24 rounded-full ${bg} opacity-50 group-hover:scale-150 transition-transform duration-500`} />
      <div className="relative z-10 flex justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
          <h3 className="text-3xl font-extrabold text-gray-900">{value}</h3>

          {(trend || subtitle) && (
            <div className="mt-2 flex items-center gap-2">
              {trend && (
                <span className={`text-xs font-semibold px-2 py-1 rounded-md ${trendUp ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
                  {trend}
                </span>
              )}
              {subtitle && <span className="text-xs text-gray-500">{subtitle}</span>}
            </div>
          )}
        </div>
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${bg} shadow-sm`}>
          {icon}
        </div>
      </div>
    </div>
  );
}
