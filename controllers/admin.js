const Product = require('../models/product');   // Product 모델 클래스를 가져옴

// 상품 추가 페이지 라우팅
exports.getAddProduct = (req, res, next) => {
	res.render('admin/edit-product', {	// add-product.ejs 렌더링
		pageTitle: '상품 추가',       // 페이지 제목
		path: '/admin/add-product',     // 현재 경로
        editing: false,                 // 수정 여부
	});
};

// 상품 추가
exports.postAddProduct = (req, res, next) => {
	const title = req.body.title;               // 상품명
	const imageUrl = req.body.imageUrl;         // 이미지 URL
	const price = req.body.price;               // 상품 가격
	const description = req.body.description;   // 상품 설명
    const product = new Product(title, price, description, imageUrl, null, req.user._id); // Product 모델 인스턴스 생성
    product
        .save()
        .then(result => {
            console.log('상품 생성');
            res.redirect('/admin/product'); // 상품 목록 페이지로 리다이렉트
        }) 
        .catch(err => console.log(err));    
};

// 상품 수정 페이지 라우팅
exports.getEditProduct = (req, res, next) => {
    const editMode = req.query.edit;    // URL 쿼리로부터 edit 값을 가져옴
    console.log(editMode);
    if(!editMode) {
        return res.redirect('/');
    }

    const prodId = req.params.productId;        // URL로부터 productId를 가져옴    
    Product
        .findById(prodId)                       // 상품 ID로 상품을 찾음
        .then(product => {                      // 상품 목록을 가져옴            
            if(!product) {                      // 상품이 없으면                                         
                return res.redirect('/');       // 홈으로 리다이렉트
            }
            res.render('admin/edit-product', {	
                pageTitle: '상품 수정',      // 페이지 제목
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
    const product = new Product(
            updatedTitle,
            updatedPrice,
            updatedDesc,
            updatedImageUrl,
            prodId
        );
        product
            .save()
            .then(result => {
                console.log('상품 수정 완료!');
                res.redirect('/admin/products');
            })
            .catch(err => console.log(err));
    };

// 상품 목록 페이지 라우팅
exports.getProducts = (req, res, next) => { 
    Product.fetchAll()                          // 모든 상품을 가져옴    
        .then(products => {                     // 상품 목록을 가져옴
            res.render('admin/products', {      // products.ejs 렌더링
                prods: products,                // 상품 목록
                pageTitle: '관리자 상품',    // 페이지 제목
                path: '/admin/products',        // 현재 경로
            });
        })
        .catch(err => console.log(err));	
};

// // 상품 삭제
exports.postDeleteProduct = (req, res, next) => {    
    const prodId = req.body.productId; // 상품 ID
    Product
        .deleteById(prodId)                 // 상품 ID로 상품을 찾음        
        .then(() => {                       // 삭제 성공하면            
            console.log('상품 삭제');
            res.redirect('/admin/products');// 상품 목록 페이지로 리다이렉트
        })
        .catch(err => console.log(err));
};
