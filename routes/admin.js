const express = require('express');
const path = require('path');

const productsController = require('../controllers/products'); // productsController 모듈 가져오기

const router = express.Router(); // Router 객체 생성

router.get('/add-product', productsController.getAddProduct); 

router.post('/add-product', productsController.postAddProduct);

module.exports = router; // Router 객체를 모듈로 내보냄
