const Product = require('../models/product'); // Product 모델 클래스를 가져옴
const Cart = require('../models/cart'); // Cart 모델 클래스를 가져옴

exports.getProducts = (req, res, next) => {
	Product.findAll() // 모든 상품을 가져옴
		.then((products) => {
			// 상품 목록을 가져옴
			res.render('shop/product-list', {
				// product-list.ejs 렌더링
				prods: products, // 상품 목록
				pageTitle: 'All Products', // 페이지 제목
				path: '/products', // 현재 경로
			});
		})
		.catch((err) => console.log(err));
};

exports.getProduct = (req, res, next) => {
	const prodId = req.params.productId; // URL로부터 productId를 가져옴
	Product.findByPk(prodId) // 상품 ID로 상품을 찾음
		.then((product) => {
			// 상품 목록을 가져옴
			res.render('shop/product-detail', {
				product: product,
				pageTitle: product.title,
				path: '/products',
			});
		})
		.catch((err) => console.log(err));
};

exports.getIndex = (req, res, next) => {
	Product.findAll() // 모든 상품을 가져옴
		.then((products) => {
			// 상품 목록을 가져옴
			res.render('shop/index', {
				// index.ejs 렌더링
				prods: products, // 상품 목록
				pageTitle: 'Shop', // 페이지 제목
				path: '/', // 현재 경로
			});
		})
		.catch((err) => console.log(err));
};

exports.getCart = (req, res, next) => {
	console.log(req.user.cart);
	req.user
		.getCart()
		.then((cart) => {
			return cart
				.getProducts()
				.then((products) => {
					res.render('shop/cart', {
						path: '/cart',
						pageTitle: 'Your Cart',
						products: products,
					});
				})
				.catch((err) => console.log(err));
		})
		.catch((err) => console.log(err));
};

exports.postCart = (req, res, next) => {
	const prodId = req.body.productId; // 상품 ID를 가져옴
	Product.findById(prodId, (product) => {
		Cart.addProduct(prodId, product.price); // 카트에 상품 추가
	});
	res.redirect('/cart');
};

// 카트에서 상품 삭제
exports.postCartDeleteProduct = (req, res, next) => {
	const prodId = req.body.productId; // 상품 ID를 가져옴
	Product.findById(prodId, (product) => {
		Cart.deleteProduct(prodId, product.price); // 카트에서 상품 삭제
		res.redirect('/cart'); // 카트 페이지로 리다이렉트
	});
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
