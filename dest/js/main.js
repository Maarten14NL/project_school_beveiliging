$('.js-newstep').on('propertychange input', function (e) {
    var elem = $(this);
    console.log(elem);
    var parent = $(elem).closest('.js-new-scenario-steps');
    var checkElem = $(parent).find('.js-newstep:last-child');
    console.log(checkElem);
    if (elem == checkElem) {
        console.log('yes');
    }
});

$('body').on('click', '.level1-btn-delete',function(){
  var rowClass = $(this).parent().parent().attr("class");
  var row = $(this).parent().parent().attr("class").split("index")[1];
  console.log(users)
  for(var i = 0; i < users.length; i++){
    if(users[i].index == row){
      $.post("include/deleteUser.php" ,{
        id: users[i].id
      }, function(response,status){
        console.log(response);
        if(response == "succes"){
          console.log(rowClass)
          console.log('asd');
          $("."+rowClass).remove();
        }
      })
    }
  }
})

function showFlashMessage(mes, type, secs = 2000){
    var elem = $('.js-flash');
    $(elem).removeClass('alert-danger').removeClass('alert-success')
        .addClass('flash-message--show')
        .addClass('alert-' + type)
        .html(mes);
    setTimeout(function () {
        unshowFlashMessage();
    }, secs);
}

function unshowFlashMessage(){
    var elem = $('.js-flash');
    console.log(elem);
    $(elem).removeClass('flash-message--show');
}

function login(a_userLevel){
  $('.login-container').addClass("hidden");
  $('.login-status').text("Welcom: user")
  $('.logout').removeClass("hidden")
  $('.settings').removeClass("hidden")
  loggedIn = true;
  userLevel = a_userLevel;

  $(".user-level").addClass("hidden")
  $(".view").addClass("hidden")

  switch (userLevel) {
    case 1:
      $(".user-level_1").removeClass("hidden")
      $(".view_1-1").removeClass("hidden")
      break;
    case 2:
      $(".user-level_2").removeClass("hidden")
      $(".view_2-2").removeClass("hidden")
      break;
    case 3:
      $(".user-level_3").removeClass("hidden")
      break;
  }
}

function logout(){
  $('.login-container').removeClass("hidden");
  $('.login-status').text("U bent nog niet ingelogd")
  $('.logout').addClass("hidden")
  $(".user-level").addClass("hidden")
  $('.settings').addClass("hidden")
  loggedIn = false;
  userLevel = 0;

  $.post("include/login.php",{
      logoutSub: ''
  }, function(response,status){
      showFlashMessage('Je bent uitgelogd', 'success');
  })
}

var loggedIn = false;
var userLevel = 0;
var loggedInUser = [];
var users = [];
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

      console.log($(this).attr("class").split(" ")[0])
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

$("body").on("click", ".new-user",function(){
  if($(".new-user-name").val() == "" || $(".new-user-password").val() == "" || $(".new-user-level").val() == null){
    console.log("geen gebruikersnaam, wachtwoord of level geselecteerd")
  }else{
    console.log($(".new-user-level").val())
    $.post("include/addUser.php",{
      username: $(".new-user-name").val(),
      userpassword: $(".new-user-password").val(),
      userlevel: $(".new-user-level").val()
    }, function(response,status){
      console.log(response)
    })
  }
})

$("body").on("click", ".options", function(){
  var level = $(this).attr("class").split(" ")[1].split("_")[1];
  var option = $(this).attr("class").split(" ")[2].split("_")[1];

  $(".view").addClass("hidden")
  $(".view_"+level+"-"+option).removeClass("hidden")

  switch (level) {
    case "1":
      $.post("include/getUsers.php",{
      }, function(response,status){
        console.log(response)
        users = JSON.parse(response)

        for(var i = 0; i < 2; i++){
          console.log(i)
          users.map(function(cp,j){
            cp.index = j;
            // console.log(i)
            if(i == 0){
              cp.class = "edit"
              cp.classText = "aanpassen"
            }else if(i == 1){
              cp.class = "delete"
              cp.classText = "verwijderen"
            }
          })

          for(var j = 0; j < users.length; j++){
            if(users[j].userlevel == 1){
              users.splice(j,1)
            }
          }

          console.log(users)

          var template = $(".level1-user-template").html();
          var renderTemplate = Mustache.render(template, users);

          if(i == 0){
            $(".user-level1-edit").html(renderTemplate);
          }else if(i == 1){
            $(".user-level1-delete").html(renderTemplate);
          }
        }
      })
      break;
  }
})

