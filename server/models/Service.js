const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    image: {
        type: String, // URL hình ảnh minh họa
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Giả định là bạn đã có model `User`
        required: true,
    },
}, { 
    timestamps: true // Tự động tạo `createdAt` và `updatedAt`
});

const Service = mongoose.model('Service', serviceSchema);

module.exports = Service;
