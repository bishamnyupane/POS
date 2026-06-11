const express = require('express');
const salesController = require('../controller/sales.controller');
const authMiddleware = require('../middleware/auth.middleware');
const router = express.Router();


router.post('/',authMiddleware.authCheck, salesController.createSale);
router.get('/', authMiddleware.authCheck, salesController.getAllSales);
router.get('/:id', authMiddleware.authCheck, salesController.getSaleById);
module.exports = router;