const UserModel = require('../models/userModel');

module.exports.updateUser = (id, item) => {
    return UserModel.updateUser(id, item);
};