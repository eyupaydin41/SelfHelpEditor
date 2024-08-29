const mongoose = require('mongoose');
const { Schema } = mongoose;

const therapySchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    imageUrl: String,
    cardImageUrl: String,
    createdAt: {
        type: Date,
        default: Date.now,
    }
});

module.exports = mongoose.model('Therapy', therapySchema);
