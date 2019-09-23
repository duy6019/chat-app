module.exports.transValidation = {
    email_incorrect: "Email phải có định dạng username@gmail.com !",
    gender_incorrect: "Không được sửa giới tính !",
    password_incorrect: "Mật khẩu chứa ít nhất 8 ký tự bao gồm chữ hoa , chữ thường và chữ số !",
    password_comfirmation_incorrect: "Nhập lại mật khẩu chưa chính xác !"
};

module.exports.transError = {
    account_in_use: "Email này đã được sử dung !",
    account_removed: "Tài khoản này đã bị gỡ khỏi hệ thống , vui lòng liên hệ bộ phận hỗ trợ của chúng tôi.",
    account_not_active: "Email này đã được đăng ký nhưng chưa kích hoạt tài khoản. Vui lòng kiểm tra email hoặc liên hệ với hỗ trợ của chúng tôi."
};

module.exports.transSuccess = {
    userCreated: (userEmail) => {
        return `Tài khoản <strong>${userEmail}</strong> đã được tạo , kiểm tra email để kích hoạt tài khoản.`;
    }
};