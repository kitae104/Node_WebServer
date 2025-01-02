const products = []; // 상품 정보를 저장할 배열

exports.getAddProduct = (req, res, next) => {
	res.render('add-product', {         // add-product.ejs 렌더링
        pageTitle: 'Add Product',       // 페이지 제목
        path: '/admin/add-product',     // 현재 경로
        formsCSS: true,                 // CSS 파일 적용 여부
        productCSS: true,               // CSS 파일 적용 여부
        activeAddProduct: true          // 메뉴 활성화 여부
    });
};

exports.postAddProduct = (req, res, next) => {
	products.push({ title: req.body.title }); // 상품 정보를 배열에 저장
	res.redirect('/');
};

exports.getProducts = (req, res, next) => {
	res.render('shop', {
		prods: products,
		pageTitle: 'Shop',
		path: '/',
		hasProducts: products.length > 0,
		activeShop: true,
		productCSS: true,
	});
};