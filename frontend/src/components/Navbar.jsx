import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShoppingBag, LogOut, User, Menu } from 'lucide-react';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="bg-red-600 text-white shadow-md sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16 items-center">
                    <div className="flex items-center">
                        <Link to="/" className="text-2xl font-extrabold tracking-tight flex items-center gap-2">
                            <span className="bg-white text-red-600 p-1 rounded-md"><Menu size={20} /></span>
                            ZomatoClone
                        </Link>
                    </div>

                    <div className="flex items-center space-x-6">
                        {!user ? (
                            <>
                                <Link to="/login" className="hover:text-red-200 transition-colors font-medium">Login</Link>
                                <Link to="/register" className="bg-white text-red-600 px-4 py-2 rounded-lg font-semibold hover:bg-red-50 transition-colors">Sign up</Link>
                            </>
                        ) : (
                            <>
                                {user.role === 'admin' && (
                                    <Link to="/admin" className="hover:text-red-200 transition-colors font-medium">Admin Panel</Link>
                                )}
                                {user.role === 'restaurant' && (
                                    <Link to="/restaurant-panel" className="hover:text-red-200 transition-colors font-medium">Restaurant Dashboard</Link>
                                )}
                                {user.role === 'user' && (
                                    <Link to="/cart" className="flex items-center gap-1 hover:text-red-200 transition-colors">
                                        <ShoppingBag size={20} /> Cart
                                    </Link>
                                )}

                                <div className="flex items-center gap-4 bg-red-700 px-4 py-2 rounded-lg">
                                    <div className="flex items-center gap-2">
                                        <User size={18} />
                                        <span className="font-medium hidden sm:block">{user.name}</span>
                                    </div>
                                    <button
                                        onClick={handleLogout}
                                        className="text-red-200 hover:text-white transition-colors"
                                    >
                                        <LogOut size={18} />
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
