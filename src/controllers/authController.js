const { validationResult } = require('express-validator/check');

const { auth } = require('../services/index');
//#region Get Request
module.exports.getLoginRegister = (req, res) => {
    return res.render("auth/master", {
        errors: req.flash("errors"),
        success: req.flash("success")
    });
};
//#endregion

//#region  Post
module.exports.postRegister = async (req, res) => {
    let errorArr = [];
    let successArr = [];
    let validationError = validationResult(req);
    if (!validationError.isEmpty()) {
        let errors = Object.values(validationError.mapped());
        errors.forEach(item => {
            errorArr.push(item.msg);
        });
        req.flash("errors", errorArr);
        return res.redirect('/login-register');
    }
    try {
        let craeteUserSuccess = await auth.register(req.body.email, req.body.gender, req.body.password);
        successArr.push(craeteUserSuccess);
        req.flash("success",successArr);
        return res.redirect('/login-register');
    } catch (error) {
        errorArr.push(error)
        req.flash("errors",errorArr);
        return res.redirect('/login-register');
    }
};
//#endregion