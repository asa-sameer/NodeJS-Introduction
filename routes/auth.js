const express  = require('express');
const router  = express.Router();
const loginController = require('../controllers/auth');

router.get('/login',loginController.getLogin);
router.post('/login',loginController.postLogin);

router.get('/logout',loginController.getLogout);

router.get('/signup',loginController.getSignup);
router.post('/signup',loginController.postSignup);

module.exports = router;