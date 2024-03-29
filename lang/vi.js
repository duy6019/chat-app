module.exports.transValidation = {
    email_incorrect: "Email phải có định dạng username@gmail.com !",
    gender_incorrect: "Không được sửa giới tính !",
    password_incorrect: "Mật khẩu chứa ít nhất 8 ký tự bao gồm chữ hoa , chữ thường và chữ số !",
    password_comfirmation_incorrect: "Nhập lại mật khẩu chưa chính xác !",
    update_username: "Username giới hạn 3-17 ký tự và không chứa ký tự đặc biệt.",
    update_gender: "Dữ liệu giới tính có vấn đề.",
    update_address: "Địa chỉ giới hạn 3-30 ký tự.",
    update_phone: "Số điện thoại Việt Nam bắt đầu bằng số 0, giới hạn trong khoảng 10-11 ký tự."
};

module.exports.transError = {
    account_in_use: "Email này đã được sử dung !",
    account_removed: "Tài khoản này đã bị gỡ khỏi hệ thống , vui lòng liên hệ bộ phận hỗ trợ của chúng tôi.",
    account_not_active: "Email này đã được đăng ký nhưng chưa kích hoạt tài khoản. Vui lòng kiểm tra email hoặc liên hệ với hỗ trợ của chúng tôi.",
    token_undefined: "Token không tồn tại!",
    login_fail: "Sai tài khoản hoặc mật khẩu",
    server_error: "Có lỗi phía server.",
    avatar_type: "Kiểu file không hợp lệ, chỉ chấp nhận jpg & png.",
    avatar_size: "Ảnh chỉ cho phép giới hạn 1Mb.",
    user_current_password_failed:"Mật khẩu nhập vào không chính xác.",
    user_confirm_password_failed:"Nhập lại mật khẩu không chính xác."
};

module.exports.transSuccess = {
    userCreated: (userEmail) => {
        return `Tài khoản <strong>${userEmail}</strong> đã được tạo , kiểm tra email để kích hoạt tài khoản.`;
    },
    account_actived: "Kích hoạt tài khoản thành công. Hiện tại bạn có thể đăng nhập.",
    loginSuccess: (user) => {
        return `Xin chào ${user}, chúc các bạn một ngày tốt lành.`
    },
    logout_success: "Đăng xuất tài khoản thành công.",
    user_avatar_updated:"Cập nhật ảnh đại diện thành công",
    user_info_updated: "Cập nhật thông tin người dùng thành công.",
    user_password_updated: "Cập nhật mật khẩu thành công."
};

module.exports.transEmail = {
    subject: "Xác nhận kích hoạt tài khoản.",
    template: (linkVerify) => {
        return `
        <h2>Bạn nhận được email này vì đăng ký tài khoản trên ứng dụng chat.</h2>
        <h3>Vui lòng Click vào liên kết để xác nhận tài khoản.</h3>
        <h3><a href = "${linkVerify}" target="blank">${linkVerify}</a></h3>
        <h4>Nếu đây là nhầm lẫn hãy bỏ qua nó.</h4>
        `;
    },
    send_failer: "Có lỗi trong quá trình gửi email. Vui lòng liên hệ với bộ phận hỗ trợ của chúng tôi."
};
