let userAvatar = null;
let userInfo = {};
let originAvartarSrc = null;
let origiUserInfo = {};

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
            let errarr = error.responseText.split('.');
            for (var i = 0; i < errarr.length-1; i++) {
                alertify.notify(errarr[i], "error", 7);
            }
            //alertify.notify(error.responseText, "error", 7);
            //Reset all
            $("#input-btn-cancel-update-user").click();
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
});
