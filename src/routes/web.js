const express = require('express');
const passport = require('passport');

const { homeController, authController } = require('../controllers/index');
const { authValid } = require("./../validation/index");
const initPassportLocal = require('../controllers/passportController/local');
const initPassportFacebook = require('../controllers/passportController/facebook');
//init all passport
initPassportLocal();
initPassportFacebook();

let router = express.Router();

let initRouters = (app) => {
    router.get("/", authController.checkLoggedIn, homeController.index);

    router.get("/logout", authController.checkLoggedIn, authController.logout);

    router.get("/login-register", authController.checkLoggedOut, authController.getLoginRegister);

    router.get("/verify/:token", authController.checkLoggedOut, authController.verifyAccount);

    router.post("/register", authValid.register, authController.checkLoggedOut, authController.postRegister);

    router.post("/login", authController.checkLoggedOut, passport.authenticate("local", {
        successRedirect: "/",
        failureRedirect: "/login-register",
        successFlash: true,
        failureFlash: true,
        session:false
    }));

    router.get("/auth/facebook",passport.authenticate("facebook",{scope:["email"]}));

    router.get("/auth/facebook/callback",passport.authenticate("facebook",{
        successRedirect: "/",
        failureRedirect: "/login-register",
    }));

    return app.use("/", router);
}
module.exports = initRouters;
