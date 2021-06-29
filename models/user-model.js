const crypto = require('crypto');
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
        role: {
            type: String,
            enum: ['user', 'guide', 'lead-guide', 'admin'],
            default: 'user',
        },
        password: {
            type: String,
            required: [true, 'Please provide a password.'],
            minlength: 8,
            select: false,
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
        passwordChangedAt: Date,
        passwordResetToken: String,
        passwordResetExpires: Date,
        isActive: {
            type: Boolean,
            default: true,
            select: false,
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

        // This will replace the normal password with the encrypted version
        // Hash password with cost of 12 (CPU consumption)
        this.password = await bcrypt.hash(this.password, 12);

        // This will delete the confirm password because it doesn't need to be stored.
        this.passwordConfirm = undefined;

        next();
    }
    // )
);

userSchema.pre('save', function (next) {
    if (!this.isModified('password') || this.isNew) return next();

    this.passwordChangedAt = Date.now() - 1000;
    next();
});

userSchema.pre(/^find/, function (next) {
    this.find({ isActive: { $ne: false } });
    next();
});

userSchema.methods.correctPassword = async function (
    candidatePassword,
    userPassword
) {
    return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
    if (this.passwordChangedAt) {
        const changedTimeStamp = parseInt(
            this.passwordChangedAt.getTime() / 1000,
            10
        );

        return JWTTimestamp < changedTimeStamp;
    }

    // False means not changed
    return false;
};

userSchema.methods.createPasswordResetToken = function () {
    // Generate a new random token that acts as a temporary password.
    const resetToken = crypto.randomBytes(32).toString('hex');

    // We then encrypt this token with the built-in crypto module because it doesn't need strong encryption.
    this.passwordResetToken = crypto
        .createHash('sha256')
        .update(resetToken)
        .digest('hex');

    // The reset token will reset after 10 minutes converted to milliseconds
    this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

    return resetToken;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
