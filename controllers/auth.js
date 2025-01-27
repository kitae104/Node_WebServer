const dotenv = require('dotenv').config(); // dotenv
const crypto = require('crypto'); // crypto
const bcrypt = require('bcryptjs'); // bcrypt
const nodemailer = require('nodemailer'); // NodeMailer

const { validationResult } = require('express-validator'); // express-validator

const User = require('../models/user');

// Naver SMTP 설정
const MAIL_KEY = process.env.MAIL_KEY;
const transporter = nodemailer.createTransport({
	host: 'smtp.naver.com', // Naver SMTP 서버
	port: 465, // Naver SMTP 포트 (SSL 사용)
	secure: true, // SSL을 사용하여 연결
	auth: {
		user: 'kktpsh@naver.com', // Naver 이메일 계정
		pass: MAIL_KEY, // Naver 이메일 비밀번호 또는 앱 비밀번호
	},
});

// 로그인 페이지 렌더링
exports.getLogin = (req, res, next) => {
	let message = req.flash('error'); // 에러 메시지
	if (message.length > 0) {
		// 에러 메시지가 있으면
		message = message[0]; // 첫 번째 에러 메시지를 가져옴
	} else {
		message = null; // 에러 메시지가 없으면 null
	}
	res.render('auth/login', {		
		path: '/login', // 로그인 페이지로 이동
		pageTitle: '로그인', // 페이지 타이틀
		errorMessage: message, // 에러 메시지
	});
};

const USER_ID = process.env.USER_ID;

