// 인증 관련 라우팅 처리
const express = require('express');                     // express 모듈 가져오기
const { check, body } = require('express-validator');   // express-validator/check 모듈 가져오기

const router = express.Router();                        // Router 객체 생성
const authController = require('../controllers/auth');  // authController 모듈 가져오기 
const User = require('../models/user');                 // User 모델 가져오기

router.get('/login', authController.getLogin);          // 로그인 페이지 라우팅

router.post('/login', 
[
    check('email')                   // 회원가입 처리 라우팅
        .isEmail()                                              // 이메일 형식 검증
        .withMessage("유효한 이메일을 입력하세요.")
        .normalizeEmail(),                                      // 이메일 주소 정규화
    body('password','비밀번호는 최소 4자 이상이어야 합니다.')
        .isLength({ min: 4 })            
        .isAlphanumeric()
        .trim(),                                                // 비밀번호 공백 제거
],
authController.postLogin);        // 로그인 처리 라우팅

router.post('/logout', authController.postLogout);      // 로그아웃 처리 라우팅

router.get('/signup', authController.getSignup);        // 회원가입 페이지 라우팅

router.post('/signup', 
    [
        check('email')                   // 회원가입 처리 라우팅
            .isEmail()
            .withMessage("유효한 이메일을 입력하세요.")
            .custom((value, { req }) => {
                return User
                    .findOne({ email: value }) // 이메일로 사용자를 찾음
                    .then(userDoc => {
                        if (userDoc) {
                            return Promise.reject('이미 사용중인 이메일입니다.');
                        }
                    });
            })
            .normalizeEmail(), 
        body('password','비밀번호는 최소 4자 이상이어야 합니다.')
            .isLength({ min: 4 })            
            .isAlphanumeric()
            .trim(),
        body('confirmPassword')
            .trim()
            .custom((value, { req }) => {
                if (value !== req.body.password) {
                    throw new Error('비밀번호가 일치하지 않습니다.');
                }
                return true;
            }),
    ],
    authController.postSignup);      

router.get('/reset', authController.getReset);          // 비밀번호 초기화 페이지 라우팅

router.post('/reset', authController.postReset);        // 비밀번호 초기화 처리 라우팅

router.get('/reset/:token', authController.getNewPassword); // 새 비밀번호 입력 페이지 라우팅

router.post('/new-password', authController.postNewPassword); // 새 비밀번호 입력 처리 라우팅

module.exports = router;                                // router 객체를 모듈로 내보냄