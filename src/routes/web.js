const express = require('express');
const passport = require('passport');

const { homeController, authController, userController } = require('../controllers/index');
const { authValid, userValid } = require("./../validation/index");
const initPassportLocal = require('../controllers/passportController/local');
const initPassportFacebook = require('../controllers/passportController/facebook');
const initPassportGoogle = require('../controllers/passportController/google');
//init all passport
initPassportLocal();
initPassportFacebook();
initPassportGoogle();

let router = express.Router();

let initRouters = (app) => {

    //#region Get request
    router.get("/", authController.checkLoggedIn, homeController.index);

    router.get("/logout", authController.checkLoggedIn, authController.logout);

    router.get("/login-register", authController.checkLoggedOut, authController.getLoginRegister);

    router.get("/verify/:token", authController.checkLoggedOut, authController.verifyAccount);

    router.get("/auth/facebook", authController.checkLoggedOut, passport.authenticate("facebook", { scope: ["profile", "email"] }));

    router.get("/auth/facebook/callback", authController.checkLoggedOut, passport.authenticate("facebook", {
        successRedirect: "/",
        failureRedirect: "/login-register",
    }));

    router.get("/auth/google", authController.checkLoggedOut, passport.authenticate("google", { scope: ["profile", "email"] }));

    router.get("/auth/google/callback", authController.checkLoggedOut, passport.authenticate("google", {
        successRedirect: "/",
        failureRedirect: "/login-register",
    }));
    //#endregion

    //#region Post request
    router.post("/register", authValid.register, authController.checkLoggedOut, authController.postRegister);

    router.post("/login", authController.checkLoggedOut, passport.authenticate("local", {
        successRedirect: "/",
        failureRedirect: "/login-register",
        successFlash: true,
        failureFlash: true,
        session: true
    }));
    //#endregion 

    //#region Put request
    router.put("/user/update-avatar", authController.checkLoggedIn, userController.updateAvatar);

    router.put("/user/update-info", authController.checkLoggedIn, userValid.updateInfo, userController.updateInfo);

    router.put("/user/update-password", authController.checkLoggedIn, userValid.updatePassword, userController.updatePassword);
    //#endregion
    return app.use("/", router);
}
module.exports = initRouters;
