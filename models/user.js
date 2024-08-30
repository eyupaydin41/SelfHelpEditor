const mongoose = require('mongoose');
const { Schema } = mongoose;
const bcrypt = require('bcrypt');

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    }
});

userSchema.pre('save', async function (next) {
    if (this.isModified('password') || this.isNew) {
        try {
            const salt = await bcrypt.genSalt(10);
            this.password = await bcrypt.hash(this.password, salt);
            next();
        } catch (err) {
            next(err);
        }
    } else {
        next();
    }
});

userSchema.methods.comparePassword = async function (candidatePassword) {
    try {
        console.log(await bcrypt.compare(candidatePassword, this.password));
        return await bcrypt.compare(candidatePassword, this.password);
    } catch (error) {
        throw new Error('Şifre karşılaştırma hatası');
    }
};

module.exports = mongoose.model('User', userSchema);
