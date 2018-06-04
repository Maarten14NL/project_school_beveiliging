$('body').on('click', '.level1-btn-delete',function(){
  var rowClass = $(this).parent().parent().attr("class");
  var row = $(this).parent().parent().attr("class").split("index")[1];
  console.log(users)
  for(var i = 0; i < users.length; i++){
    if(users[i].id == row){
      $.post("include/deleteUser.php" ,{
        id: users[i].id
      }, function(response,status){
        console.log(rowClass);
        if(response == "succes"){
          console.log(rowClass)
          $("."+rowClass).remove();
        }
      })
    }
  }
})

var rowSelected = 0;
$('body').on('click', '.level1-btn-edit', function(){
  rowSelected = $(this).parent().parent().attr("class");
  var index = 0;
  for (var i = 0; i < users.length; i++){
    if(users[i].id == rowSelected.split("index")[1]){
      index = i
    }
  }
  $('.update-users').modal('show');
  $('.update-users-username').val(users[index].username)
  $('.update-user-options').removeAttr("selected")

  if(users[index].userlevel == 2){
    $('.update-user-option2').attr("selected","selected")
  }else{
    $('.update-user-option1').attr("selected","selected")
  }
})

$('body').on('click', '.update-users-update', function(){
  console.log("update")
  console.log($('.update-users-username').val())
  console.log($('.update-users-password').val())
  console.log($('.update-users-repeat-password').val())

  if($('.update-users-username').val() == "" && $('.update-users-password').val() == "" && $('.update-users-repeat-password').val() == ""){
    console.log("gebruikersnaam en wachtwoord mogen niet leeg zijn");
  }else{
    if($('.update-users-password').val() != $('.update-users-repeat-password').val()){
      console.log("wachtwoorden zijn niet gelijk aan elkaar")
    }else{
      // console.log(users[rowSelected.split("index")[1]])
      $.post("include/updateUser.php" ,{
        id: users[index].id,
        name: $('.update-users-username').val(),
        pass: $('.update-users-password').val(),
        level: $('.update-user-level').val()
      }, function(response,status){
        console.log(response)
        if(response == "succes"){
          $('.update-users').modal('hide');
          users[index].username = $('.update-users-username').val();
          console.log($("."+rowSelected).find(".username"))
          // $('.options').trigger('click');
          updateLevel1Templates();
          // options
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

  $.post("include/login.php",{
      logoutSub: ''
  }, function(response,status){
      showFlashMessage('Je bent uitgelogd', 'success');
  })
}

function updateLevel1Templates(){
  $.post("include/getUsers.php",{
  }, function(response,status){
    // console.log(response)
    users = JSON.parse(response)

    for(var i = 0; i < 2; i++){
      // console.log(i)
      users.map(function(cp,j){
        cp.index = cp.id;
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

      // console.log(users)

      var template = $(".level1-user-template").html();
      var renderTemplate = Mustache.render(template, users);

      if(i == 0){
        $(".user-level1-edit").html(renderTemplate);
      }else if(i == 1){
        $(".user-level1-delete").html(renderTemplate);
      }
    }
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
  console.log(level)

  $(".view").addClass("hidden")
  $(".view_"+level+"-"+option).removeClass("hidden")

  switch (level) {
    case "1":
      updateLevel1Templates();
      break;
  }
})

$(document).ready(function(){
    $.post("include/returnSession.php",{
    }, function(response,status){
        var data = JSON.parse(response);
        if (data.loggedIn) {
            login(data.level);
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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImRlbGV0ZS11c2VyLmpzIiwiZWRpdC11c2VyLmpzIiwiZmxhc2gtbWVzc2FnZS5qcyIsImZ1bmN0aW9ucy5qcyIsImhvbWUuanMiLCJuZXctdXNlci5qcyIsIm9wdGlvbnMuanMiLCJzZXNzaW9uQ2hlY2suanMiLCJzZXR0aW5ncy5qcyIsInRlc3QuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNsQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3BEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDaEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDakZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3hEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNkQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNkQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ1RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDdkNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6Im1haW4uanMiLCJzb3VyY2VzQ29udGVudCI6WyIkKCdib2R5Jykub24oJ2NsaWNrJywgJy5sZXZlbDEtYnRuLWRlbGV0ZScsZnVuY3Rpb24oKXtcclxuICB2YXIgcm93Q2xhc3MgPSAkKHRoaXMpLnBhcmVudCgpLnBhcmVudCgpLmF0dHIoXCJjbGFzc1wiKTtcclxuICB2YXIgcm93ID0gJCh0aGlzKS5wYXJlbnQoKS5wYXJlbnQoKS5hdHRyKFwiY2xhc3NcIikuc3BsaXQoXCJpbmRleFwiKVsxXTtcclxuICBjb25zb2xlLmxvZyh1c2VycylcclxuICBmb3IodmFyIGkgPSAwOyBpIDwgdXNlcnMubGVuZ3RoOyBpKyspe1xyXG4gICAgaWYodXNlcnNbaV0uaWQgPT0gcm93KXtcclxuICAgICAgJC5wb3N0KFwiaW5jbHVkZS9kZWxldGVVc2VyLnBocFwiICx7XHJcbiAgICAgICAgaWQ6IHVzZXJzW2ldLmlkXHJcbiAgICAgIH0sIGZ1bmN0aW9uKHJlc3BvbnNlLHN0YXR1cyl7XHJcbiAgICAgICAgY29uc29sZS5sb2cocm93Q2xhc3MpO1xyXG4gICAgICAgIGlmKHJlc3BvbnNlID09IFwic3VjY2VzXCIpe1xyXG4gICAgICAgICAgY29uc29sZS5sb2cocm93Q2xhc3MpXHJcbiAgICAgICAgICAkKFwiLlwiK3Jvd0NsYXNzKS5yZW1vdmUoKTtcclxuICAgICAgICB9XHJcbiAgICAgIH0pXHJcbiAgICB9XHJcbiAgfVxyXG59KVxyXG4iLCJ2YXIgcm93U2VsZWN0ZWQgPSAwO1xyXG4kKCdib2R5Jykub24oJ2NsaWNrJywgJy5sZXZlbDEtYnRuLWVkaXQnLCBmdW5jdGlvbigpe1xyXG4gIHJvd1NlbGVjdGVkID0gJCh0aGlzKS5wYXJlbnQoKS5wYXJlbnQoKS5hdHRyKFwiY2xhc3NcIik7XHJcbiAgdmFyIGluZGV4ID0gMDtcclxuICBmb3IgKHZhciBpID0gMDsgaSA8IHVzZXJzLmxlbmd0aDsgaSsrKXtcclxuICAgIGlmKHVzZXJzW2ldLmlkID09IHJvd1NlbGVjdGVkLnNwbGl0KFwiaW5kZXhcIilbMV0pe1xyXG4gICAgICBpbmRleCA9IGlcclxuICAgIH1cclxuICB9XHJcbiAgJCgnLnVwZGF0ZS11c2VycycpLm1vZGFsKCdzaG93Jyk7XHJcbiAgJCgnLnVwZGF0ZS11c2Vycy11c2VybmFtZScpLnZhbCh1c2Vyc1tpbmRleF0udXNlcm5hbWUpXHJcbiAgJCgnLnVwZGF0ZS11c2VyLW9wdGlvbnMnKS5yZW1vdmVBdHRyKFwic2VsZWN0ZWRcIilcclxuXHJcbiAgaWYodXNlcnNbaW5kZXhdLnVzZXJsZXZlbCA9PSAyKXtcclxuICAgICQoJy51cGRhdGUtdXNlci1vcHRpb24yJykuYXR0cihcInNlbGVjdGVkXCIsXCJzZWxlY3RlZFwiKVxyXG4gIH1lbHNle1xyXG4gICAgJCgnLnVwZGF0ZS11c2VyLW9wdGlvbjEnKS5hdHRyKFwic2VsZWN0ZWRcIixcInNlbGVjdGVkXCIpXHJcbiAgfVxyXG59KVxyXG5cclxuJCgnYm9keScpLm9uKCdjbGljaycsICcudXBkYXRlLXVzZXJzLXVwZGF0ZScsIGZ1bmN0aW9uKCl7XHJcbiAgY29uc29sZS5sb2coXCJ1cGRhdGVcIilcclxuICBjb25zb2xlLmxvZygkKCcudXBkYXRlLXVzZXJzLXVzZXJuYW1lJykudmFsKCkpXHJcbiAgY29uc29sZS5sb2coJCgnLnVwZGF0ZS11c2Vycy1wYXNzd29yZCcpLnZhbCgpKVxyXG4gIGNvbnNvbGUubG9nKCQoJy51cGRhdGUtdXNlcnMtcmVwZWF0LXBhc3N3b3JkJykudmFsKCkpXHJcblxyXG4gIGlmKCQoJy51cGRhdGUtdXNlcnMtdXNlcm5hbWUnKS52YWwoKSA9PSBcIlwiICYmICQoJy51cGRhdGUtdXNlcnMtcGFzc3dvcmQnKS52YWwoKSA9PSBcIlwiICYmICQoJy51cGRhdGUtdXNlcnMtcmVwZWF0LXBhc3N3b3JkJykudmFsKCkgPT0gXCJcIil7XHJcbiAgICBjb25zb2xlLmxvZyhcImdlYnJ1aWtlcnNuYWFtIGVuIHdhY2h0d29vcmQgbW9nZW4gbmlldCBsZWVnIHppam5cIik7XHJcbiAgfWVsc2V7XHJcbiAgICBpZigkKCcudXBkYXRlLXVzZXJzLXBhc3N3b3JkJykudmFsKCkgIT0gJCgnLnVwZGF0ZS11c2Vycy1yZXBlYXQtcGFzc3dvcmQnKS52YWwoKSl7XHJcbiAgICAgIGNvbnNvbGUubG9nKFwid2FjaHR3b29yZGVuIHppam4gbmlldCBnZWxpamsgYWFuIGVsa2FhclwiKVxyXG4gICAgfWVsc2V7XHJcbiAgICAgIC8vIGNvbnNvbGUubG9nKHVzZXJzW3Jvd1NlbGVjdGVkLnNwbGl0KFwiaW5kZXhcIilbMV1dKVxyXG4gICAgICAkLnBvc3QoXCJpbmNsdWRlL3VwZGF0ZVVzZXIucGhwXCIgLHtcclxuICAgICAgICBpZDogdXNlcnNbaW5kZXhdLmlkLFxyXG4gICAgICAgIG5hbWU6ICQoJy51cGRhdGUtdXNlcnMtdXNlcm5hbWUnKS52YWwoKSxcclxuICAgICAgICBwYXNzOiAkKCcudXBkYXRlLXVzZXJzLXBhc3N3b3JkJykudmFsKCksXHJcbiAgICAgICAgbGV2ZWw6ICQoJy51cGRhdGUtdXNlci1sZXZlbCcpLnZhbCgpXHJcbiAgICAgIH0sIGZ1bmN0aW9uKHJlc3BvbnNlLHN0YXR1cyl7XHJcbiAgICAgICAgY29uc29sZS5sb2cocmVzcG9uc2UpXHJcbiAgICAgICAgaWYocmVzcG9uc2UgPT0gXCJzdWNjZXNcIil7XHJcbiAgICAgICAgICAkKCcudXBkYXRlLXVzZXJzJykubW9kYWwoJ2hpZGUnKTtcclxuICAgICAgICAgIHVzZXJzW2luZGV4XS51c2VybmFtZSA9ICQoJy51cGRhdGUtdXNlcnMtdXNlcm5hbWUnKS52YWwoKTtcclxuICAgICAgICAgIGNvbnNvbGUubG9nKCQoXCIuXCIrcm93U2VsZWN0ZWQpLmZpbmQoXCIudXNlcm5hbWVcIikpXHJcbiAgICAgICAgICAvLyAkKCcub3B0aW9ucycpLnRyaWdnZXIoJ2NsaWNrJyk7XHJcbiAgICAgICAgICB1cGRhdGVMZXZlbDFUZW1wbGF0ZXMoKTtcclxuICAgICAgICAgIC8vIG9wdGlvbnNcclxuICAgICAgICB9XHJcbiAgICAgIH0pXHJcbiAgICB9XHJcbiAgfVxyXG59KVxyXG4iLCJmdW5jdGlvbiBzaG93Rmxhc2hNZXNzYWdlKG1lcywgdHlwZSwgc2VjcyA9IDIwMDApe1xyXG4gICAgdmFyIGVsZW0gPSAkKCcuanMtZmxhc2gnKTtcclxuICAgICQoZWxlbSkucmVtb3ZlQ2xhc3MoJ2FsZXJ0LWRhbmdlcicpLnJlbW92ZUNsYXNzKCdhbGVydC1zdWNjZXNzJylcclxuICAgICAgICAuYWRkQ2xhc3MoJ2ZsYXNoLW1lc3NhZ2UtLXNob3cnKVxyXG4gICAgICAgIC5hZGRDbGFzcygnYWxlcnQtJyArIHR5cGUpXHJcbiAgICAgICAgLmh0bWwobWVzKTtcclxuICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHVuc2hvd0ZsYXNoTWVzc2FnZSgpO1xyXG4gICAgfSwgc2Vjcyk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHVuc2hvd0ZsYXNoTWVzc2FnZSgpe1xyXG4gICAgdmFyIGVsZW0gPSAkKCcuanMtZmxhc2gnKTtcclxuICAgIGNvbnNvbGUubG9nKGVsZW0pO1xyXG4gICAgJChlbGVtKS5yZW1vdmVDbGFzcygnZmxhc2gtbWVzc2FnZS0tc2hvdycpO1xyXG59XHJcbiIsImZ1bmN0aW9uIGxvZ2luKGFfdXNlckxldmVsKXtcclxuICAkKCcubG9naW4tY29udGFpbmVyJykuYWRkQ2xhc3MoXCJoaWRkZW5cIik7XHJcbiAgJCgnLmxvZ2luLXN0YXR1cycpLnRleHQoXCJXZWxjb206IHVzZXJcIilcclxuICAkKCcubG9nb3V0JykucmVtb3ZlQ2xhc3MoXCJoaWRkZW5cIilcclxuICAkKCcuc2V0dGluZ3MnKS5yZW1vdmVDbGFzcyhcImhpZGRlblwiKVxyXG4gIGxvZ2dlZEluID0gdHJ1ZTtcclxuICB1c2VyTGV2ZWwgPSBhX3VzZXJMZXZlbDtcclxuXHJcbiAgJChcIi51c2VyLWxldmVsXCIpLmFkZENsYXNzKFwiaGlkZGVuXCIpXHJcbiAgJChcIi52aWV3XCIpLmFkZENsYXNzKFwiaGlkZGVuXCIpXHJcblxyXG4gIHN3aXRjaCAodXNlckxldmVsKSB7XHJcbiAgICBjYXNlIDE6XHJcbiAgICAgICQoXCIudXNlci1sZXZlbF8xXCIpLnJlbW92ZUNsYXNzKFwiaGlkZGVuXCIpXHJcbiAgICAgICQoXCIudmlld18xLTFcIikucmVtb3ZlQ2xhc3MoXCJoaWRkZW5cIilcclxuICAgICAgYnJlYWs7XHJcbiAgICBjYXNlIDI6XHJcbiAgICAgICQoXCIudXNlci1sZXZlbF8yXCIpLnJlbW92ZUNsYXNzKFwiaGlkZGVuXCIpXHJcbiAgICAgICQoXCIudmlld18yLTFcIikucmVtb3ZlQ2xhc3MoXCJoaWRkZW5cIilcclxuICAgICAgYnJlYWs7XHJcbiAgICBjYXNlIDM6XHJcbiAgICAgICQoXCIudXNlci1sZXZlbF8zXCIpLnJlbW92ZUNsYXNzKFwiaGlkZGVuXCIpXHJcbiAgICAgIGJyZWFrO1xyXG4gIH1cclxufVxyXG5cclxuZnVuY3Rpb24gbG9nb3V0KCl7XHJcbiAgJCgnLmxvZ2luLWNvbnRhaW5lcicpLnJlbW92ZUNsYXNzKFwiaGlkZGVuXCIpO1xyXG4gICQoJy5sb2dpbi1zdGF0dXMnKS50ZXh0KFwiVSBiZW50IG5vZyBuaWV0IGluZ2Vsb2dkXCIpXHJcbiAgJCgnLmxvZ291dCcpLmFkZENsYXNzKFwiaGlkZGVuXCIpXHJcbiAgJChcIi51c2VyLWxldmVsXCIpLmFkZENsYXNzKFwiaGlkZGVuXCIpXHJcbiAgJCgnLnNldHRpbmdzJykuYWRkQ2xhc3MoXCJoaWRkZW5cIilcclxuICBsb2dnZWRJbiA9IGZhbHNlO1xyXG4gIHVzZXJMZXZlbCA9IDA7XHJcblxyXG4gICQucG9zdChcImluY2x1ZGUvbG9naW4ucGhwXCIse1xyXG4gICAgICBsb2dvdXRTdWI6ICcnXHJcbiAgfSwgZnVuY3Rpb24ocmVzcG9uc2Usc3RhdHVzKXtcclxuICAgICAgc2hvd0ZsYXNoTWVzc2FnZSgnSmUgYmVudCB1aXRnZWxvZ2QnLCAnc3VjY2VzcycpO1xyXG4gIH0pXHJcbn1cclxuXHJcbmZ1bmN0aW9uIHVwZGF0ZUxldmVsMVRlbXBsYXRlcygpe1xyXG4gICQucG9zdChcImluY2x1ZGUvZ2V0VXNlcnMucGhwXCIse1xyXG4gIH0sIGZ1bmN0aW9uKHJlc3BvbnNlLHN0YXR1cyl7XHJcbiAgICAvLyBjb25zb2xlLmxvZyhyZXNwb25zZSlcclxuICAgIHVzZXJzID0gSlNPTi5wYXJzZShyZXNwb25zZSlcclxuXHJcbiAgICBmb3IodmFyIGkgPSAwOyBpIDwgMjsgaSsrKXtcclxuICAgICAgLy8gY29uc29sZS5sb2coaSlcclxuICAgICAgdXNlcnMubWFwKGZ1bmN0aW9uKGNwLGope1xyXG4gICAgICAgIGNwLmluZGV4ID0gY3AuaWQ7XHJcbiAgICAgICAgLy8gY29uc29sZS5sb2coaSlcclxuICAgICAgICBpZihpID09IDApe1xyXG4gICAgICAgICAgY3AuY2xhc3MgPSBcImVkaXRcIlxyXG4gICAgICAgICAgY3AuY2xhc3NUZXh0ID0gXCJhYW5wYXNzZW5cIlxyXG4gICAgICAgIH1lbHNlIGlmKGkgPT0gMSl7XHJcbiAgICAgICAgICBjcC5jbGFzcyA9IFwiZGVsZXRlXCJcclxuICAgICAgICAgIGNwLmNsYXNzVGV4dCA9IFwidmVyd2lqZGVyZW5cIlxyXG4gICAgICAgIH1cclxuICAgICAgfSlcclxuXHJcbiAgICAgIGZvcih2YXIgaiA9IDA7IGogPCB1c2Vycy5sZW5ndGg7IGorKyl7XHJcbiAgICAgICAgaWYodXNlcnNbal0udXNlcmxldmVsID09IDEpe1xyXG4gICAgICAgICAgdXNlcnMuc3BsaWNlKGosMSlcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIC8vIGNvbnNvbGUubG9nKHVzZXJzKVxyXG5cclxuICAgICAgdmFyIHRlbXBsYXRlID0gJChcIi5sZXZlbDEtdXNlci10ZW1wbGF0ZVwiKS5odG1sKCk7XHJcbiAgICAgIHZhciByZW5kZXJUZW1wbGF0ZSA9IE11c3RhY2hlLnJlbmRlcih0ZW1wbGF0ZSwgdXNlcnMpO1xyXG5cclxuICAgICAgaWYoaSA9PSAwKXtcclxuICAgICAgICAkKFwiLnVzZXItbGV2ZWwxLWVkaXRcIikuaHRtbChyZW5kZXJUZW1wbGF0ZSk7XHJcbiAgICAgIH1lbHNlIGlmKGkgPT0gMSl7XHJcbiAgICAgICAgJChcIi51c2VyLWxldmVsMS1kZWxldGVcIikuaHRtbChyZW5kZXJUZW1wbGF0ZSk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9KVxyXG59XHJcbiIsInZhciBsb2dnZWRJbiA9IGZhbHNlO1xyXG52YXIgdXNlckxldmVsID0gMDtcclxudmFyIGxvZ2dlZEluVXNlciA9IFtdO1xyXG52YXIgdXNlcnMgPSBbXTtcclxuJChkb2N1bWVudCkucmVhZHkoZnVuY3Rpb24oKXtcclxuICBjb25zb2xlLmxvZyhcImhvbWUuanMgbG9hZGVkXCIpXHJcbiAgJCgnYm9keScpLm9uKCdjbGljaycsICcubWVudS1pdGVtJywgZnVuY3Rpb24oKXtcclxuICAgIHZhciBpZCA9ICQodGhpcykuYXR0cihcImNsYXNzXCIpLnNwbGl0KCdfJylbMV07XHJcbiAgICBjb25zb2xlLmxvZyhpZClcclxuXHJcbiAgICAkKCcudmVyZGllcGluZycpLmFkZENsYXNzKFwiaGlkZGVuXCIpXHJcbiAgICAkKCcudmVyZGllcGluZ19fJytpZCkucmVtb3ZlQ2xhc3MoXCJoaWRkZW5cIilcclxuICB9KVxyXG5cclxuICAkKCdib2R5Jykub24oJ2NsaWNrJywgJy5sb2dpbicsIGZ1bmN0aW9uKCl7XHJcbiAgICBjb25zb2xlLmxvZygkKCcudXNlcm5hbWUnKS52YWwoKS50b0xvd2VyQ2FzZSgpKVxyXG4gICAgY29uc29sZS5sb2coJCgnLnBhc3N3b3JkJykudmFsKCkudG9Mb3dlckNhc2UoKSlcclxuXHJcbiAgICAkLnBvc3QoXCJpbmNsdWRlL2xvZ2luLnBocFwiICx7XHJcbiAgICAgIGxvZ2luU3ViOiBcIlwiLFxyXG4gICAgICB1c2VybmFtZTogJCgnLnVzZXJuYW1lJykudmFsKCkudG9Mb3dlckNhc2UoKSxcclxuICAgICAgcGFzc3dvcmQ6ICQoJy5wYXNzd29yZCcpLnZhbCgpXHJcbiAgICB9LCBmdW5jdGlvbihyZXNwb25zZSxzdGF0dXMpe1xyXG4gICAgICB2YXIgZGF0YSA9IEpTT04ucGFyc2UocmVzcG9uc2UpO1xyXG4gICAgICBjb25zb2xlLmxvZyhkYXRhKTtcclxuICAgICAgbG9nZ2VkSW5Vc2VyID0gZGF0YTtcclxuICAgICAgaWYgKGRhdGEubG9nZ2VkSW4gPT0gMSkge1xyXG4gICAgICAgICAgbG9naW4oZGF0YS5sZXZlbCk7XHJcbiAgICAgICAgICBzaG93Rmxhc2hNZXNzYWdlKCdVIGJlbnQgc3VjY2Vzdm9sIGluZ2Vsb2dkJywgJ3N1Y2Nlc3MnKVxyXG4gICAgICB9XHJcbiAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgc2hvd0ZsYXNoTWVzc2FnZSgnVXcgZ2VicnVpa2Vyc25hYW0gb2Ygd2FjaHR3b29yZCBpcyBpbmNvcnJlY3QnLCAnZGFuZ2VyJylcclxuICAgICAgfVxyXG4gICAgfSlcclxuICB9KVxyXG5cclxuICAkKCdib2R5Jykub24oJ2NsaWNrJywgJy5sb2dvdXQnLCBmdW5jdGlvbigpe1xyXG4gICAgbG9nb3V0KCk7XHJcbiAgfSlcclxuXHJcbiAgJCgnYm9keScpLm9uKCdjbGljaycsICcubG9rYWFsJywgZnVuY3Rpb24oKXtcclxuICAgIGNvbnNvbGUubG9nKGxvZ2dlZEluKVxyXG4gICAgaWYobG9nZ2VkSW4gPT0gdHJ1ZSl7XHJcblxyXG4gICAgICBjb25zb2xlLmxvZygkKHRoaXMpLmF0dHIoXCJjbGFzc1wiKS5zcGxpdChcIiBcIilbMF0pXHJcbiAgICB9XHJcbiAgfSlcclxuXHJcbiAgJChkb2N1bWVudCkua2V5cHJlc3MoZnVuY3Rpb24oZSkge1xyXG4gICAgICBpZihlLndoaWNoID09IDEzKSB7XHJcbiAgICAgICAgICBpZiAoIWxvZ2dlZEluKSB7XHJcbiAgICAgICAgICAgICAgJCgnLmxvZ2luJykudHJpZ2dlcignY2xpY2snKTtcclxuICAgICAgICAgIH1cclxuICAgICAgfVxyXG4gIH0pO1xyXG59KVxyXG4iLCIkKFwiYm9keVwiKS5vbihcImNsaWNrXCIsIFwiLm5ldy11c2VyXCIsZnVuY3Rpb24oKXtcclxuICBpZigkKFwiLm5ldy11c2VyLW5hbWVcIikudmFsKCkgPT0gXCJcIiB8fCAkKFwiLm5ldy11c2VyLXBhc3N3b3JkXCIpLnZhbCgpID09IFwiXCIgfHwgJChcIi5uZXctdXNlci1sZXZlbFwiKS52YWwoKSA9PSBudWxsKXtcclxuICAgIGNvbnNvbGUubG9nKFwiZ2VlbiBnZWJydWlrZXJzbmFhbSwgd2FjaHR3b29yZCBvZiBsZXZlbCBnZXNlbGVjdGVlcmRcIilcclxuICB9ZWxzZXtcclxuICAgIGNvbnNvbGUubG9nKCQoXCIubmV3LXVzZXItbGV2ZWxcIikudmFsKCkpXHJcbiAgICAkLnBvc3QoXCJpbmNsdWRlL2FkZFVzZXIucGhwXCIse1xyXG4gICAgICB1c2VybmFtZTogJChcIi5uZXctdXNlci1uYW1lXCIpLnZhbCgpLFxyXG4gICAgICB1c2VycGFzc3dvcmQ6ICQoXCIubmV3LXVzZXItcGFzc3dvcmRcIikudmFsKCksXHJcbiAgICAgIHVzZXJsZXZlbDogJChcIi5uZXctdXNlci1sZXZlbFwiKS52YWwoKVxyXG4gICAgfSwgZnVuY3Rpb24ocmVzcG9uc2Usc3RhdHVzKXtcclxuICAgICAgY29uc29sZS5sb2cocmVzcG9uc2UpXHJcbiAgICB9KVxyXG4gIH1cclxufSlcclxuIiwiJChcImJvZHlcIikub24oXCJjbGlja1wiLCBcIi5vcHRpb25zXCIsIGZ1bmN0aW9uKCl7XHJcbiAgdmFyIGxldmVsID0gJCh0aGlzKS5hdHRyKFwiY2xhc3NcIikuc3BsaXQoXCIgXCIpWzFdLnNwbGl0KFwiX1wiKVsxXTtcclxuICB2YXIgb3B0aW9uID0gJCh0aGlzKS5hdHRyKFwiY2xhc3NcIikuc3BsaXQoXCIgXCIpWzJdLnNwbGl0KFwiX1wiKVsxXTtcclxuICBjb25zb2xlLmxvZyhsZXZlbClcclxuXHJcbiAgJChcIi52aWV3XCIpLmFkZENsYXNzKFwiaGlkZGVuXCIpXHJcbiAgJChcIi52aWV3X1wiK2xldmVsK1wiLVwiK29wdGlvbikucmVtb3ZlQ2xhc3MoXCJoaWRkZW5cIilcclxuXHJcbiAgc3dpdGNoIChsZXZlbCkge1xyXG4gICAgY2FzZSBcIjFcIjpcclxuICAgICAgdXBkYXRlTGV2ZWwxVGVtcGxhdGVzKCk7XHJcbiAgICAgIGJyZWFrO1xyXG4gIH1cclxufSlcclxuIiwiJChkb2N1bWVudCkucmVhZHkoZnVuY3Rpb24oKXtcclxuICAgICQucG9zdChcImluY2x1ZGUvcmV0dXJuU2Vzc2lvbi5waHBcIix7XHJcbiAgICB9LCBmdW5jdGlvbihyZXNwb25zZSxzdGF0dXMpe1xyXG4gICAgICAgIHZhciBkYXRhID0gSlNPTi5wYXJzZShyZXNwb25zZSk7XHJcbiAgICAgICAgaWYgKGRhdGEubG9nZ2VkSW4pIHtcclxuICAgICAgICAgICAgbG9naW4oZGF0YS5sZXZlbCk7XHJcbiAgICAgICAgfVxyXG4gICAgfSlcclxufSk7XHJcbiIsIiQoXCIuc2V0dGluZ3MtaW5wdXRzXCIpLmtleXByZXNzKGZ1bmN0aW9uKGUpIHtcclxuICBjb25zb2xlLmxvZyhcImVudGVyXCIpXHJcbiAgICBpZihlLndoaWNoID09IDEzKSB7XHJcbiAgICAgICQoJy5zZXR0aW5ncy11cGRhdGUnKS50cmlnZ2VyKCdjbGljaycpO1xyXG4gICAgfVxyXG59KTtcclxuXHJcbiQoJ2JvZHknKS5vbignY2xpY2snLCAnLnNldHRpbmdzJywgZnVuY3Rpb24oKXtcclxuICBjb25zb2xlLmxvZyhcInNldHRpbmdzXCIpXHJcbiAgJCgnLnNldHRpbmdzLXVzZXJuYW1lJykudmFsKGxvZ2dlZEluVXNlci51c2VybmFtZSlcclxuICAkKCcudXNlci1zZXR0aW5ncycpLm1vZGFsKCdzaG93Jyk7XHJcbiAgY29uc29sZS5sb2cobG9nZ2VkSW5Vc2VyLnVzZXJuYW1lKVxyXG59KVxyXG5cclxuJCgnYm9keScpLm9uKCdjbGljaycsICcuc2V0dGluZ3MtdXBkYXRlJywgZnVuY3Rpb24oKXtcclxuICBjb25zb2xlLmxvZyhcInVwZGF0ZVwiKVxyXG4gIGNvbnNvbGUubG9nKCQoJy5zZXR0aW5ncy11c2VybmFtZScpLnZhbCgpKVxyXG4gIGNvbnNvbGUubG9nKCQoJy5zZXR0aW5ncy1wYXNzd29yZCcpLnZhbCgpKVxyXG4gIGNvbnNvbGUubG9nKCQoJy5zZXR0aW5ncy1yZXBlYXQtcGFzc3dvcmQnKS52YWwoKSlcclxuXHJcbiAgaWYoJCgnLnNldHRpbmdzLXVzZXJuYW1lJykudmFsKCkgPT0gXCJcIiAmJiAkKCcuc2V0dGluZ3MtcGFzc3dvcmQnKS52YWwoKSA9PSBcIlwiICYmICQoJy5zZXR0aW5ncy1yZXBlYXQtcGFzc3dvcmQnKS52YWwoKSA9PSBcIlwiKXtcclxuICAgIGNvbnNvbGUubG9nKFwiZ2VicnVpa2Vyc25hYW0gZW4gd2FjaHR3b29yZCBtb2dlbiBuaWV0IGxlZWcgemlqblwiKTtcclxuICB9ZWxzZXtcclxuICAgIGlmKCQoJy5zZXR0aW5ncy1wYXNzd29yZCcpLnZhbCgpICE9ICQoJy5zZXR0aW5ncy1yZXBlYXQtcGFzc3dvcmQnKS52YWwoKSl7XHJcbiAgICAgIGNvbnNvbGUubG9nKFwid2FjaHR3b29yZGVuIHppam4gbmlldCBnZWxpamsgYWFuIGVsa2FhclwiKVxyXG4gICAgfWVsc2V7XHJcbiAgICAgIGNvbnNvbGUubG9nKGxvZ2dlZEluVXNlcilcclxuICAgICAgJC5wb3N0KFwiaW5jbHVkZS91cGRhdGVVc2VyLnBocFwiICx7XHJcbiAgICAgICAgaWQ6IGxvZ2dlZEluVXNlci51c2VySUQsXHJcbiAgICAgICAgbmFtZTogJCgnLnNldHRpbmdzLXVzZXJuYW1lJykudmFsKCksXHJcbiAgICAgICAgcGFzczogJCgnLnNldHRpbmdzLXBhc3N3b3JkJykudmFsKClcclxuICAgICAgfSwgZnVuY3Rpb24ocmVzcG9uc2Usc3RhdHVzKXtcclxuICAgICAgICBpZihyZXNwb25zZSA9PSBcInN1Y2Nlc1wiKXtcclxuICAgICAgICAkKCcudXNlci1zZXR0aW5ncycpLm1vZGFsKCdoaWRlJyk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9KVxyXG4gICAgfVxyXG4gIH1cclxufSlcclxuIiwiJChkb2N1bWVudCkucmVhZHkoZnVuY3Rpb24oKSB7XHJcbiAgICAkKCcjcGFuZWwtNjIzMTg4JykuaGlkZSgpO1xyXG4gICAgJCgnI3BhbmVsLTMzODY1MycpLmhpZGUoKTtcclxuICAgICQoJyNwYW5lbC00NDU1NjYnKS5oaWRlKCk7XHJcbiAgICAkKCcjcGFuZWwtNTU2MjM0JykuaGlkZSgpO1xyXG59KTtcclxuIl19
