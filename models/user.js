const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({	
	email: {					// 이메일
		type: String,
		required: true,
	},
	password: {					// 비밀번호
		type: String,
		required: true,
	},
	resetToken: String,			// 비밀번호 초기화 토큰
	resetTokenExpiration: Date,	// 비밀번호 초기화 토큰 만료 시간	
	cart: {						// 장바구니
		items: [				// 상품 목록
			{
				productId: { 						// 상품 ID
					type: Schema.Types.ObjectId, 
					ref: 'Product',
					required: true 
				}, 
				quantity: { 						// 수량
					type: Number, 
					required: true 
				}, 
			},
		],
	},
});

// 장바구니에 상품 추가
userSchema.methods.addToCart = function (product) {
	const cartProductIndex = this.cart.items.findIndex((cp) => {	// 장바구니에 이미 상품이 있는지 확인
		return cp.productId.toString() === product._id.toString();	// 상품 ID 비교
	});
	let newQuantity = 1;											// 상품 수량		
	const updatedCartItems = [...this.cart.items];					// 장바구니 목록

	if (cartProductIndex >= 0) {									// 상품이 이미 장바구니에 있는 경우
		newQuantity = this.cart.items[cartProductIndex].quantity + 1;
		updatedCartItems[cartProductIndex].quantity = newQuantity;
	} else {														// 상품이 없는 경우
		updatedCartItems.push({
			productId: product._id,
			quantity: newQuantity,
		});
	}
	const updatedCart = {
		items: updatedCartItems,
	};
	this.cart = updatedCart;
	return this.save();
};

// 장바구니에서 상품 삭제
userSchema.methods.removeFromCart = function (productId) {
	const updatedCartItems = this.cart.items.filter((item) => {
		return item.productId.toString() !== productId.toString();
	});
	this.cart.items = updatedCartItems;
	return this.save();
};

// 장바구니 비우기
userSchema.methods.clearCart = function() {
	this.cart = { items: [] };
	return this.save();
};

module.exports = mongoose.model('User', userSchema); // User 모델 내보냄
