const mongoose = require('mongoose');

const { Schema, model } = mongoose;
const { String, Date } = mongoose.Schema.Types;
const UserSchema = new Schema({
    name: {
        type: String,
        required: [true, 'Please, add a name'],
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

module.exports = model('users', UserSchema);
