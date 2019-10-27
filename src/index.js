require('dotenv').config();
const express = require('express');
const connectFlash = require('connect-flash');
const passport = require('passport');
const pem = require('pem');

const https = require('https');
const path = require('path');

const ConnectDB = require('./config/connectDB');
const configViewEngine = require('./config/viewEngine');
const configSession = require('./config/session');
const initRouters = require('./routes/web');

process.env.OPENSSL_CONF = path.join(__dirname, 'openssl', 'windows', 'openssl.cfg')
pem.config({
    pathOpenSSL: path.join(__dirname, 'openssl', 'windows', 'openssl.exe'),
})

pem.createCertificate({ days: 1, selfSigned: true }, function (err, keys) {
    if (err) {
        throw err;
    }
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

    //Config passport
    app.use(passport.initialize());
    app.use(passport.session());

    //init router
    initRouters(app);

    https.createServer({ key: keys.serviceKey, cert: keys.certificate }, app).listen(port, () => {
        console.log("Listen on port : " + port);
    });
})
// //init app
// let app = express();
// let port = 1201;
// //Connect to Mongoose
// ConnectDB();

// //Config Session
// configSession(app);

// //config view Engine
// configViewEngine(app);

// //Use body-parser
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// //Enable flash message
// app.use(connectFlash());

// //Config passport
// app.use(passport.initialize());
// app.use(passport.session());

// //init router
// initRouters(app);

// //init port
// app.listen(port, () => {
//     console.log("Listen on port : " + port);
// });
