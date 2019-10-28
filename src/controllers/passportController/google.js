const passport = require('passport');
const passportFacebook = require('passport-google-oauth');

const UserModel = require('../../models/userModel');
const { transError, transSuccess } = require('../../../lang/vi');

let ggAppId = process.env.GG_APP_ID;
let ggAppSecrect = process.env.GG_APP_SECRECT;
let ggCallbackUrl = process.env.GG_CALLBACK_URL;

let GoogleStrategy = passportFacebook.OAuth2Strategy;

/**
 * Valid user account type : Google
 */
let initPassportGoogle = () => {
    passport.use(new GoogleStrategy({
        clientID: ggAppId,
        clientSecret: ggAppSecrect,
        callbackURL: ggCallbackUrl,
        passReqToCallback: true,
        profileFields: ["email", "gender", "displayName"]
    }, async (req, accessToken, refreshToken, profile , done) => {
        try {
            let user = await UserModel.findByGoogleUid(profile.id);
            if(user){
                return done(null, user, req.flash("success", transSuccess.loginSuccess(user.username)));
            }
            console.log(profile);
            let newUserItem = {
                username : profile.displayName,
                gender : profile.gender,
                local:{isActive : true},
                google:{
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

module.exports = initPassportGoogle;
