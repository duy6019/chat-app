//#region Get Request
module.exports.index = (req, res) => {
    return res.render("main/home/home",{
        errors: req.flash("errors"),
        success: req.flash("success"),
        user:req.user
    })
};
//#endregion
