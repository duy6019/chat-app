let userAvatar = null;
let userInfo = {};
let originAvartarSrc = null;
let origiUserInfo = {};
let userUpdatePassword = {};

function callLogout() {
    let timerInterval;
    Swal.fire({
        position: "top-end",
        icon: "success",
        title: "Tự động đăng xuất sau 5s.",
        html: "Thời gian: <strong></strong>",
        timer: 5000,
        onBeforeOpen: () => {
            Swal.showLoading();
            timerInterval = setInterval(() => {
                Swal.getContent().querySelector("strong").textContent = Math.ceil(Swal.getTimerLeft()/1000);
            }, 1000);
        },
        onClose:()=>{
            clearInterval(timerInterval);
        }
    }).then(result=>{
        $.get("/logout",function(){
            location.reload();
        });
    });
}

function updateUserInfo() {
    $("#input-change-avatar").bind("change", function () {
        let fileData = $(this).prop("files")[0];
        let math = ["image/png", "image/jpg", "image/jpeg"];
        let limit = 1048576; // 1Mb = 1048576 bytes
        if ($.inArray(fileData.type, math) === -1) {
            alertify.notify("Kiểu file không hợp lệ, chỉ chấp nhận jpg & png", "error", 5);
            $(this).val(null);
            return false;
        }
        if (fileData.size > limit) {
            alertify.notify("Ảnh chỉ cho phép giới hạn 1Mb.", "error", 5);
            $(this).val(null);
            return false;
        }
        if (typeof (FileReader) != "undefined") {
            let imagePreview = $("#image-edit-profile");
            imagePreview.empty();
            let fileReader = new FileReader();
            fileReader.onload = function (element) {
                $("<img>", {
                    "src": element.target.result,
                    "class": "avatar img-circle",
                    "id": "user-modal-avatar",
                    "alt": "avatar"
                }).appendTo(imagePreview);
            }
            imagePreview.show();
            fileReader.readAsDataURL(fileData);

            let formData = new FormData();
            formData.append("avatar", fileData);
            userAvatar = formData;
        } else {
            alertify.notify("Trình duyệt không hỗ trợ đọc file.", "error", 5);
        }
    });

    $("#input-change-username").bind("change", function () {
        userInfo.username = $(this).val();
    });

    $("#input-change-gender-male").bind("click", function () {
        userInfo.gender = $(this).val();
    });

    $("#input-change-gender-female").bind("click", function () {
        userInfo.gender = $(this).val();
    });

    $("#input-change-address").bind("change", function () {
        userInfo.address = $(this).val();
    });

    $("#input-change-phone").bind("change", function () {
        userInfo.phone = $(this).val();
    });

    $("#input-change-current-password").bind("change", function () {
        let currentPassword = $(this).val();
        let regexPassword = new RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&]{8,}$/);
        if (!regexPassword.test(currentPassword)) {
            alertify.notify("Mật khẩu chứa ít nhất 8 ký tự bao gồm chữ hoa , chữ thường và chữ số !", "error", 5);
            $(this).val(null);
            delete userUpdatePassword.currentPassword;
            return false;
        }
        userUpdatePassword.currentPassword = currentPassword;
    });

    $("#input-change-new-password").bind("change", function () {
        let newPassword = $(this).val();
        let regexPassword = new RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&]{8,}$/);
        if (!regexPassword.test(newPassword)) {
            alertify.notify("Mật khẩu chứa ít nhất 8 ký tự bao gồm chữ hoa , chữ thường và chữ số !", "error", 5);
            $(this).val(null);
            delete userUpdatePassword.newPassword;
            return false;
        }
        userUpdatePassword.newPassword = newPassword;
    });

    $("#input-change-confirm-password").bind("change", function () {
        let confirmPassword = $(this).val();
        if (!userUpdatePassword.newPassword) {
            alertify.notify("Bạn chưa nhập mật khẩu mới.", "error", 5);
            $(this).val(null);
            delete userUpdatePassword.confirmPassword;
            return false;
        }
        if (confirmPassword !== userUpdatePassword.newPassword) {
            alertify.notify("Nhập lại mật khẩu chưa chính xác.", "error", 5);
            $(this).val(null);
            delete userUpdatePassword.confirmPassword;
            return false;
        }
        userUpdatePassword.confirmPassword = confirmPassword;
    });
}

function callUpdateUserAvatar() {
    $.ajax({
        url: "/user/update-avatar",
        type: "put",
        cache: false,
        contentType: false,
        processData: false,
        data: userAvatar,
        success: function (result) {
            //Display successs
            alertify.notify(result.message, "success", 5);
            //Update avatar at navbar   
            $("#navbar-avatar").attr("src", result.imageSrc);
            //Update origin avatar
            originAvartarSrc = result.imageSrc;
            //Reser all
            $("#input-btn-cancel-update-user").click();
        },
        error: function (error) {
            //Display error
            alertify.notify(error.responseText, "error", 5);
            //Reset all
            $("#input-btn-cancel-update-user").click();
        }
    });
}

