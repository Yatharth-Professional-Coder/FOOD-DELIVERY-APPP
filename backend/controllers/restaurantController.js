const Restaurant = require('../models/Restaurant');

// @desc    Create a new restaurant profile
// @route   POST /api/restaurants
// @access  Restaurant/Admin
const createRestaurant = async (req, res) => {
    try {
        const { name, description, address, image } = req.body;

        // Check if user already has a restaurant
        const existing = await Restaurant.findOne({ userId: req.user._id });
        if (existing && req.user.role !== 'admin') {
            return res.status(400).json({ message: 'User already has a restaurant profile' });
        }

        const restaurant = new Restaurant({
            userId: req.user._id,
            name,
            description,
            address,
            image: image || '',
            isActive: req.user.role === 'admin' ? true : false, // Auto-approve if admin
            isOnline: true
        });

        const createdRestaurant = await restaurant.save();
        res.status(201).json(createdRestaurant);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all active restaurants (for customers) / all restaurants (for admin)
// @route   GET /api/restaurants
// @access  Public / Admin
const getRestaurants = async (req, res) => {
    try {
        // If admin is requesting, return all. Otherwise, return active and online
        if (req.user && req.user.role === 'admin') {
            const restaurants = await Restaurant.find().populate('userId', 'name email');
            return res.json(restaurants);
        }

        const restaurants = await Restaurant.find({ isActive: true, isOnline: true });
        res.json(restaurants);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get single restaurant by ID
// @route   GET /api/restaurants/:id
// @access  Public
const getRestaurantById = async (req, res) => {
    try {
        const restaurant = await Restaurant.findById(req.params.id);
        if (restaurant) {
            res.json(restaurant);
        } else {
            res.status(404).json({ message: 'Restaurant not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get restaurant belonging to logged in user
// @route   GET /api/restaurants/my/profile
// @access  Restaurant
const getMyRestaurant = async (req, res) => {
    try {
        const restaurant = await Restaurant.findOne({ userId: req.user._id });
        if (restaurant) {
            res.json(restaurant);
        } else {
            res.status(404).json({ message: 'No restaurant profile found for this user' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update restaurant
// @route   PUT /api/restaurants/:id
// @access  Restaurant/Admin
const updateRestaurant = async (req, res) => {
    try {
        const { name, description, address, image } = req.body;
        const restaurant = await Restaurant.findById(req.params.id);

        if (restaurant) {
            // Check authorization
            if (restaurant.userId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
                return res.status(401).json({ message: 'Not authorized' });
            }

            restaurant.name = name || restaurant.name;
            restaurant.description = description || restaurant.description;
            restaurant.address = address || restaurant.address;

            if (image) {
                restaurant.image = image;
            }

            const updatedRestaurant = await restaurant.save();
            res.json(updatedRestaurant);
        } else {
            res.status(404).json({ message: 'Restaurant not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Approve/Reject restaurant
// @route   PUT /api/restaurants/:id/approve
// @access  Admin
const approveRestaurant = async (req, res) => {
    try {
        const restaurant = await Restaurant.findById(req.params.id);

        if (restaurant) {
            restaurant.isActive = req.body.isActive;
            const updatedRestaurant = await restaurant.save();
            res.json(updatedRestaurant);
        } else {
            res.status(404).json({ message: 'Restaurant not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Toggle online status
// @route   PUT /api/restaurants/:id/status
// @access  Restaurant/Admin
const toggleStatus = async (req, res) => {
    try {
        const restaurant = await Restaurant.findById(req.params.id);

        if (restaurant) {
            if (restaurant.userId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
                return res.status(401).json({ message: 'Not authorized' });
            }

            restaurant.isOnline = req.body.isOnline;
            const updatedRestaurant = await restaurant.save();
            res.json(updatedRestaurant);
        } else {
            res.status(404).json({ message: 'Restaurant not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete restaurant
// @route   DELETE /api/restaurants/:id
// @access  Admin
const deleteRestaurant = async (req, res) => {
    try {
        const restaurant = await Restaurant.findById(req.params.id);

        if (restaurant) {
            await restaurant.deleteOne();
            res.json({ message: 'Restaurant removed' });
        } else {
            res.status(404).json({ message: 'Restaurant not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createRestaurant,
    getRestaurants,
    getRestaurantById,
    getMyRestaurant,
    updateRestaurant,
    approveRestaurant,
    toggleStatus,
    deleteRestaurant
};
