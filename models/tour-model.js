const mongoose = require('mongoose');
const slugify = require('slugify');
// const validator = require('validator');

const tourSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'A tour must have a name'],
            unique: true,
            trim: true,
            maxlength: [
                40,
                'A tour name must have less or equal then 40 characters',
            ],
            minlength: [
                10,
                'A tour name must have more or equal then 10 characters',
            ],
            // validate: [
            //     validator.isAlpha,
            //     'Tour name must only contain letters',
            // ],
        },
        slug: {
            type: String,
            unique: true,
        },
        duration: {
            type: Number,
            required: [true, 'A tour must have a duration'],
        },
        maxGroupSize: {
            type: Number,
            required: [true, 'A tour must have a Group Size'],
        },
        difficulty: {
            type: String,
            required: [true, 'A tour must have a difficulty'],
            enum: {
                values: ['easy', 'medium', 'difficult'],
                message: "difficulty can only be 'easy', 'medium', 'difficult'",
            },
        },
        ratingsQuantity: {
            type: Number,
            default: 0,
        },
        ratingsAvarage: {
            type: Number,
            default: 4.5,
            min: [1, 'Rating must be more than or equel 1.0'],
            max: [5, 'Rating must be less than or equel 5'],
        },
        price: {
            type: Number,
            required: [true, 'A tour must have a price'],
        },
        priceDiscount: {
            type: Number,
            // CUSTOM DATA VALIDATION
            validate: {
                validator: function (val) {
                    // This only points to currect doc on NEW document creation
                    return val < this.price;
                },
                message:
                    'Discount Price ({VALUE}) should be less than the original price',
            },
        },
        summary: {
            type: String,
            trim: true,
            required: [true, 'A tour must have a description'],
        },
        description: {
            type: String,
            trim: true,
        },
        imageCover: {
            type: String,
            required: [true, 'A tour must have a cover image'],
        },
        images: [String],
        createdAt: {
            type: Date,
            default: Date.now(),
        },
        startDates: [Date],
        secretTour: {
            type: Boolean,
            default: false,
        },
    },
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

tourSchema.virtual('durationWeeks').get(function () {
    return this.duration / 7;
});

// DOCUMENT MIDDLEWARE : runs before .save() and .create(), not for .update()
tourSchema.pre('save', function (next) {
    this.slug = slugify(this.name, { lower: true });
    next();
});

// DOCUMENT MIDDLEWARE : runs after .save() and .create()
// tourSchema.post('save', (doc, next) => {
//     console.log(doc);
//     next();
// });

// QUERY MIDDLEWARE : runs before queries
tourSchema.pre(/^find/, function (next) {
    // tourSchema.pre('find', function (next) {
    this.find({ secretTour: { $ne: true } });
    next();
});

// tourSchema.post(/^find/, (docs, next) => {
//     console.log(docs);
//     next();
// });

// AGGRIGATION MIDDLEWARE : runs before and after aggrigation
tourSchema.pre('aggregate', function (next) {
    this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });
    next();
});

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
