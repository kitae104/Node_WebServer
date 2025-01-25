const dotenv = require('dotenv').config();
const User = require('../models/user');

exports.getLogin = (req, res, next) => {
	res.render('auth/login', {		// views/auth/login.ejs 렌더링
		path: '/login', 			// 로그인 페이지로 이동
		pageTitle: '로그인', 		// 페이지 타이틀
		isAuthenticated: false, 	// 인증 여부
	});
};

const USER_ID = process.env.USER_ID;
exports.postLogin = (req, res, next) => {	
	User.findById(USER_ID)						// 사용자 ID로 사용자를 찾음
		.then((user) => {						// 사용자를 찾으면
			req.session.isLoggedIn = true;      // 세션에 인증 정보를 저장
			req.session.user = user;			// 사용자 정보를 세션에 저장
			req.session.save((err) => {			// 세션 저장
				console.log(err);
				res.redirect('/');
			});			
		})
		.catch((err) => console.log(err));
};

exports.postLogout = (req, res, next) => {
	req.session.destroy((err) => {
		console.log("logout:" + err);
		res.redirect('/');
	});
};
