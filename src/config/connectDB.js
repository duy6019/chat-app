const mongoose = require('mongoose');
const bluebird = require('bluebird');
/**
 * Connect
 */
let connectDB = ()=>{
    mongoose.Promise = bluebird;
    let URI = `${process.env.DB_CONNECTION}://${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`;
    return mongoose.connect(URI,{useNewUrlParser:true});
};

module.exports = connectDB;
