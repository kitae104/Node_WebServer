const express = require('express');
const path = require('path');

const shopController = require('../controllers/shop'); // productsController 모듈 가져오기

const router = express.Router(); // Router 객체 생성

router.get('/', shopController.getIndex); // 상품 목록 페이지 라우팅

router.get('/products', shopController.getProducts); // 상품 목록 페이지 라우팅

router.get('/products/:productId', shopController.getProduct); // 상품 상세 페이지 라우팅

router.get('/cart', shopController.getCart); // 장바구니 페이지 라우팅

router.post('/cart', shopController.postCart); // 장바구니 추가 라우팅

router.post('/cart-delete-item', shopController.postCartDeleteProduct); // 장바구니 삭제 라우팅

router.post('/create-order', shopController.postOrder); // 주문 추가 라우팅

// router.get('/orders', shopController.getOrders); // 주문 페이지 라우팅

// router.get('/checkout', shopController.getCheckout); // 결제 페이지 라우팅

module.exports = router; // router 객체를 모듈로 내보냄
