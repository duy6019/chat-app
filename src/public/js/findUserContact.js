function callFindUsers() {
    let keyword = $("#input-find-users-contact").val();
    if (keyword) {
        let regexKeyword = new RegExp(/^[\s0-9a-zA-Z_ÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ ]+$/);
        if (!regexKeyword.test(keyword)) {
            alertify.notify("Lỗi từ khóa tìm kiếm, chỉ cho phép chữ cái và số, cho phép khoảng trống", "error", 5);
            return false;
        }
        $.get(`contact/find-users/${keyword}`, function (data) {
            $("#find-user ul").html(data);
            addContact();
            removeRequestContact();
        });
    }
}

$(document).ready(function () {
    $("#input-find-users-contact").bind("keyup", callFindUsers);
    $("#btn-find-users-contact").bind("click", callFindUsers);
});
