const bcrypt = require('bcrypt');
const uuidv4 = require('uuid/v4');

const sendMail = require('../config/mailer');
const UserModel = require('../models/userModel');
const { transError, transSuccess, transEmail} = require('./../../lang/vi');

let saltRounds = 7;

module.exports.register = (email, gender, password, protocol, host) => {
  return new Promise(async (resolve, reject) => {
    let userByEmail = await UserModel.findByEmail(email);
    if (userByEmail) {
      if (userByEmail.deleteAt !== null) {
        return reject(transError.account_removed);
      }
      if (!userByEmail.local.isActive) {
        return reject(transError.account_not_active);
      }
      return reject(transError.account_in_use);
    }
    let salt = bcrypt.genSaltSync(saltRounds);

    let userItem = {
      username: email,
      gender: gender,
      local: {
        email: email,
        password: bcrypt.hashSync(password, salt),
        verifyToken: uuidv4()
      }
    };

    let user = await UserModel.createNew(userItem);
    let linkVerify = `${protocol}://${host}/verify/${user.local.verifyToken}`;
    sendMail(email,transEmail.subject,transEmail.template(linkVerify))
      .then(success=>{
        resolve(transSuccess.userCreated(user.local.email));
      }).catch(async error=>{
        console.log(error);
        await UserModel.removeById(user._id);
        reject(transEmail.send_failer);
      });
  });
};


module.exports.verifyAccount = (token)=>{
  return new Promise(async (resolve,reject)=>{
    let userByToken = await UserModel.findByToken(token);
    if(!userByToken){
      return reject(transError.token_undefined);
    }
    await UserModel.verify(token);
    resolve(transSuccess.account_actived);
  });
};