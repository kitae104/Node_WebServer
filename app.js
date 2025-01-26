const figlet = require('figlet');
const express = require('express');
const dotenv = require('dotenv').config();
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

const mongoose = require('mongoose'); // 몽구스 모듈
const session = require('express-session'); // 세션 미들웨어
const MongoDBStore = require('connect-mongodb-session')(session); // MongoDB 세션 저장소
const csrf = require('csurf'); // CSRF 보안 미들웨어
const flash = require('connect-flash'); // 플래시 미들웨어

const errorController = require('./controllers/error'); // 에러 컨트롤러
const User = require('./models/user'); // 사용자 모델

figlet('Node  Server', function (err, data) {
	if (err) {
		console.log('Something went wrong...');
		console.dir(err);
		return;
	}
	console.log(data);
});

const app = express();
const PORT = process.env.PORT;
const MONGODB_URI = process.env.MONGODB_URI;
const USER_ID = process.env.USER_ID;
const SECRET = process.env.SECRET_KEY;

const store = new MongoDBStore({
	// MongoDB 세션 저장소 생성
	uri: MONGODB_URI,
	collection: 'sessions',
});

const csrfProtection = csrf(); // CSRF 보안 미들웨어 생성

app.set('view engine', 'ejs'); // ejs 템플릿 엔진 설정
app.set('views', 'views'); // views 폴더 설정

const adminRoutes = require('./routes/admin'); // 관리자 라우터
const shopRoutes = require('./routes/shop'); // 상품 라우터
const authRoutes = require('./routes/auth'); // 인증 라우터

//==========================================================================================
// 미들웨어 등록(use)
//==========================================================================================
app.use(cors());

app.use(bodyParser.json()); // body-parser 미들웨어 등록
app.use(bodyParser.urlencoded({ extended: false })); // body-parser 미들웨어 등록

app.use(express.static(path.join(__dirname, 'public'))); // 정적 파일 미들웨어 등록
app.use(
	session({
		// 세션 미들웨어 등록
		secret: SECRET, // 세션 암호화 키
		resave: false, // 세션을 항상 저장할지 여부
		saveUninitialized: false, // 초기화되지 않은 세션을 저장소에 저장할지 여부
		store: store, // 세션 저장소
	})
);

app.use(csrfProtection); 	// CSRF 보안 미들웨어 등록
app.use(flash()); 			// 플래시 미들웨어 등록

//사용자 정보를 미들웨어로 등록
app.use((req, res, next) => {
	if (!req.session.user) {
		// 세션에 사용자 정보가 없으면
		return next(); // 다음 미들웨어로 이동
	}
	User.findById(req.session.user._id) // 세션에 저장된 사용자 ID로 사용자를 찾음
		.then((user) => {
			req.user = user; // 사용자 정보를 req.user에 저장
			next();
		})
		.catch((err) => console.log(err));
});

// 모든 요청에 대한 CSRF 토큰을 뷰로 전달
app.use((req, res, next) => {
	res.locals.isAuthenticated = req.session.isLoggedIn; // 사용자 인증 여부를 뷰로 전달
	res.locals.csrfToken = req.csrfToken(); // CSRF 토큰을 뷰로 전달
	next();
});

app.use('/admin', adminRoutes); // admin 라우터 등록
app.use(shopRoutes); // shop 라우터 등록
app.use(authRoutes); // auth 라우터 등록

app.use(errorController.get404); // 404 에러 페이지

mongoose
	.connect(MONGODB_URI)
	.then((result) => {
		app.listen(PORT, () => {
			console.log(`http://localhost:${PORT}`);
		});
	})
	.catch((err) => {
		console.log(err);
	});
