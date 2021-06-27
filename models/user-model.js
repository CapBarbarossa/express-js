const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
// const catchAsync = require('../utils/catch-async');

// name, email, photo(string), password, passwordConfirm
const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Please tell us your name.'],
            trim: true,
        },
        email: {
            type: String,
            required: [true, 'Please provide your email address.'],
            unique: true,
            lowercase: true,
            validate: [
                validator.isEmail,
                'Please provide a valid email address.',
            ],
        },
        photo: String,
        password: {
            type: String,
            required: [true, 'Please provide a password.'],
            minlength: 8,
        },
        passwordConfirm: {
            type: String,
            required: [true, 'Please confirm your password.'],
            validate: {
                // This only works on create() and save()!
                validator: function (el) {
                    return el === this.password;
                },
                message: 'Passwords do not match!',
            },
        },
    },
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

userSchema.pre(
    'save',
    // catchAsync(
    async function (next) {
        // Only run if password was modified.
        if (!this.isModified('password')) return next();

        // This will replace the normal password with the incrypted version
        // Hash password with cost of 12 (CPU consumption)
        this.password = await bcrypt.hash(this.password, 12);

        // This will delete the confirm password because it doesn't need to be stored.
        this.passwordConfirm = undefined;

        next();
    }
    // )
);

const User = mongoose.model('User', userSchema);

module.exports = User;
