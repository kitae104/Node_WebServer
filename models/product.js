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
            callback([]);                          // 빈 배열을 리턴
        } else {
            callback(JSON.parse(fileContent));         // 파일 내용을 가져와서 JSON으로 변환
        }
    });        
};

module.exports = class Product {
    constructor(title) {
        // 생성자 함수
        this.title = title; // 상품명
    }

    save() {        // 상품 정보를 저장하는 메소드
        getProductsFromFile(products => {
            products.push(this);
            fs.writeFile(p, JSON.stringify(products), err => {
                console.log(err);
            });
        });        
    }

    static fetchAll(callback) {
        getProductsFromFile(callback);
    }
};
