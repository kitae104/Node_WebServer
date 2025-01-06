const Product = require('../models/product'); // Product 모델 클래스를 가져옴
const Cart = require('../models/cart'); // Cart 모델 클래스를 가져옴

exports.getProducts = (req, res, next) => {
	Product.fetchAll()
		.then(([rows, fieldData]) => {
			res.render('shop/product-list', {
				prods: rows,
				pageTitle: 'All Products',
				path: '/products',
			});
		})
		.catch((err) => console.log(err));
};

exports.getProduct = (req, res, next) => {
	const prodId = req.params.productId; // URL로부터 productId를 가져옴
	Product.findById(prodId)
		.then(([product]) => {
			res.render('shop/product-detail', {
				product: product[0],
				pageTitle: product.title,
				path: '/products',
			});
		})
		.catch((err) => console.log(err));
};

exports.getIndex = (req, res, next) => {
	Product.fetchAll()
		.then(([rows, fieldData]) => {
			res.render('shop/index', {
				prods: rows,
				pageTitle: 'Shop',
				path: '/',
			});
		})
		.catch((err) => console.log(err));
};

exports.getCart = (req, res, next) => {
	Cart.getCart((cart) => {
		Product.fetchAll((products) => {
			const cartProducts = [];
			for (product of products) {
				const cartProductData = cart.products.find(
					(prod) => prod.id === product.id
				);
				if (cartProductData) {
					cartProducts.push({
						productData: product,
						qty: cartProductData.qty,
					});
				}
			}
			res.render('shop/cart', {
				path: '/cart',
				pageTitle: 'Your Cart',
				products: cartProducts,
			});
		});
	});
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
