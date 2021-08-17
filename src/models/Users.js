const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const { isNull } = require('../utils/Utils')
const { JWT_SECRET, JWT_EXPIRE } = process.env;
const { Schema, model } = mongoose;
const { String, Date } = mongoose.Schema.Types;
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
    resetPasswordExpire: Date,
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Encrypt the password with bcrypt-js
UserSchema.pre('save', function (next) {
    const salt = bcrypt.genSaltSync(10);
    this.password = bcrypt.hashSync(this.password, salt);

    next()
});

// Sign JWT and return it.
UserSchema.methods.getJWTToken = function () {
    const token = jwt.sign({ id: this._id }, JWT_SECRET, { expiresIn: JWT_EXPIRE });

    return token;
}

// Match entered password with existing hashed that in DB
UserSchema.methods.isMatchedPasswords = async function (enteredPassword = null ) {
    if (isNull(enteredPassword)) return false;

    return await bcrypt.compare(enteredPassword, this.password)
}

module.exports = model('users', UserSchema);
