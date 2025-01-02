const express = require('express');
const path = require('path');
const rootDir = require('../util/path');

const adminData = require('./admin');

const router = express.Router(); // Router 객체 생성

router.get('/', (req, res, next) => {
	const products = adminData.products;
	res.render('shop', {
		prods: products,
		pageTitle: 'Shop',
		path: '/',
		hasProducts: products.length > 0,
		activeShop: true,
		productCSS: true,
	});
}); 

module.exports = router; // router 객체를 모듈로 내보냄
