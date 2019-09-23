require('dotenv').config();
const express = require('express');

const ConnectDB = require('./config/connectDB');
const configViewEngine = require('./config/viewEngine');
const initRouters = require('./routes/web');

let app = express();
let port = 1201;

//Connect to Mongo
// ConnectDB();

//config view Engine
configViewEngine(app);
console.log('ok !');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//init router
initRouters(app);

app.listen(port,()=>{
    console.log("Listen on port : " + port);
});
