const express = require('express');
const productController = require('../controllers/productController');
const router = express.Router();

router.post('/products', productController.addProd);
router.put('/products/:id', productController.editProd);
router.delete('/products/:id', productController.deleteProd);
router.get('/products', productController.getAll);
router.get('/products/:id', productController.getOne);

module.exports = router;