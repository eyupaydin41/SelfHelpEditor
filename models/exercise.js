const mongoose = require('mongoose');
const { Schema } = mongoose;

const exerciseSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    cardImageUrl: {
        type: String,
        required: true,
    },
    imageUrl: {
        type: String,
        required: true,
    }
});

module.exports = mongoose.model('Exercise', exerciseSchema);
