import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { Check, X, Trash2, Edit, Plus } from 'lucide-react';

const ManageRestaurants = () => {
    const [restaurants, setRestaurants] = useState([]);
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);

    const getHeaders = () => ({
        headers: { Authorization: `Bearer ${user?.token}` }
    });

    const fetchRestaurants = async () => {
        try {
            setLoading(true);
            const { data } = await axios.get('/api/restaurants', getHeaders());
            setRestaurants(data);
        } catch (error) {
            console.error('Error fetching restaurants:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRestaurants();
    }, []);

    const handleApprove = async (id, isActive) => {
        try {
            await axios.put(`/api/restaurants/${id}/approve`, { isActive }, getHeaders());
            fetchRestaurants();
        } catch (error) {
            console.error('Error updating approval status:', error);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this restaurant?')) {
            try {
                await axios.delete(`/api/restaurants/${id}`, getHeaders());
                fetchRestaurants();
            } catch (error) {
                console.error('Error deleting restaurant:', error);
            }
        }
    };

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Manage Restaurants</h2>
                <button className="bg-red-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-red-700">
                    <Plus size={18} /> Add Restaurant
                </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-50 border-b border-gray-100">
                            <th className="p-4 font-semibold text-gray-600">Restaurant Info</th>
                            <th className="p-4 font-semibold text-gray-600">Address</th>
                            <th className="p-4 font-semibold text-gray-600">Owner</th>
                            <th className="p-4 font-semibold text-gray-600">Status</th>
                            <th className="p-4 font-semibold text-gray-600 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan="5" className="p-4 text-center">Loading...</td></tr>
                        ) : restaurants.length === 0 ? (
                            <tr><td colSpan="5" className="p-4 text-center">No restaurants found.</td></tr>
                        ) : (
                            restaurants.map(restaurant => (
                                <tr key={restaurant._id} className="border-b border-gray-50 hover:bg-gray-50/50">
                                    <td className="p-4 flex items-center gap-3">
                                        <div className="w-12 h-12 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                                            {restaurant.image ? (
                                                <img src={restaurant.image} alt={restaurant.name} className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full bg-red-100 text-red-500 flex items-center justify-center font-bold">{restaurant.name.charAt(0)}</div>
                                            )}
                                        </div>
                                        <div>
                                            <p className="font-bold text-gray-800">{restaurant.name}</p>
                                            <p className="text-xs text-gray-500 truncate w-32">{restaurant.description || 'No description'}</p>
                                        </div>
                                    </td>
                                    <td className="p-4 text-sm text-gray-600">{restaurant.address}</td>
                                    <td className="p-4 text-sm text-gray-600">{restaurant.userId?.name || 'Unknown'}</td>
                                    <td className="p-4">
                                        {restaurant.isActive ? (
                                            <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-semibold">Approved</span>
                                        ) : (
                                            <span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full text-xs font-semibold">Pending</span>
                                        )}
                                    </td>
                                    <td className="p-4 text-right flex justify-end gap-2">
                                        {restaurant.isActive ? (
                                            <button onClick={() => handleApprove(restaurant._id, false)} className="p-2 text-yellow-600 hover:bg-yellow-50 rounded-lg" title="Reject">
                                                <X size={18} />
                                            </button>
                                        ) : (
                                            <button onClick={() => handleApprove(restaurant._id, true)} className="p-2 text-green-600 hover:bg-green-50 rounded-lg" title="Approve">
                                                <Check size={18} />
                                            </button>
                                        )}
                                        <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg" title="Edit">
                                            <Edit size={18} />
                                        </button>
                                        <button onClick={() => handleDelete(restaurant._id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg" title="Delete">
                                            <Trash2 size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ManageRestaurants;
