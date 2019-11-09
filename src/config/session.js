const session = require('express-session');
const connectMongo = require('connect-mongo');

let MongoStore = connectMongo(session);

/**
 * Biến này là nơi lưu giữ session trong mongoDb
 */
let sessionStore = new MongoStore({
    url: `${process.env.DB_CONNECTION}://${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`,
    autoReconnect:true,
    // autoRemove:'native'
});

let configSession = (app) => {
    app.use(session({
        key: 'express.sid',
        secret: 'mySecrect',
        store: sessionStore,
        resave: true,
        saveUninitialized: false,
        cookie: {
            maxAge: 1000 * 60 * 60 * 24 // 86400000 milisec = 1 day
        }
    }));
};

module.exports = configSession;
