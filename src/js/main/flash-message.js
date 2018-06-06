// function showFlashMessage(mes, type, dismissable = false, secs = 2000){
//     var elem = $('.js-flash');
//     $(elem).removeClass('alert-danger').removeClass('alert-success')
//         .addClass('flash-message--show')
//         .addClass('alert-' + type)
//         .html(mes);
//     if (dismissable) {
//         $(elem).append('<button class="js-dismiss btn">Ok</button>');
//     }
//     else {
//         setTimeout(function () {
//             unshowFlashMessage();
//         }, secs);
//     }
// }
// $('body').on('click', '.js-dismiss', function(){
//     unshowFlashMessage();
// });
//
// function unshowFlashMessage(){
//     var elem = $('.js-flash');
//     console.log(elem);
//     $(elem).removeClass('flash-message--show');
// }
