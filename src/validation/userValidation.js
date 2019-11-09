const { check } = require("express-validator/check");
const { transValidation } = require("../../lang/vi");

module.exports.updateInfo = [
    check("username",transValidation.update_username)
        .optional()
        .isLength({min:3,max:17})
        .matches(/^[\s0-9a-zA-Z_ÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ ]+$/),
    check("gender",transValidation.update_gender)
        .optional()
        .isIn(["male","female"]),
    check("address",transValidation.update_address)
        .optional()
        .isLength({min:3,max:30}),
    check("phone",transValidation.update_phone)
        .optional()
        .matches(/^(0)[0-9]{9,10}$/)        
];

module.exports.updatePassword = [
    check("currentPassword", transValidation.password_incorrect)
    .isLength({ min: 8 })
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&]{8,}$/),    
    check("newPassword", transValidation.password_incorrect)
    .isLength({ min: 8 })
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&]{8,}$/),   
    check("confirmPassword", transValidation.password_comfirmation_incorrect)
    .custom((value, { req }) => {
        if(value!==req.body.newPassword){
          return false;
        }
        return true;
      })
];
