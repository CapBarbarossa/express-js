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
router.get('/logout', authController.logout);
router.post('/forgotPassword', authController.forgotPassword);
router.patch('/resetPassword/:token', authController.resetPassword);

// Adding middleware, protect all routes after this middleware
router.use(authController.protect);

router.patch('/updateMyPassword', authController.updatePassword);

router.get('/me', userController.getMe, userController.getUserById);

router.patch('/updateMe', userController.updateMe);

router.delete('/deleteMe', userController.deleteMe);

/**
 * Another way to gather all actions and routes and make the code easier to maintain is to use the @route function of @app and chain all routes together.
 */

// Routs for users.

// Restrict all routes after this middleware
router.use(authController.restrictTo('admin'));

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
