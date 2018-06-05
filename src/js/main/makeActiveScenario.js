$('body').on('click', '.lokaal', function(){
    console.log(loggedIn)
    if(loggedIn == true){
        var lokaalnr = $(this).attr("class").split(" ")[0];
        $('.js-lokaal').html(lokaalnr);
    }
})
