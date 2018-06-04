$('body').on('propertychange input', '.js-newstep',function(e){
    var parent = $(this).closest('.js-step')
    if ($(parent).is(':last-child')) {
        var nrstr = $('.js-lastnr').html();
        var newnr = parseInt(nrstr) + 1;
        $('.js-lastnr').removeClass('js-lastnr');
        $('.js-copystep').clone().appendTo('.js-steps-container')
        .removeClass('js-copystep').removeClass('hidden').addClass('js-step')
        .find('.js-newnr').removeClass('js-newnr').addClass('js-lastnr').html(newnr);
        updateSteps();
    }
});
function updateSteps(){
    var count = 1;
    $('.js-stepnr').each(function () {
        $(this).html(count);
        count++;
    });
}
$('body').on('click', '.js-addstep',function(){
    var nrstr = $('.js-lastnr').html();
    var newnr = parseInt(nrstr) + 1;
    $('.js-lastnr').removeClass('js-lastnr');
    $('.js-copystep').clone().appendTo('.js-steps-container')
    .removeClass('js-copystep').removeClass('hidden').addClass('js-step')
    .find('.js-newnr').removeClass('js-newnr').addClass('js-lastnr').html(newnr);
    updateSteps();
});
$('body').on('click', '.js-save-new-scenario',function(){
    var name = $('.js-new-scenario-name').val();
    var steps = [];
    if (name == '') {
        showFlashMessage('Vul eerst een naam in', 'danger');
    }
    else{
        $('.js-newstep').each(function () {
            var tempval = $(this).val();
            if (tempval != "") {
                steps.push(tempval);

            }
        });
        if (steps.length == 0) {
            showFlashMessage('Vul minstens 1 stap in', 'danger');
        }
        else{
            $.post("include/saveNewScenario.php" ,{
                name: name,
                steps: steps
            }, function(response,status){
                if(response == "succes"){
                    $('.js-steps-container').html('');
                    $('.js-new-scenario-name').val('');
                    $('.js-copystep').clone().appendTo('.js-steps-container')
                    .removeClass('js-copystep').removeClass('hidden')
                    .addClass('js-step').addClass('Uniquetemp')
                    .find('.js-newnr').removeClass('js-newnr').addClass('js-lastnr').html('1');

                }
            })
        }
    }
});

$('body').on('click', '.js-delete-step',function(){
    var parent = $(this).closest('.js-step');
    if (!$(parent).is(':first-child')) {
        $(parent).remove();
        updateSteps();
    }
    else {
        showFlashMessage('Je kunt niet de eerste stap verwijderen', 'danger');
    }
});

function checkAlert() {
  if(loggedInUser.level == 3 && !alertActive){
    $.post("include/getScenariosActive.php" ,{
    }, function(response,status){
      response = JSON.parse(response);
      if(response.length > 0){
        $('.scenario').modal('show');
        alertActive = true;
      }
    })
  }
  setTimeout(checkAlert, 1000);
}
setTimeout(checkAlert, 1000);

$('.scenario').on('hidden.bs.modal', function () {
  alertActive = false;
})

$('body').on('click', '.level1-btn-delete',function(){
  var rowClass = $(this).parent().parent().attr("class");
  var row = $(this).parent().parent().attr("class").split("index")[1];
  console.log(users)
  for(var i = 0; i < users.length; i++){
    if(users[i].id == row){
      $.post("include/deleteUser.php" ,{
        id: users[i].id
      }, function(response,status){
        if(response == "succes"){
          console.log(rowClass)
          console.log('asd');
          $("."+rowClass).remove();
        }
      })
    }
  }
})

