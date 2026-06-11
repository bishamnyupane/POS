const express = require('express');
const adminController = require('../controller/admin.controller');
const authMiddleware = require('../middleware/auth.Middleware');


const router = express.Router();


router.post('/create-cashier', authMiddleware.authCheck, adminController.createCashier);

module.exports = router; 