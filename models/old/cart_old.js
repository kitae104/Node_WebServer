const fs = require('fs');
const path = require('path');

const p = path.join(
    path.dirname(process.mainModule.filename),
    'data',
    'cart.json'
);

module.exports = class Cart {    
    static addProduct(id, productPrice) {
        // 이전에 카트에 담긴 상품이 있는지 확인
        fs.readFile(p, (err, fileContent) => {
            let cart = { products: [], totalPrice: 0 };
            if (!err) {
                cart = JSON.parse(fileContent);
            }

            // 카트 분석 및 상품 찾기
            const existingProductIndex = cart.products.findIndex(prod => prod.id === id);   // 이미 카트에 있는 상품인지 확인
            const existingProduct = cart.products[existingProductIndex]; // 이미 카트에 있는 상품인지 확인
            
            let updateProduct;  // 업데이트할 상품
            if(existingProduct) {
                updateProduct = { ...existingProduct };     // 이미 카트에 있는 상품이라면
                updateProduct.qty = updateProduct.qty + 1;  // 수량을 1 증가
                cart.products = [...cart.products];         // 기존 상품을 복사
                cart.products[existingProductIndex] = updateProduct; // 업데이트된 상품을 저장
            } else {
                updateProduct = { id: id, qty: 1 };                 // 새로운 상품이라면
                cart.products = [...cart.products, updateProduct];  // 새로운 상품을 추가
            }
            cart.totalPrice = cart.totalPrice + +productPrice;  // 총 가격을 계산
            fs.writeFile(p, JSON.stringify(cart), err => {      // 카트 정보를 저장
                console.log(err);
            });
        });
    };

    // 제품 정보를 삭제하는 메소드
    static deleteProduct(id, productPrice) {
        fs.readFile(p, (err, fileContent) => {
            if(err) {
                return;
            }
            const updatedCart = { ...JSON.parse(fileContent) };
            const product = updatedCart.products.find(prod => prod.id === id);
            if(!product) {  // 상품이 없다면
                return;     // 종료
            }
            const productQty = product.qty;
            updatedCart.products = updatedCart.products.filter(prod => prod.id !== id);            
            updatedCart.totalPrice = updatedCart.totalPrice - productPrice * productQty;
            fs.writeFile(p, JSON.stringify(updatedCart), err => {
                console.log(err);
            });
        });
    };

    // 카트 정보를 가져오는 메소드
    static getCart(callback){
        fs.readFile(p, (err, fileContent) => {
            const cart = JSON.parse(fileContent);   // 카트 정보를 가져옴
            if(err) {
                callback(null); // 에러가 있다면
            } else {
                callback(cart); // 카트 정보를 콜백함수로 전달
            }
        });
    }
}