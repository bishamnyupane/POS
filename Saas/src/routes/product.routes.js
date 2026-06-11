const express = require('express');
const productController = require('../controller/product.controller');
const authMiddleware = require('../middleware/auth.middleware');
const router = express.Router();


router.post('/',authMiddleware.authCheck, productController.createProduct);
router.get('/', authMiddleware.authCheck, productController.getProducts);
router.get('/:id', authMiddleware.authCheck, productController.getProductById);
router.put('/:id', authMiddleware.authCheck, productController.updateProduct);
router.delete('/:id', authMiddleware.authCheck, productController.deleteProduct);
module.exports = router;