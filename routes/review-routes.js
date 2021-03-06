// Endpoints for getting all reviews and creating new reviews.
const express = require('express');

const reviewController = require('../controllers/review-controller');
const authController = require('../controllers/auth-controller');

const router = express.Router({ mergeParams: true });

router.use(authController.protect);

router
    .route('/')
    .get(reviewController.getAllReviews)
    .post(
        authController.restrictTo('user'),
        reviewController.setTourUserIds,
        reviewController.createReview
    );

router
    .route('/:id')
    .get(reviewController.getReview)
    .delete(authController.restrictTo('user'), reviewController.deleteReview)
    .patch(authController.restrictTo('user'), reviewController.updateReview);

module.exports = router;
