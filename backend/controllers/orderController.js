const Order = require('../models/Order');
const Cart = require('../models/Cart');
const FoodItem = require('../models/FoodItem');

// @desc    Create new order
// @route   POST /api/orders
// @access  User
const createOrder = async (req, res) => {
    try {
        const { deliveryAddress, paymentMethod } = req.body;

        const cart = await Cart.findOne({ userId: req.user._id }).populate('items.foodId');

        if (!cart || cart.items.length === 0) {
            return res.status(400).json({ message: 'No order items' });
        }

        // Determine restaurantId (assuming all items from same restaurant)
        if (!cart.items[0].foodId) {
            return res.status(400).json({ message: 'Invalid items in cart' });
        }

        const restaurantId = cart.items[0].foodId.restaurantId;

        const orderItems = cart.items.map(item => ({
            foodId: item.foodId._id,
            name: item.foodId.name,
            price: item.foodId.price,
            quantity: item.quantity,
            image: item.foodId.image
        }));

        const order = new Order({
            userId: req.user._id,
            restaurantId,
            items: orderItems,
            totalAmount: cart.totalAmount,
            deliveryAddress,
            paymentMethod
        });

        const createdOrder = await order.save();

        // Clear cart after order is placed
        await Cart.findOneAndDelete({ userId: req.user._id });

        res.status(201).json(createdOrder);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get logged in user orders
// @route   GET /api/orders/user
// @access  User
const getUserOrders = async (req, res) => {
    try {
        const orders = await Order.find({ userId: req.user._id }).sort({ createdAt: -1 });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all orders (Admin/Restaurant)
// @route   GET /api/orders/all
// @access  Admin/Restaurant
const getAllOrders = async (req, res) => {
    try {
        if (req.user.role === 'admin') {
            const orders = await Order.find({}).populate('userId', 'name email').sort({ createdAt: -1 });
            return res.json(orders);
        }

        // If restaurant, get orders only for their restaurant
        if (req.user.role === 'restaurant') {
            const restaurant = await require('../models/Restaurant').findOne({ userId: req.user._id });
            if (!restaurant) {
                return res.status(404).json({ message: 'Restaurant profile not found' });
            }
            const orders = await Order.find({ restaurantId: restaurant._id }).populate('userId', 'name email').sort({ createdAt: -1 });
            return res.json(orders);
        }

        res.status(401).json({ message: 'Not authorized' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Admin/Restaurant
const updateOrderStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        if (req.user.role === 'restaurant') {
            const restaurant = await require('../models/Restaurant').findOne({ userId: req.user._id });
            if (!restaurant || order.restaurantId.toString() !== restaurant._id.toString()) {
                return res.status(401).json({ message: 'Not authorized for this order' });
            }
        }

        order.status = status;
        const updatedOrder = await order.save();

        res.json(updatedOrder);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createOrder,
    getUserOrders,
    getAllOrders,
    updateOrderStatus
};
