const express = require('express');

const userController = require('./../controllers/user-controller');

// Creating a new Router instance to use with users only.
const router = express.Router();

// Param Middleware
router.param(
    'id',
    (req, res, next, val) => {
        console.log(
            `user id is: ${val}`
        );
        next();
    }
);

/**
 * Another way to gather all actions and routes and make the code easier to maintain is to use the @route function of @app and chain all routes together.
 */

// Routs for users.

router
    .route('/')
    .get(userController.getAllUsers)
    .post(userController.createUser);

router
    .route('/:id')
    .get(userController.getUserById)
    .patch(userController.updateUser)
    .delete(userController.deleteUser);

module.exports = router;
