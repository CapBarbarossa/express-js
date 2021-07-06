const express = require('express');
const authController = require('../controllers/auth-controller');
const reviewRouter = require('./review-routes');

const tourController = require('../controllers/tour-controller');

// Creating a new Router instance to use with tours only.
const router = express.Router();

router.use('/:tourId/reviews', reviewRouter);

/**
 * We can create param middleware, where the middleware only gets executed if there's a certain parameter in the URL.
 * {val} the value of the parameter in the request.
 */
// router.param('id', tourController.checkID);

// Create a checkBody middleware
// Check if body contains the name and price property
// If not, send back 400 (bad request)
// Add it to the post handler stack

/**
 * Another way to gather all actions and routes and make the code easier to maintain is to use the @route function of @app and chain all routes together.
 */

// Routes for tours

// Get a pre-determined set of tours using Aliasing.
router
    .route('/top-5-tours')
    .get(tourController.aliasTopTours, tourController.getAllTours);

// Get information about tours using aggregation pipeline
router.route('/tour-stats').get(tourController.getTourStats);

router
    .route('/monthly-plan/:year')
    .get(
        authController.protect,
        authController.restrictTo('admin', 'lead-guide', 'guide'),
        tourController.getMonthlyPlan
    );

router
    .route('/tours-within/:distance/center/:latlng/unit/:unit')
    .get(tourController.getToursWithin);

router.route('/distances/:latlng/unit/:unit').get(tourController.getDistances);

// Normal main routes.

router
    .route('/')
    .get(tourController.getAllTours)
    .post(
        authController.protect,
        authController.restrictTo('admin', 'lead-guide'),
        tourController.createTour
    );

router
    .route('/:id')
    .get(tourController.getTourById)
    .patch(
        authController.protect,
        authController.restrictTo('admin', 'lead-guide'),
        tourController.updateTour
    )
    .delete(
        authController.protect,
        authController.restrictTo('admin', 'lead-guide'),
        tourController.deleteTour
    );

module.exports = router;
