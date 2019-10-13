const passport = require('passport');
const passportLocal = require('passport-local');

const UserModel = require('../../models/userModel');
const {transError,transSuccess} = require('../../../lang/vi');

let localStrategy = passportLocal.Strategy;

/**
 * Valid user account type : local
 */
let initPassportLocal = () => {
    passport.use(new localStrategy({
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true
    }, async (req, email, password, done) => {
        try {
            let user = await UserModel.findByEmail(email);
            if (!user) {
                return done(null , false , req.flash('errors',transError.login_fail));
            }
            if(!user.local.isActive){
                return done(null , false , req.flash('errors',transError.account_not_active));
            }
            let checkPassword = await user.comparePassword(password);
            if(!checkPassword){                
                return done(null , false , req.flash('errors',transError.login_fail));
            }
            
            return done(null,user,req.flash("success",transSuccess.loginSuccess(user.username)));
        } catch (error) {
            console.log(error);
            return done(null,false,req.flash("errors",transError.server_error));
        }
    }));

    // lưu user id vào session
    passport.serializeUser((user,done)=>{
        done(null,user._id);
    });

    passport.deserializeUser((id,done)=>{
        UserModel.findUserById(id)
            .then(user =>{
                return done(null,user);
            })
            .catch(error=>{
                return done(error,null);
            });  
    });
};

module.exports = initPassportLocal;