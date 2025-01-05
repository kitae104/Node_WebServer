const fs = require("fs"); // 파일 시스템 모듈을 가져옴
const path = require("path"); // 경로 모듈을 가져옴
const Cart = require("./cart");

const p = path.join(
    path.dirname(process.mainModule.filename),
    'data',
    'products.json'
);

const getProductsFromFile = (callback) => {
    
    fs.readFile(p, (err, fileContent) => {      // 파일을 읽음
        if (err) {                              // 파일을 읽는데 에러가 있다면
            callback([]);                       // 빈 배열을 리턴
        } else {
            callback(JSON.parse(fileContent));  // 파일 내용을 가져와서 JSON으로 변환
        }
    });        
};

module.exports = class Product {
    constructor(id, title, imageUrl, description, price) {        // 생성자 함수 
        this.id = id;                   // 상품 ID
        this.title = title;             // 상품명
        this.imageUrl = imageUrl;       // 이미지 URL
        this.description = description; // 상품 설명
        this.price = price;             // 상품 가격
    }

    save() {        // 상품 정보를 저장하는 메소드        
        getProductsFromFile(products => {
            if(this.id){
                const existingProductIndex = products.findIndex(p => p.id === this.id);  // 이미 존재하는 상품인지 확인
                const updatedProducts = [...products];          // 기존 상품을 복사
                updatedProducts[existingProductIndex] = this;   // 업데이트된 상품을 저장
                fs.writeFile(p, JSON.stringify(updatedProducts), err => {
                    console.log(err);
                });
            } else {
                this.id = Math.random().toString();      // 랜덤한 ID를 생성
                products.push(this);
                fs.writeFile(p, JSON.stringify(products), err => {
                    console.log(err);
                });
            }
        });        
    }

    // 모든 상품 정보를 가져오는 메소드
    static fetchAll(callback) {
        getProductsFromFile(callback);
    }

    // 상품 상세 정보를 가져오는 메소드
    static findById(id, callback) {
        getProductsFromFile(products => {
            const product = products.find(p => p.id === id);    // ID로 상품을 찾음
            callback(product);                                  // 상품 정보를 콜백함수로 전달
        });
    }

    // 상품을 삭제하는 메소드
    static deleteById(id) {
        getProductsFromFile(products => {
            const product = products.find(p => p.id === id);            // ID로 상품을 찾음
            const updatedProducts = products.filter(p => p.id !== id);  // 삭제할 상품을 제외한 상품들을 필터링
            fs.writeFile(p, JSON.stringify(updatedProducts), err => {
                if(!err) {
                    Cart.deleteProduct(id, product.price);              // 카트에서 상품 삭제
                }
            });
        });
    }
};
