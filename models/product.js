const fs = require("fs"); // 파일 시스템 모듈을 가져옴
const path = require("path"); // 경로 모듈을 가져옴

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
    constructor(title, imageUrl, description, price) {        // 생성자 함수 
        this.title = title;             // 상품명
        this.imageUrl = imageUrl;       // 이미지 URL
        this.description = description; // 상품 설명
        this.price = price;             // 상품 가격
    }

    save() {        // 상품 정보를 저장하는 메소드
        this.id = Math.random().toString();      // 랜덤한 ID를 생성
        getProductsFromFile(products => {
            products.push(this);
            fs.writeFile(p, JSON.stringify(products), err => {
                console.log(err);
            });
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
};
