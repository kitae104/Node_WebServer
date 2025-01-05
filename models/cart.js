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
}