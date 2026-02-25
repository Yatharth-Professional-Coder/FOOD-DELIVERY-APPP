const express = require('express');
const router = express.Router();
const { protect, admin, restaurant } = require('../middleware/authMiddleware');
const {
    createRestaurant,
    getRestaurants,
    getRestaurantById,
    getMyRestaurant,
    updateRestaurant,
    approveRestaurant,
    toggleStatus,
    deleteRestaurant
} = require('../controllers/restaurantController');

// Public or mixed auth routes
// Custom middleware inline to optionally check if user is admin
const optionalProtect = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (token) {
        const jwt = require('jsonwebtoken');
        const User = require('../models/User');
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            User.findById(decoded.id).select('-password').then(user => {
                req.user = user;
                next();
            }).catch(err => next());
        } catch {
            next();
        }
    } else {
        next();
    }
};

router.route('/')
    .get(optionalProtect, getRestaurants)
    .post(protect, createRestaurant);

router.route('/my/profile')
    .get(protect, getMyRestaurant);

router.route('/:id')
    .get(getRestaurantById)
    .put(protect, updateRestaurant)
    .delete(protect, admin, deleteRestaurant);

router.route('/:id/approve')
    .put(protect, admin, approveRestaurant);

router.route('/:id/status')
    .put(protect, toggleStatus);

module.exports = router;
