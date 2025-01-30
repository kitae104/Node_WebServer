const Product = require('../models/product'); // Product 모델 클래스를 가져옴
const Order = require('../models/order'); // Order 모델 클래스를 가져옴

// 상품 목록 페이지
exports.getProducts = (req, res, next) => {
	Product.find() // 모든 상품을 가져옴
		.then((products) => {
			// 상품 목록을 가져옴
			// console.log(products);
			res.render('shop/product-list', {
				// product-list.ejs 렌더링
				prods: products, // 상품 목록
				pageTitle: '모든 상품 리스트', // 페이지 제목
				path: '/products', // 현재 경로
			});
		})
		.catch((err) => {
			const error = new Error(err);	// 에러 객체 생성
			error.httpStatusCode = 500;		// HTTP 상태 코드 설정
			return next(error);				// 다음 미들웨어로 에러 전달
		});
};

// 상품 상세 페이지
exports.getProduct = (req, res, next) => {
	const prodId = req.params.productId; // URL로부터 productId를 가져옴
	Product.findById(prodId) // 상품 ID로 상품을 찾음
		.then((product) => {
			// 상품 목록을 가져옴
			res.render('shop/product-detail', {
				product: product,
				pageTitle: product.title,
				path: '/products',
			});
		})
		.catch((err) => {
			const error = new Error(err);	// 에러 객체 생성
			error.httpStatusCode = 500;		// HTTP 상태 코드 설정
			return next(error);				// 다음 미들웨어로 에러 전달
		});
};

// 홈 페이지
exports.getIndex = (req, res, next) => {
	Product.find() // 모든 상품을 가져옴
		.then((products) => {
			// 상품 목록을 가져옴
			res.render('shop/index', {
				// index.ejs 렌더링
				prods: products, // 상품 목록
				pageTitle: '쇼핑몰', // 페이지 제목
				path: '/', // 현재 경로
			});
		})
		.catch((err) => {
			const error = new Error(err);	// 에러 객체 생성
			error.httpStatusCode = 500;		// HTTP 상태 코드 설정
			return next(error);				// 다음 미들웨어로 에러 전달
		});
};

exports.getCart = (req, res, next) => {
	req.user
		.populate('cart.items.productId')
		.then((user) => {
			const products = user.cart.items;
			res.render('shop/cart', {
				path: '/cart',
				pageTitle: '카트 보기',
				products: products,
			});
		})
		.catch((err) => {
			const error = new Error(err);	// 에러 객체 생성
			error.httpStatusCode = 500;		// HTTP 상태 코드 설정
			return next(error);				// 다음 미들웨어로 에러 전달
		});
};

// 카트에 상품 추가
exports.postCart = (req, res, next) => {
	const prodId = req.body.productId; // 상품 ID를 가져옴
	Product.findById(prodId) // 상품 ID로 상품을 찾음
		.then((product) => {
			return req.user.addToCart(product); // 카트에 상품 추가
		})
		.then((result) => {
			//console.log(result);
			res.redirect('/cart'); // 카트 페이지로 리다이렉트
		})
		.catch((err) => {
			const error = new Error(err);	// 에러 객체 생성
			error.httpStatusCode = 500;		// HTTP 상태 코드 설정
			return next(error);				// 다음 미들웨어로 에러 전달
		});
};

// 카트에서 상품 삭제
exports.postCartDeleteProduct = (req, res, next) => {
	const prodId = req.body.productId; // 상품 ID를 가져옴
	req.session.user
		.removeFromCart(prodId) // 카트에서 상품 삭제
		.then((result) => {
			res.redirect('/cart'); // 카트 페이지로 리다이렉트
		})
		.catch((err) => {
			const error = new Error(err);	// 에러 객체 생성
			error.httpStatusCode = 500;		// HTTP 상태 코드 설정
			return next(error);				// 다음 미들웨어로 에러 전달
		});
};

// 주문 페이지
exports.getOrders = (req, res, next) => {
	Order.find({ 'user.userId': req.user._id }) // 주문을 찾음
		.then((orders) => {
			res.render('shop/orders', {
				path: '/orders',
				pageTitle: '주문 리스트',
				orders: orders,
			});
		})
		.catch((err) => {
			const error = new Error(err);	// 에러 객체 생성
			error.httpStatusCode = 500;		// HTTP 상태 코드 설정
			return next(error);				// 다음 미들웨어로 에러 전달
		});
};

// 주문 추가
exports.postOrder = (req, res, next) => {
	req.user
		.populate('cart.items.productId')
		.then((user) => {
			console.log('user.cart.items : ' + user.cart.items);
			const products = user.cart.items.map((i) => {
				return {
					quantity: i.quantity,
					product: { ...i.productId._doc },
				};
			});
			const order = new Order({
				user: {
					email: req.user.email,
					userId: req.user,
				},
				products: products,
			});
			return order.save(); // 주문 추가
		})
		.then((result) => {
			return req.user.clearCart(); // 카트 비우기
		})
		.then(() => {
			res.redirect('/orders'); // 주문 페이지로 리다이렉트
		})
		.catch((err) => {
			const error = new Error(err);	// 에러 객체 생성
			error.httpStatusCode = 500;		// HTTP 상태 코드 설정
			return next(error);				// 다음 미들웨어로 에러 전달
		});
};

exports.getCheckout = (req, res, next) => {
	res.render('shop/checkout', {
		path: '/checkout',
		pageTitle: '체크 아웃',
	});
};
