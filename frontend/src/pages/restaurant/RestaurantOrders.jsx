import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { ClipboardList } from 'lucide-react';

const RestaurantOrders = () => {
    const [orders, setOrders] = useState([]);
    const [profile, setProfile] = useState(null);
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);

    const getHeaders = () => ({
        headers: { Authorization: `Bearer ${user?.token}` }
    });

    const fetchData = async () => {
        try {
            setLoading(true);
            const resProfile = await axios.get('/api/restaurants/my/profile', getHeaders());
            setProfile(resProfile.data);

            if (resProfile.data) {
                const resOrders = await axios.get(`/api/orders/all`, getHeaders());
                setOrders(resOrders.data);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleStatusChange = async (id, status) => {
        try {
            await axios.put(`/api/orders/${id}/status`, { status }, getHeaders());
            fetchData();
        } catch (error) {
            console.error('Error updating order status:', error);
        }
    };

    if (!profile) return <div className="p-6">Please create a restaurant profile first from the Dashboard.</div>;

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2"><ClipboardList className="text-red-500" /> Incoming Orders</h2>

            <div className="grid gap-6">
                {loading ? (
                    <p>Loading...</p>
                ) : orders.length === 0 ? (
                    <p>No orders to show.</p>
                ) : (
                    orders.map(order => (
                        <div key={order._id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                            <div className="flex justify-between items-start mb-4 border-b pb-4">
                                <div>
                                    <p className="text-sm text-gray-500 font-mono">#{order._id}</p>
                                    <p className="font-bold text-gray-800 text-lg mt-1">{order.userId?.name || 'Customer'}</p>
                                    <p className="text-sm text-gray-600 flex items-center gap-1 mt-1">📍 {order.deliveryAddress}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-2xl font-extrabold text-red-600">₹{order.totalAmount}</p>
                                    <p className="text-sm font-medium bg-gray-100 inline-block px-2 py-1 rounded mt-2">{order.paymentMethod}</p>
                                </div>
                            </div>

                            <div className="mb-4 bg-gray-50 p-4 rounded-lg">
                                <p className="font-semibold text-gray-700 mb-3 text-sm uppercase tracking-wider">Order Items</p>
                                <div className="space-y-3">
                                    {order.items.map(item => (
                                        <div key={item.foodId} className="flex justify-between items-center text-sm">
                                            <div className="flex items-center gap-3">
                                                <span className="bg-red-100 text-red-700 font-bold px-2 py-1 rounded w-8 text-center">{item.quantity}x</span>
                                                <span className="font-medium text-gray-800">{item.name}</span>
                                            </div>
                                            <span className="text-gray-800 font-bold">₹{item.price * item.quantity}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="flex items-center justify-between mt-4 pt-4 border-t">
                                <span className="font-semibold text-gray-700">Order Status:</span>
                                <select
                                    value={order.status}
                                    onChange={(e) => handleStatusChange(order._id, e.target.value)}
                                    className="border-2 border-red-200 rounded-lg px-4 py-2 text-sm font-bold text-red-700 bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors"
                                >
                                    <option value="Pending">🕒 Pending</option>
                                    <option value="Preparing">🍳 Preparing</option>
                                    <option value="Ready">🛍️ Ready</option>
                                    <option value="Out for Delivery">🛵 Out for Delivery</option>
                                    <option value="Delivered">✅ Delivered</option>
                                    <option value="Cancelled">❌ Cancelled</option>
                                </select>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default RestaurantOrders;
