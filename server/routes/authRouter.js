const express = require('express');
const router = express.Router();

const controller = require('../controllers/authController')

router.post('/auth/registration', controller.registration);
router.post('/auth/login', controller.login);

module.exports = router;