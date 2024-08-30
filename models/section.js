const mongoose = require('mongoose');
const { Schema } = mongoose;

const sectionSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    therapy: {
        type: Schema.Types.ObjectId,
        ref: 'Therapy',
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

module.exports = mongoose.model('Section', sectionSchema);