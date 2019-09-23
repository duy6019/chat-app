const {validationResult} = require('express-validator/check');

//#region Get Request
module.exports.getLoginRegister = (req,res)=>{
    return res.render("auth/master");
};
//#endregion

//#region  Post
module.exports.postRegister = (req,res)=>{
    let errorArr = [];
    let validationError = validationResult(req);
    if(!validationResult.isEmpty()){
        let errors = Object.values(validationError.mapped());
        errors.forEach(item => {
            errorArr.push(item.msg);
        });
        return;
    }
};
//#endregion