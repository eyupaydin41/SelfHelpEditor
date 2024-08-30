const mongoose = require('mongoose');
const { Schema } = mongoose;

const exerciseStepSchema = new Schema({
    source: {
        type: String,
        required: true,
    },
    stepDescription: {
        type: String,
        required: true,
    },
    exercise: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Exercise',
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

module.exports = mongoose.model('ExerciseStep', exerciseStepSchema);
