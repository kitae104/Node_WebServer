const Product = require('../models/product'); // Product 모델 클래스를 가져옴

exports.getAddProduct = (req, res, next) => {
	res.render('admin/edit-product', {
		// add-product.ejs 렌더링
		pageTitle: 'Add Product', // 페이지 제목
		path: '/admin/add-product', // 현재 경로
        editing: false,
	});
};

exports.postAddProduct = (req, res, next) => {
	const title = req.body.title; // 상품명
	const imageUrl = req.body.imageUrl; // 이미지 URL
	const price = req.body.price; // 상품 가격
	const description = req.body.description; // 상품 설명

	const product = new Product(null, title, imageUrl, description, price); // Product 모델 클래스의 객체 생성
	product.save()
        .then(() => {
            res.redirect('/');
        })
        .catch(err => console.log(err)); // 상품 정보를 저장
	res.redirect('/');
};

exports.getEditProduct = (req, res, next) => {
    const editMode = req.query.edit;    // URL 쿼리로부터 edit 값을 가져옴
    console.log(editMode);
    if(!editMode) {
        return res.redirect('/');
    }

    const prodId = req.params.productId; // URL로부터 productId를 가져옴

    Product.findById(prodId, product => {
        if(!product) {
            return res.redirect('/');
        }
        res.render('admin/edit-product', {	
            pageTitle: 'Edit Product', // 페이지 제목
            path: '/admin/edit-product', // 현재 경로
            editing: editMode,
            product: product
        });
    });
};

exports.postEditProduct = (req, res, next) => {
    console.log("postEditProduct");
    const prodId = req.body.productId;          // 상품 ID
    const updatedTitle = req.body.title;        // 수정된 상품명
    const updatedPrice = req.body.price;        // 수정된 상품 가격
    const updatedImageUrl = req.body.imageUrl;  // 수정된 이미지 URL
    const updatedDesc = req.body.description;   // 수정된 상품 설명

    const updatedProduct = new Product(prodId, updatedTitle, updatedImageUrl, updatedDesc, updatedPrice); // 수정된 상품 정보를 저장
    updatedProduct.save();
    res.redirect('/admin/products');
};

exports.getProducts = (req, res, next) => {
	Product.fetchAll((products) => {
		res.render('admin/products', {
			prods: products,
			pageTitle: 'Admin Products',
			path: '/admin/products',
		});
	});
};

exports.postDeleteProduct = (req, res, next) => {    
    const prodId = req.body.productId; // 상품 ID
    console.log("postDeleteProduct : " + prodId);
    Product.deleteById(prodId); // 상품 삭제
    res.redirect('/admin/products'); 
};
