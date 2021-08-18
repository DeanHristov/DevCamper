const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const { isNull } = require('../utils/Utils')
const { JWT_SECRET, JWT_EXPIRE } = process.env;
const { Schema, model } = mongoose;
const { String } = mongoose.Schema.Types;
const UserSchema = new Schema({
    name: {
        type: String,
        required: [true, 'Please, add a name'],
        minlength: [3, 'The min chars of the name must be 3'],
        maxlength: [20, 'The max char of the name must me 20'],
    },
    email: {
        type: String,
        unique: true,
        required: [true, 'Please, add an email'],
        match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            'Please add a valid email'
        ]
    },
    role: {
        type: String,
        enum: ['user', 'publisher', 'admin'],
        default: 'user'
    },
    password: {
        type: String,
        required: [true, 'Please add a password'],
        minlength: [3, 'The min chars of the password must be 3'],
        maxlength: [20, 'The max char of the password must me 20'],
        select: false,
    },
    resetPasswordToken: String,
    resetPasswordExpire: mongoose.Schema.Types.Date,
    createdAt: {
        type: mongoose.Schema.Types.Date,
        default: mongoose.Schema.Types.Date.now
    }
});

// Encrypt the password with bcrypt-js
UserSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        next();
    }

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// Sign JWT and return it.
UserSchema.methods.getJWToken = function () {
    const token = jwt.sign({ id: this._id }, JWT_SECRET, { expiresIn: JWT_EXPIRE });

    return token;
}

// Match entered password with existing hashed that in DB
UserSchema.methods.isMatchedPasswords = async function (enteredPassword = null ) {
    if (isNull(enteredPassword)) return false;

    return await bcrypt.compare(enteredPassword, this.password)
}

UserSchema.methods.getResetToken = function () {
    const resetToken = crypto.randomBytes(20).toString('hex')
    this.resetPasswordToken = crypto
        .createHash('sha256')
        .update(resetToken)
        .digest('hex');

    this.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

    return resetToken;
}

module.exports = model('users', UserSchema);
