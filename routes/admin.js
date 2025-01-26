// 관리자 관련 라우팅 처리
const express = require('express');

const adminController = require('../controllers/admin'); // adminController 모듈 가져오기

const isAuth = require('../middleware/is-auth'); // 인증 미들웨어

const router = express.Router(); // Router 객체 생성

router.get('/add-product', isAuth, adminController.getAddProduct); // 상품 추가 페이지 라우팅

router.post('/add-product', isAuth, adminController.postAddProduct);    // 상품 추가

router.get('/products', isAuth, adminController.getProducts); // 상품 목록 페이지 라우팅

router.get('/edit-product/:productId', isAuth, adminController.getEditProduct); // 상품 수정 페이지 라우팅

router.post('/edit-product', isAuth, adminController.postEditProduct);  // 상품 수정

router.post('/delete-product', isAuth, adminController.postDeleteProduct);  // 상품 삭제

module.exports = router; // Router 객체를 모듈로 내보냄
