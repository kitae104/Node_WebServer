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

// 카트에 상품 추가
exports.postCart = (req, res, next) => {
	const prodId = req.body.productId; 		// 상품 ID를 가져옴
	let fetchedCart;						// 카트를 가져옴
	let newQuantity = 1;					// 상품 수량을 1로 설정

	req.user
		.getCart()
		.then(cart => {						// 카트를 가져옴
			fetchedCart = cart;				// 카트를 저장		
			return cart.getProducts({ where: { id: prodId } });
		})
		.then(products => {						// 상품을 가져옴
			let product;						// 상품을 저장할 변수
			if (products.length > 0) {			// 상품이 이미 카트에 있는 경우
				product = products[0];			// 첫 번째 상품을 가져옴					
			}
			
			if(product) {						// 상품이 이미 있는 경우
				const oldQuantity = product.cartItem.quantity;	// 기존 수량을 가져옴
				newQuantity = oldQuantity + 1;	// 수량을 1 증가
				return product;					// 상품을 반환
			}
			return Product.findByPk(prodId);	// 상품을 찾아 반환
		})
		.then(product => {
			return fetchedCart.addProduct(product, {	// 카트에 상품을 추가
				through: { quantity: newQuantity }		// 수량을 설정
			});
		})		
		.then(() => {
			res.redirect('/cart');				// 카트 페이지로 리다이렉트
		})
		.catch((err) => console.log(err));
};

// 카트에서 상품 삭제
exports.postCartDeleteProduct = (req, res, next) => {
	const prodId = req.body.productId; // 상품 ID를 가져옴
	req.user
		.getCart()
		.then(cart => {
			return cart.getProducts({ where: { id: prodId } });	// 카트에서 상품을 찾아 반환
		})
		.then(products => {							// 상품을 가져옴
			const product = products[0];			// 첫 번째 상품을 가져옴
			return product.cartItem.destroy(); 		// 상품을 삭제
		})
		.then(() => {
			res.redirect('/cart');					// 카트 페이지로 리다이렉트
		})
		.catch((err) => console.log(err))	
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
