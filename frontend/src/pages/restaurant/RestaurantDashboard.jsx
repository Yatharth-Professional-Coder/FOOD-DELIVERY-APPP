import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import MenuManager from './MenuManager';
import RestaurantOrders from './RestaurantOrders';
import { LayoutDashboard, UtensilsCrossed, ClipboardList, ToggleLeft, ToggleRight } from 'lucide-react';

const RestaurantOverview = () => {
    const { user } = useAuth();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    const getHeaders = () => ({
        headers: { Authorization: `Bearer ${user?.token}` }
    });

    const fetchProfile = async () => {
        try {
            const { data } = await axios.get('/api/restaurants/my/profile', getHeaders());
            setProfile(data);
        } catch (error) {
            console.error('Error fetching profile:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProfile();
    }, []);

    const toggleStatus = async () => {
        if (!profile) return;
        try {
            await axios.put(`/api/restaurants/${profile._id}/status`, { isOnline: !profile.isOnline }, getHeaders());
            fetchProfile();
        } catch (error) {
            console.error('Error updating status:', error);
        }
    };

    const createProfile = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        try {
            await axios.post('/api/restaurants', {
                name: formData.get('name'),
                description: formData.get('description'),
                address: formData.get('address'),
                image: formData.get('image')
            }, {
                headers: {
                    Authorization: `Bearer ${user?.token}`
                }
            });
            fetchProfile();
        } catch (error) {
            alert(error.response?.data?.message || 'Error creating profile');
        }
    };

    if (loading) return <div>Loading...</div>;

    if (!profile) {
        return (
            <div className="p-6 max-w-2xl mx-auto">
                <h2 className="text-2xl font-bold mb-6">Create Your Restaurant Profile</h2>
                <form onSubmit={createProfile} className="bg-white p-6 rounded-xl shadow-sm border space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Restaurant Name</label>
                        <input type="text" name="name" required className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Description</label>
                        <textarea name="description" className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Address</label>
                        <input type="text" name="address" required className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Restaurant Image URL</label>
                        <input type="text" name="image" placeholder="https://res.cloudinary.com/.../image.jpg" className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm" />
                    </div>
                    <button type="submit" className="bg-red-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-700">Create Profile</button>
                </form>
            </div>
        );
    }

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Restaurant Dashboard</h2>
                <div className="flex items-center gap-4">
                    {!profile.isActive && (
                        <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium">Pending Admin Approval</span>
                    )}
                    <button
                        onClick={toggleStatus}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-white transition-colors ${profile.isOnline ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-500 hover:bg-gray-600'}`}
                    >
                        {profile.isOnline ? <ToggleRight size={20} /> : <ToggleLeft size={20} />}
                        {profile.isOnline ? 'Online - Accepting Orders' : 'Offline - Not Accepting Orders'}
                    </button>
                </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-6 flex items-start gap-6">
                <div className="w-32 h-32 bg-gray-100 rounded-xl overflow-hidden shadow-inner flex items-center justify-center text-4xl font-bold text-gray-400">
                    {profile.image ? <img src={profile.image} alt={profile.name} className="w-full h-full object-cover" /> : profile.name.charAt(0)}
                </div>
                <div>
                    <h3 className="text-2xl font-extrabold text-gray-900">{profile.name}</h3>
                    <p className="text-gray-500 mt-1">{profile.description}</p>
                    <p className="text-gray-700 font-medium mt-2">📍 {profile.address}</p>
                </div>
            </div>
        </div>
    );
};

const RestaurantDashboard = () => {
    const location = useLocation();

    const isActive = (path) => {
        return location.pathname === path ? 'bg-red-50 text-red-600' : 'text-gray-600 hover:bg-gray-50';
    };

    return (
        <div className="flex h-[calc(100vh-64px)] bg-gray-50">
            {/* Sidebar */}
            <div className="w-64 bg-white border-r border-gray-200 shadow-sm flex flex-col">
                <div className="p-4 border-b border-gray-100">
                    <h2 className="text-lg font-bold text-gray-800">Restaurant Portal</h2>
                </div>
                <nav className="flex-1 p-4 space-y-2">
                    <Link to="/restaurant-panel" className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${isActive('/restaurant-panel')}`}>
                        <LayoutDashboard size={20} /> Dashboard
                    </Link>
                    <Link to="/restaurant-panel/menu" className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${isActive('/restaurant-panel/menu')}`}>
                        <UtensilsCrossed size={20} /> Menu Items
                    </Link>
                    <Link to="/restaurant-panel/orders" className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${isActive('/restaurant-panel/orders')}`}>
                        <ClipboardList size={20} /> Orders
                    </Link>
                </nav>
            </div>

            {/* Main Content */}
            <div className="flex-1 overflow-auto">
                <Routes>
                    <Route path="/" element={<RestaurantOverview />} />
                    <Route path="/menu" element={<MenuManager />} />
                    <Route path="/orders" element={<RestaurantOrders />} />
                </Routes>
            </div>
        </div>
    );
};

export default RestaurantDashboard;
