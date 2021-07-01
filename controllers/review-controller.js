// functionality for getting all reviews and creating new reviews.
const Review = require('../models/review-model');
// const catchAsync = require('../utils/catch-async');
const factory = require('./handler-factory');

// const AppError = require('../utils/app-error');

exports.setTourUserIds = (req, res, next) => {
    if (!req.body.tour) {
        req.body.tour = req.params.tourId;
    }
    if (!req.body.user) {
        req.body.user = req.user.id;
    }
    next();
};

exports.getAllReviews = factory.getAll(Review);
exports.getReview = factory.getOne(Review);
exports.createReview = factory.createOne(Review);
exports.updateReview = factory.updateOne(Review);
exports.deleteReview = factory.deleteOne(Review);
