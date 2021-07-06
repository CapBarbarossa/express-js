const express = require('express');
const viewController = require('../controllers/view-controller');
const authController = require('../controllers/auth-controller');

const router = express.Router();

router.use(authController.isLoggedIn);

router.get('/', viewController.getOverview);
router.get('/tour/:slug', viewController.getTour);

router.get('/login', viewController.getLoginForm);

module.exports = router;
