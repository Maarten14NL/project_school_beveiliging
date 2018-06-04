$('body').on('click', '.level1-btn-delete',function(){
  var rowClass = $(this).parent().parent().attr("class");
  var row = $(this).parent().parent().attr("class").split("index")[1];
  console.log(users)
  for(var i = 0; i < users.length; i++){
    if(users[i].index == row){
      $.post("include/deleteUser.php" ,{
        id: users[i].id
      }, function(response,status){
        // console.log(response);
        if(response == "succes"){
          console.log(rowClass)
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
      $(".view_2-1").removeClass("hidden")
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
  showFlashMessage('Je bent uitgelogd', 'success');
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
          showFlashMessage('Ingelogd succesvol', 'success')
      }
      else {
          showFlashMessage('Gebruikersnaam of wachtwoord is verkeerd', 'danger')
      }
    })
  })

  $('body').on('click', '.logout', function(){
    logout();
  })

  $('body').on('click', '.lokaal', function(){
    console.log(loggedIn)
    if(loggedIn == true){    // Save the original method in a private variable

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
        // console.log(response)
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
        if(response == "succes"){
        $('.user-settings').modal('hide');
        }
      })
    }
  }
})

$(document).ready(function() {
    $('#panel-623188').hide();
    $('#panel-338653').hide();
    $('#panel-445566').hide();
    $('#panel-556234').hide();
});

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImRlbGV0ZS11c2VyLmpzIiwiZmxhc2gtbWVzc2FnZS5qcyIsImZ1bmN0aW9ucy5qcyIsImhvbWUuanMiLCJuZXctdXNlci5qcyIsIm9wdGlvbnMuanMiLCJzZXR0aW5ncy5qcyIsInRlc3QuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNsQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2hCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3BDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN4REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDZEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2pEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3ZDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJtYWluLmpzIiwic291cmNlc0NvbnRlbnQiOlsiJCgnYm9keScpLm9uKCdjbGljaycsICcubGV2ZWwxLWJ0bi1kZWxldGUnLGZ1bmN0aW9uKCl7XHJcbiAgdmFyIHJvd0NsYXNzID0gJCh0aGlzKS5wYXJlbnQoKS5wYXJlbnQoKS5hdHRyKFwiY2xhc3NcIik7XHJcbiAgdmFyIHJvdyA9ICQodGhpcykucGFyZW50KCkucGFyZW50KCkuYXR0cihcImNsYXNzXCIpLnNwbGl0KFwiaW5kZXhcIilbMV07XHJcbiAgY29uc29sZS5sb2codXNlcnMpXHJcbiAgZm9yKHZhciBpID0gMDsgaSA8IHVzZXJzLmxlbmd0aDsgaSsrKXtcclxuICAgIGlmKHVzZXJzW2ldLmluZGV4ID09IHJvdyl7XHJcbiAgICAgICQucG9zdChcImluY2x1ZGUvZGVsZXRlVXNlci5waHBcIiAse1xyXG4gICAgICAgIGlkOiB1c2Vyc1tpXS5pZFxyXG4gICAgICB9LCBmdW5jdGlvbihyZXNwb25zZSxzdGF0dXMpe1xyXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKHJlc3BvbnNlKTtcclxuICAgICAgICBpZihyZXNwb25zZSA9PSBcInN1Y2Nlc1wiKXtcclxuICAgICAgICAgIGNvbnNvbGUubG9nKHJvd0NsYXNzKVxyXG4gICAgICAgICAgJChcIi5cIityb3dDbGFzcykucmVtb3ZlKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9KVxyXG4gICAgfVxyXG4gIH1cclxufSlcclxuIiwiZnVuY3Rpb24gc2hvd0ZsYXNoTWVzc2FnZShtZXMsIHR5cGUsIHNlY3MgPSAyMDAwKXtcclxuICAgIHZhciBlbGVtID0gJCgnLmpzLWZsYXNoJyk7XHJcbiAgICAkKGVsZW0pLnJlbW92ZUNsYXNzKCdhbGVydC1kYW5nZXInKS5yZW1vdmVDbGFzcygnYWxlcnQtc3VjY2VzcycpXHJcbiAgICAgICAgLmFkZENsYXNzKCdmbGFzaC1tZXNzYWdlLS1zaG93JylcclxuICAgICAgICAuYWRkQ2xhc3MoJ2FsZXJ0LScgKyB0eXBlKVxyXG4gICAgICAgIC5odG1sKG1lcyk7XHJcbiAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB1bnNob3dGbGFzaE1lc3NhZ2UoKTtcclxuICAgIH0sIHNlY3MpO1xyXG59XHJcblxyXG5mdW5jdGlvbiB1bnNob3dGbGFzaE1lc3NhZ2UoKXtcclxuICAgIHZhciBlbGVtID0gJCgnLmpzLWZsYXNoJyk7XHJcbiAgICBjb25zb2xlLmxvZyhlbGVtKTtcclxuICAgICQoZWxlbSkucmVtb3ZlQ2xhc3MoJ2ZsYXNoLW1lc3NhZ2UtLXNob3cnKTtcclxufVxyXG4iLCJmdW5jdGlvbiBsb2dpbihhX3VzZXJMZXZlbCl7XHJcbiAgJCgnLmxvZ2luLWNvbnRhaW5lcicpLmFkZENsYXNzKFwiaGlkZGVuXCIpO1xyXG4gICQoJy5sb2dpbi1zdGF0dXMnKS50ZXh0KFwiV2VsY29tOiB1c2VyXCIpXHJcbiAgJCgnLmxvZ291dCcpLnJlbW92ZUNsYXNzKFwiaGlkZGVuXCIpXHJcbiAgJCgnLnNldHRpbmdzJykucmVtb3ZlQ2xhc3MoXCJoaWRkZW5cIilcclxuICBsb2dnZWRJbiA9IHRydWU7XHJcbiAgdXNlckxldmVsID0gYV91c2VyTGV2ZWw7XHJcblxyXG4gICQoXCIudXNlci1sZXZlbFwiKS5hZGRDbGFzcyhcImhpZGRlblwiKVxyXG4gICQoXCIudmlld1wiKS5hZGRDbGFzcyhcImhpZGRlblwiKVxyXG5cclxuICBzd2l0Y2ggKHVzZXJMZXZlbCkge1xyXG4gICAgY2FzZSAxOlxyXG4gICAgICAkKFwiLnVzZXItbGV2ZWxfMVwiKS5yZW1vdmVDbGFzcyhcImhpZGRlblwiKVxyXG4gICAgICAkKFwiLnZpZXdfMS0xXCIpLnJlbW92ZUNsYXNzKFwiaGlkZGVuXCIpXHJcbiAgICAgIGJyZWFrO1xyXG4gICAgY2FzZSAyOlxyXG4gICAgICAkKFwiLnVzZXItbGV2ZWxfMlwiKS5yZW1vdmVDbGFzcyhcImhpZGRlblwiKVxyXG4gICAgICAkKFwiLnZpZXdfMi0xXCIpLnJlbW92ZUNsYXNzKFwiaGlkZGVuXCIpXHJcbiAgICAgIGJyZWFrO1xyXG4gICAgY2FzZSAzOlxyXG4gICAgICAkKFwiLnVzZXItbGV2ZWxfM1wiKS5yZW1vdmVDbGFzcyhcImhpZGRlblwiKVxyXG4gICAgICBicmVhaztcclxuICB9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGxvZ291dCgpe1xyXG4gICQoJy5sb2dpbi1jb250YWluZXInKS5yZW1vdmVDbGFzcyhcImhpZGRlblwiKTtcclxuICAkKCcubG9naW4tc3RhdHVzJykudGV4dChcIlUgYmVudCBub2cgbmlldCBpbmdlbG9nZFwiKVxyXG4gICQoJy5sb2dvdXQnKS5hZGRDbGFzcyhcImhpZGRlblwiKVxyXG4gICQoXCIudXNlci1sZXZlbFwiKS5hZGRDbGFzcyhcImhpZGRlblwiKVxyXG4gICQoJy5zZXR0aW5ncycpLmFkZENsYXNzKFwiaGlkZGVuXCIpXHJcbiAgbG9nZ2VkSW4gPSBmYWxzZTtcclxuICB1c2VyTGV2ZWwgPSAwO1xyXG4gIHNob3dGbGFzaE1lc3NhZ2UoJ0plIGJlbnQgdWl0Z2Vsb2dkJywgJ3N1Y2Nlc3MnKTtcclxufVxyXG4iLCJ2YXIgbG9nZ2VkSW4gPSBmYWxzZTtcclxudmFyIHVzZXJMZXZlbCA9IDA7XHJcbnZhciBsb2dnZWRJblVzZXIgPSBbXTtcclxudmFyIHVzZXJzID0gW107XHJcbiQoZG9jdW1lbnQpLnJlYWR5KGZ1bmN0aW9uKCl7XHJcbiAgY29uc29sZS5sb2coXCJob21lLmpzIGxvYWRlZFwiKVxyXG4gICQoJ2JvZHknKS5vbignY2xpY2snLCAnLm1lbnUtaXRlbScsIGZ1bmN0aW9uKCl7XHJcbiAgICB2YXIgaWQgPSAkKHRoaXMpLmF0dHIoXCJjbGFzc1wiKS5zcGxpdCgnXycpWzFdO1xyXG4gICAgY29uc29sZS5sb2coaWQpXHJcblxyXG4gICAgJCgnLnZlcmRpZXBpbmcnKS5hZGRDbGFzcyhcImhpZGRlblwiKVxyXG4gICAgJCgnLnZlcmRpZXBpbmdfXycraWQpLnJlbW92ZUNsYXNzKFwiaGlkZGVuXCIpXHJcbiAgfSlcclxuXHJcbiAgJCgnYm9keScpLm9uKCdjbGljaycsICcubG9naW4nLCBmdW5jdGlvbigpe1xyXG4gICAgY29uc29sZS5sb2coJCgnLnVzZXJuYW1lJykudmFsKCkudG9Mb3dlckNhc2UoKSlcclxuICAgIGNvbnNvbGUubG9nKCQoJy5wYXNzd29yZCcpLnZhbCgpLnRvTG93ZXJDYXNlKCkpXHJcblxyXG4gICAgJC5wb3N0KFwiaW5jbHVkZS9sb2dpbi5waHBcIiAse1xyXG4gICAgICBsb2dpblN1YjogXCJcIixcclxuICAgICAgdXNlcm5hbWU6ICQoJy51c2VybmFtZScpLnZhbCgpLnRvTG93ZXJDYXNlKCksXHJcbiAgICAgIHBhc3N3b3JkOiAkKCcucGFzc3dvcmQnKS52YWwoKVxyXG4gICAgfSwgZnVuY3Rpb24ocmVzcG9uc2Usc3RhdHVzKXtcclxuICAgICAgdmFyIGRhdGEgPSBKU09OLnBhcnNlKHJlc3BvbnNlKTtcclxuICAgICAgY29uc29sZS5sb2coZGF0YSk7XHJcbiAgICAgIGxvZ2dlZEluVXNlciA9IGRhdGE7XHJcbiAgICAgIGlmIChkYXRhLmxvZ2dlZEluID09IDEpIHtcclxuICAgICAgICAgIGxvZ2luKGRhdGEubGV2ZWwpO1xyXG4gICAgICAgICAgc2hvd0ZsYXNoTWVzc2FnZSgnSW5nZWxvZ2Qgc3VjY2Vzdm9sJywgJ3N1Y2Nlc3MnKVxyXG4gICAgICB9XHJcbiAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgc2hvd0ZsYXNoTWVzc2FnZSgnR2VicnVpa2Vyc25hYW0gb2Ygd2FjaHR3b29yZCBpcyB2ZXJrZWVyZCcsICdkYW5nZXInKVxyXG4gICAgICB9XHJcbiAgICB9KVxyXG4gIH0pXHJcblxyXG4gICQoJ2JvZHknKS5vbignY2xpY2snLCAnLmxvZ291dCcsIGZ1bmN0aW9uKCl7XHJcbiAgICBsb2dvdXQoKTtcclxuICB9KVxyXG5cclxuICAkKCdib2R5Jykub24oJ2NsaWNrJywgJy5sb2thYWwnLCBmdW5jdGlvbigpe1xyXG4gICAgY29uc29sZS5sb2cobG9nZ2VkSW4pXHJcbiAgICBpZihsb2dnZWRJbiA9PSB0cnVlKXsgICAgLy8gU2F2ZSB0aGUgb3JpZ2luYWwgbWV0aG9kIGluIGEgcHJpdmF0ZSB2YXJpYWJsZVxyXG5cclxuICAgICAgY29uc29sZS5sb2coJCh0aGlzKS5hdHRyKFwiY2xhc3NcIikuc3BsaXQoXCIgXCIpWzBdKVxyXG4gICAgfVxyXG4gIH0pXHJcbiAgJChkb2N1bWVudCkua2V5cHJlc3MoZnVuY3Rpb24oZSkge1xyXG4gICAgICBpZihlLndoaWNoID09IDEzKSB7XHJcbiAgICAgICAgICBpZiAoIWxvZ2dlZEluKSB7XHJcbiAgICAgICAgICAgICAgJCgnLmxvZ2luJykudHJpZ2dlcignY2xpY2snKTtcclxuICAgICAgICAgIH1cclxuICAgICAgfVxyXG4gIH0pO1xyXG5cclxufSlcclxuIiwiJChcImJvZHlcIikub24oXCJjbGlja1wiLCBcIi5uZXctdXNlclwiLGZ1bmN0aW9uKCl7XHJcbiAgaWYoJChcIi5uZXctdXNlci1uYW1lXCIpLnZhbCgpID09IFwiXCIgfHwgJChcIi5uZXctdXNlci1wYXNzd29yZFwiKS52YWwoKSA9PSBcIlwiIHx8ICQoXCIubmV3LXVzZXItbGV2ZWxcIikudmFsKCkgPT0gbnVsbCl7XHJcbiAgICBjb25zb2xlLmxvZyhcImdlZW4gZ2VicnVpa2Vyc25hYW0sIHdhY2h0d29vcmQgb2YgbGV2ZWwgZ2VzZWxlY3RlZXJkXCIpXHJcbiAgfWVsc2V7XHJcbiAgICBjb25zb2xlLmxvZygkKFwiLm5ldy11c2VyLWxldmVsXCIpLnZhbCgpKVxyXG4gICAgJC5wb3N0KFwiaW5jbHVkZS9hZGRVc2VyLnBocFwiLHtcclxuICAgICAgdXNlcm5hbWU6ICQoXCIubmV3LXVzZXItbmFtZVwiKS52YWwoKSxcclxuICAgICAgdXNlcnBhc3N3b3JkOiAkKFwiLm5ldy11c2VyLXBhc3N3b3JkXCIpLnZhbCgpLFxyXG4gICAgICB1c2VybGV2ZWw6ICQoXCIubmV3LXVzZXItbGV2ZWxcIikudmFsKClcclxuICAgIH0sIGZ1bmN0aW9uKHJlc3BvbnNlLHN0YXR1cyl7XHJcbiAgICAgIGNvbnNvbGUubG9nKHJlc3BvbnNlKVxyXG4gICAgfSlcclxuICB9XHJcbn0pXHJcbiIsIiQoXCJib2R5XCIpLm9uKFwiY2xpY2tcIiwgXCIub3B0aW9uc1wiLCBmdW5jdGlvbigpe1xyXG4gIHZhciBsZXZlbCA9ICQodGhpcykuYXR0cihcImNsYXNzXCIpLnNwbGl0KFwiIFwiKVsxXS5zcGxpdChcIl9cIilbMV07XHJcbiAgdmFyIG9wdGlvbiA9ICQodGhpcykuYXR0cihcImNsYXNzXCIpLnNwbGl0KFwiIFwiKVsyXS5zcGxpdChcIl9cIilbMV07XHJcblxyXG4gICQoXCIudmlld1wiKS5hZGRDbGFzcyhcImhpZGRlblwiKVxyXG4gICQoXCIudmlld19cIitsZXZlbCtcIi1cIitvcHRpb24pLnJlbW92ZUNsYXNzKFwiaGlkZGVuXCIpXHJcblxyXG4gIHN3aXRjaCAobGV2ZWwpIHtcclxuICAgIGNhc2UgXCIxXCI6XHJcbiAgICAgICQucG9zdChcImluY2x1ZGUvZ2V0VXNlcnMucGhwXCIse1xyXG4gICAgICB9LCBmdW5jdGlvbihyZXNwb25zZSxzdGF0dXMpe1xyXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKHJlc3BvbnNlKVxyXG4gICAgICAgIHVzZXJzID0gSlNPTi5wYXJzZShyZXNwb25zZSlcclxuXHJcbiAgICAgICAgZm9yKHZhciBpID0gMDsgaSA8IDI7IGkrKyl7XHJcbiAgICAgICAgICBjb25zb2xlLmxvZyhpKVxyXG4gICAgICAgICAgdXNlcnMubWFwKGZ1bmN0aW9uKGNwLGope1xyXG4gICAgICAgICAgICBjcC5pbmRleCA9IGo7XHJcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKGkpXHJcbiAgICAgICAgICAgIGlmKGkgPT0gMCl7XHJcbiAgICAgICAgICAgICAgY3AuY2xhc3MgPSBcImVkaXRcIlxyXG4gICAgICAgICAgICAgIGNwLmNsYXNzVGV4dCA9IFwiYWFucGFzc2VuXCJcclxuICAgICAgICAgICAgfWVsc2UgaWYoaSA9PSAxKXtcclxuICAgICAgICAgICAgICBjcC5jbGFzcyA9IFwiZGVsZXRlXCJcclxuICAgICAgICAgICAgICBjcC5jbGFzc1RleHQgPSBcInZlcndpamRlcmVuXCJcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfSlcclxuXHJcbiAgICAgICAgICBmb3IodmFyIGogPSAwOyBqIDwgdXNlcnMubGVuZ3RoOyBqKyspe1xyXG4gICAgICAgICAgICBpZih1c2Vyc1tqXS51c2VybGV2ZWwgPT0gMSl7XHJcbiAgICAgICAgICAgICAgdXNlcnMuc3BsaWNlKGosMSlcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIGNvbnNvbGUubG9nKHVzZXJzKVxyXG5cclxuICAgICAgICAgIHZhciB0ZW1wbGF0ZSA9ICQoXCIubGV2ZWwxLXVzZXItdGVtcGxhdGVcIikuaHRtbCgpO1xyXG4gICAgICAgICAgdmFyIHJlbmRlclRlbXBsYXRlID0gTXVzdGFjaGUucmVuZGVyKHRlbXBsYXRlLCB1c2Vycyk7XHJcblxyXG4gICAgICAgICAgaWYoaSA9PSAwKXtcclxuICAgICAgICAgICAgJChcIi51c2VyLWxldmVsMS1lZGl0XCIpLmh0bWwocmVuZGVyVGVtcGxhdGUpO1xyXG4gICAgICAgICAgfWVsc2UgaWYoaSA9PSAxKXtcclxuICAgICAgICAgICAgJChcIi51c2VyLWxldmVsMS1kZWxldGVcIikuaHRtbChyZW5kZXJUZW1wbGF0ZSk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICB9KVxyXG4gICAgICBicmVhaztcclxuICB9XHJcbn0pXHJcbiIsIiQoXCIuc2V0dGluZ3MtaW5wdXRzXCIpLmtleXByZXNzKGZ1bmN0aW9uKGUpIHtcclxuICBjb25zb2xlLmxvZyhcImVudGVyXCIpXHJcbiAgICBpZihlLndoaWNoID09IDEzKSB7XHJcbiAgICAgICQoJy5zZXR0aW5ncy11cGRhdGUnKS50cmlnZ2VyKCdjbGljaycpO1xyXG4gICAgfVxyXG59KTtcclxuXHJcbiQoJ2JvZHknKS5vbignY2xpY2snLCAnLnNldHRpbmdzJywgZnVuY3Rpb24oKXtcclxuICBjb25zb2xlLmxvZyhcInNldHRpbmdzXCIpXHJcbiAgJCgnLnNldHRpbmdzLXVzZXJuYW1lJykudmFsKGxvZ2dlZEluVXNlci51c2VybmFtZSlcclxuICAkKCcudXNlci1zZXR0aW5ncycpLm1vZGFsKCdzaG93Jyk7XHJcbiAgY29uc29sZS5sb2cobG9nZ2VkSW5Vc2VyLnVzZXJuYW1lKVxyXG59KVxyXG5cclxuJCgnYm9keScpLm9uKCdjbGljaycsICcuc2V0dGluZ3MtdXBkYXRlJywgZnVuY3Rpb24oKXtcclxuICBjb25zb2xlLmxvZyhcInVwZGF0ZVwiKVxyXG4gIGNvbnNvbGUubG9nKCQoJy5zZXR0aW5ncy11c2VybmFtZScpLnZhbCgpKVxyXG4gIGNvbnNvbGUubG9nKCQoJy5zZXR0aW5ncy1wYXNzd29yZCcpLnZhbCgpKVxyXG4gIGNvbnNvbGUubG9nKCQoJy5zZXR0aW5ncy1yZXBlYXQtcGFzc3dvcmQnKS52YWwoKSlcclxuXHJcbiAgaWYoJCgnLnNldHRpbmdzLXVzZXJuYW1lJykudmFsKCkgPT0gXCJcIiAmJiAkKCcuc2V0dGluZ3MtcGFzc3dvcmQnKS52YWwoKSA9PSBcIlwiICYmICQoJy5zZXR0aW5ncy1yZXBlYXQtcGFzc3dvcmQnKS52YWwoKSA9PSBcIlwiKXtcclxuICAgIGNvbnNvbGUubG9nKFwiZ2VicnVpa2Vyc25hYW0gZW4gd2FjaHR3b29yZCBtb2dlbiBuaWV0IGxlZWcgemlqblwiKTtcclxuICB9ZWxzZXtcclxuICAgIGlmKCQoJy5zZXR0aW5ncy1wYXNzd29yZCcpLnZhbCgpICE9ICQoJy5zZXR0aW5ncy1yZXBlYXQtcGFzc3dvcmQnKS52YWwoKSl7XHJcbiAgICAgIGNvbnNvbGUubG9nKFwid2FjaHR3b29yZGVuIHppam4gbmlldCBnZWxpamsgYWFuIGVsa2FhclwiKVxyXG4gICAgfWVsc2V7XHJcbiAgICAgIGNvbnNvbGUubG9nKGxvZ2dlZEluVXNlcilcclxuICAgICAgJC5wb3N0KFwiaW5jbHVkZS91cGRhdGVVc2VyLnBocFwiICx7XHJcbiAgICAgICAgaWQ6IGxvZ2dlZEluVXNlci51c2VySUQsXHJcbiAgICAgICAgbmFtZTogJCgnLnNldHRpbmdzLXVzZXJuYW1lJykudmFsKCksXHJcbiAgICAgICAgcGFzczogJCgnLnNldHRpbmdzLXBhc3N3b3JkJykudmFsKClcclxuICAgICAgfSwgZnVuY3Rpb24ocmVzcG9uc2Usc3RhdHVzKXtcclxuICAgICAgICBpZihyZXNwb25zZSA9PSBcInN1Y2Nlc1wiKXtcclxuICAgICAgICAkKCcudXNlci1zZXR0aW5ncycpLm1vZGFsKCdoaWRlJyk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9KVxyXG4gICAgfVxyXG4gIH1cclxufSlcclxuIiwiJChkb2N1bWVudCkucmVhZHkoZnVuY3Rpb24oKSB7XHJcbiAgICAkKCcjcGFuZWwtNjIzMTg4JykuaGlkZSgpO1xyXG4gICAgJCgnI3BhbmVsLTMzODY1MycpLmhpZGUoKTtcclxuICAgICQoJyNwYW5lbC00NDU1NjYnKS5oaWRlKCk7XHJcbiAgICAkKCcjcGFuZWwtNTU2MjM0JykuaGlkZSgpO1xyXG59KTtcclxuIl19
