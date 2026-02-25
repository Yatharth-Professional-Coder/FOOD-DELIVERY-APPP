import React from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import ManageRestaurants from './ManageRestaurants';
import ManageOrders from './ManageOrders';
import { LayoutDashboard, Store, ShoppingCart } from 'lucide-react';

const AdminOverview = () => (
    <div className="p-6">
        <h2 className="text-2xl font-bold mb-4">Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
                <Store className="text-red-500" size={32} />
                <div>
                    <p className="text-gray-500 text-sm font-medium">Total Restaurants</p>
                    <p className="text-2xl font-bold">-</p>
                </div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
                <ShoppingCart className="text-blue-500" size={32} />
                <div>
                    <p className="text-gray-500 text-sm font-medium">Total Orders</p>
                    <p className="text-2xl font-bold">-</p>
                </div>
            </div>
        </div>
    </div>
);

const AdminDashboard = () => {
    const location = useLocation();

    const isActive = (path) => {
        return location.pathname === path ? 'bg-red-50 text-red-600' : 'text-gray-600 hover:bg-gray-50';
    };

    return (
        <div className="flex h-[calc(100vh-64px)] bg-gray-50">
            {/* Sidebar */}
            <div className="w-64 bg-white border-r border-gray-200 shadow-sm flex flex-col">
                <div className="p-4 border-b border-gray-100">
                    <h2 className="text-lg font-bold text-gray-800">Admin Panel</h2>
                </div>
                <nav className="flex-1 p-4 space-y-2">
                    <Link to="/admin" className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${isActive('/admin')}`}>
                        <LayoutDashboard size={20} /> Dashboard
                    </Link>
                    <Link to="/admin/restaurants" className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${isActive('/admin/restaurants')}`}>
                        <Store size={20} /> Restaurants
                    </Link>
                    <Link to="/admin/orders" className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${isActive('/admin/orders')}`}>
                        <ShoppingCart size={20} /> Orders
                    </Link>
                </nav>
            </div>

            {/* Main Content */}
            <div className="flex-1 overflow-auto">
                <Routes>
                    <Route path="/" element={<AdminOverview />} />
                    <Route path="/restaurants" element={<ManageRestaurants />} />
                    <Route path="/orders" element={<ManageOrders />} />
                </Routes>
            </div>
        </div>
    );
};

export default AdminDashboard;
