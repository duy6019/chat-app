function removeRequestContact() {
    $(".user-remove-request-contact").bind('click',function(){
        let targetId = $(this).data("uid");
        $.ajax({
            url:"/contact/remove-request-contact",
            type:"delete",
            data:{uid:targetId},
            success:function(data){
                $("#find-user").find(`div.user-remove-request-contact[data-uid=${targetId}]`).hide();
                $("#find-user").find(`div.user-add-new-contact[data-uid=${targetId}]`).css('display','inline-block');
                decreaseNumberNotifContact("count-request-contact-sent");
                //Xử lý realtime ở bài sau
            }
        });
    });
}
