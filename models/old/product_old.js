const db = require('../../util/database'); // 데이터베이스 모듈
const Cart = require('../cart'); // 장바구니 모듈

module.exports = class Product {
	constructor(id, title, imageUrl, description, price) {
		// 생성자 함수
		this.id = id; // 상품 ID
		this.title = title; // 상품명
		this.imageUrl = imageUrl; // 이미지 URL
		this.description = description; // 상품 설명
		this.price = price; // 상품 가격
	}

	save() {
		// 상품 정보를 저장하는 메소드
		return db.execute(
			'INSERT INTO products (title, price, imageUrl, description) VALUES (?, ?, ?, ?)',
			[this.title, this.price, this.imageUrl, this.description]
		); // 상품 정보를 데이터베이스에 저장
	}

	// 모든 상품 정보를 가져오는 메소드
	static fetchAll() {
		return db.execute('SELECT * FROM products'); // 데이터베이스에 저장된 모든 상품 정보를 가져옴
	}

	// 상품 상세 정보를 가져오는 메소드
	static findById(id) {
		return db.execute('SELECT * FROM products where products.id = ?', [id]); // 상품 ID에 해당하는 상품 정보를 가져옴
	}

	// 상품을 삭제하는 메소드
	static deleteById(id) {
		return db.execute('DELETE FROM products WHERE id = ?', [id]); // 상품 ID에 해당하는 상품 정보를 삭제
	}
};
