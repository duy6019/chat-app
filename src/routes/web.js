const express = require('express');
const passport = require('passport');

const {homeController , authController} = require('../controllers/index');
const {authValid} = require("./../validation/index");
const initPassportLocal = require('../controllers/passportController/local');

//init all passport
initPassportLocal();

let router = express.Router();

let initRouters = (app)=>{
    router.get("/",homeController.index);

    router.get("/login-register",authController.getLoginRegister);

    router.get("/verify/:token",authController.verifyAccount);

    router.post("/register",authValid.register,authController.postRegister);

    router.post("/login", passport.authenticate("local",{
        successRedirect:"/",
        failureRedirect:"/login-register",
        successFlash:true,
        failureFlash:true
    }));

    return app.use("/",router);
}
module.exports = initRouters;
