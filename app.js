const figlet = require('figlet');
const express = require('express');
const bodyParser = require("body-parser");
const cors = require('cors');
const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

figlet('Node  Server', function (err, data) {
	if (err) {
		console.log('Something went wrong...');
		console.dir(err);
		return;
	}
	console.log(data);
});

const app = express();
const port = 3000;

//==========================================================================================
// 미들웨어 등록(use)
//==========================================================================================
app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }));        // body-parser 미들웨어 등록

app.use(adminRoutes);
app.use(shopRoutes);

app.use((req, res, next) => {
	res.status(404).send('<h1>Page not found</h1>');
});

app.listen(port, () => {
	console.log(`Server Start - listening on port ${port}`);
});