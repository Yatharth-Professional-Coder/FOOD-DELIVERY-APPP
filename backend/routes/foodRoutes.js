const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
    createFoodItem,
    getFoodsByRestaurant,
    updateFoodItem,
    deleteFoodItem
} = require('../controllers/foodController');

router.route('/:restaurantId')
    .post(protect, createFoodItem)
    .get(getFoodsByRestaurant);

router.route('/:id')
    .put(protect, updateFoodItem)
    .delete(protect, deleteFoodItem);

module.exports = router;
