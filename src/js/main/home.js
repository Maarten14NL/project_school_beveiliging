var loggedIn = false;
var userLevel = 0;
var loggedInUser = [];
var users = [];
var scenarios = [];
var alertActive = false;

$(document).ready(function(){
    console.log("home.js loaded")
    $('body').on('click', '.menu-item', function(){
        var id = $(this).attr("class").split('_')[1];
        console.log(id)

        $('.verdieping').addClass("hidden")
        $('.verdieping__'+id).removeClass("hidden")
    })

    $('body').on('click', '.login', function(){
        console.log($('.username').val().toLowerCase())
        console.log($('.password').val().toLowerCase())

        $.post("include/login.php" ,{
            loginSub: "",
            username: $('.username').val().toLowerCase(),
            password: $('.password').val()
        }, function(response,status){
            var data = JSON.parse(response);
            console.log(data);
            loggedInUser = data;
            if (data.loggedIn == 1) {
                login(data.level);
                showFlashMessage('U bent succesvol ingelogd', 'success')
            }
            else {
                showFlashMessage('Uw gebruikersnaam of wachtwoord is incorrect', 'danger')
            }
        })
    })

    $('body').on('click', '.logout', function(){
        logout();
    })

    $('body').on('click', '.lokaal', function(){
        console.log(loggedIn)
        if(loggedIn == true){
            var lokaalnr = $(this).attr("class").split(" ")[0];
            $('.js-lokaal').html(lokaalnr);
        }
    })

    $(document).keypress(function(e) {
        if(e.which == 13) {
            if (!loggedIn) {
                $('.login').trigger('click');
            }
        }
    });
})
