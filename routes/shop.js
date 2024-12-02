const express = require('express');

const router = express.Router();    // Router 객체 생성

router.get('/' , (req, res, next) => {
    res.send('<h1>Shop</h1>');
});

module.exports = router;            // router 객체를 모듈로 내보냄