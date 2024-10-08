const mongoose = require('mongoose');
const { Schema } = mongoose;
const { STATUS } = require('../config/Enum');

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

module.exports = mongoose.model('Therapy', therapySchema);
