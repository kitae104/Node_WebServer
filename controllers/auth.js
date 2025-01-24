exports.getLogin = (req, res, next) => {
	// const isLoggedIn = req
	// 	.get('Cookie')
	// 	.split(';')[3]
	// 	.trim()
	// 	.split('=')[1] === 'true';	
	console.log(req.session.isLoggedIn);		// 세션에 저장된 로그인 정보 출력
	res.render('auth/login', {					// views/auth/login.ejs 렌더링
		path: '/login',							// 로그인 페이지로 이동 
		pageTitle: '로그인',					// 페이지 타이틀
        isAuthenticated: false,			// 인증 여부
	});
};

exports.postLogin = (req, res, next) => {		
	// res.setHeader('Set-Cookie', 'loggedIn=true; HttpOnly');	// 쿠키 설정    	
	req.session.isLoggedIn = true;					// 세션에 로그인 정보 저장
	res.redirect('/');								// 홈페이지로 이동
};
