const multer = require('multer');
const uuidv4 = require('uuid/v4');
const fsExtra = require('fs-extra');

const { app } = require('../config/app');
const { transError,transSuccess } = require('../../lang/vi');
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
        
        if (req.file == undefined){
            return res.status(500).send("Bạn phải thay đổi thông tin trước khi cập nhật dữ liệu.");
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
                message:transSuccess.avatar_updated,
                imageSrc : `/images/users/${req.file.filename}`
            }
            return res.status(200).send(result);
        } catch(error){
            return res.status(500).send(error)
        }
    });
};