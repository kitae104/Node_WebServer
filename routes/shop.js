// 상품 관련 라우팅 처리
const express = require('express');

const shopController = require('../controllers/shop'); // productsController 모듈 가져오기

const isAuth = require('../middleware/is-auth'); // 인증 미들웨어

const router = express.Router(); // Router 객체 생성

router.get('/', shopController.getIndex); // 상품 목록 페이지 라우팅

router.get('/products', shopController.getProducts); // 상품 목록 페이지 라우팅

router.get('/products/:productId', shopController.getProduct); // 상품 상세 페이지 라우팅

router.get('/cart', isAuth, shopController.getCart); // 장바구니 페이지 라우팅

router.post('/cart', isAuth, shopController.postCart); // 장바구니 추가 라우팅

router.post('/cart-delete-item', isAuth, shopController.postCartDeleteProduct); // 장바구니 삭제 라우팅

router.post('/create-order', isAuth, shopController.postOrder); // 주문 추가 라우팅

router.get('/orders', isAuth, shopController.getOrders); // 주문 페이지 라우팅

router.get('/orders/:orderId', isAuth, shopController.getInvoice); // 주문 페이지 라우팅

// router.get('/checkout', isAuth, shopController.getCheckout); // 결제 페이지 라우팅

module.exports = router; // router 객체를 모듈로 내보냄
