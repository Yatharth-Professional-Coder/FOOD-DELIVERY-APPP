import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { Package, MapPin, CreditCard, Clock } from 'lucide-react';

const OrderHistory = () => {
    const [orders, setOrders] = useState([]);
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);

    const getHeaders = () => ({
        headers: { Authorization: `Bearer ${user?.token}` }
    });

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const { data } = await axios.get('/api/orders/user', getHeaders());
                setOrders(data);
            } catch (error) {
                console.error('Error fetching orders:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, []);

    const getStatusColor = (status) => {
        switch (status) {
            case 'Pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'Preparing': return 'bg-orange-100 text-orange-800 border-orange-200';
            case 'Ready': return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'Out for Delivery': return 'bg-purple-100 text-purple-800 border-purple-200';
            case 'Delivered': return 'bg-green-100 text-green-800 border-green-200';
            case 'Cancelled': return 'bg-red-100 text-red-800 border-red-200';
            default: return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'Pending': return '🕒';
            case 'Preparing': return '🍳';
            case 'Ready': return '🛍️';
            case 'Out for Delivery': return '🛵';
            case 'Delivered': return '✅';
            case 'Cancelled': return '❌';
            default: return '📦';
        }
    };

    if (loading) return <div className="p-8 text-center text-gray-500 font-medium">Loading your delicious history...</div>;

    return (
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 bg-gray-50 min-h-[calc(100vh-64px)]">
            <div className="mb-8 flex items-center gap-3">
                <div className="bg-red-100 p-3 rounded-full text-red-600">
                    <Package size={28} />
                </div>
                <h1 className="text-3xl font-extrabold text-gray-900">My Orders</h1>
            </div>

            {orders.length === 0 ? (
                <div className="bg-white p-10 rounded-2xl shadow-sm text-center border border-gray-100">
                    <div className="text-6xl mb-4">🍽️</div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">No orders yet</h2>
                    <p className="text-gray-500">You haven't placed any orders. Let's fix that!</p>
                </div>
            ) : (
                <div className="space-y-6">
                    {orders.map(order => (
                        <div key={order._id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
                            {/* Card Header */}
                            <div className="border-b border-gray-100 bg-gray-50/50 p-5 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                                <div className="flex items-center gap-3">
                                    <span className="text-2xl">{getStatusIcon(order.status)}</span>
                                    <div>
                                        <p className="text-sm font-semibold text-gray-500 font-mono tracking-wider">ORDER #{order._id.substring(order._id.length - 8).toUpperCase()}</p>
                                        <p className="text-xs text-gray-400 font-medium mt-1 flex items-center gap-1">
                                            <Clock size={12} /> {new Date(order.createdAt).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })}
                                        </p>
                                    </div>
                                </div>
                                <div className={`px-4 py-1.5 rounded-full border ${getStatusColor(order.status)} font-bold text-sm shadow-sm`}>
                                    {order.status}
                                </div>
                            </div>

                            {/* Card Body */}
                            <div className="p-5 sm:p-6 flex flex-col md:flex-row gap-8">
                                {/* Items List */}
                                <div className="flex-1 space-y-4">
                                    <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-2">Items Ordered</h3>
                                    <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 space-y-3">
                                        {order.items.map(item => (
                                            <div key={item.foodId} className="flex justify-between items-center bg-white p-3 rounded-lg shadow-sm border border-gray-50">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 bg-gray-100 border border-gray-200 rounded-md overflow-hidden shadow-inner flex-shrink-0">
                                                        {item.image ? (
                                                            <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                                        ) : (
                                                            <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">🍔</div>
                                                        )}
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-gray-900 text-sm">{item.name}</p>
                                                        <p className="text-xs text-gray-500 font-medium bg-gray-100 inline-block px-1.5 py-0.5 rounded mt-0.5">Qty: {item.quantity}</p>
                                                    </div>
                                                </div>
                                                <span className="font-extrabold text-gray-900">₹{item.price * item.quantity}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Order Meta */}
                                <div className="w-full md:w-64 space-y-6 md:border-l md:border-gray-100 md:pl-8">
                                    <div>
                                        <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-3 flex items-center gap-1">
                                            <MapPin size={16} className="text-red-500" /> Delivery
                                        </h3>
                                        <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg border border-gray-100">{order.deliveryAddress}</p>
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-3 flex items-center gap-1">
                                            <CreditCard size={16} className="text-blue-500" /> Payment
                                        </h3>
                                        <div className="flex justify-between items-center text-sm font-medium">
                                            <span className="text-gray-600">{order.paymentMethod}</span>
                                            <span className="bg-gray-100 text-gray-800 px-2 py-0.5 rounded text-xs border border-gray-200">Paid</span>
                                        </div>
                                    </div>
                                    <div className="pt-4 border-t border-gray-100">
                                        <div className="flex justify-between items-center">
                                            <span className="font-bold text-gray-600">Total</span>
                                            <span className="text-2xl font-extrabold text-red-600">₹{order.totalAmount + 40}</span>
                                        </div>
                                        <p className="text-xs text-gray-400 text-right mt-1">incl. ₹40 delivery</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default OrderHistory;
