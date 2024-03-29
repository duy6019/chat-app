const passport = require('passport');
const passportFacebook = require('passport-facebook');

const UserModel = require('../../models/userModel');
const { transError, transSuccess } = require('../../../lang/vi');

let fbAppId = process.env.FB_APP_ID;
let fbAppSecrect = process.env.FB_APP_SECRECT;
let fbCallbackUrl = process.env.FB_CALLBACK_URL;

let FacebookStrategy = passportFacebook.Strategy;

/**
 * Valid user account type : Facebook
 */
let initPassportFacebook = () => {
    passport.use(new FacebookStrategy({
        clientID: fbAppId,
        clientSecret: fbAppSecrect,
        callbackURL: fbCallbackUrl,
        passReqToCallback: true,
        profileFields: ["email", "gender", "displayName"]
    }, async (req, accessToken, refreshToken, profile , done) => {
        try {
            let user = await UserModel.findByFacebookUid(profile.id);
            if(user){
                return done(null, user, req.flash("success", transSuccess.loginSuccess(user.username)));
            }
            let newUserItem = {
                username : profile.displayName,
                gender : profile.gender,
                local:{isActive : true},
                facebook:{
                    uid: profile.id,
                    token: accessToken,
                    email: profile.emails[0].value
                }
            };
            let newUser = await UserModel.createNew(newUserItem);
            return done(null, newUser, req.flash("success", transSuccess.loginSuccess(newUser.username)));
        } catch (error) {
            console.log(error);
            return done(null, false, req.flash("errors", transError.server_error));
        }
    }));

    // lưu user id vào session
    passport.serializeUser((user, done) => {
        done(null, user._id);
    });

    // gọi bởi passport.session()
    // return userInfo vào req.user
    passport.deserializeUser((id, done) => {
        UserModel.findUserById(id)
            .then(user => {
                return done(null, user);
            })
            .catch(error => {
                return done(error, null);
            });
    });
};

module.exports = initPassportFacebook;
