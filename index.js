const express = require('express');
const nodemailer = require("nodemailer");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();

var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'X-Requested-With, Accept, Origin, Referer, User-Agent, Content-Type, Authorization');

    // intercept OPTIONS method
    if (req.method === 'OPTIONS') {
        res.send(200);
    }
    else {
        next();
    }
};

// you might have "app" instead of "server"
app.configure(function() {
    app.use(allowCrossDomain);   // make sure this is is called before the router
    app.use(app.router);      // not entirely necessary--will be automatically called with the first .get()
});

app.use(cors())
app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json())

let smtp_login = process.env.SMTP_LOGIN || "---"
let smtp_password = process.env.SMTP_PASSWORD || "---"

let transporter = nodemailer.createTransport({
    service:"gmail",
    auth: {
        user: smtp_login ,
        pass: smtp_password,
    },
});

app.get("/" ,function(req,res){
    res.send("All is work!")
})

app.post("/sendMessage", async function (req, res) {

    let {name,email,message} = req.body

    let info = await transporter.sendMail({
        from: "Portfolio Page",
        to: "shpakovad@gmail.com",
        subject: "Message from Portfolio Page",
        html: `<b>Message from Portfolio Page</b>,
<div>name: ${name}</div>
<div>email: ${email}</div>
<div>message: ${message}</div>
`
    });
    res.send('Message sent');
});

let port = process.env.PORT || 3010
app.listen(port, function () {
    console.log('App listening on port 3010!');
});

