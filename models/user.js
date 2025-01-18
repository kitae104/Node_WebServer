const mongodb = require('mongodb');                 // mongodb 모듈 가져오기
const getDb = require('../util/database').getDb;    // getDb 함수 가져오기
const ObjectId = mongodb.ObjectId;                  // ObjectId 가져오기

class User {
    constructor(username, email) {
        this.name = username;
        this.email = email;
    }

    save() {
        const db = getDB();
        return db.collection('users').insertOne(this);
    }

    static findById(userId) {
        const db = getDb();                             // db 가져오기
        return db                                       
            .collection('users')                        // users 컬렉션 가져오기
            .findOne({ _id: new ObjectId(userId) })     // 사용자 ID로 사용자 찾기(조건 검색)
            .then(user => {                             // 사용자 반환
                console.log(user);                      
                return user;                            // 사용자 반환
            })
            .catch(err => console.log(err));            // 에러 처리
    }
}

module.exports = User;