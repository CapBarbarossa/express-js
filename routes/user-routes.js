const express = require('express');

const userController = require('../controllers/user-controller');
const authController = require('../controllers/auth-controller');

// Creating a new Router instance to use with users only.
const router = express.Router();

// // Param Middleware
// router.param('id', (req, res, next, val) => {
//     console.log(`user id is: ${val}`);
//     next();
// });

router.post('/signup', authController.signup);
router.post('/login', authController.login);

router.post('/forgotPassword', authController.forgotPassword);
router.patch('/resetPassword/:token', authController.resetPassword);
router.patch(
    '/updateMyPassword',
    authController.protect,
    authController.updatePassword
);

router.patch(
    '/updateMe',
    authController.protect,
    userController.updateMe
);

router.delete(
    '/deleteMe',
    authController.protect,
    userController.deleteMe
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
