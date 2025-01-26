const dotenv = require('dotenv').config();
const bcrypt = require('bcryptjs');
const User = require('../models/user');

// 로그인 페이지 렌더링
exports.getLogin = (req, res, next) => {
	let message = req.flash('error'); 		// 에러 메시지
	if(message.length > 0) {				// 에러 메시지가 있으면
		message = message[0];				// 첫 번째 에러 메시지를 가져옴
	} else {
		message = null;						// 에러 메시지가 없으면 null
	}
	res.render('auth/login', {		// views/auth/login.ejs 렌더링
		path: '/login', 			// 로그인 페이지로 이동
		pageTitle: '로그인', 		// 페이지 타이틀
		errorMessage: message, 		// 에러 메시지
	});
};

const USER_ID = process.env.USER_ID;

// 로그인 처리
exports.postLogin = (req, res, next) => {
	const email = req.body.email; 			// 이메일
	const password = req.body.password		// 비밀번호
	User.findOne({email: email}) 			// 이메일로 사용자를 찾음
		.then((user) => {
			if (!user) {						// 사용자가 없으면
				req.flash('error', '이메일이나 비밀번호가 일치하지 않습니다.'); // 에러 메시지
				return res.redirect('/login'); 	// 로그인 페이지로 이동
			}
			bcrypt
				.compare(password, user.password)			// 비밀번호 비교
				.then(doMatch => {
					if (doMatch) {							// 비밀번호가 일치하면
						req.session.isLoggedIn = true;		// 세션에 인증 정보를 저장
						req.session.user = user;			// 사용자 정보를 세션에 저장
						return req.session.save((err) => {
							console.log(err);
							res.redirect('/');				// 홈페이지로 이동
						});
					}
					res.redirect('/login');			// 비밀번호가 일치하지 않으면 로그인 페이지로 이동
				})
				.catch((err) => {
					console.log(err);
					res.redirect('/login');
				});			
		})
		.catch((err) => console.log(err));
};

// 로그아웃 처리
exports.postLogout = (req, res, next) => {
	req.session.destroy((err) => {
		console.log('logout:' + err);
		res.redirect('/');
	});
};

// 회원가입 페이지 렌더링
exports.getSignup = (req, res, next) => {
	let message = req.flash('error');		// 에러 메시지
	if(message.length > 0) {				// 에러 메시지가 있으면
		message = message[0];				// 첫 번째 에러 메시지를 가져옴
	} else {
		message = null;						// 에러 메시지가 없으면 null
	}
	res.render('auth/signup', {
		path: '/signup',
		pageTitle: '회원가입',
		errorMessage: message,
	});
};

// 회원가입 처리
exports.postSignup = (req, res, next) => {
	const email = req.body.email;
	const password = req.body.password;
	const confirmPassword = req.body.confirmPassword;

	User.findOne({ email: email }) 				// 이메일로 사용자를 찾음
		.then((userDoc) => {					// 사용자를 찾으면
			if (userDoc) {						// 사용자가 있으면
				req.flash('error', '이미 사용중인 이메일입니다. 다른 이메일을 사용하세요.'); // 에러 메시지
				return res.redirect('/signup'); // 회원가입 페이지로 이동
			}
			return bcrypt
				.hash(password, 12)
				.then((hashedPassword) => {
					const user = new User({				// 사용자가 없으면
						email: email, 					// 사용자 정보 생성
						password: hashedPassword,
						cart: { items: [] },			// 장바구니 정보
					});
					return user.save(); 				// 사용자 정보를 저장
				})
				.then((result) => {
					res.redirect('/login'); 			// 로그인 페이지로 이동
				});
		})
		.catch((err) => console.log(err));
};
