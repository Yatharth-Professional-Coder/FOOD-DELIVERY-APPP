const FoodItem = require('../models/FoodItem');
const Restaurant = require('../models/Restaurant');

// @desc    Add fresh food item
// @route   POST /api/foods/:restaurantId
// @access  Restaurant/Admin
const createFoodItem = async (req, res) => {
    try {
        const restaurant = await Restaurant.findById(req.params.restaurantId);

        if (!restaurant) {
            return res.status(404).json({ message: 'Restaurant not found' });
        }

        // Authorization
        if (restaurant.userId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(401).json({ message: 'Not authorized' });
        }

        const { name, price, category, isAvailable } = req.body;

        const foodItem = new FoodItem({
            restaurantId: req.params.restaurantId,
            name,
            price,
            category,
            isAvailable: isAvailable !== undefined ? isAvailable : true,
            image: req.file ? req.file.path : ''
        });

        const createdFood = await foodItem.save();
        res.status(201).json(createdFood);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all food for a specific restaurant
// @route   GET /api/foods/:restaurantId
// @access  Public
const getFoodsByRestaurant = async (req, res) => {
    try {
        const foods = await FoodItem.find({ restaurantId: req.params.restaurantId });
        res.json(foods);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update a food item
// @route   PUT /api/foods/:id
// @access  Restaurant/Admin
const updateFoodItem = async (req, res) => {
    try {
        const foodItem = await FoodItem.findById(req.params.id);
        if (!foodItem) {
            return res.status(404).json({ message: 'Food item not found' });
        }

        const restaurant = await Restaurant.findById(foodItem.restaurantId);
        if (restaurant.userId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(401).json({ message: 'Not authorized' });
        }

        const { name, price, category, isAvailable } = req.body;

        foodItem.name = name || foodItem.name;
        foodItem.price = price || foodItem.price;
        foodItem.category = category || foodItem.category;
        foodItem.isAvailable = isAvailable !== undefined ? isAvailable : foodItem.isAvailable;

        if (req.file) {
            foodItem.image = req.file.path;
        }

        const updatedFood = await foodItem.save();
        res.json(updatedFood);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete a food item
// @route   DELETE /api/foods/:id
// @access  Restaurant/Admin
const deleteFoodItem = async (req, res) => {
    try {
        const foodItem = await FoodItem.findById(req.params.id);
        if (!foodItem) {
            return res.status(404).json({ message: 'Food item not found' });
        }

        const restaurant = await Restaurant.findById(foodItem.restaurantId);
        if (restaurant.userId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(401).json({ message: 'Not authorized' });
        }

        await foodItem.deleteOne();
        res.json({ message: 'Food removed' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createFoodItem,
    getFoodsByRestaurant,
    updateFoodItem,
    deleteFoodItem
};
