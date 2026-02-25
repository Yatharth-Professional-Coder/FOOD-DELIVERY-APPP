const mongoose = require('mongoose');
const Restaurant = require('./backend/models/Restaurant');
require('dotenv').config({ path: './backend/.env' });

async function checkRestaurants() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const all = await Restaurant.find();
        console.log('--- ALL RESTAURANTS ---');
        console.log(all);

        const active = await Restaurant.find({ isActive: true, isOnline: true });
        console.log('--- ACTIVE & ONLINE RESTAURANTS ---');
        console.log(active);
    } catch (error) {
        console.error(error);
    } finally {
        mongoose.disconnect();
    }
}
checkRestaurants();
