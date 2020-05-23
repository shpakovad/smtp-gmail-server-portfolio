const express = require('express');
const nodemailer = require("nodemailer");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();

app.use(cors({
    credentials: 'true',
    origin: '*',
    methods: 'GET, POST, PUT, DELETE, OPTIONS',
    allowedHeaders: 'Authorization, Access-Control-Allow-Headers, Origin,X-Requested-With,Content-Type,Accept,content-type,application/json'
}))
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

