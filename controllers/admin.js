const Product = require('../models/product'); // Product 모델 클래스를 가져옴

// 상품 추가 페이지 라우팅
exports.getAddProduct = (req, res, next) => {
	res.render('admin/edit-product', {
		// add-product.ejs 렌더링
		pageTitle: 'Add Product', // 페이지 제목
		path: '/admin/add-product', // 현재 경로
        editing: false,
	});
};

// 상품 추가
exports.postAddProduct = (req, res, next) => {
	const title = req.body.title; // 상품명
	const imageUrl = req.body.imageUrl; // 이미지 URL
	const price = req.body.price; // 상품 가격
	const description = req.body.description; // 상품 설명

    // Product 모델을 이용하여 상품 생성 -> 데이터베이스에 저장
    req.user                            // 연관 관계 메서드를 사용하여 사용자와 상품을 연결
        .createProduct({                // 현재 사용자에게 상품을 생성	
            title: title,
            price: price,
            imageUrl: imageUrl,
            description: description,      
        })
        .then(() => {
            console.log('Created Product');
            res.redirect('/');
        })
        .catch((err) => console.log(err));
};

// 상품 수정 페이지 라우팅
exports.getEditProduct = (req, res, next) => {
    const editMode = req.query.edit;    // URL 쿼리로부터 edit 값을 가져옴
    console.log(editMode);
    if(!editMode) {
        return res.redirect('/');
    }

    const prodId = req.params.productId; // URL로부터 productId를 가져옴
    req.user
        .getProducts({ where: { id: prodId } }) // 현재 사용 --> 리스트로 반환   
        // .findByPk(prodId)                    // 상품 ID로 상품을 찾음
        .then(products => {                     // 상품 목록을 가져옴
            const product = products[0];        // 상품 목록 중 첫 번째 상품
            if(!product) {                      // 상품이 없으면                                         
                return res.redirect('/');       // 홈으로 리다이렉트
            }
            res.render('admin/edit-product', {	
                pageTitle: 'Edit Product',      // 페이지 제목
                path: '/admin/edit-product',    // 현재 경로
                editing: editMode,
                product: product
            });
        })
        .catch(err => console.log(err));
};

// 상품 수정
exports.postEditProduct = (req, res, next) => {
    const prodId = req.body.productId;          // 상품 ID
    const updatedTitle = req.body.title;        // 수정된 상품명
    const updatedPrice = req.body.price;        // 수정된 상품 가격
    const updatedImageUrl = req.body.imageUrl;  // 수정된 이미지 URL
    const updatedDesc = req.body.description;   // 수정된 상품 설명

    // Product 모델을 이용하여 상품 수정 -> 데이터베이스에 저장
    Product
        .findByPk(prodId)                       // 상품 ID로 상품을 찾음
        .then(product => {
            product.title = updatedTitle;       // 상품명 수정
            product.price = updatedPrice;       // 상품 가격 수정
            product.imageUrl = updatedImageUrl; // 이미지 URL 수정
            product.description = updatedDesc;  // 상품 설명 수정
            return product.save();              // 수정된 상품을 저장
        })
        .then(result => {
            console.log('UPDATED PRODUCT!');
            res.redirect('/admin/products');
        })
        .catch(err => console.log(err));    
};

// 상품 목록 페이지 라우팅
exports.getProducts = (req, res, next) => { 
    req.user
        .getProducts()                          // 모든 상품을 가져옴
        .then(products => {                     // 상품 목록을 가져옴
            res.render('admin/products', {      // products.ejs 렌더링
                prods: products,                // 상품 목록
                pageTitle: 'Admin Products',    // 페이지 제목
                path: '/admin/products',        // 현재 경로
            });
        })
        .catch(err => console.log(err));	
};

// 상품 삭제
exports.postDeleteProduct = (req, res, next) => {    
    const prodId = req.body.productId; // 상품 ID
    Product
        .findByPk(prodId)                   // 상품 ID로 상품을 찾음
        .then(product => {                  // 상품을 찾으면
            return product.destroy();       // 상품 삭제
        })
        .then(result => {                   // 삭제 성공하면            
            res.redirect('/admin/products'); // 상품 목록 페이지로 리다이렉트
        })
        .catch(err => console.log(err));
};
