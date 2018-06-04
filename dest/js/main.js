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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFkZFNjZW5hcmlvLmpzIiwiZGVsZXRlLXVzZXIuanMiLCJlZGl0LXVzZXIuanMiLCJmbGFzaC1tZXNzYWdlLmpzIiwiZnVuY3Rpb25zLmpzIiwiaG9tZS5qcyIsIm5ldy11c2VyLmpzIiwib3B0aW9ucy5qcyIsInNlc3Npb25DaGVjay5qcyIsInNldHRpbmdzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2xCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDcERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNoQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNqRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDeERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNWQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6Im1haW4uanMiLCJzb3VyY2VzQ29udGVudCI6WyIkKCdib2R5Jykub24oJ3Byb3BlcnR5Y2hhbmdlIGlucHV0JywgJy5qcy1uZXdzdGVwJyxmdW5jdGlvbihlKXtcclxuICAgIHZhciBwYXJlbnQgPSAkKHRoaXMpLmNsb3Nlc3QoJy5qcy1zdGVwJylcclxuICAgIGlmICgkKHBhcmVudCkuaXMoJzpsYXN0LWNoaWxkJykpIHtcclxuICAgICAgICB2YXIgbnJzdHIgPSAkKCcuanMtbGFzdG5yJykuaHRtbCgpO1xyXG4gICAgICAgIHZhciBuZXduciA9IHBhcnNlSW50KG5yc3RyKSArIDE7XHJcbiAgICAgICAgJCgnLmpzLWxhc3RucicpLnJlbW92ZUNsYXNzKCdqcy1sYXN0bnInKTtcclxuICAgICAgICAkKCcuanMtY29weXN0ZXAnKS5jbG9uZSgpLmFwcGVuZFRvKCcuanMtc3RlcHMtY29udGFpbmVyJylcclxuICAgICAgICAucmVtb3ZlQ2xhc3MoJ2pzLWNvcHlzdGVwJykucmVtb3ZlQ2xhc3MoJ2hpZGRlbicpLmFkZENsYXNzKCdqcy1zdGVwJylcclxuICAgICAgICAuZmluZCgnLmpzLW5ld25yJykucmVtb3ZlQ2xhc3MoJ2pzLW5ld25yJykuYWRkQ2xhc3MoJ2pzLWxhc3RucicpLmh0bWwobmV3bnIpO1xyXG4gICAgICAgIHVwZGF0ZVN0ZXBzKCk7XHJcbiAgICB9XHJcbn0pO1xyXG5mdW5jdGlvbiB1cGRhdGVTdGVwcygpe1xyXG4gICAgdmFyIGNvdW50ID0gMTtcclxuICAgICQoJy5qcy1zdGVwbnInKS5lYWNoKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAkKHRoaXMpLmh0bWwoY291bnQpO1xyXG4gICAgICAgIGNvdW50Kys7XHJcbiAgICB9KTtcclxufVxyXG4kKCdib2R5Jykub24oJ2NsaWNrJywgJy5qcy1hZGRzdGVwJyxmdW5jdGlvbigpe1xyXG4gICAgdmFyIG5yc3RyID0gJCgnLmpzLWxhc3RucicpLmh0bWwoKTtcclxuICAgIHZhciBuZXduciA9IHBhcnNlSW50KG5yc3RyKSArIDE7XHJcbiAgICAkKCcuanMtbGFzdG5yJykucmVtb3ZlQ2xhc3MoJ2pzLWxhc3RucicpO1xyXG4gICAgJCgnLmpzLWNvcHlzdGVwJykuY2xvbmUoKS5hcHBlbmRUbygnLmpzLXN0ZXBzLWNvbnRhaW5lcicpXHJcbiAgICAucmVtb3ZlQ2xhc3MoJ2pzLWNvcHlzdGVwJykucmVtb3ZlQ2xhc3MoJ2hpZGRlbicpLmFkZENsYXNzKCdqcy1zdGVwJylcclxuICAgIC5maW5kKCcuanMtbmV3bnInKS5yZW1vdmVDbGFzcygnanMtbmV3bnInKS5hZGRDbGFzcygnanMtbGFzdG5yJykuaHRtbChuZXducik7XHJcbiAgICB1cGRhdGVTdGVwcygpO1xyXG59KTtcclxuJCgnYm9keScpLm9uKCdjbGljaycsICcuanMtc2F2ZS1uZXctc2NlbmFyaW8nLGZ1bmN0aW9uKCl7XHJcbiAgICB2YXIgbmFtZSA9ICQoJy5qcy1uZXctc2NlbmFyaW8tbmFtZScpLnZhbCgpO1xyXG4gICAgdmFyIHN0ZXBzID0gW107XHJcbiAgICBpZiAobmFtZSA9PSAnJykge1xyXG4gICAgICAgIHNob3dGbGFzaE1lc3NhZ2UoJ1Z1bCBlZXJzdCBlZW4gbmFhbSBpbicsICdkYW5nZXInKTtcclxuICAgIH1cclxuICAgIGVsc2V7XHJcbiAgICAgICAgJCgnLmpzLW5ld3N0ZXAnKS5lYWNoKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgdmFyIHRlbXB2YWwgPSAkKHRoaXMpLnZhbCgpO1xyXG4gICAgICAgICAgICBpZiAodGVtcHZhbCAhPSBcIlwiKSB7XHJcbiAgICAgICAgICAgICAgICBzdGVwcy5wdXNoKHRlbXB2YWwpO1xyXG5cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIGlmIChzdGVwcy5sZW5ndGggPT0gMCkge1xyXG4gICAgICAgICAgICBzaG93Rmxhc2hNZXNzYWdlKCdWdWwgbWluc3RlbnMgMSBzdGFwIGluJywgJ2RhbmdlcicpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNle1xyXG4gICAgICAgICAgICAkLnBvc3QoXCJpbmNsdWRlL3NhdmVOZXdTY2VuYXJpby5waHBcIiAse1xyXG4gICAgICAgICAgICAgICAgbmFtZTogbmFtZSxcclxuICAgICAgICAgICAgICAgIHN0ZXBzOiBzdGVwc1xyXG4gICAgICAgICAgICB9LCBmdW5jdGlvbihyZXNwb25zZSxzdGF0dXMpe1xyXG4gICAgICAgICAgICAgICAgaWYocmVzcG9uc2UgPT0gXCJzdWNjZXNcIil7XHJcbiAgICAgICAgICAgICAgICAgICAgJCgnLmpzLXN0ZXBzLWNvbnRhaW5lcicpLmh0bWwoJycpO1xyXG4gICAgICAgICAgICAgICAgICAgICQoJy5qcy1uZXctc2NlbmFyaW8tbmFtZScpLnZhbCgnJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgJCgnLmpzLWNvcHlzdGVwJykuY2xvbmUoKS5hcHBlbmRUbygnLmpzLXN0ZXBzLWNvbnRhaW5lcicpXHJcbiAgICAgICAgICAgICAgICAgICAgLnJlbW92ZUNsYXNzKCdqcy1jb3B5c3RlcCcpLnJlbW92ZUNsYXNzKCdoaWRkZW4nKVxyXG4gICAgICAgICAgICAgICAgICAgIC5hZGRDbGFzcygnanMtc3RlcCcpLmFkZENsYXNzKCdVbmlxdWV0ZW1wJylcclxuICAgICAgICAgICAgICAgICAgICAuZmluZCgnLmpzLW5ld25yJykucmVtb3ZlQ2xhc3MoJ2pzLW5ld25yJykuYWRkQ2xhc3MoJ2pzLWxhc3RucicpLmh0bWwoJzEnKTtcclxuXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59KTtcclxuXHJcbiQoJ2JvZHknKS5vbignY2xpY2snLCAnLmpzLWRlbGV0ZS1zdGVwJyxmdW5jdGlvbigpe1xyXG4gICAgdmFyIHBhcmVudCA9ICQodGhpcykuY2xvc2VzdCgnLmpzLXN0ZXAnKTtcclxuICAgIGlmICghJChwYXJlbnQpLmlzKCc6Zmlyc3QtY2hpbGQnKSkge1xyXG4gICAgICAgICQocGFyZW50KS5yZW1vdmUoKTtcclxuICAgICAgICB1cGRhdGVTdGVwcygpO1xyXG4gICAgfVxyXG4gICAgZWxzZSB7XHJcbiAgICAgICAgc2hvd0ZsYXNoTWVzc2FnZSgnSmUga3VudCBuaWV0IGRlIGVlcnN0ZSBzdGFwIHZlcndpamRlcmVuJywgJ2RhbmdlcicpO1xyXG4gICAgfVxyXG59KTtcclxuIiwiJCgnYm9keScpLm9uKCdjbGljaycsICcubGV2ZWwxLWJ0bi1kZWxldGUnLGZ1bmN0aW9uKCl7XHJcbiAgdmFyIHJvd0NsYXNzID0gJCh0aGlzKS5wYXJlbnQoKS5wYXJlbnQoKS5hdHRyKFwiY2xhc3NcIik7XHJcbiAgdmFyIHJvdyA9ICQodGhpcykucGFyZW50KCkucGFyZW50KCkuYXR0cihcImNsYXNzXCIpLnNwbGl0KFwiaW5kZXhcIilbMV07XHJcbiAgY29uc29sZS5sb2codXNlcnMpXHJcbiAgZm9yKHZhciBpID0gMDsgaSA8IHVzZXJzLmxlbmd0aDsgaSsrKXtcclxuICAgIGlmKHVzZXJzW2ldLmlkID09IHJvdyl7XHJcbiAgICAgICQucG9zdChcImluY2x1ZGUvZGVsZXRlVXNlci5waHBcIiAse1xyXG4gICAgICAgIGlkOiB1c2Vyc1tpXS5pZFxyXG4gICAgICB9LCBmdW5jdGlvbihyZXNwb25zZSxzdGF0dXMpe1xyXG4gICAgICAgIGlmKHJlc3BvbnNlID09IFwic3VjY2VzXCIpe1xyXG4gICAgICAgICAgY29uc29sZS5sb2cocm93Q2xhc3MpXHJcbiAgICAgICAgICBjb25zb2xlLmxvZygnYXNkJyk7XHJcbiAgICAgICAgICAkKFwiLlwiK3Jvd0NsYXNzKS5yZW1vdmUoKTtcclxuICAgICAgICB9XHJcbiAgICAgIH0pXHJcbiAgICB9XHJcbiAgfVxyXG59KVxyXG4iLCJ2YXIgcm93U2VsZWN0ZWQgPSAwO1xyXG4kKCdib2R5Jykub24oJ2NsaWNrJywgJy5sZXZlbDEtYnRuLWVkaXQnLCBmdW5jdGlvbigpe1xyXG4gIHJvd1NlbGVjdGVkID0gJCh0aGlzKS5wYXJlbnQoKS5wYXJlbnQoKS5hdHRyKFwiY2xhc3NcIik7XHJcbiAgdmFyIGluZGV4ID0gMDtcclxuICBmb3IgKHZhciBpID0gMDsgaSA8IHVzZXJzLmxlbmd0aDsgaSsrKXtcclxuICAgIGlmKHVzZXJzW2ldLmlkID09IHJvd1NlbGVjdGVkLnNwbGl0KFwiaW5kZXhcIilbMV0pe1xyXG4gICAgICBpbmRleCA9IGlcclxuICAgIH1cclxuICB9XHJcbiAgJCgnLnVwZGF0ZS11c2VycycpLm1vZGFsKCdzaG93Jyk7XHJcbiAgJCgnLnVwZGF0ZS11c2Vycy11c2VybmFtZScpLnZhbCh1c2Vyc1tpbmRleF0udXNlcm5hbWUpXHJcbiAgJCgnLnVwZGF0ZS11c2VyLW9wdGlvbnMnKS5yZW1vdmVBdHRyKFwic2VsZWN0ZWRcIilcclxuXHJcbiAgaWYodXNlcnNbaW5kZXhdLnVzZXJsZXZlbCA9PSAyKXtcclxuICAgICQoJy51cGRhdGUtdXNlci1vcHRpb24yJykuYXR0cihcInNlbGVjdGVkXCIsXCJzZWxlY3RlZFwiKVxyXG4gIH1lbHNle1xyXG4gICAgJCgnLnVwZGF0ZS11c2VyLW9wdGlvbjEnKS5hdHRyKFwic2VsZWN0ZWRcIixcInNlbGVjdGVkXCIpXHJcbiAgfVxyXG59KVxyXG5cclxuJCgnYm9keScpLm9uKCdjbGljaycsICcudXBkYXRlLXVzZXJzLXVwZGF0ZScsIGZ1bmN0aW9uKCl7XHJcbiAgY29uc29sZS5sb2coXCJ1cGRhdGVcIilcclxuICBjb25zb2xlLmxvZygkKCcudXBkYXRlLXVzZXJzLXVzZXJuYW1lJykudmFsKCkpXHJcbiAgY29uc29sZS5sb2coJCgnLnVwZGF0ZS11c2Vycy1wYXNzd29yZCcpLnZhbCgpKVxyXG4gIGNvbnNvbGUubG9nKCQoJy51cGRhdGUtdXNlcnMtcmVwZWF0LXBhc3N3b3JkJykudmFsKCkpXHJcblxyXG4gIGlmKCQoJy51cGRhdGUtdXNlcnMtdXNlcm5hbWUnKS52YWwoKSA9PSBcIlwiICYmICQoJy51cGRhdGUtdXNlcnMtcGFzc3dvcmQnKS52YWwoKSA9PSBcIlwiICYmICQoJy51cGRhdGUtdXNlcnMtcmVwZWF0LXBhc3N3b3JkJykudmFsKCkgPT0gXCJcIil7XHJcbiAgICBjb25zb2xlLmxvZyhcImdlYnJ1aWtlcnNuYWFtIGVuIHdhY2h0d29vcmQgbW9nZW4gbmlldCBsZWVnIHppam5cIik7XHJcbiAgfWVsc2V7XHJcbiAgICBpZigkKCcudXBkYXRlLXVzZXJzLXBhc3N3b3JkJykudmFsKCkgIT0gJCgnLnVwZGF0ZS11c2Vycy1yZXBlYXQtcGFzc3dvcmQnKS52YWwoKSl7XHJcbiAgICAgIGNvbnNvbGUubG9nKFwid2FjaHR3b29yZGVuIHppam4gbmlldCBnZWxpamsgYWFuIGVsa2FhclwiKVxyXG4gICAgfWVsc2V7XHJcbiAgICAgIC8vIGNvbnNvbGUubG9nKHVzZXJzW3Jvd1NlbGVjdGVkLnNwbGl0KFwiaW5kZXhcIilbMV1dKVxyXG4gICAgICAkLnBvc3QoXCJpbmNsdWRlL3VwZGF0ZVVzZXIucGhwXCIgLHtcclxuICAgICAgICBpZDogdXNlcnNbaW5kZXhdLmlkLFxyXG4gICAgICAgIG5hbWU6ICQoJy51cGRhdGUtdXNlcnMtdXNlcm5hbWUnKS52YWwoKSxcclxuICAgICAgICBwYXNzOiAkKCcudXBkYXRlLXVzZXJzLXBhc3N3b3JkJykudmFsKCksXHJcbiAgICAgICAgbGV2ZWw6ICQoJy51cGRhdGUtdXNlci1sZXZlbCcpLnZhbCgpXHJcbiAgICAgIH0sIGZ1bmN0aW9uKHJlc3BvbnNlLHN0YXR1cyl7XHJcbiAgICAgICAgY29uc29sZS5sb2cocmVzcG9uc2UpXHJcbiAgICAgICAgaWYocmVzcG9uc2UgPT0gXCJzdWNjZXNcIil7XHJcbiAgICAgICAgICAkKCcudXBkYXRlLXVzZXJzJykubW9kYWwoJ2hpZGUnKTtcclxuICAgICAgICAgIHVzZXJzW2luZGV4XS51c2VybmFtZSA9ICQoJy51cGRhdGUtdXNlcnMtdXNlcm5hbWUnKS52YWwoKTtcclxuICAgICAgICAgIGNvbnNvbGUubG9nKCQoXCIuXCIrcm93U2VsZWN0ZWQpLmZpbmQoXCIudXNlcm5hbWVcIikpXHJcbiAgICAgICAgICAvLyAkKCcub3B0aW9ucycpLnRyaWdnZXIoJ2NsaWNrJyk7XHJcbiAgICAgICAgICB1cGRhdGVMZXZlbDFUZW1wbGF0ZXMoKTtcclxuICAgICAgICAgIC8vIG9wdGlvbnNcclxuICAgICAgICB9XHJcbiAgICAgIH0pXHJcbiAgICB9XHJcbiAgfVxyXG59KVxyXG4iLCJmdW5jdGlvbiBzaG93Rmxhc2hNZXNzYWdlKG1lcywgdHlwZSwgc2VjcyA9IDIwMDApe1xyXG4gICAgdmFyIGVsZW0gPSAkKCcuanMtZmxhc2gnKTtcclxuICAgICQoZWxlbSkucmVtb3ZlQ2xhc3MoJ2FsZXJ0LWRhbmdlcicpLnJlbW92ZUNsYXNzKCdhbGVydC1zdWNjZXNzJylcclxuICAgICAgICAuYWRkQ2xhc3MoJ2ZsYXNoLW1lc3NhZ2UtLXNob3cnKVxyXG4gICAgICAgIC5hZGRDbGFzcygnYWxlcnQtJyArIHR5cGUpXHJcbiAgICAgICAgLmh0bWwobWVzKTtcclxuICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHVuc2hvd0ZsYXNoTWVzc2FnZSgpO1xyXG4gICAgfSwgc2Vjcyk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHVuc2hvd0ZsYXNoTWVzc2FnZSgpe1xyXG4gICAgdmFyIGVsZW0gPSAkKCcuanMtZmxhc2gnKTtcclxuICAgIGNvbnNvbGUubG9nKGVsZW0pO1xyXG4gICAgJChlbGVtKS5yZW1vdmVDbGFzcygnZmxhc2gtbWVzc2FnZS0tc2hvdycpO1xyXG59XHJcbiIsImZ1bmN0aW9uIGxvZ2luKGFfdXNlckxldmVsKXtcclxuICAkKCcubG9naW4tY29udGFpbmVyJykuYWRkQ2xhc3MoXCJoaWRkZW5cIik7XHJcbiAgJCgnLmxvZ2luLXN0YXR1cycpLnRleHQoXCJXZWxjb206IHVzZXJcIilcclxuICAkKCcubG9nb3V0JykucmVtb3ZlQ2xhc3MoXCJoaWRkZW5cIilcclxuICAkKCcuc2V0dGluZ3MnKS5yZW1vdmVDbGFzcyhcImhpZGRlblwiKVxyXG4gIGxvZ2dlZEluID0gdHJ1ZTtcclxuICB1c2VyTGV2ZWwgPSBhX3VzZXJMZXZlbDtcclxuXHJcbiAgJChcIi51c2VyLWxldmVsXCIpLmFkZENsYXNzKFwiaGlkZGVuXCIpXHJcbiAgJChcIi52aWV3XCIpLmFkZENsYXNzKFwiaGlkZGVuXCIpXHJcblxyXG4gIHN3aXRjaCAodXNlckxldmVsKSB7XHJcbiAgICBjYXNlIDE6XHJcbiAgICAgICQoXCIudXNlci1sZXZlbF8xXCIpLnJlbW92ZUNsYXNzKFwiaGlkZGVuXCIpXHJcbiAgICAgICQoXCIudmlld18xLTFcIikucmVtb3ZlQ2xhc3MoXCJoaWRkZW5cIilcclxuICAgICAgYnJlYWs7XHJcbiAgICBjYXNlIDI6XHJcbiAgICAgICQoXCIudXNlci1sZXZlbF8yXCIpLnJlbW92ZUNsYXNzKFwiaGlkZGVuXCIpXHJcbiAgICAgICQoXCIudmlld18yLTJcIikucmVtb3ZlQ2xhc3MoXCJoaWRkZW5cIilcclxuICAgICAgYnJlYWs7XHJcbiAgICBjYXNlIDM6XHJcbiAgICAgICQoXCIudXNlci1sZXZlbF8zXCIpLnJlbW92ZUNsYXNzKFwiaGlkZGVuXCIpXHJcbiAgICAgIGJyZWFrO1xyXG4gIH1cclxufVxyXG5cclxuZnVuY3Rpb24gbG9nb3V0KCl7XHJcbiAgJCgnLmxvZ2luLWNvbnRhaW5lcicpLnJlbW92ZUNsYXNzKFwiaGlkZGVuXCIpO1xyXG4gICQoJy5sb2dpbi1zdGF0dXMnKS50ZXh0KFwiVSBiZW50IG5vZyBuaWV0IGluZ2Vsb2dkXCIpXHJcbiAgJCgnLmxvZ291dCcpLmFkZENsYXNzKFwiaGlkZGVuXCIpXHJcbiAgJChcIi51c2VyLWxldmVsXCIpLmFkZENsYXNzKFwiaGlkZGVuXCIpXHJcbiAgJCgnLnNldHRpbmdzJykuYWRkQ2xhc3MoXCJoaWRkZW5cIilcclxuICBsb2dnZWRJbiA9IGZhbHNlO1xyXG4gIHVzZXJMZXZlbCA9IDA7XHJcblxyXG4gICQucG9zdChcImluY2x1ZGUvbG9naW4ucGhwXCIse1xyXG4gICAgICBsb2dvdXRTdWI6ICcnXHJcbiAgfSwgZnVuY3Rpb24ocmVzcG9uc2Usc3RhdHVzKXtcclxuICAgICAgc2hvd0ZsYXNoTWVzc2FnZSgnSmUgYmVudCB1aXRnZWxvZ2QnLCAnc3VjY2VzcycpO1xyXG4gIH0pXHJcbn1cclxuXHJcbmZ1bmN0aW9uIHVwZGF0ZUxldmVsMVRlbXBsYXRlcygpe1xyXG4gICQucG9zdChcImluY2x1ZGUvZ2V0VXNlcnMucGhwXCIse1xyXG4gIH0sIGZ1bmN0aW9uKHJlc3BvbnNlLHN0YXR1cyl7XHJcbiAgICAvLyBjb25zb2xlLmxvZyhyZXNwb25zZSlcclxuICAgIHVzZXJzID0gSlNPTi5wYXJzZShyZXNwb25zZSlcclxuXHJcbiAgICBmb3IodmFyIGkgPSAwOyBpIDwgMjsgaSsrKXtcclxuICAgICAgLy8gY29uc29sZS5sb2coaSlcclxuICAgICAgdXNlcnMubWFwKGZ1bmN0aW9uKGNwLGope1xyXG4gICAgICAgIGNwLmluZGV4ID0gY3AuaWQ7XHJcbiAgICAgICAgLy8gY29uc29sZS5sb2coaSlcclxuICAgICAgICBpZihpID09IDApe1xyXG4gICAgICAgICAgY3AuY2xhc3MgPSBcImVkaXRcIlxyXG4gICAgICAgICAgY3AuY2xhc3NUZXh0ID0gXCJhYW5wYXNzZW5cIlxyXG4gICAgICAgIH1lbHNlIGlmKGkgPT0gMSl7XHJcbiAgICAgICAgICBjcC5jbGFzcyA9IFwiZGVsZXRlXCJcclxuICAgICAgICAgIGNwLmNsYXNzVGV4dCA9IFwidmVyd2lqZGVyZW5cIlxyXG4gICAgICAgIH1cclxuICAgICAgfSlcclxuXHJcbiAgICAgIGZvcih2YXIgaiA9IDA7IGogPCB1c2Vycy5sZW5ndGg7IGorKyl7XHJcbiAgICAgICAgaWYodXNlcnNbal0udXNlcmxldmVsID09IDEpe1xyXG4gICAgICAgICAgdXNlcnMuc3BsaWNlKGosMSlcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIC8vIGNvbnNvbGUubG9nKHVzZXJzKVxyXG5cclxuICAgICAgdmFyIHRlbXBsYXRlID0gJChcIi5sZXZlbDEtdXNlci10ZW1wbGF0ZVwiKS5odG1sKCk7XHJcbiAgICAgIHZhciByZW5kZXJUZW1wbGF0ZSA9IE11c3RhY2hlLnJlbmRlcih0ZW1wbGF0ZSwgdXNlcnMpO1xyXG5cclxuICAgICAgaWYoaSA9PSAwKXtcclxuICAgICAgICAkKFwiLnVzZXItbGV2ZWwxLWVkaXRcIikuaHRtbChyZW5kZXJUZW1wbGF0ZSk7XHJcbiAgICAgIH1lbHNlIGlmKGkgPT0gMSl7XHJcbiAgICAgICAgJChcIi51c2VyLWxldmVsMS1kZWxldGVcIikuaHRtbChyZW5kZXJUZW1wbGF0ZSk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9KVxyXG59XHJcbiIsInZhciBsb2dnZWRJbiA9IGZhbHNlO1xyXG52YXIgdXNlckxldmVsID0gMDtcclxudmFyIGxvZ2dlZEluVXNlciA9IFtdO1xyXG52YXIgdXNlcnMgPSBbXTtcclxuJChkb2N1bWVudCkucmVhZHkoZnVuY3Rpb24oKXtcclxuICBjb25zb2xlLmxvZyhcImhvbWUuanMgbG9hZGVkXCIpXHJcbiAgJCgnYm9keScpLm9uKCdjbGljaycsICcubWVudS1pdGVtJywgZnVuY3Rpb24oKXtcclxuICAgIHZhciBpZCA9ICQodGhpcykuYXR0cihcImNsYXNzXCIpLnNwbGl0KCdfJylbMV07XHJcbiAgICBjb25zb2xlLmxvZyhpZClcclxuXHJcbiAgICAkKCcudmVyZGllcGluZycpLmFkZENsYXNzKFwiaGlkZGVuXCIpXHJcbiAgICAkKCcudmVyZGllcGluZ19fJytpZCkucmVtb3ZlQ2xhc3MoXCJoaWRkZW5cIilcclxuICB9KVxyXG5cclxuICAkKCdib2R5Jykub24oJ2NsaWNrJywgJy5sb2dpbicsIGZ1bmN0aW9uKCl7XHJcbiAgICBjb25zb2xlLmxvZygkKCcudXNlcm5hbWUnKS52YWwoKS50b0xvd2VyQ2FzZSgpKVxyXG4gICAgY29uc29sZS5sb2coJCgnLnBhc3N3b3JkJykudmFsKCkudG9Mb3dlckNhc2UoKSlcclxuXHJcbiAgICAkLnBvc3QoXCJpbmNsdWRlL2xvZ2luLnBocFwiICx7XHJcbiAgICAgIGxvZ2luU3ViOiBcIlwiLFxyXG4gICAgICB1c2VybmFtZTogJCgnLnVzZXJuYW1lJykudmFsKCkudG9Mb3dlckNhc2UoKSxcclxuICAgICAgcGFzc3dvcmQ6ICQoJy5wYXNzd29yZCcpLnZhbCgpXHJcbiAgICB9LCBmdW5jdGlvbihyZXNwb25zZSxzdGF0dXMpe1xyXG4gICAgICB2YXIgZGF0YSA9IEpTT04ucGFyc2UocmVzcG9uc2UpO1xyXG4gICAgICBjb25zb2xlLmxvZyhkYXRhKTtcclxuICAgICAgbG9nZ2VkSW5Vc2VyID0gZGF0YTtcclxuICAgICAgaWYgKGRhdGEubG9nZ2VkSW4gPT0gMSkge1xyXG4gICAgICAgICAgbG9naW4oZGF0YS5sZXZlbCk7XHJcbiAgICAgICAgICBzaG93Rmxhc2hNZXNzYWdlKCdVIGJlbnQgc3VjY2Vzdm9sIGluZ2Vsb2dkJywgJ3N1Y2Nlc3MnKVxyXG4gICAgICB9XHJcbiAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgc2hvd0ZsYXNoTWVzc2FnZSgnVXcgZ2VicnVpa2Vyc25hYW0gb2Ygd2FjaHR3b29yZCBpcyBpbmNvcnJlY3QnLCAnZGFuZ2VyJylcclxuICAgICAgfVxyXG4gICAgfSlcclxuICB9KVxyXG5cclxuICAkKCdib2R5Jykub24oJ2NsaWNrJywgJy5sb2dvdXQnLCBmdW5jdGlvbigpe1xyXG4gICAgbG9nb3V0KCk7XHJcbiAgfSlcclxuXHJcbiAgJCgnYm9keScpLm9uKCdjbGljaycsICcubG9rYWFsJywgZnVuY3Rpb24oKXtcclxuICAgIGNvbnNvbGUubG9nKGxvZ2dlZEluKVxyXG4gICAgaWYobG9nZ2VkSW4gPT0gdHJ1ZSl7XHJcblxyXG4gICAgICBjb25zb2xlLmxvZygkKHRoaXMpLmF0dHIoXCJjbGFzc1wiKS5zcGxpdChcIiBcIilbMF0pXHJcbiAgICB9XHJcbiAgfSlcclxuXHJcbiAgJChkb2N1bWVudCkua2V5cHJlc3MoZnVuY3Rpb24oZSkge1xyXG4gICAgICBpZihlLndoaWNoID09IDEzKSB7XHJcbiAgICAgICAgICBpZiAoIWxvZ2dlZEluKSB7XHJcbiAgICAgICAgICAgICAgJCgnLmxvZ2luJykudHJpZ2dlcignY2xpY2snKTtcclxuICAgICAgICAgIH1cclxuICAgICAgfVxyXG4gIH0pO1xyXG59KVxyXG4iLCIkKFwiYm9keVwiKS5vbihcImNsaWNrXCIsIFwiLm5ldy11c2VyXCIsZnVuY3Rpb24oKXtcclxuICBpZigkKFwiLm5ldy11c2VyLW5hbWVcIikudmFsKCkgPT0gXCJcIiB8fCAkKFwiLm5ldy11c2VyLXBhc3N3b3JkXCIpLnZhbCgpID09IFwiXCIgfHwgJChcIi5uZXctdXNlci1sZXZlbFwiKS52YWwoKSA9PSBudWxsKXtcclxuICAgIGNvbnNvbGUubG9nKFwiZ2VlbiBnZWJydWlrZXJzbmFhbSwgd2FjaHR3b29yZCBvZiBsZXZlbCBnZXNlbGVjdGVlcmRcIilcclxuICB9ZWxzZXtcclxuICAgIGNvbnNvbGUubG9nKCQoXCIubmV3LXVzZXItbGV2ZWxcIikudmFsKCkpXHJcbiAgICAkLnBvc3QoXCJpbmNsdWRlL2FkZFVzZXIucGhwXCIse1xyXG4gICAgICB1c2VybmFtZTogJChcIi5uZXctdXNlci1uYW1lXCIpLnZhbCgpLFxyXG4gICAgICB1c2VycGFzc3dvcmQ6ICQoXCIubmV3LXVzZXItcGFzc3dvcmRcIikudmFsKCksXHJcbiAgICAgIHVzZXJsZXZlbDogJChcIi5uZXctdXNlci1sZXZlbFwiKS52YWwoKVxyXG4gICAgfSwgZnVuY3Rpb24ocmVzcG9uc2Usc3RhdHVzKXtcclxuICAgICAgY29uc29sZS5sb2cocmVzcG9uc2UpXHJcbiAgICB9KVxyXG4gIH1cclxufSlcclxuIiwiJChcImJvZHlcIikub24oXCJjbGlja1wiLCBcIi5vcHRpb25zXCIsIGZ1bmN0aW9uKCl7XHJcbiAgdmFyIGxldmVsID0gJCh0aGlzKS5hdHRyKFwiY2xhc3NcIikuc3BsaXQoXCIgXCIpWzFdLnNwbGl0KFwiX1wiKVsxXTtcclxuICB2YXIgb3B0aW9uID0gJCh0aGlzKS5hdHRyKFwiY2xhc3NcIikuc3BsaXQoXCIgXCIpWzJdLnNwbGl0KFwiX1wiKVsxXTtcclxuICBjb25zb2xlLmxvZyhsZXZlbClcclxuXHJcbiAgJChcIi52aWV3XCIpLmFkZENsYXNzKFwiaGlkZGVuXCIpXHJcbiAgJChcIi52aWV3X1wiK2xldmVsK1wiLVwiK29wdGlvbikucmVtb3ZlQ2xhc3MoXCJoaWRkZW5cIilcclxuXHJcbiAgc3dpdGNoIChsZXZlbCkge1xyXG4gICAgY2FzZSBcIjFcIjpcclxuICAgICAgdXBkYXRlTGV2ZWwxVGVtcGxhdGVzKCk7XHJcbiAgICAgIGJyZWFrO1xyXG4gIH1cclxufSlcclxuIiwiJChkb2N1bWVudCkucmVhZHkoZnVuY3Rpb24oKXtcclxuICAgICQucG9zdChcImluY2x1ZGUvcmV0dXJuU2Vzc2lvbi5waHBcIix7XHJcbiAgICB9LCBmdW5jdGlvbihyZXNwb25zZSxzdGF0dXMpe1xyXG4gICAgICAgIHZhciBkYXRhID0gSlNPTi5wYXJzZShyZXNwb25zZSk7XHJcbiAgICAgICAgaWYgKGRhdGEubG9nZ2VkSW4pIHtcclxuICAgICAgICAgICAgbG9naW4oZGF0YS5sZXZlbCk7XHJcbiAgICAgICAgICAgIGxvZ2dlZEluVXNlciA9IGRhdGE7XHJcbiAgICAgICAgfVxyXG4gICAgfSlcclxufSk7XHJcbiIsIiQoXCIuc2V0dGluZ3MtaW5wdXRzXCIpLmtleXByZXNzKGZ1bmN0aW9uKGUpIHtcclxuICBjb25zb2xlLmxvZyhcImVudGVyXCIpXHJcbiAgICBpZihlLndoaWNoID09IDEzKSB7XHJcbiAgICAgICQoJy5zZXR0aW5ncy11cGRhdGUnKS50cmlnZ2VyKCdjbGljaycpO1xyXG4gICAgfVxyXG59KTtcclxuXHJcbiQoJ2JvZHknKS5vbignY2xpY2snLCAnLnNldHRpbmdzJywgZnVuY3Rpb24oKXtcclxuICBjb25zb2xlLmxvZyhcInNldHRpbmdzXCIpXHJcbiAgJCgnLnNldHRpbmdzLXVzZXJuYW1lJykudmFsKGxvZ2dlZEluVXNlci51c2VybmFtZSlcclxuICAkKCcudXNlci1zZXR0aW5ncycpLm1vZGFsKCdzaG93Jyk7XHJcbiAgY29uc29sZS5sb2cobG9nZ2VkSW5Vc2VyLnVzZXJuYW1lKVxyXG59KVxyXG5cclxuJCgnYm9keScpLm9uKCdjbGljaycsICcuc2V0dGluZ3MtdXBkYXRlJywgZnVuY3Rpb24oKXtcclxuICBjb25zb2xlLmxvZyhcInVwZGF0ZVwiKVxyXG4gIGNvbnNvbGUubG9nKCQoJy5zZXR0aW5ncy11c2VybmFtZScpLnZhbCgpKVxyXG4gIGNvbnNvbGUubG9nKCQoJy5zZXR0aW5ncy1wYXNzd29yZCcpLnZhbCgpKVxyXG4gIGNvbnNvbGUubG9nKCQoJy5zZXR0aW5ncy1yZXBlYXQtcGFzc3dvcmQnKS52YWwoKSlcclxuXHJcbiAgaWYoJCgnLnNldHRpbmdzLXVzZXJuYW1lJykudmFsKCkgPT0gXCJcIiAmJiAkKCcuc2V0dGluZ3MtcGFzc3dvcmQnKS52YWwoKSA9PSBcIlwiICYmICQoJy5zZXR0aW5ncy1yZXBlYXQtcGFzc3dvcmQnKS52YWwoKSA9PSBcIlwiKXtcclxuICAgIGNvbnNvbGUubG9nKFwiZ2VicnVpa2Vyc25hYW0gZW4gd2FjaHR3b29yZCBtb2dlbiBuaWV0IGxlZWcgemlqblwiKTtcclxuICB9ZWxzZXtcclxuICAgIGlmKCQoJy5zZXR0aW5ncy1wYXNzd29yZCcpLnZhbCgpICE9ICQoJy5zZXR0aW5ncy1yZXBlYXQtcGFzc3dvcmQnKS52YWwoKSl7XHJcbiAgICAgIGNvbnNvbGUubG9nKFwid2FjaHR3b29yZGVuIHppam4gbmlldCBnZWxpamsgYWFuIGVsa2FhclwiKVxyXG4gICAgfWVsc2V7XHJcbiAgICAgIGNvbnNvbGUubG9nKGxvZ2dlZEluVXNlcilcclxuICAgICAgJC5wb3N0KFwiaW5jbHVkZS91cGRhdGVVc2VyLnBocFwiICx7XHJcbiAgICAgICAgaWQ6IGxvZ2dlZEluVXNlci51c2VySUQsXHJcbiAgICAgICAgbmFtZTogJCgnLnNldHRpbmdzLXVzZXJuYW1lJykudmFsKCksXHJcbiAgICAgICAgcGFzczogJCgnLnNldHRpbmdzLXBhc3N3b3JkJykudmFsKClcclxuICAgICAgfSwgZnVuY3Rpb24ocmVzcG9uc2Usc3RhdHVzKXtcclxuICAgICAgICAgIGNvbnNvbGUubG9nKHJlc3BvbnNlKTtcclxuICAgICAgICBpZihyZXNwb25zZSA9PSBcInN1Y2Nlc1wiKXtcclxuICAgICAgICAkKCcudXNlci1zZXR0aW5ncycpLm1vZGFsKCdoaWRlJyk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9KVxyXG4gICAgfVxyXG4gIH1cclxufSlcclxuIl19