function callUpdateUserInfo() {
    $.ajax({
        url: "/user/update-info",
        type: "put",
        data: userInfo,
        success: function (result) {
            //Display success
            alertify.notify(result.message, "success", 5);
            //Update originUserInfo
            origiUserInfo = Object.assign(origiUserInfo, userInfo);

            //Update username at navbar
            $("#navbar-username").text(origiUserInfo.username);

            //Reser all
            $("#input-btn-cancel-update-user").click();
        },
        error: function (error) {
            //Display error
            let errarr = error.responseText.split(".");
            for (var i = 0; i < errarr.length - 1; i++) {
                alertify.notify(errarr[i], "error", 7);
            }
            //alertify.notify(error.responseText, "error", 7);
            //Reset all
            $("#input-btn-cancel-update-user").click();
        }
    });
}

function callUpdateUserPassword() {
    $.ajax({
        url: "/user/update-password",
        type: "put",
        data: userUpdatePassword,
        success: function (result) {
            //Display success
            $(".user-modal-password-alert-success").find("span").text(result.message);
            $(".user-modal-password-alert-success").css("display", "block");
            //Update originUserInfo
            origiUserInfo = Object.assign(origiUserInfo, userInfo);

            //Update username at navbar
            $("#navbar-username").text(origiUserInfo.username);

            //Reser all
            $("#input-btn-cancel-update-user-password").click();

            //Log out after change password
            callLogout();
        },
        error: function (error) {
            //Display error
            $(".user-modal-password-alert-error").find("span").text(error.responseText);
            $(".user-modal-password-alert-error").css("display", "block");
            //Reset all
            $("#input-btn-cancel-update-user-password").click();
        }
    });
}

$(document).ready(function () {
    origiUserInfo = {
        username: $("#input-change-username").val(),
        gender: ($("#input-change-gender-male").is(":checked")) ? $("#input-change-gender-male").val() : $("#input-change-gender-female").val(),
        address: $("#input-change-address").val(),
        phone: $("#input-change-phone").val(),
    };
    originAvartarSrc = $("#user-modal-avatar").attr("src");
    // Update user info after change
    updateUserInfo();
    $("#input-btn-update-user").bind("click", function () {
        if ($.isEmptyObject(userInfo) && !userAvatar) {
            alertify.notify("Bạn phải thay đổi thông tin trước khi cập nhật dữ liệu.", "error", 5);
            return false;
        }
        if (userAvatar) {
            callUpdateUserAvatar();
        }
        if (!$.isEmptyObject(userInfo)) {
            callUpdateUserInfo();
        }

    });
    $("#input-btn-cancel-update-user").bind("click", function () {
        userAvatar = null;
        userInfo = {};
        $("#input-change-avatar").val(null);
        $("#user-modal-avatar").attr("src", originAvartarSrc);
        $("#input-change-username").val(origiUserInfo.username);
        if (origiUserInfo.gender === "male" && !$("#input-change-gender-male").is(":checked")) {
            $("#input-change-gender-male").click();
        }
        if (origiUserInfo.gender === "female" && !$("#input-change-gender-female").is(":checked")) {
            $("#input-change-gender-fmale").click();
        }
        $("#input-change-address").val(origiUserInfo.address);
        $("#input-change-phone").val(origiUserInfo.phone);
    })

    $("#input-btn-update-user-password").bind("click", function () {

        if (!userUpdatePassword.currentPassword || !userUpdatePassword.newPassword || !userUpdatePassword.confirmPassword) {
            alertify.notify("Bạn phải điền đầy đủ thông tin trước khi cập nhật dữ liệu.", "error", 5);
            return false;
        }
        Swal.fire({
            title: "Bạn có chắc muốn thay đổi mật khẩu?",
            text: "Bạn không thể hoàn tác quá trình này!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#2ECC71",
            cancelButtonColor: "#ff7675",
            confirmButtonText: "Xác nhận",
            cancelButtonText: "Hủy"
        }).then((result) => {
            if (!result.value) {
                $("#input-btn-cancel-update-user-password").click();
                return false;
            }
            callUpdateUserPassword();
        })
    });

    $("#input-btn-cancel-update-user-password").bind("click", function () {
        userUpdatePassword = {};
        $("#input-change-current-password").val(null);
        $("#input-change-new-password").val(null);
        $("#input-change-confirm-password").val(null);
    });

});
