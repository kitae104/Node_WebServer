const express = require('express');
const path = require('path');
const rootDir = require('../util/path');

const router = express.Router(); // Router 객체 생성

const products = []; // 상품 정보를 저장할 배열

router.get('/add-product', (req, res, next) => {
	res.render('add-product', {         // add-product.ejs 렌더링
        pageTitle: 'Add Product',       // 페이지 제목
        path: '/admin/add-product',     // 현재 경로
        formsCSS: true,                 // CSS 파일 적용 여부
        productCSS: true,               // CSS 파일 적용 여부
        activeAddProduct: true          // 메뉴 활성화 여부
    });
}); 

router.post('/add-product', (req, res, next) => {
	products.push({ title: req.body.title }); // 상품 정보를 배열에 저장
	res.redirect('/');
});

exports.routes = router; // router 객체를 모듈로 내보냄
exports.products = products; // products 배열을 모듈로 내보냄
