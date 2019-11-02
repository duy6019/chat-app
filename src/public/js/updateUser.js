let userAvatar = null;
let userInfo = {};
let originAvartarSrc = null;
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

$(document).ready(function () {
    updateUserInfo();

    originAvartarSrc = $("#user-modal-avatar").attr("src");

    $("#input-btn-update-user").bind("click", function () {
        if ($.isEmptyObject(userInfo) && !userAvatar) {
            alertify.notify("Bạn phải thay đổi thông tin trước khi cập nhật dữ liệu.", "error", 5);
            return false;
        }
        $.ajax({
            url: "/user/update-avatar",
            type: "put",
            cache: false,
            contentType: false,
            processData: false,
            data: userAvatar,
            success:function(result){
                //Display success
                $(".user-modal-alert-success").find("span").text(result.message);
                $(".user-modal-alert-error").css("display","none");
                $(".user-modal-alert-success").css("display","block");
                //Update avatar at navbar
                $("#navbar-avatar").attr("src",result.imageSrc);
                //Update origin avatar
                originAvartarSrc = result.imageSrc;
                //Reser all
                $("#input-btn-cancel-update-user").click();
            },
            error:function(error){
                //Display error
                $(".user-modal-alert-error").find("span").text(error.responseText);
                $(".user-modal-alert-success").css("display","none");
                $(".user-modal-alert-error").css("display","block");
                //Reset all
                $("#input-btn-cancel-update-user").click();
            }
        });
    });
    $("#input-btn-cancel-update-user").bind("click", function () {
        userAvatar = null;
        userInfo = {};
        $("#input-change-avatar").val(null);
        $("#user-modal-avatar").attr("src", originAvartarSrc);
    })
});
