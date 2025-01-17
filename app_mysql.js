const figlet = require('figlet');
const express = require('express');
const bodyParser = require("body-parser");
const cors = require('cors');
const path = require('path');

const errorController = require('./controllers/error');	// 에러 컨트롤러
const sequelize = require('./util/database');			// 시퀄라이즈 모듈

// 모델 등록
const Product = require('./models/product');
const User = require('./models/user');
const Cart = require('./models/cart');
const CartItem = require('./models/cart-item');
const Order = require('./models/order');
const OrderItem = require('./models/order-item');

figlet('Node  Server', function (err, data) {
	if (err) {
		console.log('Something went wrong...');
		console.dir(err);
		return;
	}
	console.log(data);
});

const app = express();
const port = 3333;

app.set('view engine', 'ejs');                             // ejs 템플릿 엔진 설정
app.set('views', 'views');                                 // views 폴더 설정

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

//==========================================================================================
// 미들웨어 등록(use)
//==========================================================================================
app.use(cors());

app.use(bodyParser.json());                                 // body-parser 미들웨어 등록 
app.use(bodyParser.urlencoded({ extended: false }));        // body-parser 미들웨어 등록

app.use(express.static(path.join(__dirname, 'public')));    // 정적 파일 미들웨어 등록

// 사용자 정보를 미들웨어로 등록
app.use((req, res, next) => {
	User.findByPk(1)
		.then(user => {
			req.user = user;
			next();
		})
		.catch(err => console.log(err));
}); 

app.use('/admin', adminRoutes);                        		// admin 라우터 등록
app.use(shopRoutes);										// shop 라우터 등록

app.use(errorController.get404);							// 404 에러 페이지

//==========================================================================================
// 관계 설정
//==========================================================================================
Product.belongsTo(User, { constraints: true, onDelete: 'CASCADE' }); // 상품과 사용자의 관계 설정 - 상품은 사용자에 속해야 한다.
User.hasMany(Product);									// 사용자와 상품의 관계 설정 - 사용자는 여러 상품을 가질 수 있다.
User.hasOne(Cart);										// 사용자와 카트의 관계 설정 - 사용자는 하나의 카트만 가질 수 있다.
Cart.belongsTo(User);									// 카트와 사용자의 관계 설정 - 카트는 사용자에 속해야 한다
Cart.belongsToMany(Product, { through: CartItem });		// 카트와 상품의 관계 설정 - 카트는 여러 상품을 가질 수 있다.
Product.belongsToMany(Cart, { through: CartItem });		// 상품과 카트의 관계 설정 - 상품은 여러 카트에 담길 수 있다.
Order.belongsTo(User);									// 주문과 사용자의 관계 설정 - 주문은 사용자에 속해야 한다.
User.hasMany(Order);									// 사용자는 여러 주문을 가질 수 있다.
Order.belongsToMany(Product, { through: OrderItem });	// 주문과 상품의 관계 설정 - 주문은 여러 상품을 가질 수 있다.

//==========================================================================================
// 시퀄라이즈 동기화
//==========================================================================================
sequelize
	//.sync({ force: true })				// 테이블 재생성 -> 변경사항이 있을 때만 사용
	.sync()									// 데이터 유지를 위해서는 이거 사용 
	.then(result => {
		return User.findByPk(1);
	})
	.then(user => {
		if (!user) {
			return User.create({ name: 'Tester', email: 'test@test.com' });
		}
		return user;
	})
	.then(user => {
		return user.createCart();
	})
	.then(cart => {		
		app.listen(port, () => {
			console.log(`http://localhost:${port}`);
		});
	})
	.catch(err => {
		console.log(err);
	});


