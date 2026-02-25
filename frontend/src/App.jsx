import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import axios from 'axios';

// Set global base URL for axios
axios.defaults.baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import Navbar from './components/Navbar';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import AdminDashboard from './pages/admin/AdminDashboard';
import RestaurantDashboard from './pages/restaurant/RestaurantDashboard';
import Home from './pages/customer/Home';
import RestaurantDetails from './pages/customer/RestaurantDetails';
import CartCheckout from './pages/customer/CartCheckout';
import OrderHistory from './pages/customer/OrderHistory';

const ProtectedRoute = ({ children, roles }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/" />;
  return children;
};

const AppRoutes = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/restaurant/:id" element={<RestaurantDetails />} />

          {/* Customer Protected Routes */}
          <Route path="/cart" element={<ProtectedRoute roles={['user']}><CartCheckout /></ProtectedRoute>} />
          <Route path="/orders" element={<ProtectedRoute roles={['user']}><OrderHistory /></ProtectedRoute>} />

          {/* Admin Protected Routes */}
          <Route path="/admin/*" element={
            <ProtectedRoute roles={['admin']}>
              <AdminDashboard />
            </ProtectedRoute>
          } />

          {/* Restaurant Protected Routes */}
          <Route path="/restaurant-panel/*" element={
            <ProtectedRoute roles={['restaurant']}>
              <RestaurantDashboard />
            </ProtectedRoute>
          } />
        </Routes>
      </main>
    </div>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <AppRoutes />
        </Router>
      </CartProvider>
    </AuthProvider>
  );
};

export default App;
