const mongoose = require('mongoose');

const restaurantSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    name: {
        type: String,
        required: true
    },
    image: {
        type: String, // Cloudinary URL
    },
    description: {
        type: String,
    },
    address: {
        type: String,
        required: true
    },
    isActive: {
        type: Boolean,
        default: false // Admin needs to approve
    },
    isOnline: {
        type: Boolean,
        default: true // Restaurant can toggle visibility to customers
    }
}, { timestamps: true });

const Restaurant = mongoose.model('Restaurant', restaurantSchema);
module.exports = Restaurant;
