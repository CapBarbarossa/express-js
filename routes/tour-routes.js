const express = require('express');

const tourController = require('../controllers/tour-controller');

// Creating a new Router instance to use with tours only.
const router = express.Router();

/**
 * We can create param middleware, where the middleware only gets executed if there's a certain parameter in the URL.
 * @prarm {val} holds the value of the parameter in the request.
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

router
    .route('/top-5-tours')
    .get(tourController.aliasTopTours, tourController.getAllTours);

router.route('/tour-stats').get(tourController.getTourStats);
router.route('/monthly-plan/:year').get(tourController.getMonthlyPlan);

router
    .route('/')
    .get(tourController.getAllTours)
    .post(tourController.createTour);

router
    .route('/:id')
    .get(tourController.getTourById)
    .patch(tourController.updateTour)
    .delete(tourController.deleteTour);

module.exports = router;
