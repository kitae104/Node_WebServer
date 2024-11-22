const figlet = require('figlet');
const express = require('express');
const cors = require('cors');

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

app.use(cors());

app.get('/', (req, res) => {
	res.send('Hello World!');
});

app.get('/user/:id', (req, res) => {
	const id = req.params.id;
	res.json({ id: id });
});

app.get('/sound/:name', (req, res) => {
	const {name} = req.params;
	console.log(name);
	if (name === 'cat') {
		res.json({ sound: '야옹' });
	} else if (name == 'dog') {
		res.json({ sound: '멍멍' });
	} else {
		res.json({ sound: '알 수 없음' });
	}
});

app.listen(port, () => {
	console.log(`Server Start - listening on port ${port}`);
});
