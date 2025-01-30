const { validationResult } = require('express-validator'); // express-validator
const Product = require('../models/product'); // Product 모델 클래스를 가져옴

// 상품 추가 페이지 라우팅
exports.getAddProduct = (req, res, next) => {
	res.render('admin/edit-product', {
		pageTitle: '상품 추가', // 페이지 제목
		path: '/admin/add-product', // 현재 경로
		editing: false, // 수정 여부
		hasError: false, // 에러 여부
		errorMessage: null, // 에러 메시지
		validationErrors: [], // 검증 에러
	});
};

// 상품 추가
exports.postAddProduct = (req, res, next) => {
	console.log("postAddProduct 호출 =======================");
	const title = req.body.title; // 상품명
	const imageUrl = req.file; // 이미지 URL
	const price = req.body.price; // 상품 가격
	const description = req.body.description; // 상품 설명	
	console.log(imageUrl); // 이미지 URL 출력
	console.log(req.session.isLoggedIn); // 세션 출력
	const errors = validationResult(req); // 검증 결과

	if(!errors.isEmpty()) { // 에러가 있으면
		console.log(errors.array());
		return res.status(422).render('admin/edit-product', { // 상품 추가 페이지로 이동
			pageTitle: '상품 추가', // 페이지 제목
			path: '/admin/edit-product', // 현재 경로
			editing: false, // 수정 여부
			hasError: true, // 에러 여부
			product: {
				title: title,
				imageUrl: imageUrl,
				price: price,
				description: description,
			},
			errorMessage: errors.array()[0].msg, // 에러 메시지
			validationErrors: errors.array(), // 검증 에러
		});
	}
	
	// Product 모델 인스턴스 생성
	const product = new Product({		
		title: title,
		price: price,
		description: description,
		imageUrl: imageUrl,
		userId: req.user, // 사용자 ID
	});
	product
		.save()
		.then((result) => {
			console.log('상품 생성');
			res.redirect('/admin/products'); // 상품 목록 페이지로 리다이렉트
		})
		.catch((err) => {
			const error = new Error(err);	// 에러 객체 생성
			error.httpStatusCode = 500;		// HTTP 상태 코드 설정
			return next(error);				// 다음 미들웨어로 에러 전달
		});
};

// 상품 수정 페이지 라우팅
exports.getEditProduct = (req, res, next) => {
	const editMode = req.query.edit; // URL 쿼리로부터 edit 값을 가져옴
	if (!editMode) {
		return res.redirect('/');
	}

	const prodId = req.params.productId; // URL로부터 productId를 가져옴
	Product.findById(prodId) // 상품 ID로 상품을 찾음
		.then((product) => {
			//throw new Error('Dummy'); // 강제 에러 발생			
			if (!product) {
				// 상품이 없으면
				return res.redirect('/'); // 홈으로 리다이렉트
			}
			res.render('admin/edit-product', {
				pageTitle: '상품 수정', // 페이지 제목
				path: '/admin/edit-product', // 현재 경로
				editing: editMode,
				product: product,
				hasError: false,
				errorMessage: null,
				validationErrors: []
			});
		})
		.catch((err) => {
			const error = new Error(err);	// 에러 객체 생성
			error.httpStatusCode = 500;		// HTTP 상태 코드 설정
			return next(error);				// 다음 미들웨어로 에러 전달
		});
};

// 상품 수정
exports.postEditProduct = (req, res, next) => {
	const prodId = req.body.productId; // 상품 ID
	const updatedTitle = req.body.title; // 수정된 상품명
	const updatedPrice = req.body.price; // 수정된 상품 가격
	const updatedImageUrl = req.body.imageUrl; // 수정된 이미지 URL
	const updatedDesc = req.body.description; // 수정된 상품 설명

	const errors = validationResult(req);

	if (!errors.isEmpty()) {
		return res.status(422).render('admin/edit-product', {
			pageTitle: 'Edit Product',		// 페이지 제목
			path: '/admin/edit-product',	// 현재 경로
			editing: true,					// 수정 여부
			hasError: true,					// 에러 여부
			product: {
				title: updatedTitle,		// 수정된 상품명
				imageUrl: updatedImageUrl,	// 수정된 이미지 URL
				price: updatedPrice,		// 수정된 상품 가격
				description: updatedDesc,	// 수정된 상품 설명		
				_id: prodId					// 상품 ID
			},
			errorMessage: errors.array()[0].msg,
			validationErrors: errors.array()
		});
	}

	Product.findById(prodId) // 상품 ID로 상품을 찾음
		.then((product) => {			// 상품 목록을 가져옴
			if(product.userId.toString() !== req.user._id.toString()) {	// 사용자 ID가 일치하지 않으면
				return res.redirect('/');
			}
			product.title = updatedTitle; // 상품명 수정
			product.imageUrl = updatedImageUrl; // 이미지 URL 수정
			product.price = updatedPrice; // 가격 수정
			product.description = updatedDesc; // 상품 설명 수정
			return product
				.save() // 상품 저장
				.then((result) => {
					console.log('상품 수정 완료!');
					res.redirect('/admin/products');
				});
		})
		.catch((err) => {
			const error = new Error(err);	// 에러 객체 생성
			error.httpStatusCode = 500;		// HTTP 상태 코드 설정
			return next(error);				// 다음 미들웨어로 에러 전달
		});
};

// 상품 목록 페이지 라우팅
exports.getProducts = (req, res, next) => {
	Product.find({userId: req.user._id}) 	// 로그인 한 사용자와 관련된 모든 상품을 가져옴
		// .populate('userId')          	// userId 필드를 참조하여 User 모델의 정보를 가져옴
		.then((products) => {				// 상품 목록을 가져옴						
			res.render('admin/products', {	
				prods: products, 			// 상품 목록
				pageTitle: '관리자 상품', 	// 페이지 제목
				path: '/admin/products', 	// 현재 경로
			});
		})
		.catch((err) => {
			const error = new Error(err);	// 에러 객체 생성
			error.httpStatusCode = 500;		// HTTP 상태 코드 설정
			return next(error);				// 다음 미들웨어로 에러 전달
		});
};

// 상품 삭제
exports.postDeleteProduct = (req, res, next) => {
	const prodId = req.body.productId; // 상품 ID
	Product.deleteOne({_id: prodId, userId: req.user._id}) // 상품 ID와 사용자 ID로 상품을 찾아 삭제
		.then(() => {
			// 삭제 성공하면
			console.log('상품 삭제');
			res.redirect('/admin/products'); // 상품 목록 페이지로 리다이렉트
		})
		.catch((err) => {
			const error = new Error(err);	// 에러 객체 생성
			error.httpStatusCode = 500;		// HTTP 상태 코드 설정
			return next(error);				// 다음 미들웨어로 에러 전달
		});
};
