const Product = require('../models/product'); // Product 모델 클래스를 가져옴
const Cart = require('../models/cart'); // Cart 모델 클래스를 가져옴

exports.getProducts = (req, res, next) => {
	Product.fetchAll((products) => {
		res.render('shop/product-list', {
			prods: products,
			pageTitle: 'All Products',
			path: '/products',
		});
	}); // 모든 상품 정보를 가져옴
};

exports.getProduct = (req, res, next) => {
	const prodId = req.params.productId; // URL로부터 productId를 가져옴
	Product.findById(prodId, (product) => {
		res.render('shop/product-detail', {
			product: product,
			pageTitle: product.title,
			path: '/products',
		});
	});
};

exports.getIndex = (req, res, next) => {
	Product.fetchAll((products) => {
		res.render('shop/index', {
			prods: products,
			pageTitle: 'Shop',
			path: '/',
		});
	});
};

exports.getCart = (req, res, next) => {
	res.render('shop/cart', {
		path: '/cart',
		pageTitle: 'Your Cart',
	});
};

exports.postCart = (req, res, next) => {
	const prodId = req.body.productId; // 상품 ID를 가져옴
	Product.findById(prodId, (product) => {
		Cart.addProduct(prodId, product.price); // 카트에 상품 추가
	});
	res.redirect('/cart');
};

exports.getOrders = (req, res, next) => {
	res.render('shop/orders', {
		path: '/orders',
		pageTitle: 'Your Orders',
	});
};

exports.getCheckout = (req, res, next) => {
	res.render('shop/checkout', {
		path: '/checkout',
		pageTitle: 'Checkout',
	});
};
