const mongodb = require('mongodb'); 				// mongodb 모듈 가져오기
const getDb = require('../util/database').getDb; 	// getDb 함수 가져오기
const ObjectId = mongodb.ObjectId; 					// ObjectId 가져오기

class User {
	constructor(username, email, cart, id) {
		this.name = username;
		this.email = email;
		this.cart = cart 			// 카트 정보 { items: [] }
		this._id = id; 				// 사용자 ID
	}

	// 사용자 정보 저장
	save() {
		const db = getDb();
		return db.collection('users').insertOne(this);
	}

	// 카트에 상품 추가
	addToCart(product) {
		const cartProductIndex = this.cart.items.findIndex((cp) => {
			return cp.productId.toString() === product._id.toString();
		});
		let newQuantity = 1;
		const updatedCartItems = [...this.cart.items]; // 업데이트할 카트 정보

		if (cartProductIndex >= 0) {
			newQuantity = this.cart.items[cartProductIndex].quantity + 1; // 상품이 이미 카트에 있는 경우 수량 증가
			updatedCartItems[cartProductIndex].quantity = newQuantity; // 상품 수량 업데이트
		} else {
			// 상품이 카트에 없는 경우 상품 추가
			updatedCartItems.push({
				productId: new ObjectId(product._id),
				quantity: newQuantity,
			});
		}
		const updatedCart = {
			items: updatedCartItems, // 업데이트된 카트 정보
		};
		const db = getDb();
		return db
			.collection('users')
			.updateOne(
				{ _id: new ObjectId(this._id) },
				{ $set: { cart: updatedCart } }
			);
	}

	getCart() {
		const db = getDb();
		const productIds = this.cart.items.map((i) => {
			return i.productId; // 카트에 있는 상품 ID 가져오기
		});
		return db
			.collection('products') // products 컬렉션 가져오기
			.find({ _id: { $in: productIds } }) // 카트에 있는 상품 찾기
			.toArray() // 배열로 변환
			.then((products) => {
				return products.map((p) => {
					return {
						...p,                   // 상품 정보
						quantity: this.cart.items.find((i) => {                 // 상품 수량
							return i.productId.toString() === p._id.toString(); // 상품 ID 비교
						}).quantity,
					};
				});
			})
			.catch((err) => console.log(err)); // 에러 처리
	}

    deleteItemFromCart(productId) {
        const updatedCartItems = this.cart.items.filter(item => {
            return item.productId.toString() !== productId.toString();
        });

        const db = getDb();
		return db
			.collection('users')
			.updateOne(
				{ _id: new ObjectId(this._id) },
				{ $set: { cart: {items: updatedCartItems} } }
			);
    }

	addOrder() {
		const db = getDb();							// db 가져오기
		return this.getCart()						// 카트 정보 가져오기
			.then(products => {						// 상품 정보 반환
			const order = {							// 주문 정보
				items : products,					// 주문 상품 정보
				user : { 							// 사용자 정보
					_id: new ObjectId(this._id), 	// 사용자 ID
					name: this.name,				// 사용자 이름
				} 
			};
			return db								// db 반환
				.collection('orders')				// orders 컬렉션 가져오기
				.insertOne(order)					// 주문 추가
		})								
		.then(result => {										
			this.cart = { items: []};						// 카트 비우기
			return db										// db 반환
				.collection('users')						// users 컬렉션 가져오기	
				.updateOne(									// 사용자 업데이트
					{ _id: new ObjectId(this._id) },		// 사용자 ID로 사용자 찾기	
					{ $set: { cart: { items: [] } } }		// 카트 비우기
				);
		});
	}

	getOrders() {
		const db = getDb();
		return db
			.collection('orders')
			.find({ 'user._id': new ObjectId(this._id) })
			.toArray();
	}

	static findById(userId) {
		const db = getDb(); // db 가져오기
		return db
			.collection('users') 					// users 컬렉션 가져오기
			.findOne({ _id: new ObjectId(userId) }) // 사용자 ID로 사용자 찾기(조건 검색)
			.then((user) => {						// 사용자 반환
				console.log(user);
				return user; 						// 사용자 반환
			})
			.catch((err) => console.log(err)); 		// 에러 처리
	}
}

module.exports = User;
