const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { addToCart, getCart, removeFromCart } = require('../controllers/cartController');

router.route('/add').post(protect, addToCart);
router.route('/').get(protect, getCart);
router.route('/remove/:foodId').delete(protect, removeFromCart);

module.exports = router;
