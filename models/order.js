const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const orderSchema = new Schema({
	products: [
		// 상품 목록
		{
			product: { type: Object, required: true }, // 상품 정보
			quantity: { type: Number, required: true }, // 수량
		},
	],
	user: {		                            // 사용자 정보
		email: {			                    // 이름
			type: String,
			required: true,
		},
		userId: {			                // 사용자 ID
			type: Schema.Types.ObjectId,
			required: true,
			ref: 'User',
		},
	},
});

module.exports = mongoose.model('Order', orderSchema); // Order 모델 내보냄
