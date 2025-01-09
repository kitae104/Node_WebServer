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
Product.belongsTo(User, { constraints: true, onDelete: 'CASCADE' });
User.hasMany(Product);
User.hasOne(Cart);
Cart.belongsTo(User);
Cart.belongsToMany(Product, { through: CartItem });
Product.belongsToMany(Cart, { through: CartItem });


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