$(document).ready(function(){
    $.post("include/returnSession.php",{
    }, function(response,status){
        var data = JSON.parse(response);
        if (data.loggedIn) {
            login(data.level);
            loggedInUser = data;
        }
    })
});

$(".settings-inputs").keypress(function(e) {
  console.log("enter")
    if(e.which == 13) {
      $('.settings-update').trigger('click');
    }
});

$('body').on('click', '.settings', function(){
  console.log("settings")
  $('.settings-username').val(loggedInUser.username)
  $('.user-settings').modal('show');
  console.log(loggedInUser.username)
})

$('body').on('click', '.settings-update', function(){
  console.log("update")
  console.log($('.settings-username').val())
  console.log($('.settings-password').val())
  console.log($('.settings-repeat-password').val())

  if($('.settings-username').val() == "" && $('.settings-password').val() == "" && $('.settings-repeat-password').val() == ""){
    console.log("gebruikersnaam en wachtwoord mogen niet leeg zijn");
  }else{
    if($('.settings-password').val() != $('.settings-repeat-password').val()){
      console.log("wachtwoorden zijn niet gelijk aan elkaar")
    }else{
      console.log(loggedInUser)
      $.post("include/updateUser.php" ,{
        id: loggedInUser.userID,
        name: $('.settings-username').val(),
        pass: $('.settings-password').val()
      }, function(response,status){
          console.log(response);
        if(response == "succes"){
        $('.user-settings').modal('hide');
        }
      })
    }
  }
})

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFkZFNjZW5hcmlvLmpzIiwiZGVsZXRlLXVzZXIuanMiLCJmbGFzaC1tZXNzYWdlLmpzIiwiZnVuY3Rpb25zLmpzIiwiaG9tZS5qcyIsIm5ldy11c2VyLmpzIiwib3B0aW9ucy5qcyIsInNlc3Npb25DaGVjay5qcyIsInNldHRpbmdzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNWQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDbkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNoQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDekNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN2REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDZEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2pEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDVkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJtYWluLmpzIiwic291cmNlc0NvbnRlbnQiOlsiJCgnLmpzLW5ld3N0ZXAnKS5vbigncHJvcGVydHljaGFuZ2UgaW5wdXQnLCBmdW5jdGlvbiAoZSkge1xyXG4gICAgdmFyIGVsZW0gPSAkKHRoaXMpO1xyXG4gICAgY29uc29sZS5sb2coZWxlbSk7XHJcbiAgICB2YXIgcGFyZW50ID0gJChlbGVtKS5jbG9zZXN0KCcuanMtbmV3LXNjZW5hcmlvLXN0ZXBzJyk7XHJcbiAgICB2YXIgY2hlY2tFbGVtID0gJChwYXJlbnQpLmZpbmQoJy5qcy1uZXdzdGVwOmxhc3QtY2hpbGQnKTtcclxuICAgIGNvbnNvbGUubG9nKGNoZWNrRWxlbSk7XHJcbiAgICBpZiAoZWxlbSA9PSBjaGVja0VsZW0pIHtcclxuICAgICAgICBjb25zb2xlLmxvZygneWVzJyk7XHJcbiAgICB9XHJcbn0pO1xyXG4iLCIkKCdib2R5Jykub24oJ2NsaWNrJywgJy5sZXZlbDEtYnRuLWRlbGV0ZScsZnVuY3Rpb24oKXtcclxuICB2YXIgcm93Q2xhc3MgPSAkKHRoaXMpLnBhcmVudCgpLnBhcmVudCgpLmF0dHIoXCJjbGFzc1wiKTtcclxuICB2YXIgcm93ID0gJCh0aGlzKS5wYXJlbnQoKS5wYXJlbnQoKS5hdHRyKFwiY2xhc3NcIikuc3BsaXQoXCJpbmRleFwiKVsxXTtcclxuICBjb25zb2xlLmxvZyh1c2VycylcclxuICBmb3IodmFyIGkgPSAwOyBpIDwgdXNlcnMubGVuZ3RoOyBpKyspe1xyXG4gICAgaWYodXNlcnNbaV0uaW5kZXggPT0gcm93KXtcclxuICAgICAgJC5wb3N0KFwiaW5jbHVkZS9kZWxldGVVc2VyLnBocFwiICx7XHJcbiAgICAgICAgaWQ6IHVzZXJzW2ldLmlkXHJcbiAgICAgIH0sIGZ1bmN0aW9uKHJlc3BvbnNlLHN0YXR1cyl7XHJcbiAgICAgICAgY29uc29sZS5sb2cocmVzcG9uc2UpO1xyXG4gICAgICAgIGlmKHJlc3BvbnNlID09IFwic3VjY2VzXCIpe1xyXG4gICAgICAgICAgY29uc29sZS5sb2cocm93Q2xhc3MpXHJcbiAgICAgICAgICBjb25zb2xlLmxvZygnYXNkJyk7XHJcbiAgICAgICAgICAkKFwiLlwiK3Jvd0NsYXNzKS5yZW1vdmUoKTtcclxuICAgICAgICB9XHJcbiAgICAgIH0pXHJcbiAgICB9XHJcbiAgfVxyXG59KVxyXG4iLCJmdW5jdGlvbiBzaG93Rmxhc2hNZXNzYWdlKG1lcywgdHlwZSwgc2VjcyA9IDIwMDApe1xyXG4gICAgdmFyIGVsZW0gPSAkKCcuanMtZmxhc2gnKTtcclxuICAgICQoZWxlbSkucmVtb3ZlQ2xhc3MoJ2FsZXJ0LWRhbmdlcicpLnJlbW92ZUNsYXNzKCdhbGVydC1zdWNjZXNzJylcclxuICAgICAgICAuYWRkQ2xhc3MoJ2ZsYXNoLW1lc3NhZ2UtLXNob3cnKVxyXG4gICAgICAgIC5hZGRDbGFzcygnYWxlcnQtJyArIHR5cGUpXHJcbiAgICAgICAgLmh0bWwobWVzKTtcclxuICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHVuc2hvd0ZsYXNoTWVzc2FnZSgpO1xyXG4gICAgfSwgc2Vjcyk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHVuc2hvd0ZsYXNoTWVzc2FnZSgpe1xyXG4gICAgdmFyIGVsZW0gPSAkKCcuanMtZmxhc2gnKTtcclxuICAgIGNvbnNvbGUubG9nKGVsZW0pO1xyXG4gICAgJChlbGVtKS5yZW1vdmVDbGFzcygnZmxhc2gtbWVzc2FnZS0tc2hvdycpO1xyXG59XHJcbiIsImZ1bmN0aW9uIGxvZ2luKGFfdXNlckxldmVsKXtcclxuICAkKCcubG9naW4tY29udGFpbmVyJykuYWRkQ2xhc3MoXCJoaWRkZW5cIik7XHJcbiAgJCgnLmxvZ2luLXN0YXR1cycpLnRleHQoXCJXZWxjb206IHVzZXJcIilcclxuICAkKCcubG9nb3V0JykucmVtb3ZlQ2xhc3MoXCJoaWRkZW5cIilcclxuICAkKCcuc2V0dGluZ3MnKS5yZW1vdmVDbGFzcyhcImhpZGRlblwiKVxyXG4gIGxvZ2dlZEluID0gdHJ1ZTtcclxuICB1c2VyTGV2ZWwgPSBhX3VzZXJMZXZlbDtcclxuXHJcbiAgJChcIi51c2VyLWxldmVsXCIpLmFkZENsYXNzKFwiaGlkZGVuXCIpXHJcbiAgJChcIi52aWV3XCIpLmFkZENsYXNzKFwiaGlkZGVuXCIpXHJcblxyXG4gIHN3aXRjaCAodXNlckxldmVsKSB7XHJcbiAgICBjYXNlIDE6XHJcbiAgICAgICQoXCIudXNlci1sZXZlbF8xXCIpLnJlbW92ZUNsYXNzKFwiaGlkZGVuXCIpXHJcbiAgICAgICQoXCIudmlld18xLTFcIikucmVtb3ZlQ2xhc3MoXCJoaWRkZW5cIilcclxuICAgICAgYnJlYWs7XHJcbiAgICBjYXNlIDI6XHJcbiAgICAgICQoXCIudXNlci1sZXZlbF8yXCIpLnJlbW92ZUNsYXNzKFwiaGlkZGVuXCIpXHJcbiAgICAgICQoXCIudmlld18yLTJcIikucmVtb3ZlQ2xhc3MoXCJoaWRkZW5cIilcclxuICAgICAgYnJlYWs7XHJcbiAgICBjYXNlIDM6XHJcbiAgICAgICQoXCIudXNlci1sZXZlbF8zXCIpLnJlbW92ZUNsYXNzKFwiaGlkZGVuXCIpXHJcbiAgICAgIGJyZWFrO1xyXG4gIH1cclxufVxyXG5cclxuZnVuY3Rpb24gbG9nb3V0KCl7XHJcbiAgJCgnLmxvZ2luLWNvbnRhaW5lcicpLnJlbW92ZUNsYXNzKFwiaGlkZGVuXCIpO1xyXG4gICQoJy5sb2dpbi1zdGF0dXMnKS50ZXh0KFwiVSBiZW50IG5vZyBuaWV0IGluZ2Vsb2dkXCIpXHJcbiAgJCgnLmxvZ291dCcpLmFkZENsYXNzKFwiaGlkZGVuXCIpXHJcbiAgJChcIi51c2VyLWxldmVsXCIpLmFkZENsYXNzKFwiaGlkZGVuXCIpXHJcbiAgJCgnLnNldHRpbmdzJykuYWRkQ2xhc3MoXCJoaWRkZW5cIilcclxuICBsb2dnZWRJbiA9IGZhbHNlO1xyXG4gIHVzZXJMZXZlbCA9IDA7XHJcblxyXG4gICQucG9zdChcImluY2x1ZGUvbG9naW4ucGhwXCIse1xyXG4gICAgICBsb2dvdXRTdWI6ICcnXHJcbiAgfSwgZnVuY3Rpb24ocmVzcG9uc2Usc3RhdHVzKXtcclxuICAgICAgc2hvd0ZsYXNoTWVzc2FnZSgnSmUgYmVudCB1aXRnZWxvZ2QnLCAnc3VjY2VzcycpO1xyXG4gIH0pXHJcbn1cclxuIiwidmFyIGxvZ2dlZEluID0gZmFsc2U7XHJcbnZhciB1c2VyTGV2ZWwgPSAwO1xyXG52YXIgbG9nZ2VkSW5Vc2VyID0gW107XHJcbnZhciB1c2VycyA9IFtdO1xyXG4kKGRvY3VtZW50KS5yZWFkeShmdW5jdGlvbigpe1xyXG4gIGNvbnNvbGUubG9nKFwiaG9tZS5qcyBsb2FkZWRcIilcclxuICAkKCdib2R5Jykub24oJ2NsaWNrJywgJy5tZW51LWl0ZW0nLCBmdW5jdGlvbigpe1xyXG4gICAgdmFyIGlkID0gJCh0aGlzKS5hdHRyKFwiY2xhc3NcIikuc3BsaXQoJ18nKVsxXTtcclxuICAgIGNvbnNvbGUubG9nKGlkKVxyXG5cclxuICAgICQoJy52ZXJkaWVwaW5nJykuYWRkQ2xhc3MoXCJoaWRkZW5cIilcclxuICAgICQoJy52ZXJkaWVwaW5nX18nK2lkKS5yZW1vdmVDbGFzcyhcImhpZGRlblwiKVxyXG4gIH0pXHJcblxyXG4gICQoJ2JvZHknKS5vbignY2xpY2snLCAnLmxvZ2luJywgZnVuY3Rpb24oKXtcclxuICAgIGNvbnNvbGUubG9nKCQoJy51c2VybmFtZScpLnZhbCgpLnRvTG93ZXJDYXNlKCkpXHJcbiAgICBjb25zb2xlLmxvZygkKCcucGFzc3dvcmQnKS52YWwoKS50b0xvd2VyQ2FzZSgpKVxyXG5cclxuICAgICQucG9zdChcImluY2x1ZGUvbG9naW4ucGhwXCIgLHtcclxuICAgICAgbG9naW5TdWI6IFwiXCIsXHJcbiAgICAgIHVzZXJuYW1lOiAkKCcudXNlcm5hbWUnKS52YWwoKS50b0xvd2VyQ2FzZSgpLFxyXG4gICAgICBwYXNzd29yZDogJCgnLnBhc3N3b3JkJykudmFsKClcclxuICAgIH0sIGZ1bmN0aW9uKHJlc3BvbnNlLHN0YXR1cyl7XHJcbiAgICAgIHZhciBkYXRhID0gSlNPTi5wYXJzZShyZXNwb25zZSk7XHJcbiAgICAgIGNvbnNvbGUubG9nKGRhdGEpO1xyXG4gICAgICBsb2dnZWRJblVzZXIgPSBkYXRhO1xyXG4gICAgICBpZiAoZGF0YS5sb2dnZWRJbiA9PSAxKSB7XHJcbiAgICAgICAgICBsb2dpbihkYXRhLmxldmVsKTtcclxuICAgICAgICAgIHNob3dGbGFzaE1lc3NhZ2UoJ1UgYmVudCBzdWNjZXN2b2wgaW5nZWxvZ2QnLCAnc3VjY2VzcycpXHJcbiAgICAgIH1cclxuICAgICAgZWxzZSB7XHJcbiAgICAgICAgICBzaG93Rmxhc2hNZXNzYWdlKCdVdyBnZWJydWlrZXJzbmFhbSBvZiB3YWNodHdvb3JkIGlzIGluY29ycmVjdCcsICdkYW5nZXInKVxyXG4gICAgICB9XHJcbiAgICB9KVxyXG4gIH0pXHJcblxyXG4gICQoJ2JvZHknKS5vbignY2xpY2snLCAnLmxvZ291dCcsIGZ1bmN0aW9uKCl7XHJcbiAgICBsb2dvdXQoKTtcclxuICB9KVxyXG5cclxuICAkKCdib2R5Jykub24oJ2NsaWNrJywgJy5sb2thYWwnLCBmdW5jdGlvbigpe1xyXG4gICAgY29uc29sZS5sb2cobG9nZ2VkSW4pXHJcbiAgICBpZihsb2dnZWRJbiA9PSB0cnVlKXtcclxuXHJcbiAgICAgIGNvbnNvbGUubG9nKCQodGhpcykuYXR0cihcImNsYXNzXCIpLnNwbGl0KFwiIFwiKVswXSlcclxuICAgIH1cclxuICB9KVxyXG4gICQoZG9jdW1lbnQpLmtleXByZXNzKGZ1bmN0aW9uKGUpIHtcclxuICAgICAgaWYoZS53aGljaCA9PSAxMykge1xyXG4gICAgICAgICAgaWYgKCFsb2dnZWRJbikge1xyXG4gICAgICAgICAgICAgICQoJy5sb2dpbicpLnRyaWdnZXIoJ2NsaWNrJyk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgIH1cclxuICB9KTtcclxufSlcclxuIiwiJChcImJvZHlcIikub24oXCJjbGlja1wiLCBcIi5uZXctdXNlclwiLGZ1bmN0aW9uKCl7XHJcbiAgaWYoJChcIi5uZXctdXNlci1uYW1lXCIpLnZhbCgpID09IFwiXCIgfHwgJChcIi5uZXctdXNlci1wYXNzd29yZFwiKS52YWwoKSA9PSBcIlwiIHx8ICQoXCIubmV3LXVzZXItbGV2ZWxcIikudmFsKCkgPT0gbnVsbCl7XHJcbiAgICBjb25zb2xlLmxvZyhcImdlZW4gZ2VicnVpa2Vyc25hYW0sIHdhY2h0d29vcmQgb2YgbGV2ZWwgZ2VzZWxlY3RlZXJkXCIpXHJcbiAgfWVsc2V7XHJcbiAgICBjb25zb2xlLmxvZygkKFwiLm5ldy11c2VyLWxldmVsXCIpLnZhbCgpKVxyXG4gICAgJC5wb3N0KFwiaW5jbHVkZS9hZGRVc2VyLnBocFwiLHtcclxuICAgICAgdXNlcm5hbWU6ICQoXCIubmV3LXVzZXItbmFtZVwiKS52YWwoKSxcclxuICAgICAgdXNlcnBhc3N3b3JkOiAkKFwiLm5ldy11c2VyLXBhc3N3b3JkXCIpLnZhbCgpLFxyXG4gICAgICB1c2VybGV2ZWw6ICQoXCIubmV3LXVzZXItbGV2ZWxcIikudmFsKClcclxuICAgIH0sIGZ1bmN0aW9uKHJlc3BvbnNlLHN0YXR1cyl7XHJcbiAgICAgIGNvbnNvbGUubG9nKHJlc3BvbnNlKVxyXG4gICAgfSlcclxuICB9XHJcbn0pXHJcbiIsIiQoXCJib2R5XCIpLm9uKFwiY2xpY2tcIiwgXCIub3B0aW9uc1wiLCBmdW5jdGlvbigpe1xyXG4gIHZhciBsZXZlbCA9ICQodGhpcykuYXR0cihcImNsYXNzXCIpLnNwbGl0KFwiIFwiKVsxXS5zcGxpdChcIl9cIilbMV07XHJcbiAgdmFyIG9wdGlvbiA9ICQodGhpcykuYXR0cihcImNsYXNzXCIpLnNwbGl0KFwiIFwiKVsyXS5zcGxpdChcIl9cIilbMV07XHJcblxyXG4gICQoXCIudmlld1wiKS5hZGRDbGFzcyhcImhpZGRlblwiKVxyXG4gICQoXCIudmlld19cIitsZXZlbCtcIi1cIitvcHRpb24pLnJlbW92ZUNsYXNzKFwiaGlkZGVuXCIpXHJcblxyXG4gIHN3aXRjaCAobGV2ZWwpIHtcclxuICAgIGNhc2UgXCIxXCI6XHJcbiAgICAgICQucG9zdChcImluY2x1ZGUvZ2V0VXNlcnMucGhwXCIse1xyXG4gICAgICB9LCBmdW5jdGlvbihyZXNwb25zZSxzdGF0dXMpe1xyXG4gICAgICAgIGNvbnNvbGUubG9nKHJlc3BvbnNlKVxyXG4gICAgICAgIHVzZXJzID0gSlNPTi5wYXJzZShyZXNwb25zZSlcclxuXHJcbiAgICAgICAgZm9yKHZhciBpID0gMDsgaSA8IDI7IGkrKyl7XHJcbiAgICAgICAgICBjb25zb2xlLmxvZyhpKVxyXG4gICAgICAgICAgdXNlcnMubWFwKGZ1bmN0aW9uKGNwLGope1xyXG4gICAgICAgICAgICBjcC5pbmRleCA9IGo7XHJcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKGkpXHJcbiAgICAgICAgICAgIGlmKGkgPT0gMCl7XHJcbiAgICAgICAgICAgICAgY3AuY2xhc3MgPSBcImVkaXRcIlxyXG4gICAgICAgICAgICAgIGNwLmNsYXNzVGV4dCA9IFwiYWFucGFzc2VuXCJcclxuICAgICAgICAgICAgfWVsc2UgaWYoaSA9PSAxKXtcclxuICAgICAgICAgICAgICBjcC5jbGFzcyA9IFwiZGVsZXRlXCJcclxuICAgICAgICAgICAgICBjcC5jbGFzc1RleHQgPSBcInZlcndpamRlcmVuXCJcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfSlcclxuXHJcbiAgICAgICAgICBmb3IodmFyIGogPSAwOyBqIDwgdXNlcnMubGVuZ3RoOyBqKyspe1xyXG4gICAgICAgICAgICBpZih1c2Vyc1tqXS51c2VybGV2ZWwgPT0gMSl7XHJcbiAgICAgICAgICAgICAgdXNlcnMuc3BsaWNlKGosMSlcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIGNvbnNvbGUubG9nKHVzZXJzKVxyXG5cclxuICAgICAgICAgIHZhciB0ZW1wbGF0ZSA9ICQoXCIubGV2ZWwxLXVzZXItdGVtcGxhdGVcIikuaHRtbCgpO1xyXG4gICAgICAgICAgdmFyIHJlbmRlclRlbXBsYXRlID0gTXVzdGFjaGUucmVuZGVyKHRlbXBsYXRlLCB1c2Vycyk7XHJcblxyXG4gICAgICAgICAgaWYoaSA9PSAwKXtcclxuICAgICAgICAgICAgJChcIi51c2VyLWxldmVsMS1lZGl0XCIpLmh0bWwocmVuZGVyVGVtcGxhdGUpO1xyXG4gICAgICAgICAgfWVsc2UgaWYoaSA9PSAxKXtcclxuICAgICAgICAgICAgJChcIi51c2VyLWxldmVsMS1kZWxldGVcIikuaHRtbChyZW5kZXJUZW1wbGF0ZSk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICB9KVxyXG4gICAgICBicmVhaztcclxuICB9XHJcbn0pXHJcbiIsIiQoZG9jdW1lbnQpLnJlYWR5KGZ1bmN0aW9uKCl7XHJcbiAgICAkLnBvc3QoXCJpbmNsdWRlL3JldHVyblNlc3Npb24ucGhwXCIse1xyXG4gICAgfSwgZnVuY3Rpb24ocmVzcG9uc2Usc3RhdHVzKXtcclxuICAgICAgICB2YXIgZGF0YSA9IEpTT04ucGFyc2UocmVzcG9uc2UpO1xyXG4gICAgICAgIGlmIChkYXRhLmxvZ2dlZEluKSB7XHJcbiAgICAgICAgICAgIGxvZ2luKGRhdGEubGV2ZWwpO1xyXG4gICAgICAgICAgICBsb2dnZWRJblVzZXIgPSBkYXRhO1xyXG4gICAgICAgIH1cclxuICAgIH0pXHJcbn0pO1xyXG4iLCIkKFwiLnNldHRpbmdzLWlucHV0c1wiKS5rZXlwcmVzcyhmdW5jdGlvbihlKSB7XHJcbiAgY29uc29sZS5sb2coXCJlbnRlclwiKVxyXG4gICAgaWYoZS53aGljaCA9PSAxMykge1xyXG4gICAgICAkKCcuc2V0dGluZ3MtdXBkYXRlJykudHJpZ2dlcignY2xpY2snKTtcclxuICAgIH1cclxufSk7XHJcblxyXG4kKCdib2R5Jykub24oJ2NsaWNrJywgJy5zZXR0aW5ncycsIGZ1bmN0aW9uKCl7XHJcbiAgY29uc29sZS5sb2coXCJzZXR0aW5nc1wiKVxyXG4gICQoJy5zZXR0aW5ncy11c2VybmFtZScpLnZhbChsb2dnZWRJblVzZXIudXNlcm5hbWUpXHJcbiAgJCgnLnVzZXItc2V0dGluZ3MnKS5tb2RhbCgnc2hvdycpO1xyXG4gIGNvbnNvbGUubG9nKGxvZ2dlZEluVXNlci51c2VybmFtZSlcclxufSlcclxuXHJcbiQoJ2JvZHknKS5vbignY2xpY2snLCAnLnNldHRpbmdzLXVwZGF0ZScsIGZ1bmN0aW9uKCl7XHJcbiAgY29uc29sZS5sb2coXCJ1cGRhdGVcIilcclxuICBjb25zb2xlLmxvZygkKCcuc2V0dGluZ3MtdXNlcm5hbWUnKS52YWwoKSlcclxuICBjb25zb2xlLmxvZygkKCcuc2V0dGluZ3MtcGFzc3dvcmQnKS52YWwoKSlcclxuICBjb25zb2xlLmxvZygkKCcuc2V0dGluZ3MtcmVwZWF0LXBhc3N3b3JkJykudmFsKCkpXHJcblxyXG4gIGlmKCQoJy5zZXR0aW5ncy11c2VybmFtZScpLnZhbCgpID09IFwiXCIgJiYgJCgnLnNldHRpbmdzLXBhc3N3b3JkJykudmFsKCkgPT0gXCJcIiAmJiAkKCcuc2V0dGluZ3MtcmVwZWF0LXBhc3N3b3JkJykudmFsKCkgPT0gXCJcIil7XHJcbiAgICBjb25zb2xlLmxvZyhcImdlYnJ1aWtlcnNuYWFtIGVuIHdhY2h0d29vcmQgbW9nZW4gbmlldCBsZWVnIHppam5cIik7XHJcbiAgfWVsc2V7XHJcbiAgICBpZigkKCcuc2V0dGluZ3MtcGFzc3dvcmQnKS52YWwoKSAhPSAkKCcuc2V0dGluZ3MtcmVwZWF0LXBhc3N3b3JkJykudmFsKCkpe1xyXG4gICAgICBjb25zb2xlLmxvZyhcIndhY2h0d29vcmRlbiB6aWpuIG5pZXQgZ2VsaWprIGFhbiBlbGthYXJcIilcclxuICAgIH1lbHNle1xyXG4gICAgICBjb25zb2xlLmxvZyhsb2dnZWRJblVzZXIpXHJcbiAgICAgICQucG9zdChcImluY2x1ZGUvdXBkYXRlVXNlci5waHBcIiAse1xyXG4gICAgICAgIGlkOiBsb2dnZWRJblVzZXIudXNlcklELFxyXG4gICAgICAgIG5hbWU6ICQoJy5zZXR0aW5ncy11c2VybmFtZScpLnZhbCgpLFxyXG4gICAgICAgIHBhc3M6ICQoJy5zZXR0aW5ncy1wYXNzd29yZCcpLnZhbCgpXHJcbiAgICAgIH0sIGZ1bmN0aW9uKHJlc3BvbnNlLHN0YXR1cyl7XHJcbiAgICAgICAgICBjb25zb2xlLmxvZyhyZXNwb25zZSk7XHJcbiAgICAgICAgaWYocmVzcG9uc2UgPT0gXCJzdWNjZXNcIil7XHJcbiAgICAgICAgJCgnLnVzZXItc2V0dGluZ3MnKS5tb2RhbCgnaGlkZScpO1xyXG4gICAgICAgIH1cclxuICAgICAgfSlcclxuICAgIH1cclxuICB9XHJcbn0pXHJcbiJdfQ==
