const mongoose = require('mongoose');

/**
 * Model for Orders
 */
const OrdersSchema = mongoose.Schema({
    order: {
        type: Array,
        required: true,
    },
    total: {
        type: Number,
        required: true,
    },
    client: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Client',
    },
    state: {
        type: String,
        default: 'PENDIENTE',
    },
    seller: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
    },
    createdAt: {
        type: Date,
        default: Date.now(),
    },
});

module.exports = mongoose.model('Order', OrdersSchema);
