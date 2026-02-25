import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { Plus, Trash2, Edit, ToggleLeft, ToggleRight } from 'lucide-react';

const MenuManager = () => {
    const [foods, setFoods] = useState([]);
    const [profile, setProfile] = useState(null);
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentFood, setCurrentFood] = useState(null);

    const openModal = (food = null) => {
        setCurrentFood(food);
        setIsModalOpen(true);
    };

    const getHeaders = () => ({
        headers: { Authorization: `Bearer ${user?.token}` }
    });

    const fetchData = async () => {
        try {
            setLoading(true);
            const resProfile = await axios.get('/api/restaurants/my/profile', getHeaders());
            setProfile(resProfile.data);

            if (resProfile.data) {
                const resFoods = await axios.get(`/api/foods/${resProfile.data._id}`);
                setFoods(resFoods.data);
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

    const handleAddOrEditFood = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const payload = {
            name: formData.get('name'),
            category: formData.get('category'),
            price: formData.get('price'),
            image: formData.get('image')
        };
        try {
            if (currentFood) {
                // Edit
                await axios.put(`/api/foods/${currentFood._id}`, payload, {
                    headers: { Authorization: `Bearer ${user?.token}` }
                });
            } else {
                // Add
                await axios.post(`/api/foods/${profile._id}`, payload, {
                    headers: { Authorization: `Bearer ${user?.token}` }
                });
            }
            setIsModalOpen(false);
            setCurrentFood(null);
            fetchData();
        } catch (error) {
            alert(error.response?.data?.message || 'Error saving food item');
        }
    };

    const toggleAvailability = async (id, currentStatus) => {
        try {
            await axios.put(`/api/foods/${id}`, { isAvailable: !currentStatus }, getHeaders());
            fetchData();
        } catch (error) {
            console.error('Error updating availability:', error);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this item?')) {
            try {
                await axios.delete(`/api/foods/${id}`, getHeaders());
                fetchData();
            } catch (error) {
                console.error('Error deleting food:', error);
            }
        }
    };

    if (!profile) return <div className="p-6">Please create a restaurant profile first from the Dashboard.</div>;

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Menu Manager</h2>
                <button
                    onClick={() => openModal()}
                    className="bg-red-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-red-700"
                >
                    <Plus size={18} /> Add Menu Item
                </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-50 border-b border-gray-100">
                            <th className="p-4 font-semibold text-gray-600">Item Name</th>
                            <th className="p-4 font-semibold text-gray-600">Category</th>
                            <th className="p-4 font-semibold text-gray-600">Price</th>
                            <th className="p-4 font-semibold text-gray-600 border-x">Availability</th>
                            <th className="p-4 font-semibold text-gray-600 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan="5" className="p-4 text-center">Loading...</td></tr>
                        ) : foods.length === 0 ? (
                            <tr><td colSpan="5" className="p-4 text-center">No items found.</td></tr>
                        ) : (
                            foods.map(food => (
                                <tr key={food._id} className="border-b border-gray-50 hover:bg-gray-50/50">
                                    <td className="p-4 flex items-center gap-3">
                                        <div className="w-12 h-12 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                                            {food.image ? (
                                                <img src={food.image} alt={food.name} className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full bg-red-100 text-red-500 flex items-center justify-center font-bold">🍔</div>
                                            )}
                                        </div>
                                        <span className="font-bold text-gray-800">{food.name}</span>
                                    </td>
                                    <td className="p-4 text-sm text-gray-600">{food.category}</td>
                                    <td className="p-4 text-sm font-bold text-red-600">₹{food.price}</td>
                                    <td className="p-4 border-x text-center">
                                        <button
                                            onClick={() => toggleAvailability(food._id, food.isAvailable)}
                                            className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold ${food.isAvailable ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}
                                        >
                                            {food.isAvailable ? <ToggleRight size={16} /> : <ToggleLeft size={16} />}
                                            {food.isAvailable ? 'Available' : 'Out of Stock'}
                                        </button>
                                    </td>
                                    <td className="p-4 text-right flex justify-end gap-2">
                                        <button onClick={() => openModal(food)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg" title="Edit">
                                            <Edit size={18} />
                                        </button>
                                        <button onClick={() => handleDelete(food._id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg" title="Delete">
                                            <Trash2 size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 w-full max-w-md">
                        <h3 className="text-xl font-bold mb-4">{currentFood ? 'Edit Menu Item' : 'Add Menu Item'}</h3>
                        <form onSubmit={handleAddOrEditFood} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Item Name</label>
                                <input type="text" name="name" defaultValue={currentFood?.name || ''} required className="mt-1 block w-full px-3 py-2 border rounded-md" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Category</label>
                                <input type="text" name="category" defaultValue={currentFood?.category || ''} required className="mt-1 block w-full px-3 py-2 border rounded-md" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Price (₹)</label>
                                <input type="number" name="price" defaultValue={currentFood?.price || ''} required min="0" className="mt-1 block w-full px-3 py-2 border rounded-md" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Image URL</label>
                                <input type="text" name="image" defaultValue={currentFood?.image || ''} placeholder="https://res.cloudinary.com/.../image.jpg" className="mt-1 block w-full px-3 py-2 border rounded-md" />
                            </div>
                            <div className="flex gap-4 mt-6">
                                <button type="button" onClick={() => { setIsModalOpen(false); setCurrentFood(null); }} className="flex-1 bg-gray-100 px-4 py-2 rounded-lg font-medium hover:bg-gray-200">Cancel</button>
                                <button type="submit" className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-700">{currentFood ? 'Update Item' : 'Add Item'}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MenuManager;
