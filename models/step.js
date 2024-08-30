const mongoose = require('mongoose');
const { Schema } = mongoose;

const stepSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    section: {
        type: Schema.Types.ObjectId,
        ref: 'Section',
        required: true,
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

module.exports = mongoose.model('Step', stepSchema);