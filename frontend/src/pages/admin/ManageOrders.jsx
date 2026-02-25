import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { ShoppingBag } from 'lucide-react';

const ManageOrders = () => {
    const [orders, setOrders] = useState([]);
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);

    const getHeaders = () => ({
        headers: { Authorization: `Bearer ${user?.token}` }
    });

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const { data } = await axios.get('/api/orders/all', getHeaders());
            setOrders(data);
        } catch (error) {
            console.error('Error fetching orders:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const handleStatusChange = async (id, status) => {
        try {
            await axios.put(`/api/orders/${id}/status`, { status }, getHeaders());
            fetchOrders();
        } catch (error) {
            console.error('Error updating order status:', error);
        }
    };

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2"><ShoppingBag className="text-red-500" /> Manage Orders</h2>

            <div className="grid gap-6">
                {loading ? (
                    <p>Loading...</p>
                ) : orders.length === 0 ? (
                    <p>No orders found.</p>
                ) : (
                    orders.map(order => (
                        <div key={order._id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                            <div className="flex justify-between items-start mb-4 border-b pb-4">
                                <div>
                                    <p className="text-sm text-gray-500">Order ID: {order._id}</p>
                                    <p className="font-bold text-gray-800">Customer: {order.userId?.name || 'Unknown'}</p>
                                    <p className="text-sm text-gray-600">Address: {order.deliveryAddress}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-xl font-bold text-red-600">₹{order.totalAmount}</p>
                                    <p className="text-sm font-medium bg-gray-100 inline-block px-2 py-1 rounded mt-1">{order.paymentMethod}</p>
                                </div>
                            </div>

                            <div className="mb-4">
                                <p className="font-semibold text-gray-700 mb-2">Items:</p>
                                <div className="space-y-2">
                                    {order.items.map(item => (
                                        <div key={item.foodId} className="flex justify-between text-sm">
                                            <span className="text-gray-600">{item.quantity}x {item.name}</span>
                                            <span className="text-gray-800 font-medium">₹{item.price * item.quantity}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="flex items-center justify-between mt-4 pt-4 border-t">
                                <span className="font-semibold text-gray-700">Update Status:</span>
                                <select
                                    value={order.status}
                                    onChange={(e) => handleStatusChange(order._id, e.target.value)}
                                    className="border border-gray-300 rounded-lg px-3 py-2 text-sm font-medium bg-gray-50 focus:outline-none focus:ring-2 focus:ring-red-500"
                                >
                                    <option value="Pending">Pending</option>
                                    <option value="Preparing">Preparing</option>
                                    <option value="Ready">Ready</option>
                                    <option value="Out for Delivery">Out for Delivery</option>
                                    <option value="Delivered">Delivered</option>
                                    <option value="Cancelled">Cancelled</option>
                                </select>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default ManageOrders;
