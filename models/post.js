const mongoose = require('mongoose');
const { Schema } = mongoose;
const { STATUS } = require('../config/Enum');

const postSchema = new Schema({
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
        required: true
    },
    status: {
        type: String,
        enum: Object.values(STATUS),
        default: STATUS.PENDING
    },
    creator: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    }
});

module.exports = mongoose.model('Post', postSchema);