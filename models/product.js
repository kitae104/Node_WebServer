const products = [];    // 상품 정보를 저장할 배열

module.exports = class Product {
    constructor(title) {        // 생성자 함수
        this.title = title;     // 상품명
    }

    save() {                    // 상품 정보를 저장하는 메소드
        products.push(this);    // 상품 정보를 배열에 저장
    }

    static fetchAll() {         // 모든 상품 정보를 가져오는 메소드
        return products;        // 상품 정보 배열을 리턴
    }
}