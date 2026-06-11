const mongoose = require('mongoose');

const saleItemSchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        min: 1
    },
    price: {
        type: Number,
        required: true
    },
    total: {
        type: Number,
        required: true
    }
});

const salesSchema = new mongoose.Schema({

    invoiceNumber: {
        type: String,
        unique: true,
        required: true
    },

    items: [saleItemSchema],

    customerName: {
        type: String,
        default: "Walk-in Customer"
    },

    customerPhone: {
        type: String
    },

    subtotal: {
        type: Number,
        required: true
    },

    discount: {
        type: Number,
        default: 0
    },

    tax: {
        type: Number,
        default: 0
    },

    totalAmount: {
        type: Number,
        required: true
    },

    paymentMethod: {
        type: String,
        enum: ['cash', 'card', 'online', 'credit'],
        default: 'cash'
    },

    paymentStatus: {
        type: String,
        enum: ['paid', 'unpaid', 'partial'],
        default: 'paid'
    },

    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }

}, { timestamps: true });

const salesModel = mongoose.model('Sale', salesSchema);
module.exports = salesModel;