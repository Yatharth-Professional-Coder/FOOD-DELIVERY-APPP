import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../../context/CartContext';
import { ShoppingBag, ArrowLeft } from 'lucide-react';

const RestaurantDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [restaurant, setRestaurant] = useState(null);
    const [foods, setFoods] = useState([]);
    const [loading, setLoading] = useState(true);
    const { addToCart, cart } = useCart();
    const [addingToCartId, setAddingToCartId] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
                const resRest = await axios.get(`${API_URL}/api/restaurants/${id}`);
                setRestaurant(resRest.data);

                const resFoods = await axios.get(`${API_URL}/api/foods/${id}`);
                setFoods(resFoods.data);
            } catch (error) {
                console.error('Error fetching data', error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id]);

    const handleAddToCart = async (foodId) => {
        setAddingToCartId(foodId);
        await addToCart(foodId, 1);
        setAddingToCartId(null);
    };

    if (loading) return <div className="p-8 text-center text-gray-500">Loading deliciousness...</div>;
    if (!restaurant) return <div className="p-8 text-center text-red-500">Restaurant not found.</div>;

    const totalCartItems = cart?.items?.reduce((acc, item) => acc + item.quantity, 0) || 0;

    return (
        <div className="bg-gray-50 min-h-[calc(100vh-64px)] pb-24">
            {/* Header Banner */}
            <div className="bg-white border-b shadow-sm relative sticky top-16 z-10 p-4">
                <div className="max-w-5xl mx-auto flex items-center justify-between">
                    <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-600 hover:text-red-600 transition">
                        <ArrowLeft size={20} /> Back
                    </button>
                    <h1 className="text-xl font-bold truncate px-4">{restaurant.name}</h1>
                    <button onClick={() => navigate('/cart')} className="relative bg-red-50 p-2 rounded-full text-red-600 hover:bg-red-100 transition">
                        <ShoppingBag size={24} />
                        {totalCartItems > 0 && (
                            <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full font-bold">
                                {totalCartItems}
                            </span>
                        )}
                    </button>
                </div>
            </div>

            <div className="max-w-5xl mx-auto px-4 mt-8">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-8 flex flex-col md:flex-row">
                    <div className="md:w-1/3 h-48 md:h-auto bg-gray-200">
                        {restaurant.image ? (
                            <img src={restaurant.image} alt={restaurant.name} className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full bg-red-100 text-red-500 flex items-center justify-center font-bold text-4xl">{restaurant.name.charAt(0)}</div>
                        )}
                    </div>
                    <div className="p-6 md:w-2/3 flex flex-col justify-center">
                        <h2 className="text-3xl font-extrabold text-gray-900 mb-2">{restaurant.name}</h2>
                        <p className="text-gray-600 text-lg mb-4">{restaurant.description}</p>
                        <div className="flex gap-4 text-sm text-gray-500">
                            <span className="bg-gray-100 px-3 py-1 rounded-full">📍 {restaurant.address}</span>
                            <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full font-semibold">Open Now</span>
                        </div>
                    </div>
                </div>

                <h3 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-2">Menu</h3>

                {foods.length === 0 ? (
                    <p className="text-gray-500 text-center py-8">This restaurant hasn't added any menu items yet.</p>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {foods.map(food => (
                            <div key={food._id} className={`bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex gap-4 transition-all ${!food.isAvailable ? 'opacity-60 grayscale' : 'hover:shadow-md'}`}>
                                <div className="w-24 h-24 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                                    {food.image ? (
                                        <img src={food.image} alt={food.name} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-2xl">🍔</div>
                                    )}
                                </div>
                                <div className="flex-1 flex flex-col justify-between">
                                    <div>
                                        <div className="flex justify-between items-start">
                                            <h4 className="font-bold text-lg text-gray-900 line-clamp-1">{food.name}</h4>
                                        </div>
                                        <p className="text-sm text-gray-500 mt-1">{food.category}</p>
                                    </div>
                                    <div className="flex justify-between items-end mt-2">
                                        <span className="font-extrabold text-gray-800 text-lg">₹{food.price}</span>
                                        {food.isAvailable ? (
                                            <button
                                                onClick={() => handleAddToCart(food._id)}
                                                disabled={addingToCartId === food._id}
                                                className="bg-white border-2 border-red-200 text-red-600 px-4 py-1.5 rounded-lg text-sm font-bold hover:bg-red-50 hover:border-red-300 transition-colors disabled:opacity-50"
                                            >
                                                {addingToCartId === food._id ? 'Adding...' : 'ADD +'}
                                            </button>
                                        ) : (
                                            <span className="text-sm font-bold text-red-500 bg-red-50 px-3 py-1 rounded">Out of Stock</span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default RestaurantDetails;
