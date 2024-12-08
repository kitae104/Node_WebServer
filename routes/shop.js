const express = require('express');
const path = require('path');
const rootDir = require('../util/path');

const router = express.Router();    // Router 객체 생성

router.get('/' , (req, res, next) => {
    res.sendFile(path.join(rootDir, 'views', 'shop.html'));
});

module.exports = router;            // router 객체를 모듈로 내보냄