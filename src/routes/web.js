const express = require('express');

const {homeController , authController} = require('../controllers/index');

const {authValid} = require("./../validation/index");

let router = express.Router();

let initRouters = (app)=>{
    router.get("/",homeController.index);

    router.get("/login-register",authController.getLoginRegister);

    router.get("/verify/:token",authController.verifyAccount);

    router.post("/register",authValid.register,authController.postRegister);

    return app.use("/",router);
}
module.exports = initRouters;
