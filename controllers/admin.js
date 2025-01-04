const Product = require('../models/product'); // Product 모델 클래스를 가져옴

exports.getAddProduct = (req, res, next) => {
	res.render('admin/add-product', {         // add-product.ejs 렌더링
        pageTitle: 'Add Product',       // 페이지 제목
        path: '/admin/add-product',     // 현재 경로
        formsCSS: true,                 // CSS 파일 적용 여부
        productCSS: true,               // CSS 파일 적용 여부
        activeAddProduct: true          // 메뉴 활성화 여부
    });
};

exports.postAddProduct = (req, res, next) => {
    const title = req.body.title;               // 상품명
    const imageUrl = req.body.imageUrl;         // 이미지 URL
    const price = req.body.price;               // 상품 가격
    const description = req.body.description;   // 상품 설명

	const product = new Product(title, imageUrl, description, price); // Product 모델 클래스의 객체 생성
	product.save(); 							 // 상품 정보를 저장
	res.redirect('/');
};

exports.getProducts = (req, res, next) => {
    Product.fetchAll((products) => {
        res.render('admin/products', {
            prods: products,
            pageTitle: 'Admin Products',
            path: '/admin/products',
        })
    });
};