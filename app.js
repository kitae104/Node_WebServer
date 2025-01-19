const figlet = require('figlet');
const express = require('express');
const bodyParser = require("body-parser");
const cors = require('cors');
const path = require('path');

const errorController = require('./controllers/error');			// 에러 컨트롤러
const mongoConnect = require('./util/database').mongoConnect;	// 몽고디비 모듈
const User = require('./models/user');							// 사용자 모델

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
	User.findById('678baa219b5d99b7d229bc7e')
		.then(user => {
			req.user = new User(user.name, user.email, user.cart, user._id); // 사용자 정보를 req.user에 저장
			next();
		})
		.catch(err => console.log(err));
}); 

app.use('/admin', adminRoutes);                        		// admin 라우터 등록
app.use(shopRoutes);										// shop 라우터 등록

app.use(errorController.get404);							// 404 에러 페이지

mongoConnect(() => {									// 몽고디비 연결
	app.listen(port, () => {
		console.log(`http://localhost:${port}`);
	});
});

