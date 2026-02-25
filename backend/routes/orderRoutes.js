const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
    createOrder,
    getUserOrders,
    getAllOrders,
    updateOrderStatus
} = require('../controllers/orderController');

router.route('/').post(protect, createOrder);
router.route('/user').get(protect, getUserOrders);
router.route('/all').get(protect, getAllOrders);
router.route('/:id/status').put(protect, updateOrderStatus);

module.exports = router;
