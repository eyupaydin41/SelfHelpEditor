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
    }
});

module.exports = mongoose.model('ExerciseStep', exerciseStepSchema);
