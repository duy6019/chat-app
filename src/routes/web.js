const express = require('express');

const {homeController , authController} = require('../controllers/index');

let router = express.Router();

let initRouters = (app)=>{
    router.get("/",homeController.index);

    router.get("/login-register",authController.getLoginRegister);

    return app.use("/",router);
}
module.exports = initRouters;