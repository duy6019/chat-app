const { check } = require("express-validator/check");
const { transValidation } = require("../../lang/vi");

let register = [
  check("email", transValidation.email_incorrect)
    .isEmail()
    .trim(),
  check("gender", transValidation.gender_incorrect)
    .isIn("male", "female"),
  check("password", transValidation.password_incorrect)
    .isLength({ min: 8 })
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&]{8,}$/),
  check("password_confirmation", transValidation.password_comfirmation_incorrect)
    .custom((value, { req }) => {
      if(value!==req.body.password){
        return false;
      }
      return true;
    })
];

module.exports = {
  register: register
}