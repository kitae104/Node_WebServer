const express = require('express');

const router = express.Router();    // Router 객체 생성

router.get('/add-product', (req, res,  next) => {
    res.send(
        '<form action="/product" method="POST"><input type="text" name="title"><button type="submit">Add Product</button></form>'
    );
});

router.post('/product', (req, res, next) => {
    console.log(req.body);
    res.redirect('/');
});

module.exports = router;            // router 객체를 모듈로 내보냄