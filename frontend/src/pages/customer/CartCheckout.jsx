import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { Trash2, ArrowRight } from 'lucide-react';

const CartCheckout = () => {
    const { cart, removeFromCart, fetchCart, loading } = useCart();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [address, setAddress] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('COD');
    const [placingOrder, setPlacingOrder] = useState(false);

    const getHeaders = () => ({
        headers: { Authorization: `Bearer ${user?.token}` }
    });

    const handlePlaceOrder = async (e) => {
        e.preventDefault();
        if (!cart?.items?.length) return alert('Cart is empty');
        if (!address) return alert('Please enter delivery address');

        try {
            setPlacingOrder(true);
            const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
            await axios.post(`${API_URL}/api/orders`, {
                deliveryAddress: address,
                paymentMethod
            }, getHeaders());

            // Clear cart context
            await fetchCart();
            alert('Order placed successfully!');
            navigate('/orders');
        } catch (error) {
            alert(error.response?.data?.message || 'Error placing order');
        } finally {
            setPlacingOrder(false);
        }
    };

    if (loading) return <div className="p-8 text-center text-gray-500 font-medium">Loading your cart...</div>;

    if (!cart || !cart.items || cart.items.length === 0) {
        return (
            <div className="min-h-[calc(100vh-64px)] flex flex-col items-center justify-center bg-gray-50 p-6">
                <div className="bg-white p-8 rounded-2xl shadow-sm text-center max-w-md w-full border border-gray-100">
                    <div className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
                        <span className="text-4xl">🛒</span>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
                    <p className="text-gray-500 mb-8">Looks like you haven't added any delicious food yet.</p>
                    <Link to="/" className="inline-block bg-red-600 text-white font-bold py-3 px-8 rounded-full hover:bg-red-700 transition shadow-md hover:shadow-lg">
                        Browse Restaurants
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 bg-gray-50 min-h-[calc(100vh-64px)]">
            <h1 className="text-3xl font-extrabold text-gray-900 mb-8">Checkout</h1>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Cart Items */}
                <div className="lg:col-span-7">
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="p-6 border-b border-gray-100 bg-gray-50/50">
                            <h2 className="text-xl font-bold text-gray-800">Order Summary</h2>
                        </div>
                        <div className="p-6 space-y-6">
                            {cart.items.map((item) => (
                                <div key={item.foodId._id} className="flex justify-between items-center bg-gray-50 p-4 rounded-xl border border-gray-100">
                                    <div className="flex items-center gap-4">
                                        <div className="w-16 h-16 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0 shadow-sm">
                                            {item.foodId.image ? (
                                                <img src={item.foodId.image} alt={item.foodId.name} className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-xl">🍔</div>
                                            )}
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-gray-900 text-lg">{item.foodId.name}</h3>
                                            <p className="text-sm text-gray-500">₹{item.foodId.price} x {item.quantity}</p>
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-end gap-3">
                                        <span className="font-extrabold text-gray-900 text-lg">₹{item.foodId.price * item.quantity}</span>
                                        <button
                                            onClick={() => removeFromCart(item.foodId._id)}
                                            className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-full transition-colors flex items-center gap-1 text-sm font-medium"
                                        >
                                            <Trash2 size={16} /> <span>Remove</span>
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Price Details */}
                        <div className="p-6 bg-gray-50/50 border-t border-gray-100">
                            <div className="flex justify-between items-center text-gray-600 mb-2 font-medium">
                                <span>Subtotal</span>
                                <span>₹{cart.totalAmount}</span>
                            </div>
                            <div className="flex justify-between items-center text-gray-600 mb-4 font-medium">
                                <span>Delivery Fee</span>
                                <span>₹40</span>
                            </div>
                            <div className="flex justify-between items-center text-xl font-extrabold text-gray-900 pt-4 border-t border-gray-200">
                                <span>Total</span>
                                <span className="text-red-600">₹{cart.totalAmount + 40}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Checkout Form */}
                <div className="lg:col-span-5">
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-24">
                        <h2 className="text-xl font-bold text-gray-800 mb-6">Delivery Details</h2>

                        <form onSubmit={handlePlaceOrder} className="space-y-6">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Delivery Address</label>
                                <textarea
                                    required
                                    rows="3"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-shadow resize-none"
                                    placeholder="Enter your full apartment, street, and landmark..."
                                    value={address}
                                    onChange={(e) => setAddress(e.target.value)}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Payment Method</label>
                                <div className="grid grid-cols-2 gap-4">
                                    <button
                                        type="button"
                                        onClick={() => setPaymentMethod('COD')}
                                        className={`py-3 px-4 rounded-xl border-2 font-bold transition-all ${paymentMethod === 'COD' ? 'border-red-500 bg-red-50 text-red-700' : 'border-gray-200 text-gray-600 hover:border-gray-300'}`}
                                    >
                                        Cash on Delivery
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setPaymentMethod('Online')}
                                        className={`py-3 px-4 rounded-xl border-2 font-bold transition-all ${paymentMethod === 'Online' ? 'border-red-500 bg-red-50 text-red-700' : 'border-gray-200 text-gray-600 hover:border-gray-300'}`}
                                    >
                                        Online (Mock)
                                    </button>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={placingOrder}
                                className="w-full bg-red-600 text-white font-extrabold py-4 px-6 rounded-xl hover:bg-red-700 focus:outline-none focus:ring-4 focus:ring-red-300 transition-all flex justify-center items-center gap-2 group disabled:opacity-70 disabled:cursor-not-allowed shadow-md hover:shadow-xl transform hover:-translate-y-0.5"
                            >
                                {placingOrder ? 'Processing Order...' : `Pay ₹${cart.totalAmount + 40} securely`}
                                {!placingOrder && <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CartCheckout;
