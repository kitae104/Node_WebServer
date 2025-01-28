// 관리자 관련 라우팅 처리
const express = require('express');
const { body } = require('express-validator');

const adminController = require('../controllers/admin'); // adminController 모듈 가져오기

const isAuth = require('../middleware/is-auth'); // 인증 미들웨어

const router = express.Router(); // Router 객체 생성

router.get('/add-product', isAuth, adminController.getAddProduct); // 상품 추가 페이지 라우팅

router.post('/add-product', [
    body('title')                       // 상품 추가 처리 라우팅
        .isString()                     // 문자열 형식
        .isLength({ min: 3 })           // 최소 3자 이상
        .trim(),                        // 공백 제거
    body('imageUrl').isURL(),           // URL 형식
    body('price').isInt(),              // 정수 형식
    body('description')
        .isLength({ min: 5, max: 400 }) // 최소 5자 이상, 최대 400자 이하
        .trim(),                        // 공백 제거 
], isAuth, adminController.postAddProduct);    // 상품 추가

router.get('/products', isAuth, adminController.getProducts); // 상품 목록 페이지 라우팅

router.get('/edit-product/:productId', isAuth, adminController.getEditProduct); // 상품 수정 페이지 라우팅

router.post('/edit-product', [
    body('title')                       // 상품 수정 처리 라우팅
        .isString()                     // 문자열 형식
        .isLength({ min: 3 })           // 최소 3자 이상
        .trim(),                        // 공백 제거
    body('imageUrl').isURL(),           // URL 형식
    body('price').isInt(),              // 정수 형식
    body('description')
        .isLength({ min: 5, max: 400 }) // 최소 5자 이상, 최대 400자 이하
        .trim(),                        // 공백 제거
], isAuth, adminController.postEditProduct);  // 상품 수정

router.post('/delete-product', isAuth, adminController.postDeleteProduct);  // 상품 삭제

module.exports = router; // Router 객체를 모듈로 내보냄
