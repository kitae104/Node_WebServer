const Sequelize = require('sequelize');
const sequelize = require('../../util/database');

const CartItem = sequelize.define('cartItem', {
	id: {
		// 카트 ID
		type: Sequelize.INTEGER, // 데이터 타입은 정수형
		autoIncrement: true, // 자동 증가
		allowNull: false, // 널 값 허용 안함
		primaryKey: true, // 기본 키
	},
	quantity: Sequelize.INTEGER, // 수량
});

module.exports = CartItem;
