const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true },
    color: { type: String },
    limit: { type: Number, required: true, default: 0 },
    description: { type: String },
    imgUrl: [{ type: String }] // Bir nechta rasm bo'lishi uchun massiv
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);