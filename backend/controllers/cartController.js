const Cart = require('../models/Cart');
const FoodItem = require('../models/FoodItem');

// @desc    Add item to cart
// @route   POST /api/cart/add
// @access  User (Customer)
const addToCart = async (req, res) => {
    try {
        const { foodId, quantity } = req.body;

        const food = await FoodItem.findById(foodId);
        if (!food) {
            return res.status(404).json({ message: 'Food item not found' });
        }

        let cart = await Cart.findOne({ userId: req.user._id });

        if (!cart) {
            // Create new cart
            cart = new Cart({
                userId: req.user._id,
                items: [{ foodId, quantity }],
                totalAmount: food.price * quantity
            });
        } else {
            // Check if food item already in cart
            const itemIndex = cart.items.findIndex(item => item.foodId.toString() === foodId);

            if (itemIndex > -1) {
                // Increment quantity
                cart.items[itemIndex].quantity += quantity;
            } else {
                // Add new item
                cart.items.push({ foodId, quantity });
            }

            // Recalculate total amount
            let totalAmount = 0;
            for (const item of cart.items) {
                const foodItem = await FoodItem.findById(item.foodId);
                if (foodItem) {
                    totalAmount += foodItem.price * item.quantity;
                }
            }
            cart.totalAmount = totalAmount;
        }

        await cart.save();
        res.status(200).json(cart);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get user cart
// @route   GET /api/cart
// @access  User (Customer)
const getCart = async (req, res) => {
    try {
        const cart = await Cart.findOne({ userId: req.user._id }).populate('items.foodId');
        if (!cart) {
            return res.status(200).json({ items: [], totalAmount: 0 });
        }
        res.json(cart);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Remove item from cart
// @route   DELETE /api/cart/remove/:foodId
// @access  User (Customer)
const removeFromCart = async (req, res) => {
    try {
        const cart = await Cart.findOne({ userId: req.user._id });

        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        cart.items = cart.items.filter(item => item.foodId.toString() !== req.params.foodId);

        // Recalculate total
        let totalAmount = 0;
        for (const item of cart.items) {
            const foodItem = await FoodItem.findById(item.foodId);
            if (foodItem) {
                totalAmount += foodItem.price * item.quantity;
            }
        }
        cart.totalAmount = totalAmount;

        await cart.save();
        res.json(cart);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { addToCart, getCart, removeFromCart };
