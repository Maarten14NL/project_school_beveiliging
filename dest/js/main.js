$(document).ready(function() {
    console.log('home.js loaded');

    var loggedIn = false;
    var userLevel = 0;

    $('body').on('click', '.menu-item', function() {
        var id = $(this)
            .attr('class')
            .split('_')[1];
        console.log(id);

        $('.verdieping').addClass('hidden');
        $('.verdieping__' + id).removeClass('hidden');
    });

    $('body').on('click', '.login', function() {
        console.log(
            $('.username')
                .val()
                .toLowerCase()
        );
        console.log(
            $('.password')
                .val()
                .toLowerCase()
        );

        $.post(
            'include/login.php',
            {
                loginSub: '',
                username: $('.username')
                    .val()
                    .toLowerCase(),
                password: $('.password').val()
            },
            function(response, status) {
                var data = JSON.parse(response);
                console.log(data);
                if (data.loggedIn == 1) {
                    login(data.level);
                }
            }
        );
    });

    $('body').on('click', '.logout', function() {
        logout();
    });

    $('body').on('click', '.lokaal', function() {
        console.log(loggedIn);
        if (loggedIn == true) {
            console.log(
                $(this)
                    .attr('class')
                    .split(' ')[0]
            );
        }
    });

    $('body').on('click', '.options', function() {
        var level = $(this)
            .attr('class')
            .split(' ')[1]
            .split('_')[1];
        var option = $(this)
            .attr('class')
            .split(' ')[2]
            .split('_')[1];

        $('.view').addClass('hidden');
        $('.view_' + level + '-' + option).removeClass('hidden');

        console.log(level);
        switch (level) {
            case '1':
                $.post('include/getUsers.php', {}, function(response, status) {
                    // console.log(response)
                    response = JSON.parse(response);

                    response.map(function(cp, i) {
                        if (option == '2') {
                            cp.class = 'edit';
                            cp.classText = 'aanpassen';
                        } else if (option == '3') {
                            cp.class = 'delete';
                            cp.classText = 'verwijderen';
                        }
                    });

                    for (var i = 0; i < response.length; i++) {
                        if (response[i].userlevel == 1) {
                            response.splice(i, 1);
                        }
                    }
                    console.log(response);

                    var template = $('.level1-user-template').html();
                    var renderTemplate = Mustache.render(template, response);

                    if (option == '2') {
                        $('.user-level1-edit').html(renderTemplate);
                    } else if (option == '3') {
                        $('.user-level1-delete').html(renderTemplate);
                    }
                });
                break;
        }
    });

    $('body').on('click', '.new-user', function() {
        if (
            $('.new-user-name').val() == '' ||
            $('.new-user-password').val() == '' ||
            $('.new-user-level').val() == null
        ) {
            console.log(
                'geen gebruikersnaam, wachtwoord of level geselecteerd'
            );
        } else {
            console.log($('.new-user-level').val());
            $.post(
                'include/addUser.php',
                {
                    username: $('.new-user-name').val(),
                    userpassword: $('.new-user-password').val(),
                    userlevel: $('.new-user-level').val()
                },
                function(response, status) {
                    console.log(response);
                }
            );
        }
    });

    function login(a_userLevel) {
        $('.login-container').addClass('hidden');
        $('.login-status').text('Welcom: user');
        $('.logout').removeClass('hidden');
        loggedIn = true;
        userLevel = a_userLevel;

        $('.user-level').addClass('hidden');
        $('.view').addClass('hidden');

        switch (userLevel) {
            case 1:
                $('.user-level_1').removeClass('hidden');
                $('.view_1-1').removeClass('hidden');
                break;
            case 2:
                $('.user-level_2').removeClass('hidden');
                $('.view_2-1').removeClass('hidden');
                break;
            case 3:
                $('.user-level_3').removeClass('hidden');
                break;
        }
    }

    function logout() {
        $('.login-container').removeClass('hidden');
        $('.login-status').text('U bent nog niet ingelogd');
        $('.logout').addClass('hidden');
        $('.user-level').addClass('hidden');
        loggedIn = false;
        userLevel = 0;
    }
});

