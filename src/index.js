require('dotenv').config();
const express = require('express');
const connectFlash = require('connect-flash');

const ConnectDB = require('./config/connectDB');
const configViewEngine = require('./config/viewEngine');
const configSession = require('./config/session');
const initRouters = require('./routes/web');

let app = express();
let port = 1201;

//Connect to Mongoose
ConnectDB();

//Config Session
configSession(app);

//config view Engine
configViewEngine(app);

//Use body-parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Enable flash message
app.use(connectFlash());

//init router
initRouters(app);

//init port
app.listen(port,()=>{
    console.log("Listen on port : " + port);
});
