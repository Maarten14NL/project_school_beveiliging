$("body").on("click", ".options", function () {
    var level = $(this).data('level');
    var option = $(this).data('option');
    $(".view").addClass("hidden")
    $(".view_" + level + "-" + option).removeClass("hidden")
    $('.options').removeClass('active');
    $(this).addClass('active');
    switch (level) {
        case "1":
            updateLevel1Templates();
            break;
        case "2":
            updateLevel2Templates();
            break;
    }
})
