import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Home = () => {
    const [restaurants, setRestaurants] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRestaurants = async () => {
            try {
                const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
                const { data } = await axios.get(`${API_URL}/api/restaurants`);
                setRestaurants(data);
            } catch (error) {
                console.error('Error fetching restaurants', error);
            } finally {
                setLoading(false);
            }
        };
        fetchRestaurants();
    }, []);

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-center mb-12">
                <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
                    <span className="block xl:inline">Hungry? You're in the</span>{' '}
                    <span className="block text-red-600 xl:inline">right place.</span>
                </h1>
                <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
                    Order from the best local restaurants with easy, on-demand delivery.
                </p>
            </div>

            <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-2">Popular Restaurants</h2>

            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {[1, 2, 3, 4, 5, 6].map(i => (
                        <div key={i} className="animate-pulse bg-gray-200 h-64 rounded-xl"></div>
                    ))}
                </div>
            ) : restaurants.length === 0 ? (
                <p className="text-gray-500 text-center py-12 text-lg">No restaurants available right now. Check back later!</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {restaurants.map(restaurant => (
                        <Link to={`/restaurant/${restaurant._id}`} key={restaurant._id} className="group block bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 transform hover:-translate-y-1">
                            <div className="relative h-48 w-full bg-gray-100">
                                {restaurant.image ? (
                                    <img src={restaurant.image} alt={restaurant.name} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-red-600 text-4xl font-bold bg-red-50">
                                        {restaurant.name.charAt(0)}
                                    </div>
                                )}
                                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold shadow-sm">
                                    30-45 min
                                </div>
                            </div>
                            <div className="p-5">
                                <div className="flex justify-between items-start">
                                    <h3 className="text-xl font-bold text-gray-900 group-hover:text-red-600 transition-colors">
                                        {restaurant.name}
                                    </h3>
                                    <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded font-bold flex items-center gap-1">
                                        ★ 4.5
                                    </span>
                                </div>
                                <p className="mt-2 text-sm text-gray-500 line-clamp-2">{restaurant.description || 'Delicious food delivered hot and fresh.'}</p>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Home;
