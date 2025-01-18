const mongodb = require('mongodb');
const getDb = require('../util/database').getDb;  // getDb 함수 가져오기

// 상품 모델
class Product {
    constructor(title, price, description, imageUrl, id, userId) {
        this.title = title;
        this.price = price;
        this.description = description;
        this.imageUrl = imageUrl;
        this._id = id ? new mongodb.ObjectId(id) : null;    // 상품 ID 생성 (있으면 ObjectId로 변환, 없으면 null)
        this.userId = userId;
    }

    save() {
        const db = getDb();
        let dbOp;

        if(this._id) {  // 상품이 이미 있으면 - 업데이트 
            dbOp = db
                .collection('products')
                .updateOne({ _id: this._id }, { $set: this }); // 상품 수정
        } else {        // 상품이 없으면 - 추가
            dbOp = db.collection('products').insertOne(this); // 상품 추가            
        }
        
        return dbOp
            .then(result => {
                console.log(result);
            })
            .catch(err => console.log(err));

    }

    static fetchAll() {
        const db = getDb();                     // db 가져오기
        return db
            .collection('products')             // products 컬렉션 가져오기
            .find()                             // 모든 상품 가져오기
            .toArray()                          // 배열로 변환
            .then(products => {                 // 상품 목록 반환
                console.log(products);          
                return products;                // 상품 목록 반환
            })
            .catch(err => console.log(err));
    }

    static findById(prodId) {
        const db = getDb();                                 // db 가져오기
        console.log("1 : " + prodId);
        return db
            .collection('products')                         // products 컬렉션 가져오기
            .find({ _id: new mongodb.ObjectId(prodId) })    // 상품 ID로 상품 찾기(조건 검색)
            .next()                                         // 상품 반환
            .then(product => {                              // 상품 반환
                console.log(product);
                return product;                             // 상품 반환
            })
            .catch(err => console.log(err));
    }

    static deleteById(prodId) {
        const db = getDb();                                     // db 가져오기
        return db
            .collection('products')                             // products 컬렉션 가져오기
            .deleteOne({ _id: new mongodb.ObjectId(prodId)})    // 상품 삭제
            .then(result => {                                   // 결과 반환
                console.log('삭제 완료');
            })
            .catch(err => console.log(err));
    }
}   

module.exports = Product;    // 상품 모델을 내보냄