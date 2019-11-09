const UserModel = require('../models/userModel');
const { transError } = require('../../lang/vi');
const bcrypt = require('bcrypt');

const saltRound = 7;

module.exports.updateUser = (id, item) => {
    return UserModel.updateUser(id, item);
};

module.exports.updatePassword = (id, dataUpdate) => {
    return new Promise(async (resolve, reject) => {
        if (dataUpdate.newPassword !== dataUpdate.confirmPassword) {
            return reject(transError.user_confirm_password_failed);
        }
        let currentUser = await UserModel.findUserById(id);
        let checkCurrentPassword = await currentUser.comparePassword(dataUpdate.currentPassword);
        if (!checkCurrentPassword) {
            return reject(transError.user_current_password_failed);
        }
        let salt = bcrypt.genSaltSync(saltRound);
        await UserModel.updatePassword(id,bcrypt.hashSync(dataUpdate.newPassword,salt));
        resolve(true);
    });
};
