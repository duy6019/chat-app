const bcrypt = require('bcrypt');
const uuidv4 = require('uuid/v4');

const UserModel = require('../models/userModel');
const { transError, transSuccess } = require('./../../lang/vi');

let saltRounds = 7;

module.exports.register = (email, gender, password) => {
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

    let user = await UserModel.creatNew(userItem);
    resolve(transSuccess.userCreated(user.local.email));
  });
}
