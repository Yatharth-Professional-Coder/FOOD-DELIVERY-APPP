const express = require('express');
const router = express.Router();
const { upload } = require('../config/cloudinary');
const { protect } = require('../middleware/authMiddleware');
const {
    createFoodItem,
    getFoodsByRestaurant,
    updateFoodItem,
    deleteFoodItem
} = require('../controllers/foodController');

router.route('/:restaurantId')
    .post(protect, upload.single('image'), createFoodItem)
    .get(getFoodsByRestaurant);

router.route('/:id')
    .put(protect, upload.single('image'), updateFoodItem)
    .delete(protect, deleteFoodItem);

module.exports = router;
