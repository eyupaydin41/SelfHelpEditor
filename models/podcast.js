const mongoose = require('mongoose');
const { Schema } = mongoose;

const podcastSchema = new Schema({
    title: {
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
    },
    source: {
        type: String,
        required: true,
    },
});

module.exports = mongoose.model('Podcast', podcastSchema);