var rowSelected = 0;
var index = 0;
$('body').on('click', '.level1-btn-edit', function(){
  rowSelected = $(this).parent().parent().attr("class");
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
  $('.login-status').text("Welcom: "+loggedInUser.username + "  ")
  $('.logout').removeClass("hidden")
  loggedIn = true;
  userLevel = a_userLevel;

  $(".user-level").addClass("hidden")
  $(".view").addClass("hidden")

  switch (userLevel) {
    case 1:
      $(".user-level_1").removeClass("hidden")
      $(".view_1-1").removeClass("hidden")
      $('.settings').removeClass("hidden")
      break;
    case 2:
      $(".user-level_2").removeClass("hidden")
      $(".view_2-2").removeClass("hidden")
      $('.settings').removeClass("hidden")
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
        if(cp.userlevel == 2){
          cp.level = "Docent"
        }else if(cp.userlevel == 3){
          cp.level = "Student"
        }
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
            loggedInUser = data;
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
          console.log(response);
        if(response == "succes"){
        $('.user-settings').modal('hide');
        }
      })
    }
  }
})

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFkZFNjZW5hcmlvLmpzIiwiY2hlY2tBbGVydC5qcyIsImRlbGV0ZS11c2VyLmpzIiwiZWRpdC11c2VyLmpzIiwiZmxhc2gtbWVzc2FnZS5qcyIsImZ1bmN0aW9ucy5qcyIsIm5ldy11c2VyLmpzIiwib3B0aW9ucy5qcyIsInNlc3Npb25DaGVjay5qcyIsInNldHRpbmdzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2xCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2xCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNyREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2hCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3ZGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNkQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNkQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDVkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJtYWluLmpzIiwic291cmNlc0NvbnRlbnQiOlsiJCgnYm9keScpLm9uKCdwcm9wZXJ0eWNoYW5nZSBpbnB1dCcsICcuanMtbmV3c3RlcCcsZnVuY3Rpb24oZSl7XHJcbiAgICB2YXIgcGFyZW50ID0gJCh0aGlzKS5jbG9zZXN0KCcuanMtc3RlcCcpXHJcbiAgICBpZiAoJChwYXJlbnQpLmlzKCc6bGFzdC1jaGlsZCcpKSB7XHJcbiAgICAgICAgdmFyIG5yc3RyID0gJCgnLmpzLWxhc3RucicpLmh0bWwoKTtcclxuICAgICAgICB2YXIgbmV3bnIgPSBwYXJzZUludChucnN0cikgKyAxO1xyXG4gICAgICAgICQoJy5qcy1sYXN0bnInKS5yZW1vdmVDbGFzcygnanMtbGFzdG5yJyk7XHJcbiAgICAgICAgJCgnLmpzLWNvcHlzdGVwJykuY2xvbmUoKS5hcHBlbmRUbygnLmpzLXN0ZXBzLWNvbnRhaW5lcicpXHJcbiAgICAgICAgLnJlbW92ZUNsYXNzKCdqcy1jb3B5c3RlcCcpLnJlbW92ZUNsYXNzKCdoaWRkZW4nKS5hZGRDbGFzcygnanMtc3RlcCcpXHJcbiAgICAgICAgLmZpbmQoJy5qcy1uZXducicpLnJlbW92ZUNsYXNzKCdqcy1uZXducicpLmFkZENsYXNzKCdqcy1sYXN0bnInKS5odG1sKG5ld25yKTtcclxuICAgICAgICB1cGRhdGVTdGVwcygpO1xyXG4gICAgfVxyXG59KTtcclxuZnVuY3Rpb24gdXBkYXRlU3RlcHMoKXtcclxuICAgIHZhciBjb3VudCA9IDE7XHJcbiAgICAkKCcuanMtc3RlcG5yJykuZWFjaChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgJCh0aGlzKS5odG1sKGNvdW50KTtcclxuICAgICAgICBjb3VudCsrO1xyXG4gICAgfSk7XHJcbn1cclxuJCgnYm9keScpLm9uKCdjbGljaycsICcuanMtYWRkc3RlcCcsZnVuY3Rpb24oKXtcclxuICAgIHZhciBucnN0ciA9ICQoJy5qcy1sYXN0bnInKS5odG1sKCk7XHJcbiAgICB2YXIgbmV3bnIgPSBwYXJzZUludChucnN0cikgKyAxO1xyXG4gICAgJCgnLmpzLWxhc3RucicpLnJlbW92ZUNsYXNzKCdqcy1sYXN0bnInKTtcclxuICAgICQoJy5qcy1jb3B5c3RlcCcpLmNsb25lKCkuYXBwZW5kVG8oJy5qcy1zdGVwcy1jb250YWluZXInKVxyXG4gICAgLnJlbW92ZUNsYXNzKCdqcy1jb3B5c3RlcCcpLnJlbW92ZUNsYXNzKCdoaWRkZW4nKS5hZGRDbGFzcygnanMtc3RlcCcpXHJcbiAgICAuZmluZCgnLmpzLW5ld25yJykucmVtb3ZlQ2xhc3MoJ2pzLW5ld25yJykuYWRkQ2xhc3MoJ2pzLWxhc3RucicpLmh0bWwobmV3bnIpO1xyXG4gICAgdXBkYXRlU3RlcHMoKTtcclxufSk7XHJcbiQoJ2JvZHknKS5vbignY2xpY2snLCAnLmpzLXNhdmUtbmV3LXNjZW5hcmlvJyxmdW5jdGlvbigpe1xyXG4gICAgdmFyIG5hbWUgPSAkKCcuanMtbmV3LXNjZW5hcmlvLW5hbWUnKS52YWwoKTtcclxuICAgIHZhciBzdGVwcyA9IFtdO1xyXG4gICAgaWYgKG5hbWUgPT0gJycpIHtcclxuICAgICAgICBzaG93Rmxhc2hNZXNzYWdlKCdWdWwgZWVyc3QgZWVuIG5hYW0gaW4nLCAnZGFuZ2VyJyk7XHJcbiAgICB9XHJcbiAgICBlbHNle1xyXG4gICAgICAgICQoJy5qcy1uZXdzdGVwJykuZWFjaChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHZhciB0ZW1wdmFsID0gJCh0aGlzKS52YWwoKTtcclxuICAgICAgICAgICAgaWYgKHRlbXB2YWwgIT0gXCJcIikge1xyXG4gICAgICAgICAgICAgICAgc3RlcHMucHVzaCh0ZW1wdmFsKTtcclxuXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgICAgICBpZiAoc3RlcHMubGVuZ3RoID09IDApIHtcclxuICAgICAgICAgICAgc2hvd0ZsYXNoTWVzc2FnZSgnVnVsIG1pbnN0ZW5zIDEgc3RhcCBpbicsICdkYW5nZXInKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZXtcclxuICAgICAgICAgICAgJC5wb3N0KFwiaW5jbHVkZS9zYXZlTmV3U2NlbmFyaW8ucGhwXCIgLHtcclxuICAgICAgICAgICAgICAgIG5hbWU6IG5hbWUsXHJcbiAgICAgICAgICAgICAgICBzdGVwczogc3RlcHNcclxuICAgICAgICAgICAgfSwgZnVuY3Rpb24ocmVzcG9uc2Usc3RhdHVzKXtcclxuICAgICAgICAgICAgICAgIGlmKHJlc3BvbnNlID09IFwic3VjY2VzXCIpe1xyXG4gICAgICAgICAgICAgICAgICAgICQoJy5qcy1zdGVwcy1jb250YWluZXInKS5odG1sKCcnKTtcclxuICAgICAgICAgICAgICAgICAgICAkKCcuanMtbmV3LXNjZW5hcmlvLW5hbWUnKS52YWwoJycpO1xyXG4gICAgICAgICAgICAgICAgICAgICQoJy5qcy1jb3B5c3RlcCcpLmNsb25lKCkuYXBwZW5kVG8oJy5qcy1zdGVwcy1jb250YWluZXInKVxyXG4gICAgICAgICAgICAgICAgICAgIC5yZW1vdmVDbGFzcygnanMtY29weXN0ZXAnKS5yZW1vdmVDbGFzcygnaGlkZGVuJylcclxuICAgICAgICAgICAgICAgICAgICAuYWRkQ2xhc3MoJ2pzLXN0ZXAnKS5hZGRDbGFzcygnVW5pcXVldGVtcCcpXHJcbiAgICAgICAgICAgICAgICAgICAgLmZpbmQoJy5qcy1uZXducicpLnJlbW92ZUNsYXNzKCdqcy1uZXducicpLmFkZENsYXNzKCdqcy1sYXN0bnInKS5odG1sKCcxJyk7XHJcblxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgIH1cclxuICAgIH1cclxufSk7XHJcblxyXG4kKCdib2R5Jykub24oJ2NsaWNrJywgJy5qcy1kZWxldGUtc3RlcCcsZnVuY3Rpb24oKXtcclxuICAgIHZhciBwYXJlbnQgPSAkKHRoaXMpLmNsb3Nlc3QoJy5qcy1zdGVwJyk7XHJcbiAgICBpZiAoISQocGFyZW50KS5pcygnOmZpcnN0LWNoaWxkJykpIHtcclxuICAgICAgICAkKHBhcmVudCkucmVtb3ZlKCk7XHJcbiAgICAgICAgdXBkYXRlU3RlcHMoKTtcclxuICAgIH1cclxuICAgIGVsc2Uge1xyXG4gICAgICAgIHNob3dGbGFzaE1lc3NhZ2UoJ0plIGt1bnQgbmlldCBkZSBlZXJzdGUgc3RhcCB2ZXJ3aWpkZXJlbicsICdkYW5nZXInKTtcclxuICAgIH1cclxufSk7XHJcbiIsImZ1bmN0aW9uIGNoZWNrQWxlcnQoKSB7XHJcbiAgaWYobG9nZ2VkSW5Vc2VyLmxldmVsID09IDMgJiYgIWFsZXJ0QWN0aXZlKXtcclxuICAgICQucG9zdChcImluY2x1ZGUvZ2V0U2NlbmFyaW9zQWN0aXZlLnBocFwiICx7XHJcbiAgICB9LCBmdW5jdGlvbihyZXNwb25zZSxzdGF0dXMpe1xyXG4gICAgICByZXNwb25zZSA9IEpTT04ucGFyc2UocmVzcG9uc2UpO1xyXG4gICAgICBpZihyZXNwb25zZS5sZW5ndGggPiAwKXtcclxuICAgICAgICAkKCcuc2NlbmFyaW8nKS5tb2RhbCgnc2hvdycpO1xyXG4gICAgICAgIGFsZXJ0QWN0aXZlID0gdHJ1ZTtcclxuICAgICAgfVxyXG4gICAgfSlcclxuICB9XHJcbiAgc2V0VGltZW91dChjaGVja0FsZXJ0LCAxMDAwKTtcclxufVxyXG5zZXRUaW1lb3V0KGNoZWNrQWxlcnQsIDEwMDApO1xyXG5cclxuJCgnLnNjZW5hcmlvJykub24oJ2hpZGRlbi5icy5tb2RhbCcsIGZ1bmN0aW9uICgpIHtcclxuICBhbGVydEFjdGl2ZSA9IGZhbHNlO1xyXG59KVxyXG4iLCIkKCdib2R5Jykub24oJ2NsaWNrJywgJy5sZXZlbDEtYnRuLWRlbGV0ZScsZnVuY3Rpb24oKXtcclxuICB2YXIgcm93Q2xhc3MgPSAkKHRoaXMpLnBhcmVudCgpLnBhcmVudCgpLmF0dHIoXCJjbGFzc1wiKTtcclxuICB2YXIgcm93ID0gJCh0aGlzKS5wYXJlbnQoKS5wYXJlbnQoKS5hdHRyKFwiY2xhc3NcIikuc3BsaXQoXCJpbmRleFwiKVsxXTtcclxuICBjb25zb2xlLmxvZyh1c2VycylcclxuICBmb3IodmFyIGkgPSAwOyBpIDwgdXNlcnMubGVuZ3RoOyBpKyspe1xyXG4gICAgaWYodXNlcnNbaV0uaWQgPT0gcm93KXtcclxuICAgICAgJC5wb3N0KFwiaW5jbHVkZS9kZWxldGVVc2VyLnBocFwiICx7XHJcbiAgICAgICAgaWQ6IHVzZXJzW2ldLmlkXHJcbiAgICAgIH0sIGZ1bmN0aW9uKHJlc3BvbnNlLHN0YXR1cyl7XHJcbiAgICAgICAgaWYocmVzcG9uc2UgPT0gXCJzdWNjZXNcIil7XHJcbiAgICAgICAgICBjb25zb2xlLmxvZyhyb3dDbGFzcylcclxuICAgICAgICAgIGNvbnNvbGUubG9nKCdhc2QnKTtcclxuICAgICAgICAgICQoXCIuXCIrcm93Q2xhc3MpLnJlbW92ZSgpO1xyXG4gICAgICAgIH1cclxuICAgICAgfSlcclxuICAgIH1cclxuICB9XHJcbn0pXHJcbiIsInZhciByb3dTZWxlY3RlZCA9IDA7XHJcbnZhciBpbmRleCA9IDA7XHJcbiQoJ2JvZHknKS5vbignY2xpY2snLCAnLmxldmVsMS1idG4tZWRpdCcsIGZ1bmN0aW9uKCl7XHJcbiAgcm93U2VsZWN0ZWQgPSAkKHRoaXMpLnBhcmVudCgpLnBhcmVudCgpLmF0dHIoXCJjbGFzc1wiKTtcclxuICBmb3IgKHZhciBpID0gMDsgaSA8IHVzZXJzLmxlbmd0aDsgaSsrKXtcclxuICAgIGlmKHVzZXJzW2ldLmlkID09IHJvd1NlbGVjdGVkLnNwbGl0KFwiaW5kZXhcIilbMV0pe1xyXG4gICAgICBpbmRleCA9IGlcclxuICAgIH1cclxuICB9XHJcblxyXG4gICQoJy51cGRhdGUtdXNlcnMnKS5tb2RhbCgnc2hvdycpO1xyXG4gICQoJy51cGRhdGUtdXNlcnMtdXNlcm5hbWUnKS52YWwodXNlcnNbaW5kZXhdLnVzZXJuYW1lKVxyXG4gICQoJy51cGRhdGUtdXNlci1vcHRpb25zJykucmVtb3ZlQXR0cihcInNlbGVjdGVkXCIpXHJcblxyXG4gIGlmKHVzZXJzW2luZGV4XS51c2VybGV2ZWwgPT0gMil7XHJcbiAgICAkKCcudXBkYXRlLXVzZXItb3B0aW9uMicpLmF0dHIoXCJzZWxlY3RlZFwiLFwic2VsZWN0ZWRcIilcclxuICB9ZWxzZXtcclxuICAgICQoJy51cGRhdGUtdXNlci1vcHRpb24xJykuYXR0cihcInNlbGVjdGVkXCIsXCJzZWxlY3RlZFwiKVxyXG4gIH1cclxufSlcclxuXHJcbiQoJ2JvZHknKS5vbignY2xpY2snLCAnLnVwZGF0ZS11c2Vycy11cGRhdGUnLCBmdW5jdGlvbigpe1xyXG4gIGNvbnNvbGUubG9nKFwidXBkYXRlXCIpXHJcbiAgY29uc29sZS5sb2coJCgnLnVwZGF0ZS11c2Vycy11c2VybmFtZScpLnZhbCgpKVxyXG4gIGNvbnNvbGUubG9nKCQoJy51cGRhdGUtdXNlcnMtcGFzc3dvcmQnKS52YWwoKSlcclxuICBjb25zb2xlLmxvZygkKCcudXBkYXRlLXVzZXJzLXJlcGVhdC1wYXNzd29yZCcpLnZhbCgpKVxyXG5cclxuICBpZigkKCcudXBkYXRlLXVzZXJzLXVzZXJuYW1lJykudmFsKCkgPT0gXCJcIiAmJiAkKCcudXBkYXRlLXVzZXJzLXBhc3N3b3JkJykudmFsKCkgPT0gXCJcIiAmJiAkKCcudXBkYXRlLXVzZXJzLXJlcGVhdC1wYXNzd29yZCcpLnZhbCgpID09IFwiXCIpe1xyXG4gICAgY29uc29sZS5sb2coXCJnZWJydWlrZXJzbmFhbSBlbiB3YWNodHdvb3JkIG1vZ2VuIG5pZXQgbGVlZyB6aWpuXCIpO1xyXG4gIH1lbHNle1xyXG4gICAgaWYoJCgnLnVwZGF0ZS11c2Vycy1wYXNzd29yZCcpLnZhbCgpICE9ICQoJy51cGRhdGUtdXNlcnMtcmVwZWF0LXBhc3N3b3JkJykudmFsKCkpe1xyXG4gICAgICBjb25zb2xlLmxvZyhcIndhY2h0d29vcmRlbiB6aWpuIG5pZXQgZ2VsaWprIGFhbiBlbGthYXJcIilcclxuICAgIH1lbHNle1xyXG4gICAgICAvLyBjb25zb2xlLmxvZyh1c2Vyc1tyb3dTZWxlY3RlZC5zcGxpdChcImluZGV4XCIpWzFdXSlcclxuICAgICAgJC5wb3N0KFwiaW5jbHVkZS91cGRhdGVVc2VyLnBocFwiICx7XHJcbiAgICAgICAgaWQ6IHVzZXJzW2luZGV4XS5pZCxcclxuICAgICAgICBuYW1lOiAkKCcudXBkYXRlLXVzZXJzLXVzZXJuYW1lJykudmFsKCksXHJcbiAgICAgICAgcGFzczogJCgnLnVwZGF0ZS11c2Vycy1wYXNzd29yZCcpLnZhbCgpLFxyXG4gICAgICAgIGxldmVsOiAkKCcudXBkYXRlLXVzZXItbGV2ZWwnKS52YWwoKVxyXG4gICAgICB9LCBmdW5jdGlvbihyZXNwb25zZSxzdGF0dXMpe1xyXG4gICAgICAgIGNvbnNvbGUubG9nKHJlc3BvbnNlKVxyXG4gICAgICAgIGlmKHJlc3BvbnNlID09IFwic3VjY2VzXCIpe1xyXG4gICAgICAgICAgJCgnLnVwZGF0ZS11c2VycycpLm1vZGFsKCdoaWRlJyk7XHJcbiAgICAgICAgICB1c2Vyc1tpbmRleF0udXNlcm5hbWUgPSAkKCcudXBkYXRlLXVzZXJzLXVzZXJuYW1lJykudmFsKCk7XHJcbiAgICAgICAgICBjb25zb2xlLmxvZygkKFwiLlwiK3Jvd1NlbGVjdGVkKS5maW5kKFwiLnVzZXJuYW1lXCIpKVxyXG4gICAgICAgICAgLy8gJCgnLm9wdGlvbnMnKS50cmlnZ2VyKCdjbGljaycpO1xyXG4gICAgICAgICAgdXBkYXRlTGV2ZWwxVGVtcGxhdGVzKCk7XHJcbiAgICAgICAgICAvLyBvcHRpb25zXHJcbiAgICAgICAgfVxyXG4gICAgICB9KVxyXG4gICAgfVxyXG4gIH1cclxufSlcclxuIiwiZnVuY3Rpb24gc2hvd0ZsYXNoTWVzc2FnZShtZXMsIHR5cGUsIHNlY3MgPSAyMDAwKXtcclxuICAgIHZhciBlbGVtID0gJCgnLmpzLWZsYXNoJyk7XHJcbiAgICAkKGVsZW0pLnJlbW92ZUNsYXNzKCdhbGVydC1kYW5nZXInKS5yZW1vdmVDbGFzcygnYWxlcnQtc3VjY2VzcycpXHJcbiAgICAgICAgLmFkZENsYXNzKCdmbGFzaC1tZXNzYWdlLS1zaG93JylcclxuICAgICAgICAuYWRkQ2xhc3MoJ2FsZXJ0LScgKyB0eXBlKVxyXG4gICAgICAgIC5odG1sKG1lcyk7XHJcbiAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB1bnNob3dGbGFzaE1lc3NhZ2UoKTtcclxuICAgIH0sIHNlY3MpO1xyXG59XHJcblxyXG5mdW5jdGlvbiB1bnNob3dGbGFzaE1lc3NhZ2UoKXtcclxuICAgIHZhciBlbGVtID0gJCgnLmpzLWZsYXNoJyk7XHJcbiAgICBjb25zb2xlLmxvZyhlbGVtKTtcclxuICAgICQoZWxlbSkucmVtb3ZlQ2xhc3MoJ2ZsYXNoLW1lc3NhZ2UtLXNob3cnKTtcclxufVxyXG4iLCJmdW5jdGlvbiBsb2dpbihhX3VzZXJMZXZlbCl7XHJcbiAgJCgnLmxvZ2luLWNvbnRhaW5lcicpLmFkZENsYXNzKFwiaGlkZGVuXCIpO1xyXG4gICQoJy5sb2dpbi1zdGF0dXMnKS50ZXh0KFwiV2VsY29tOiBcIitsb2dnZWRJblVzZXIudXNlcm5hbWUgKyBcIiAgXCIpXHJcbiAgJCgnLmxvZ291dCcpLnJlbW92ZUNsYXNzKFwiaGlkZGVuXCIpXHJcbiAgbG9nZ2VkSW4gPSB0cnVlO1xyXG4gIHVzZXJMZXZlbCA9IGFfdXNlckxldmVsO1xyXG5cclxuICAkKFwiLnVzZXItbGV2ZWxcIikuYWRkQ2xhc3MoXCJoaWRkZW5cIilcclxuICAkKFwiLnZpZXdcIikuYWRkQ2xhc3MoXCJoaWRkZW5cIilcclxuXHJcbiAgc3dpdGNoICh1c2VyTGV2ZWwpIHtcclxuICAgIGNhc2UgMTpcclxuICAgICAgJChcIi51c2VyLWxldmVsXzFcIikucmVtb3ZlQ2xhc3MoXCJoaWRkZW5cIilcclxuICAgICAgJChcIi52aWV3XzEtMVwiKS5yZW1vdmVDbGFzcyhcImhpZGRlblwiKVxyXG4gICAgICAkKCcuc2V0dGluZ3MnKS5yZW1vdmVDbGFzcyhcImhpZGRlblwiKVxyXG4gICAgICBicmVhaztcclxuICAgIGNhc2UgMjpcclxuICAgICAgJChcIi51c2VyLWxldmVsXzJcIikucmVtb3ZlQ2xhc3MoXCJoaWRkZW5cIilcclxuICAgICAgJChcIi52aWV3XzItMlwiKS5yZW1vdmVDbGFzcyhcImhpZGRlblwiKVxyXG4gICAgICAkKCcuc2V0dGluZ3MnKS5yZW1vdmVDbGFzcyhcImhpZGRlblwiKVxyXG4gICAgICBicmVhaztcclxuICAgIGNhc2UgMzpcclxuICAgICAgJChcIi51c2VyLWxldmVsXzNcIikucmVtb3ZlQ2xhc3MoXCJoaWRkZW5cIilcclxuICAgICAgYnJlYWs7XHJcbiAgfVxyXG59XHJcblxyXG5mdW5jdGlvbiBsb2dvdXQoKXtcclxuICAkKCcubG9naW4tY29udGFpbmVyJykucmVtb3ZlQ2xhc3MoXCJoaWRkZW5cIik7XHJcbiAgJCgnLmxvZ2luLXN0YXR1cycpLnRleHQoXCJVIGJlbnQgbm9nIG5pZXQgaW5nZWxvZ2RcIilcclxuICAkKCcubG9nb3V0JykuYWRkQ2xhc3MoXCJoaWRkZW5cIilcclxuICAkKFwiLnVzZXItbGV2ZWxcIikuYWRkQ2xhc3MoXCJoaWRkZW5cIilcclxuICAkKCcuc2V0dGluZ3MnKS5hZGRDbGFzcyhcImhpZGRlblwiKVxyXG4gIGxvZ2dlZEluID0gZmFsc2U7XHJcbiAgdXNlckxldmVsID0gMDtcclxuXHJcbiAgJC5wb3N0KFwiaW5jbHVkZS9sb2dpbi5waHBcIix7XHJcbiAgICAgIGxvZ291dFN1YjogJydcclxuICB9LCBmdW5jdGlvbihyZXNwb25zZSxzdGF0dXMpe1xyXG4gICAgICBzaG93Rmxhc2hNZXNzYWdlKCdKZSBiZW50IHVpdGdlbG9nZCcsICdzdWNjZXNzJyk7XHJcbiAgfSlcclxufVxyXG5cclxuZnVuY3Rpb24gdXBkYXRlTGV2ZWwxVGVtcGxhdGVzKCl7XHJcbiAgJC5wb3N0KFwiaW5jbHVkZS9nZXRVc2Vycy5waHBcIix7XHJcbiAgfSwgZnVuY3Rpb24ocmVzcG9uc2Usc3RhdHVzKXtcclxuICAgIC8vIGNvbnNvbGUubG9nKHJlc3BvbnNlKVxyXG4gICAgdXNlcnMgPSBKU09OLnBhcnNlKHJlc3BvbnNlKVxyXG5cclxuICAgIGZvcih2YXIgaSA9IDA7IGkgPCAyOyBpKyspe1xyXG4gICAgICAvLyBjb25zb2xlLmxvZyhpKVxyXG4gICAgICB1c2Vycy5tYXAoZnVuY3Rpb24oY3Asail7XHJcbiAgICAgICAgY3AuaW5kZXggPSBjcC5pZDtcclxuICAgICAgICAvLyBjb25zb2xlLmxvZyhpKVxyXG4gICAgICAgIGlmKGNwLnVzZXJsZXZlbCA9PSAyKXtcclxuICAgICAgICAgIGNwLmxldmVsID0gXCJEb2NlbnRcIlxyXG4gICAgICAgIH1lbHNlIGlmKGNwLnVzZXJsZXZlbCA9PSAzKXtcclxuICAgICAgICAgIGNwLmxldmVsID0gXCJTdHVkZW50XCJcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYoaSA9PSAwKXtcclxuICAgICAgICAgIGNwLmNsYXNzID0gXCJlZGl0XCJcclxuICAgICAgICAgIGNwLmNsYXNzVGV4dCA9IFwiYWFucGFzc2VuXCJcclxuICAgICAgICB9ZWxzZSBpZihpID09IDEpe1xyXG4gICAgICAgICAgY3AuY2xhc3MgPSBcImRlbGV0ZVwiXHJcbiAgICAgICAgICBjcC5jbGFzc1RleHQgPSBcInZlcndpamRlcmVuXCJcclxuICAgICAgICB9XHJcbiAgICAgIH0pXHJcblxyXG4gICAgICBmb3IodmFyIGogPSAwOyBqIDwgdXNlcnMubGVuZ3RoOyBqKyspe1xyXG4gICAgICAgIGlmKHVzZXJzW2pdLnVzZXJsZXZlbCA9PSAxKXtcclxuICAgICAgICAgIHVzZXJzLnNwbGljZShqLDEpXHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcblxyXG4gICAgICAvLyBjb25zb2xlLmxvZyh1c2VycylcclxuXHJcbiAgICAgIHZhciB0ZW1wbGF0ZSA9ICQoXCIubGV2ZWwxLXVzZXItdGVtcGxhdGVcIikuaHRtbCgpO1xyXG4gICAgICB2YXIgcmVuZGVyVGVtcGxhdGUgPSBNdXN0YWNoZS5yZW5kZXIodGVtcGxhdGUsIHVzZXJzKTtcclxuXHJcbiAgICAgIGlmKGkgPT0gMCl7XHJcbiAgICAgICAgJChcIi51c2VyLWxldmVsMS1lZGl0XCIpLmh0bWwocmVuZGVyVGVtcGxhdGUpO1xyXG4gICAgICB9ZWxzZSBpZihpID09IDEpe1xyXG4gICAgICAgICQoXCIudXNlci1sZXZlbDEtZGVsZXRlXCIpLmh0bWwocmVuZGVyVGVtcGxhdGUpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfSlcclxufVxyXG4iLCIkKFwiYm9keVwiKS5vbihcImNsaWNrXCIsIFwiLm5ldy11c2VyXCIsZnVuY3Rpb24oKXtcclxuICBpZigkKFwiLm5ldy11c2VyLW5hbWVcIikudmFsKCkgPT0gXCJcIiB8fCAkKFwiLm5ldy11c2VyLXBhc3N3b3JkXCIpLnZhbCgpID09IFwiXCIgfHwgJChcIi5uZXctdXNlci1sZXZlbFwiKS52YWwoKSA9PSBudWxsKXtcclxuICAgIGNvbnNvbGUubG9nKFwiZ2VlbiBnZWJydWlrZXJzbmFhbSwgd2FjaHR3b29yZCBvZiBsZXZlbCBnZXNlbGVjdGVlcmRcIilcclxuICB9ZWxzZXtcclxuICAgIGNvbnNvbGUubG9nKCQoXCIubmV3LXVzZXItbGV2ZWxcIikudmFsKCkpXHJcbiAgICAkLnBvc3QoXCJpbmNsdWRlL2FkZFVzZXIucGhwXCIse1xyXG4gICAgICB1c2VybmFtZTogJChcIi5uZXctdXNlci1uYW1lXCIpLnZhbCgpLFxyXG4gICAgICB1c2VycGFzc3dvcmQ6ICQoXCIubmV3LXVzZXItcGFzc3dvcmRcIikudmFsKCksXHJcbiAgICAgIHVzZXJsZXZlbDogJChcIi5uZXctdXNlci1sZXZlbFwiKS52YWwoKVxyXG4gICAgfSwgZnVuY3Rpb24ocmVzcG9uc2Usc3RhdHVzKXtcclxuICAgICAgY29uc29sZS5sb2cocmVzcG9uc2UpXHJcbiAgICB9KVxyXG4gIH1cclxufSlcclxuIiwiJChcImJvZHlcIikub24oXCJjbGlja1wiLCBcIi5vcHRpb25zXCIsIGZ1bmN0aW9uKCl7XHJcbiAgdmFyIGxldmVsID0gJCh0aGlzKS5hdHRyKFwiY2xhc3NcIikuc3BsaXQoXCIgXCIpWzFdLnNwbGl0KFwiX1wiKVsxXTtcclxuICB2YXIgb3B0aW9uID0gJCh0aGlzKS5hdHRyKFwiY2xhc3NcIikuc3BsaXQoXCIgXCIpWzJdLnNwbGl0KFwiX1wiKVsxXTtcclxuICBjb25zb2xlLmxvZyhsZXZlbClcclxuXHJcbiAgJChcIi52aWV3XCIpLmFkZENsYXNzKFwiaGlkZGVuXCIpXHJcbiAgJChcIi52aWV3X1wiK2xldmVsK1wiLVwiK29wdGlvbikucmVtb3ZlQ2xhc3MoXCJoaWRkZW5cIilcclxuXHJcbiAgc3dpdGNoIChsZXZlbCkge1xyXG4gICAgY2FzZSBcIjFcIjpcclxuICAgICAgdXBkYXRlTGV2ZWwxVGVtcGxhdGVzKCk7XHJcbiAgICAgIGJyZWFrO1xyXG4gIH1cclxufSlcclxuIiwiJChkb2N1bWVudCkucmVhZHkoZnVuY3Rpb24oKXtcclxuICAgICQucG9zdChcImluY2x1ZGUvcmV0dXJuU2Vzc2lvbi5waHBcIix7XHJcbiAgICB9LCBmdW5jdGlvbihyZXNwb25zZSxzdGF0dXMpe1xyXG4gICAgICAgIHZhciBkYXRhID0gSlNPTi5wYXJzZShyZXNwb25zZSk7XHJcbiAgICAgICAgaWYgKGRhdGEubG9nZ2VkSW4pIHtcclxuICAgICAgICAgICAgbG9nZ2VkSW5Vc2VyID0gZGF0YTtcclxuICAgICAgICAgICAgbG9naW4oZGF0YS5sZXZlbCk7XHJcbiAgICAgICAgfVxyXG4gICAgfSlcclxufSk7XHJcbiIsIiQoXCIuc2V0dGluZ3MtaW5wdXRzXCIpLmtleXByZXNzKGZ1bmN0aW9uKGUpIHtcclxuICBjb25zb2xlLmxvZyhcImVudGVyXCIpXHJcbiAgICBpZihlLndoaWNoID09IDEzKSB7XHJcbiAgICAgICQoJy5zZXR0aW5ncy11cGRhdGUnKS50cmlnZ2VyKCdjbGljaycpO1xyXG4gICAgfVxyXG59KTtcclxuXHJcbiQoJ2JvZHknKS5vbignY2xpY2snLCAnLnNldHRpbmdzJywgZnVuY3Rpb24oKXtcclxuICBjb25zb2xlLmxvZyhcInNldHRpbmdzXCIpXHJcbiAgJCgnLnNldHRpbmdzLXVzZXJuYW1lJykudmFsKGxvZ2dlZEluVXNlci51c2VybmFtZSlcclxuICAkKCcudXNlci1zZXR0aW5ncycpLm1vZGFsKCdzaG93Jyk7XHJcbiAgY29uc29sZS5sb2cobG9nZ2VkSW5Vc2VyLnVzZXJuYW1lKVxyXG59KVxyXG5cclxuJCgnYm9keScpLm9uKCdjbGljaycsICcuc2V0dGluZ3MtdXBkYXRlJywgZnVuY3Rpb24oKXtcclxuICBjb25zb2xlLmxvZyhcInVwZGF0ZVwiKVxyXG4gIGNvbnNvbGUubG9nKCQoJy5zZXR0aW5ncy11c2VybmFtZScpLnZhbCgpKVxyXG4gIGNvbnNvbGUubG9nKCQoJy5zZXR0aW5ncy1wYXNzd29yZCcpLnZhbCgpKVxyXG4gIGNvbnNvbGUubG9nKCQoJy5zZXR0aW5ncy1yZXBlYXQtcGFzc3dvcmQnKS52YWwoKSlcclxuXHJcbiAgaWYoJCgnLnNldHRpbmdzLXVzZXJuYW1lJykudmFsKCkgPT0gXCJcIiAmJiAkKCcuc2V0dGluZ3MtcGFzc3dvcmQnKS52YWwoKSA9PSBcIlwiICYmICQoJy5zZXR0aW5ncy1yZXBlYXQtcGFzc3dvcmQnKS52YWwoKSA9PSBcIlwiKXtcclxuICAgIGNvbnNvbGUubG9nKFwiZ2VicnVpa2Vyc25hYW0gZW4gd2FjaHR3b29yZCBtb2dlbiBuaWV0IGxlZWcgemlqblwiKTtcclxuICB9ZWxzZXtcclxuICAgIGlmKCQoJy5zZXR0aW5ncy1wYXNzd29yZCcpLnZhbCgpICE9ICQoJy5zZXR0aW5ncy1yZXBlYXQtcGFzc3dvcmQnKS52YWwoKSl7XHJcbiAgICAgIGNvbnNvbGUubG9nKFwid2FjaHR3b29yZGVuIHppam4gbmlldCBnZWxpamsgYWFuIGVsa2FhclwiKVxyXG4gICAgfWVsc2V7XHJcbiAgICAgIGNvbnNvbGUubG9nKGxvZ2dlZEluVXNlcilcclxuICAgICAgJC5wb3N0KFwiaW5jbHVkZS91cGRhdGVVc2VyLnBocFwiICx7XHJcbiAgICAgICAgaWQ6IGxvZ2dlZEluVXNlci51c2VySUQsXHJcbiAgICAgICAgbmFtZTogJCgnLnNldHRpbmdzLXVzZXJuYW1lJykudmFsKCksXHJcbiAgICAgICAgcGFzczogJCgnLnNldHRpbmdzLXBhc3N3b3JkJykudmFsKClcclxuICAgICAgfSwgZnVuY3Rpb24ocmVzcG9uc2Usc3RhdHVzKXtcclxuICAgICAgICAgIGNvbnNvbGUubG9nKHJlc3BvbnNlKTtcclxuICAgICAgICBpZihyZXNwb25zZSA9PSBcInN1Y2Nlc1wiKXtcclxuICAgICAgICAkKCcudXNlci1zZXR0aW5ncycpLm1vZGFsKCdoaWRlJyk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9KVxyXG4gICAgfVxyXG4gIH1cclxufSlcclxuIl19
