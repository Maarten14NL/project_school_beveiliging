var loggedIn = false;
var userLevel = 0;
var loggedInUser = [];
var users = [];
var scenarios = [];
var alertActive = false;
$(document).ready(function () {
    $('.verdieping').addClass("hidden")
    $('.verdieping__0').removeClass("hidden")

    $('body').on('click', '.menu-item', function () {
        var id = $(this).data('floor');
        $('.verdieping').addClass("hidden")
        $('.menu-item').removeClass("active")
        $('.verdieping__' + id).removeClass("hidden")

        $('.floor_' + id).addClass("active")
    })

    $('body').on('click', '.login', function () {
        $.post("include/login.php", {
            loginSub: "",
            username: $('.username').val().toLowerCase(),
            password: $('.password').val()
        }, function (response, status) {
            var data = JSON.parse(response);
            loggedInUser = data;
            if (data.loggedIn == 1) {
                login(data.level);
                showFlashMessage('U bent succesvol ingelogd', 'success')
            } else {
                showFlashMessage('Uw gebruikersnaam of wachtwoord is incorrect', 'danger')
            }
        })
    })

    $('body').on('click', '.logout', function () {
        logout();
    })

    $('body').on('click', '.lokaal', function () {
        if (loggedIn == true) {
            var lokaalnr = $(this).attr("class").split(" ")[0];
            $('.js-lokaal').html(lokaalnr);
        }
    })

    $(document).keypress(function (e) {
        if (e.which == 13) {
            if (!loggedIn) {
                $('.login').trigger('click');
            }
        }
    });
})