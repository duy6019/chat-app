const mongoose = require('mongoose');
const bluebird = require('bluebird');
/**
 * Connect
 */
let connectDB = ()=>{
    mongoose.Promise = bluebird;
    let DB_CONNECTION = "mongodb";
    let DB_HOST = "localhost";
    let DB_PORT = "27017";
    let DB_NAME = "awesome_chat";
    let DB_USER = "";
    let DB_PASSWORD = "";
    let URI = `${DB_CONNECTION}://${DB_HOST}:${DB_PORT}/${DB_NAME}`;
    
    return mongoose.connect(URI,{useNewUrlParser:true});
};

module.exports = connectDB;