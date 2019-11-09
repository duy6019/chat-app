const multer = require('multer');
const uuidv4 = require('uuid/v4');
const fsExtra = require('fs-extra');
const { validationResult } = require('express-validator/check');

const { app } = require('../config/app');
const { transError, transSuccess } = require('../../lang/vi');
const { user } = require('../services/index')

let storageAvatar = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, app.avatar_directory);
    },
    filename: function (req, file, callback) {
        let math = app.avatar_type;
        if (math.indexOf(file.mimetype) === -1) {
            return callback(transError.avatar_type, null);
        }
        let avatar_name = `${Date.now()}-${uuidv4()}-${file.originalname}`;
        callback(null, avatar_name);
    }
});

let avatarUploadFile = multer({
    storage: storageAvatar,
    limits: { fileSize: app.avatar_limit_size }
}).single("avatar");

module.exports.updateAvatar = (req, res) => {
    avatarUploadFile(req, res, async (error) => {
        if (error) {
            if (error.message) {
                return res.status(500).send(transError.avatar_size);
            }
            return res.status(500).send(error);
        }
        try {

            let updateUserItem = {
                avatar: req.file.filename,
                updateAt: Date.now()
            };
            //Update User
            let userUpdate = await user.updateUser(req.user._id, updateUserItem);

            //Remove old avatar
            await fsExtra.remove(`${app.avatar_directory}/${userUpdate.avatar}`);
            let result = {
                message: transSuccess.user_avatar_updated,
                imageSrc: `/images/users/${req.file.filename}`
            }
            return res.status(200).send(result);
        } catch (error) {
            return res.status(500).send(error)
        }
    });
};

module.exports.updateInfo = async (req, res) => {
    let errorArr = "";
    let validationError = validationResult(req);
    if (!validationError.isEmpty()) {
        let errors = Object.values(validationError.mapped());
        errors.forEach(item => {
            errorArr = errorArr + item.msg;
        });
        return res.status(500).send(errorArr);
    }
    try {
        let updateUserItem = req.body;
        if (Object.keys(updateUserItem).length === 0) {
            let result = {
                message: transSuccess.user_info_updated
            }
            return res.status(500).send(result);
        }
        updateUserItem.updateAt = Date.now();
        await user.updateUser(req.user._id, updateUserItem);
        let result = {
            message: transSuccess.user_info_updated
        }
        return res.status(200).send(result);
    } catch (error) {
        return res.status(500).send(error)
    }
};

module.exports.updatePassword = async (req, res) => {
    let errorArr = [];;
    let validationError = validationResult(req);
    if (!validationError.isEmpty()) {
        let errors = Object.values(validationError.mapped());
        errors.forEach(element=>{
            errorArr.push(element.msg);
        });
        return res.status(500).send(errorArr);
    } 
    try {
        let updateUserItem = req.body;
        await user.updatePassword(req.user._id,updateUserItem);
        updateUserItem.updateAt = Date.now();
        await user.updateUser(req.user._id, updateUserItem);
        let result = {
            message: transSuccess.user_password_updated
        }
        return res.status(200).send(result);
    } catch (error) {
        return res.status(500).send(error)
    }
};
