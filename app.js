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
const multer = require('multer'); // 파일 업로드 미들웨어

const errorController = require('./controllers/error'); // 에러 컨트롤러
const User = require('./models/user'); // 사용자 모델

//==========================================================================================
// figlet을 이용한 콘솔 로고 출력
//==========================================================================================
figlet('ki tae - node js', function (err, data) {
	if (err) {
		console.log('Something went wrong...');
		console.dir(err);
		return;
	}
	console.log(data);
});

//==========================================================================================
// Express 앱 생성
//==========================================================================================
const app = express();
const PORT = process.env.PORT;
const MONGODB_URI = process.env.MONGODB_URI;
const USER_ID = process.env.USER_ID;
const SECRET = process.env.SECRET_KEY;

//==========================================================================================
// MongoDB 세션 저장소 생성
//==========================================================================================
const store = new MongoDBStore({
	uri: MONGODB_URI,
	collection: 'sessions',
});

store.on('error', function(error) {
    console.log('Session Store Error:', error);
});

//==========================================================================================
// 미들웨어 등록(use)
//==========================================================================================
const csrfProtection = csrf(); // CSRF 보안 미들웨어 생성
app.use(cors());

const fileStorage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, 'images'); // 파일 저장 경로
	},
	filename: (req, file, cb) => {
		cb(null, new Date().toISOString().replace(/:/g, '-') + '-' + file.originalname); // 파일명
	},
});

const fileFilter = (req, file, cb) => {
	if (
		file.mimetype === 'image/png' ||
		file.mimetype === 'image/jpg' ||
		file.mimetype === 'image/jpeg'
	) {
		cb(null, true); // 파일 허용
	} else {
		cb(null, false); // 파일 거부
	}
};

//==========================================================================================
// 뷰 엔진 설정
//==========================================================================================
app.set('view engine', 'ejs'); // ejs 템플릿 엔진 설정
app.set('views', 'views'); // views 폴더 설정

//==========================================================================================
// 라우터 등록
//==========================================================================================
const adminRoutes = require('./routes/admin'); // 관리자 라우터
const shopRoutes = require('./routes/shop'); // 상품 라우터
const authRoutes = require('./routes/auth'); // 인증 라우터

app.use(bodyParser.json()); // body-parser 미들웨어 등록
app.use(bodyParser.urlencoded({ extended: false })); // body-parser 미들웨어 등록

app.use(multer({ storage: fileStorage, fileFilter: fileFilter }).single('image')); // 파일 업로드 미들웨어 등록
// app.use(multer({ dest: 'images' }).single('image')); // public/images 폴더에 이미지 저장

app.use(express.static(path.join(__dirname, 'public'))); // 정적 파일 미들웨어 등록

app.use(
	// 세션 미들웨어 등록
	session({
		secret: SECRET, // 세션 암호화 키
		resave: false, // 세션을 항상 저장할지 여부
		saveUninitialized: false, // 초기화되지 않은 세션을 저장소에 저장할지 여부
		store: store, // 세션 저장소
	})
);

app.use(csrfProtection); // CSRF 보안 미들웨어 등록
app.use(flash()); // 플래시 미들웨어 등록

// 모든 요청에 대한 CSRF 토큰을 뷰로 전달
app.use((req, res, next) => {
	res.locals.isAuthenticated = req.session.isLoggedIn; // 사용자 인증 여부를 뷰로 전달
	res.locals.csrfToken = req.csrfToken(); // CSRF 토큰을 뷰로 전달
	next();
});

//사용자 정보를 미들웨어로 등록
app.use((req, res, next) => {
	if (!req.session.user) {
		return next();
	}
	User.findById(req.session.user._id) // 세션에 저장된 사용자 ID로 사용자를 찾음
		.then((user) => {
			if (!user) {
				return next();
			}
			req.user = user; // 사용자 정보를 req.user에 저장
			next();
		})
		.catch((err) => {
			next(new Error(err)); // 에러 발생 시 다음 미들웨어로 전달
		});
});

app.use('/admin', adminRoutes); // admin 라우터 등록
app.use(shopRoutes); // shop 라우터 등록
app.use(authRoutes); // auth 라우터 등록

app.get('/500', errorController.get500); // 500 에러 페이지

app.use(errorController.get404); // 404 에러 페이지

app.use((req, res, next) => {
	console.log('Middleware check1:', req.user);
	console.log('Middleware check2:', req.session.isLoggedIn);
	next();
});

//=================================================================
// 에러 처리 미들웨어 등록
//=================================================================
// app.use((error, req, res, next) => {
// 	res.status(500).render('500', {
// 		pageTitle: '서버 오류',
// 		path: '/500',
// 		isAuthenticated: req.session.isLoggedIn,
// 	});
// });

//=================================================================
// MongoDB 연결
//=================================================================
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
