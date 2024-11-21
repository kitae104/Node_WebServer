const figlet = require("figlet");
const express = require("express");

figlet("Node  Server", function (err, data) {
    if (err) {
        console.log("Something went wrong...");
        console.dir(err);
        return;
    }
    console.log(data);
});

const app = express();

app.get("/", function (req, res) {
    res.send("Hello World");
});

app.listen(3000);