$(document).ready(function() {
    $('#panel-623188').hide();
    $('#panel-338653').hide();
    $('#panel-445566').hide();
    $('#panel-556234').hide();
});

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImhvbWUuanMiLCJ0ZXN0LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDM0tBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6Im1haW4uanMiLCJzb3VyY2VzQ29udGVudCI6WyIkKGRvY3VtZW50KS5yZWFkeShmdW5jdGlvbigpIHtcclxuICAgIGNvbnNvbGUubG9nKCdob21lLmpzIGxvYWRlZCcpO1xyXG5cclxuICAgIHZhciBsb2dnZWRJbiA9IGZhbHNlO1xyXG4gICAgdmFyIHVzZXJMZXZlbCA9IDA7XHJcblxyXG4gICAgJCgnYm9keScpLm9uKCdjbGljaycsICcubWVudS1pdGVtJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgdmFyIGlkID0gJCh0aGlzKVxyXG4gICAgICAgICAgICAuYXR0cignY2xhc3MnKVxyXG4gICAgICAgICAgICAuc3BsaXQoJ18nKVsxXTtcclxuICAgICAgICBjb25zb2xlLmxvZyhpZCk7XHJcblxyXG4gICAgICAgICQoJy52ZXJkaWVwaW5nJykuYWRkQ2xhc3MoJ2hpZGRlbicpO1xyXG4gICAgICAgICQoJy52ZXJkaWVwaW5nX18nICsgaWQpLnJlbW92ZUNsYXNzKCdoaWRkZW4nKTtcclxuICAgIH0pO1xyXG5cclxuICAgICQoJ2JvZHknKS5vbignY2xpY2snLCAnLmxvZ2luJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgY29uc29sZS5sb2coXHJcbiAgICAgICAgICAgICQoJy51c2VybmFtZScpXHJcbiAgICAgICAgICAgICAgICAudmFsKClcclxuICAgICAgICAgICAgICAgIC50b0xvd2VyQ2FzZSgpXHJcbiAgICAgICAgKTtcclxuICAgICAgICBjb25zb2xlLmxvZyhcclxuICAgICAgICAgICAgJCgnLnBhc3N3b3JkJylcclxuICAgICAgICAgICAgICAgIC52YWwoKVxyXG4gICAgICAgICAgICAgICAgLnRvTG93ZXJDYXNlKClcclxuICAgICAgICApO1xyXG5cclxuICAgICAgICAkLnBvc3QoXHJcbiAgICAgICAgICAgICdpbmNsdWRlL2xvZ2luLnBocCcsXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGxvZ2luU3ViOiAnJyxcclxuICAgICAgICAgICAgICAgIHVzZXJuYW1lOiAkKCcudXNlcm5hbWUnKVxyXG4gICAgICAgICAgICAgICAgICAgIC52YWwoKVxyXG4gICAgICAgICAgICAgICAgICAgIC50b0xvd2VyQ2FzZSgpLFxyXG4gICAgICAgICAgICAgICAgcGFzc3dvcmQ6ICQoJy5wYXNzd29yZCcpLnZhbCgpXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGZ1bmN0aW9uKHJlc3BvbnNlLCBzdGF0dXMpIHtcclxuICAgICAgICAgICAgICAgIHZhciBkYXRhID0gSlNPTi5wYXJzZShyZXNwb25zZSk7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhkYXRhKTtcclxuICAgICAgICAgICAgICAgIGlmIChkYXRhLmxvZ2dlZEluID09IDEpIHtcclxuICAgICAgICAgICAgICAgICAgICBsb2dpbihkYXRhLmxldmVsKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICk7XHJcbiAgICB9KTtcclxuXHJcbiAgICAkKCdib2R5Jykub24oJ2NsaWNrJywgJy5sb2dvdXQnLCBmdW5jdGlvbigpIHtcclxuICAgICAgICBsb2dvdXQoKTtcclxuICAgIH0pO1xyXG5cclxuICAgICQoJ2JvZHknKS5vbignY2xpY2snLCAnLmxva2FhbCcsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKGxvZ2dlZEluKTtcclxuICAgICAgICBpZiAobG9nZ2VkSW4gPT0gdHJ1ZSkge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcclxuICAgICAgICAgICAgICAgICQodGhpcylcclxuICAgICAgICAgICAgICAgICAgICAuYXR0cignY2xhc3MnKVxyXG4gICAgICAgICAgICAgICAgICAgIC5zcGxpdCgnICcpWzBdXHJcbiAgICAgICAgICAgICk7XHJcbiAgICAgICAgfVxyXG4gICAgfSk7XHJcblxyXG4gICAgJCgnYm9keScpLm9uKCdjbGljaycsICcub3B0aW9ucycsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHZhciBsZXZlbCA9ICQodGhpcylcclxuICAgICAgICAgICAgLmF0dHIoJ2NsYXNzJylcclxuICAgICAgICAgICAgLnNwbGl0KCcgJylbMV1cclxuICAgICAgICAgICAgLnNwbGl0KCdfJylbMV07XHJcbiAgICAgICAgdmFyIG9wdGlvbiA9ICQodGhpcylcclxuICAgICAgICAgICAgLmF0dHIoJ2NsYXNzJylcclxuICAgICAgICAgICAgLnNwbGl0KCcgJylbMl1cclxuICAgICAgICAgICAgLnNwbGl0KCdfJylbMV07XHJcblxyXG4gICAgICAgICQoJy52aWV3JykuYWRkQ2xhc3MoJ2hpZGRlbicpO1xyXG4gICAgICAgICQoJy52aWV3XycgKyBsZXZlbCArICctJyArIG9wdGlvbikucmVtb3ZlQ2xhc3MoJ2hpZGRlbicpO1xyXG5cclxuICAgICAgICBjb25zb2xlLmxvZyhsZXZlbCk7XHJcbiAgICAgICAgc3dpdGNoIChsZXZlbCkge1xyXG4gICAgICAgICAgICBjYXNlICcxJzpcclxuICAgICAgICAgICAgICAgICQucG9zdCgnaW5jbHVkZS9nZXRVc2Vycy5waHAnLCB7fSwgZnVuY3Rpb24ocmVzcG9uc2UsIHN0YXR1cykge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKHJlc3BvbnNlKVxyXG4gICAgICAgICAgICAgICAgICAgIHJlc3BvbnNlID0gSlNPTi5wYXJzZShyZXNwb25zZSk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHJlc3BvbnNlLm1hcChmdW5jdGlvbihjcCwgaSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAob3B0aW9uID09ICcyJykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY3AuY2xhc3MgPSAnZWRpdCc7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjcC5jbGFzc1RleHQgPSAnYWFucGFzc2VuJztcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmIChvcHRpb24gPT0gJzMnKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjcC5jbGFzcyA9ICdkZWxldGUnO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY3AuY2xhc3NUZXh0ID0gJ3ZlcndpamRlcmVuJztcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHJlc3BvbnNlLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChyZXNwb25zZVtpXS51c2VybGV2ZWwgPT0gMSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzcG9uc2Uuc3BsaWNlKGksIDEpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKHJlc3BvbnNlKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIHRlbXBsYXRlID0gJCgnLmxldmVsMS11c2VyLXRlbXBsYXRlJykuaHRtbCgpO1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciByZW5kZXJUZW1wbGF0ZSA9IE11c3RhY2hlLnJlbmRlcih0ZW1wbGF0ZSwgcmVzcG9uc2UpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBpZiAob3B0aW9uID09ICcyJykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAkKCcudXNlci1sZXZlbDEtZWRpdCcpLmh0bWwocmVuZGVyVGVtcGxhdGUpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAob3B0aW9uID09ICczJykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAkKCcudXNlci1sZXZlbDEtZGVsZXRlJykuaHRtbChyZW5kZXJUZW1wbGF0ZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICB9XHJcbiAgICB9KTtcclxuXHJcbiAgICAkKCdib2R5Jykub24oJ2NsaWNrJywgJy5uZXctdXNlcicsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIGlmIChcclxuICAgICAgICAgICAgJCgnLm5ldy11c2VyLW5hbWUnKS52YWwoKSA9PSAnJyB8fFxyXG4gICAgICAgICAgICAkKCcubmV3LXVzZXItcGFzc3dvcmQnKS52YWwoKSA9PSAnJyB8fFxyXG4gICAgICAgICAgICAkKCcubmV3LXVzZXItbGV2ZWwnKS52YWwoKSA9PSBudWxsXHJcbiAgICAgICAgKSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFxyXG4gICAgICAgICAgICAgICAgJ2dlZW4gZ2VicnVpa2Vyc25hYW0sIHdhY2h0d29vcmQgb2YgbGV2ZWwgZ2VzZWxlY3RlZXJkJ1xyXG4gICAgICAgICAgICApO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCQoJy5uZXctdXNlci1sZXZlbCcpLnZhbCgpKTtcclxuICAgICAgICAgICAgJC5wb3N0KFxyXG4gICAgICAgICAgICAgICAgJ2luY2x1ZGUvYWRkVXNlci5waHAnLFxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIHVzZXJuYW1lOiAkKCcubmV3LXVzZXItbmFtZScpLnZhbCgpLFxyXG4gICAgICAgICAgICAgICAgICAgIHVzZXJwYXNzd29yZDogJCgnLm5ldy11c2VyLXBhc3N3b3JkJykudmFsKCksXHJcbiAgICAgICAgICAgICAgICAgICAgdXNlcmxldmVsOiAkKCcubmV3LXVzZXItbGV2ZWwnKS52YWwoKVxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIGZ1bmN0aW9uKHJlc3BvbnNlLCBzdGF0dXMpIHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhyZXNwb25zZSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICk7XHJcbiAgICAgICAgfVxyXG4gICAgfSk7XHJcblxyXG4gICAgZnVuY3Rpb24gbG9naW4oYV91c2VyTGV2ZWwpIHtcclxuICAgICAgICAkKCcubG9naW4tY29udGFpbmVyJykuYWRkQ2xhc3MoJ2hpZGRlbicpO1xyXG4gICAgICAgICQoJy5sb2dpbi1zdGF0dXMnKS50ZXh0KCdXZWxjb206IHVzZXInKTtcclxuICAgICAgICAkKCcubG9nb3V0JykucmVtb3ZlQ2xhc3MoJ2hpZGRlbicpO1xyXG4gICAgICAgIGxvZ2dlZEluID0gdHJ1ZTtcclxuICAgICAgICB1c2VyTGV2ZWwgPSBhX3VzZXJMZXZlbDtcclxuXHJcbiAgICAgICAgJCgnLnVzZXItbGV2ZWwnKS5hZGRDbGFzcygnaGlkZGVuJyk7XHJcbiAgICAgICAgJCgnLnZpZXcnKS5hZGRDbGFzcygnaGlkZGVuJyk7XHJcblxyXG4gICAgICAgIHN3aXRjaCAodXNlckxldmVsKSB7XHJcbiAgICAgICAgICAgIGNhc2UgMTpcclxuICAgICAgICAgICAgICAgICQoJy51c2VyLWxldmVsXzEnKS5yZW1vdmVDbGFzcygnaGlkZGVuJyk7XHJcbiAgICAgICAgICAgICAgICAkKCcudmlld18xLTEnKS5yZW1vdmVDbGFzcygnaGlkZGVuJyk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSAyOlxyXG4gICAgICAgICAgICAgICAgJCgnLnVzZXItbGV2ZWxfMicpLnJlbW92ZUNsYXNzKCdoaWRkZW4nKTtcclxuICAgICAgICAgICAgICAgICQoJy52aWV3XzItMScpLnJlbW92ZUNsYXNzKCdoaWRkZW4nKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIDM6XHJcbiAgICAgICAgICAgICAgICAkKCcudXNlci1sZXZlbF8zJykucmVtb3ZlQ2xhc3MoJ2hpZGRlbicpO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIGxvZ291dCgpIHtcclxuICAgICAgICAkKCcubG9naW4tY29udGFpbmVyJykucmVtb3ZlQ2xhc3MoJ2hpZGRlbicpO1xyXG4gICAgICAgICQoJy5sb2dpbi1zdGF0dXMnKS50ZXh0KCdVIGJlbnQgbm9nIG5pZXQgaW5nZWxvZ2QnKTtcclxuICAgICAgICAkKCcubG9nb3V0JykuYWRkQ2xhc3MoJ2hpZGRlbicpO1xyXG4gICAgICAgICQoJy51c2VyLWxldmVsJykuYWRkQ2xhc3MoJ2hpZGRlbicpO1xyXG4gICAgICAgIGxvZ2dlZEluID0gZmFsc2U7XHJcbiAgICAgICAgdXNlckxldmVsID0gMDtcclxuICAgIH1cclxufSk7XHJcbiIsIiQoZG9jdW1lbnQpLnJlYWR5KGZ1bmN0aW9uKCkge1xyXG4gICAgJCgnI3BhbmVsLTYyMzE4OCcpLmhpZGUoKTtcclxuICAgICQoJyNwYW5lbC0zMzg2NTMnKS5oaWRlKCk7XHJcbiAgICAkKCcjcGFuZWwtNDQ1NTY2JykuaGlkZSgpO1xyXG4gICAgJCgnI3BhbmVsLTU1NjIzNCcpLmhpZGUoKTtcclxufSk7XHJcbiJdfQ==