// 로그인 처리
exports.postLogin = (req, res, next) => {
	const email = req.body.email; // 이메일
	const password = req.body.password; // 비밀번호
	User.findOne({ email: email }) // 이메일로 사용자를 찾음
		.then((user) => {
			if (!user) {
				// 사용자가 없으면
				req.flash('error', '이메일이나 비밀번호가 일치하지 않습니다.'); // 에러 메시지
				return res.redirect('/login'); // 로그인 페이지로 이동
			}
			bcrypt
				.compare(password, user.password) // 비밀번호 비교
				.then((doMatch) => {
					if (doMatch) {
						// 비밀번호가 일치하면
						req.session.isLoggedIn = true; // 세션에 인증 정보를 저장
						req.session.user = user; // 사용자 정보를 세션에 저장
						return req.session.save((err) => {
							console.log(err);
							res.redirect('/'); // 홈페이지로 이동
						});
					}
					res.redirect('/login'); // 비밀번호가 일치하지 않으면 로그인 페이지로 이동
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
	let message = req.flash('error'); // 에러 메시지
	if (message.length > 0) {
		// 에러 메시지가 있으면
		message = message[0]; // 첫 번째 에러 메시지를 가져옴
	} else {
		message = null; // 에러 메시지가 없으면 null
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

	const errors = validationResult(req); 	// 검증 결과
	if (!errors.isEmpty()) {		 		// 에러가 있으면
		return res.status(422).render('auth/signup', {	// 회원가입 페이지로 이동
			path: '/signup',
			pageTitle: '회원가입',
			errorMessage: errors.array()[0].msg,		// 에러 메시지
		});
	}

	User.findOne({ email: email }) // 이메일로 사용자를 찾음
		.then((userDoc) => {
			// 사용자를 찾으면
			if (userDoc) {
				// 사용자가 있으면
				req.flash(
					'error',
					'이미 사용중인 이메일입니다. 다른 이메일을 사용하세요.'
				); // 에러 메시지
				return res.redirect('/signup'); // 회원가입 페이지로 이동
			}
			return bcrypt
				.hash(password, 12)
				.then((hashedPassword) => {
					const user = new User({
						// 사용자가 없으면
						email: email, // 사용자 정보 생성
						password: hashedPassword,
						cart: { items: [] }, // 장바구니 정보
					});
					return user.save(); // 사용자 정보를 저장
				})
				.then((result) => {
					res.redirect('/login'); // 로그인 페이지로 이동
					return transporter
						.sendMail({
							from: 'kktpsh@naver.com', // 발신 이메일
							to: email, // 수신 이메일
							subject: '회원 가입 성공!', // 이메일 제목
							html: '<h1>기태네 쇼핑몰 회원 가입에 성공하셨습니다!</h1>', // 이메일 본문
						})
						.catch((err) => console.log(err));
				});
		})
		.catch((err) => console.log(err));
};

// 비밀번호 재설정
exports.getReset = (req, res, next) => {
	let message = req.flash('error'); // 에러 메시지
	if (message.length > 0) {
		// 에러 메시지가 있으면
		message = message[0]; // 첫 번째 에러 메시지를 가져옴
	} else {
		message = null; // 에러 메시지가 없으면 null
	}
	res.render('auth/reset', {
		path: '/reset',
		pageTitle: '비밀번호 재설정',
		errorMessage: message,
	});
};

// 비밀번호 초기화 처리
exports.postReset = (req, res, next) => {
	crypto.randomBytes(32, (err, buffer) => {
		if (err) {
			console.log(err);
			return res.redirect('/reset');
		}
		const token = buffer.toString('hex');
		User.findOne({ email: req.body.email }) // 이메일로 사용자를 찾음
			.then((user) => {
				if (!user) {
					req.flash('error', '등록되지 않은 이메일입니다.');
					return res.redirect('/reset');
				}
				user.resetToken = token; // 비밀번호 초기화 토큰
				user.resetTokenExpiration = Date.now() + 3600000; // 토큰 만료 시간(1시간)
				return user.save(); // 사용자 정보를 저장
			})
			.then((result) => {
				res.redirect('/');
				transporter.sendMail({
					from: 'kktpsh@naver.com', // 발신 이메일
					to: req.body.email, // 수신 이메일
					subject: '비밀번호 초기화', // 이메일 제목
					html: `								
						<p>비밀번호 초기화를 위한 링크입니다.</p>
						<p>아래 링크를 클릭하여 비밀번호를 초기화하세요.</p>
						<p><a href="http://localhost:3333/reset/${token}">비밀번호 초기화</a></p>
					`,
				});
			})
			.catch((err) => console.log(err));
	});
};

// 새 비밀번호 입력 페이지 렌더링
exports.getNewPassword = (req, res, next) => {
	const token = req.params.token; // 토큰
	User.findOne({
		// 토큰과 만료 시간으로 사용자를 찾음
		resetToken: token,
		resetTokenExpiration: {
			$gt: Date.now(),
		},
	})
		.then((user) => {
			let message = req.flash('error'); // 에러 메시지
			if (message.length > 0) {
				// 에러 메시지가 있으면
				message = message[0]; // 첫 번째 에러 메시지를 가져옴
			} else {
				message = null; // 에러 메시지가 없으면 null
			}
			res.render('auth/new-password', {
				path: '/new-password', // 경로
				pageTitle: '새 비밀번호 설정', // 페이지 타이틀
				errorMessage: message, // 에러 메시지
				userId: user._id.toString(), // 사용자 ID
				passwordToken: token, // 비밀번호 토큰
			});
		})
		.catch((err) => console.log(err));
};

exports.postNewPassword = (req, res, next) => {
	const newPassword = req.body.password; // 새 비밀번호
	const userId = req.body.userId; // 사용자 ID
	const passwordToken = req.body.passwordToken; // 비밀번호 토큰
	let resetUser; // 사용자 정보

	User.findOne({
		// 사용자 ID와 토큰으로 사용자를 찾음
		resetToken: passwordToken,
		resetTokenExpiration: {
			$gt: Date.now(),
		},
		_id: userId,
	})
		.then((user) => {
			resetUser = user; // 사용자 정보 저장
			return bcrypt.hash(newPassword, 12); // 비밀번호 암호화
		})
		.then((hashedPassword) => {
			resetUser.password = hashedPassword; // 암호화된 비밀번호 저장
			resetUser.resetToken = undefined; // 토큰 초기화
			resetUser.resetTokenExpiration = undefined; // 토큰 만료 시간 초기화
			return resetUser.save(); // 사용자 정보 저장
		})
		.then((result) => {
			res.redirect('/login'); // 로그인 페이지로 이동
		})
		.catch((err) => console.log(err));
};
