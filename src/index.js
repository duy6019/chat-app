const express = require('express');

const ConnectDB = require('./config/connectDB');
const configViewEngine = require('./config/viewEngine');

let app = express();
let port = 1201;

//Connect to Mongo
ConnectDB();

//config view Engine
configViewEngine(app);

app.get('/',(req,res)=>{
    res.render('auth/loginRegister');
});

app.listen(port,()=>{
    console.log("Listen on port : " + port);
});