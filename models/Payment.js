const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
    full_name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    amount: {
        type: Number,
        required: true,
    },
    reference: {
        type: String,
        required: true,
        unique: true,
    },
    //making this unique so that it can be stored twice
    status: {
        type: String,
        required: true,
    }
},
{timestamps: true})

module.exports = mongoose.model('Payment', paymentSchema);