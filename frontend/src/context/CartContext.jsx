import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState(null);
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);

    const getAuthHeaders = () => {
        return {
            headers: {
                Authorization: `Bearer ${user?.token}`
            }
        };
    };

    const fetchCart = async () => {
        if (!user) {
            setCart(null);
            return;
        }

        try {
            setLoading(true);
            const { data } = await axios.get('/api/cart', getAuthHeaders());
            setCart(data);
        } catch (error) {
            console.error('Fetch cart error', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCart();
    }, [user]);

    const addToCart = async (foodId, quantity = 1) => {
        if (!user) return alert('Please login first');
        try {
            const { data } = await axios.post('/api/cart/add', { foodId, quantity }, getAuthHeaders());
            setCart(data);
        } catch (error) {
            console.error('Add to cart error', error);
        }
    };

    const removeFromCart = async (foodId) => {
        try {
            const { data } = await axios.delete(`/api/cart/remove/${foodId}`, getAuthHeaders());
            setCart(data);
        } catch (error) {
            console.error('Remove from cart error', error);
        }
    };

    const clearCart = () => {
        setCart(null);
    };

    return (
        <CartContext.Provider value={{ cart, fetchCart, addToCart, removeFromCart, clearCart, loading }}>
            {children}
        </CartContext.Provider>
    );
};
