// 인증 관련 라우팅 처리
const express = require('express');                     // express 모듈 가져오기
const router = express.Router();                        // Router 객체 생성
const authController = require('../controllers/auth');  // authController 모듈 가져오기 


router.get('/login', authController.getLogin);          // 로그인 페이지 라우팅

router.post('/login', authController.postLogin);        // 로그인 처리 라우팅

module.exports = router;                                // router 객체를 모듈로 내보냄