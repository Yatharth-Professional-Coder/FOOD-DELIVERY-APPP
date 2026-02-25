const mongoose = require('mongoose');

const foodItemSchema = new mongoose.Schema({
    restaurantId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Restaurant'
    },
    name: {
        type: String,
        required: true
    },
    image: {
        type: String, // Cloudinary URL
    },
    price: {
        type: Number,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    isAvailable: {
        type: Boolean,
        default: true
    }
}, { timestamps: true });

const FoodItem = mongoose.model('FoodItem', foodItemSchema);
module.exports = FoodItem;
