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
                    showFlashMessage('Scenario succesvol toegevoegd', 'success');
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
  if(loggedInUser.level == 3 && !alertActive && loggedIn == true){
    console.log("open")
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
  console.log("close")
  if(loggedInUser.level == 3 && loggedIn == true){
    alertActive = false;
  }
})

$('body').on('click', '.level2-btn-delete',function(){
  var rowClass = $(this).parent().parent().attr("class");
  var row = $(this).parent().parent().attr("class").split("index")[1];
  for(var i = 0; i < scenarios.length; i++){
    if(scenarios[i].id == row){
      $.post("include/deleteScenarios.php" ,{
        id: scenarios[i].id
      }, function(response,status){
        console.log(response)
        if(response == "successuccessucces"){
          console.log(rowClass)
          scenarios.splice(i,1)
          $("."+rowClass).remove();
          updateLevel2Templates();
        }
      })
    }
  }
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
var descriptions = [];
$('body').on('click', '.level2-btn-edit', function(){
  rowSelected = $(this).parent().parent().attr("class");
  for (var i = 0; i < scenarios.length; i++){
    if(scenarios[i].id == rowSelected.split("index")[1]){
      index = i
    }
  }

  $.post("include/getScenerioDesc.php" ,{
    id: scenarios[index].id
  }, function(response,status){
    descriptions = JSON.parse(response)

    descriptions.map(function(cp,i){
      cp.index = i+1;
    })
    console.log(descriptions)

    var template = $(".level2-scenario-edit-template").html();
    var renderTemplate = Mustache.render(template, descriptions);

    $(".scenario-edit-options-container").html(renderTemplate);

    $('.scenario-edit').modal('show');
    $('.update-scenarios-name').val(scenarios[index].name)
  })
})

$('body').on('click', '.update-scenarios-update', function(){
  console.log("update")
  $('.scenario-edit').modal('hide');
})

$('body').on('click', '.js-scenario-edit-delete',function(){
    var parent = $(this).closest('.js-scenario-edit-step');
    if (!$(parent).is(':first-child')) {
        $(parent).remove();
        updateSteps();
    }
    else {
        showFlashMessage('Je kunt niet de eerste stap verwijderen', 'danger');
    }
});

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
  $('.login-status').text("Welkom: "+loggedInUser.username + "    ")
  $('.logout').removeClass("hidden")
  loggedIn = true;
  userLevel = a_userLevel;

  $(".user-level").addClass("hidden")
  $(".view").addClass("hidden")

  switch (userLevel) {
    case 1:
      $(".user-level_1").removeClass("hidden")
      $(".view_1-1").removeClass("hidden")
      $(".option_1").addClass("options--active")
      $('.settings').removeClass("hidden")
      updateLevel1Templates();
      break;
    case 2:
      $(".user-level_2").removeClass("hidden")
      $(".view_2-1").removeClass("hidden")
      $(".option_1").addClass("options--active")
      $('.settings').removeClass("hidden")
      updateLevel2Templates();
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
  console.log("logout")

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

function updateLevel2Templates(){
  $.post("include/getScenarios.php",{
  }, function(response,status){
    scenarios = JSON.parse(response)
    console.log(scenarios)

    $('.scenario-selector').html("")
    for(var i = 0 ; i < scenarios.length; i++){
      console.log(scenarios[i].name)
      $('.scenario-selector').append("<option>" + scenarios[i].name + "</option>")
    }

    // for(var i = 0; i < 2; i++){

      var template = $(".level2-scenario-template").html();
      var renderTemplate = Mustache.render(template, scenarios);

      $(".js-scenario-container").html(renderTemplate);
    // }
  })
}

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

$('body').on('click', '.lokaal', function(){
    console.log(loggedIn)
    if(loggedIn == true){
        var lokaalnr = $(this).attr("class").split(" ")[0];
        $('.js-lokaal').html(lokaalnr);
    }
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
  $('.options').removeClass('options--active');
  $(this).addClass('options--active');
  switch (level) {
    case "1":
      updateLevel1Templates();
      break;
    case "2":
      updateLevel2Templates();
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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFkZFNjZW5hcmlvLmpzIiwiY2hlY2tBbGVydC5qcyIsImRlbGV0ZS1zY2VuYXJpby5qcyIsImRlbGV0ZS11c2VyLmpzIiwiZWRpdC1zY2VuYXJpby5qcyIsImVkaXQtdXNlci5qcyIsImZsYXNoLW1lc3NhZ2UuanMiLCJmdW5jdGlvbnMuanMiLCJob21lLmpzIiwibWFrZUFjdGl2ZVNjZW5hcmlvLmpzIiwibmV3LXVzZXIuanMiLCJvcHRpb25zLmpzIiwic2Vzc2lvbkNoZWNrLmpzIiwic2V0dGluZ3MuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMzRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3RCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDbkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDbEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUM5Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDckRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNoQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNsSEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDM0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNQQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNkQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2xCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDVkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJtYWluLmpzIiwic291cmNlc0NvbnRlbnQiOlsiJCgnYm9keScpLm9uKCdwcm9wZXJ0eWNoYW5nZSBpbnB1dCcsICcuanMtbmV3c3RlcCcsZnVuY3Rpb24oZSl7XHJcbiAgICB2YXIgcGFyZW50ID0gJCh0aGlzKS5jbG9zZXN0KCcuanMtc3RlcCcpXHJcbiAgICBpZiAoJChwYXJlbnQpLmlzKCc6bGFzdC1jaGlsZCcpKSB7XHJcbiAgICAgICAgdmFyIG5yc3RyID0gJCgnLmpzLWxhc3RucicpLmh0bWwoKTtcclxuICAgICAgICB2YXIgbmV3bnIgPSBwYXJzZUludChucnN0cikgKyAxO1xyXG4gICAgICAgICQoJy5qcy1sYXN0bnInKS5yZW1vdmVDbGFzcygnanMtbGFzdG5yJyk7XHJcbiAgICAgICAgJCgnLmpzLWNvcHlzdGVwJykuY2xvbmUoKS5hcHBlbmRUbygnLmpzLXN0ZXBzLWNvbnRhaW5lcicpXHJcbiAgICAgICAgLnJlbW92ZUNsYXNzKCdqcy1jb3B5c3RlcCcpLnJlbW92ZUNsYXNzKCdoaWRkZW4nKS5hZGRDbGFzcygnanMtc3RlcCcpXHJcbiAgICAgICAgLmZpbmQoJy5qcy1uZXducicpLnJlbW92ZUNsYXNzKCdqcy1uZXducicpLmFkZENsYXNzKCdqcy1sYXN0bnInKS5odG1sKG5ld25yKTtcclxuICAgICAgICB1cGRhdGVTdGVwcygpO1xyXG4gICAgfVxyXG59KTtcclxuZnVuY3Rpb24gdXBkYXRlU3RlcHMoKXtcclxuICAgIHZhciBjb3VudCA9IDE7XHJcbiAgICAkKCcuanMtc3RlcG5yJykuZWFjaChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgJCh0aGlzKS5odG1sKGNvdW50KTtcclxuICAgICAgICBjb3VudCsrO1xyXG4gICAgfSk7XHJcbn1cclxuJCgnYm9keScpLm9uKCdjbGljaycsICcuanMtYWRkc3RlcCcsZnVuY3Rpb24oKXtcclxuICAgIHZhciBucnN0ciA9ICQoJy5qcy1sYXN0bnInKS5odG1sKCk7XHJcbiAgICB2YXIgbmV3bnIgPSBwYXJzZUludChucnN0cikgKyAxO1xyXG4gICAgJCgnLmpzLWxhc3RucicpLnJlbW92ZUNsYXNzKCdqcy1sYXN0bnInKTtcclxuICAgICQoJy5qcy1jb3B5c3RlcCcpLmNsb25lKCkuYXBwZW5kVG8oJy5qcy1zdGVwcy1jb250YWluZXInKVxyXG4gICAgLnJlbW92ZUNsYXNzKCdqcy1jb3B5c3RlcCcpLnJlbW92ZUNsYXNzKCdoaWRkZW4nKS5hZGRDbGFzcygnanMtc3RlcCcpXHJcbiAgICAuZmluZCgnLmpzLW5ld25yJykucmVtb3ZlQ2xhc3MoJ2pzLW5ld25yJykuYWRkQ2xhc3MoJ2pzLWxhc3RucicpLmh0bWwobmV3bnIpO1xyXG4gICAgdXBkYXRlU3RlcHMoKTtcclxufSk7XHJcbiQoJ2JvZHknKS5vbignY2xpY2snLCAnLmpzLXNhdmUtbmV3LXNjZW5hcmlvJyxmdW5jdGlvbigpe1xyXG4gICAgdmFyIG5hbWUgPSAkKCcuanMtbmV3LXNjZW5hcmlvLW5hbWUnKS52YWwoKTtcclxuICAgIHZhciBzdGVwcyA9IFtdO1xyXG4gICAgaWYgKG5hbWUgPT0gJycpIHtcclxuICAgICAgICBzaG93Rmxhc2hNZXNzYWdlKCdWdWwgZWVyc3QgZWVuIG5hYW0gaW4nLCAnZGFuZ2VyJyk7XHJcbiAgICB9XHJcbiAgICBlbHNle1xyXG4gICAgICAgICQoJy5qcy1uZXdzdGVwJykuZWFjaChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHZhciB0ZW1wdmFsID0gJCh0aGlzKS52YWwoKTtcclxuICAgICAgICAgICAgaWYgKHRlbXB2YWwgIT0gXCJcIikge1xyXG4gICAgICAgICAgICAgICAgc3RlcHMucHVzaCh0ZW1wdmFsKTtcclxuXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgICAgICBpZiAoc3RlcHMubGVuZ3RoID09IDApIHtcclxuICAgICAgICAgICAgc2hvd0ZsYXNoTWVzc2FnZSgnVnVsIG1pbnN0ZW5zIDEgc3RhcCBpbicsICdkYW5nZXInKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZXtcclxuICAgICAgICAgICAgJC5wb3N0KFwiaW5jbHVkZS9zYXZlTmV3U2NlbmFyaW8ucGhwXCIgLHtcclxuICAgICAgICAgICAgICAgIG5hbWU6IG5hbWUsXHJcbiAgICAgICAgICAgICAgICBzdGVwczogc3RlcHNcclxuICAgICAgICAgICAgfSwgZnVuY3Rpb24ocmVzcG9uc2Usc3RhdHVzKXtcclxuICAgICAgICAgICAgICAgIGlmKHJlc3BvbnNlID09IFwic3VjY2VzXCIpe1xyXG4gICAgICAgICAgICAgICAgICAgIHNob3dGbGFzaE1lc3NhZ2UoJ1NjZW5hcmlvIHN1Y2Nlc3ZvbCB0b2VnZXZvZWdkJywgJ3N1Y2Nlc3MnKTtcclxuICAgICAgICAgICAgICAgICAgICAkKCcuanMtc3RlcHMtY29udGFpbmVyJykuaHRtbCgnJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgJCgnLmpzLW5ldy1zY2VuYXJpby1uYW1lJykudmFsKCcnKTtcclxuICAgICAgICAgICAgICAgICAgICAkKCcuanMtY29weXN0ZXAnKS5jbG9uZSgpLmFwcGVuZFRvKCcuanMtc3RlcHMtY29udGFpbmVyJylcclxuICAgICAgICAgICAgICAgICAgICAucmVtb3ZlQ2xhc3MoJ2pzLWNvcHlzdGVwJykucmVtb3ZlQ2xhc3MoJ2hpZGRlbicpXHJcbiAgICAgICAgICAgICAgICAgICAgLmFkZENsYXNzKCdqcy1zdGVwJykuYWRkQ2xhc3MoJ1VuaXF1ZXRlbXAnKVxyXG4gICAgICAgICAgICAgICAgICAgIC5maW5kKCcuanMtbmV3bnInKS5yZW1vdmVDbGFzcygnanMtbmV3bnInKS5hZGRDbGFzcygnanMtbGFzdG5yJykuaHRtbCgnMScpO1xyXG5cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSlcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn0pO1xyXG5cclxuJCgnYm9keScpLm9uKCdjbGljaycsICcuanMtZGVsZXRlLXN0ZXAnLGZ1bmN0aW9uKCl7XHJcbiAgICB2YXIgcGFyZW50ID0gJCh0aGlzKS5jbG9zZXN0KCcuanMtc3RlcCcpO1xyXG4gICAgaWYgKCEkKHBhcmVudCkuaXMoJzpmaXJzdC1jaGlsZCcpKSB7XHJcbiAgICAgICAgJChwYXJlbnQpLnJlbW92ZSgpO1xyXG4gICAgICAgIHVwZGF0ZVN0ZXBzKCk7XHJcbiAgICB9XHJcbiAgICBlbHNlIHtcclxuICAgICAgICBzaG93Rmxhc2hNZXNzYWdlKCdKZSBrdW50IG5pZXQgZGUgZWVyc3RlIHN0YXAgdmVyd2lqZGVyZW4nLCAnZGFuZ2VyJyk7XHJcbiAgICB9XHJcbn0pO1xyXG4iLCJmdW5jdGlvbiBjaGVja0FsZXJ0KCkge1xyXG4gIGlmKGxvZ2dlZEluVXNlci5sZXZlbCA9PSAzICYmICFhbGVydEFjdGl2ZSAmJiBsb2dnZWRJbiA9PSB0cnVlKXtcclxuICAgIGNvbnNvbGUubG9nKFwib3BlblwiKVxyXG4gICAgJC5wb3N0KFwiaW5jbHVkZS9nZXRTY2VuYXJpb3NBY3RpdmUucGhwXCIgLHtcclxuICAgIH0sIGZ1bmN0aW9uKHJlc3BvbnNlLHN0YXR1cyl7XHJcbiAgICAgIHJlc3BvbnNlID0gSlNPTi5wYXJzZShyZXNwb25zZSk7XHJcbiAgICAgIGlmKHJlc3BvbnNlLmxlbmd0aCA+IDApe1xyXG4gICAgICAgICQoJy5zY2VuYXJpbycpLm1vZGFsKCdzaG93Jyk7XHJcbiAgICAgICAgYWxlcnRBY3RpdmUgPSB0cnVlO1xyXG4gICAgICB9XHJcbiAgICB9KVxyXG4gIH1cclxuICBzZXRUaW1lb3V0KGNoZWNrQWxlcnQsIDEwMDApO1xyXG59XHJcbnNldFRpbWVvdXQoY2hlY2tBbGVydCwgMTAwMCk7XHJcblxyXG4kKCcuc2NlbmFyaW8nKS5vbignaGlkZGVuLmJzLm1vZGFsJywgZnVuY3Rpb24gKCkge1xyXG4gIGNvbnNvbGUubG9nKFwiY2xvc2VcIilcclxuICBpZihsb2dnZWRJblVzZXIubGV2ZWwgPT0gMyAmJiBsb2dnZWRJbiA9PSB0cnVlKXtcclxuICAgIGFsZXJ0QWN0aXZlID0gZmFsc2U7XHJcbiAgfVxyXG59KVxyXG4iLCIkKCdib2R5Jykub24oJ2NsaWNrJywgJy5sZXZlbDItYnRuLWRlbGV0ZScsZnVuY3Rpb24oKXtcclxuICB2YXIgcm93Q2xhc3MgPSAkKHRoaXMpLnBhcmVudCgpLnBhcmVudCgpLmF0dHIoXCJjbGFzc1wiKTtcclxuICB2YXIgcm93ID0gJCh0aGlzKS5wYXJlbnQoKS5wYXJlbnQoKS5hdHRyKFwiY2xhc3NcIikuc3BsaXQoXCJpbmRleFwiKVsxXTtcclxuICBmb3IodmFyIGkgPSAwOyBpIDwgc2NlbmFyaW9zLmxlbmd0aDsgaSsrKXtcclxuICAgIGlmKHNjZW5hcmlvc1tpXS5pZCA9PSByb3cpe1xyXG4gICAgICAkLnBvc3QoXCJpbmNsdWRlL2RlbGV0ZVNjZW5hcmlvcy5waHBcIiAse1xyXG4gICAgICAgIGlkOiBzY2VuYXJpb3NbaV0uaWRcclxuICAgICAgfSwgZnVuY3Rpb24ocmVzcG9uc2Usc3RhdHVzKXtcclxuICAgICAgICBjb25zb2xlLmxvZyhyZXNwb25zZSlcclxuICAgICAgICBpZihyZXNwb25zZSA9PSBcInN1Y2Nlc3N1Y2Nlc3N1Y2Nlc1wiKXtcclxuICAgICAgICAgIGNvbnNvbGUubG9nKHJvd0NsYXNzKVxyXG4gICAgICAgICAgc2NlbmFyaW9zLnNwbGljZShpLDEpXHJcbiAgICAgICAgICAkKFwiLlwiK3Jvd0NsYXNzKS5yZW1vdmUoKTtcclxuICAgICAgICAgIHVwZGF0ZUxldmVsMlRlbXBsYXRlcygpO1xyXG4gICAgICAgIH1cclxuICAgICAgfSlcclxuICAgIH1cclxuICB9XHJcbn0pXHJcbiIsIiQoJ2JvZHknKS5vbignY2xpY2snLCAnLmxldmVsMS1idG4tZGVsZXRlJyxmdW5jdGlvbigpe1xyXG4gIHZhciByb3dDbGFzcyA9ICQodGhpcykucGFyZW50KCkucGFyZW50KCkuYXR0cihcImNsYXNzXCIpO1xyXG4gIHZhciByb3cgPSAkKHRoaXMpLnBhcmVudCgpLnBhcmVudCgpLmF0dHIoXCJjbGFzc1wiKS5zcGxpdChcImluZGV4XCIpWzFdO1xyXG4gIGNvbnNvbGUubG9nKHVzZXJzKVxyXG4gIGZvcih2YXIgaSA9IDA7IGkgPCB1c2Vycy5sZW5ndGg7IGkrKyl7XHJcbiAgICBpZih1c2Vyc1tpXS5pZCA9PSByb3cpe1xyXG4gICAgICAkLnBvc3QoXCJpbmNsdWRlL2RlbGV0ZVVzZXIucGhwXCIgLHtcclxuICAgICAgICBpZDogdXNlcnNbaV0uaWRcclxuICAgICAgfSwgZnVuY3Rpb24ocmVzcG9uc2Usc3RhdHVzKXtcclxuICAgICAgICBpZihyZXNwb25zZSA9PSBcInN1Y2Nlc1wiKXtcclxuICAgICAgICAgIGNvbnNvbGUubG9nKHJvd0NsYXNzKVxyXG4gICAgICAgICAgY29uc29sZS5sb2coJ2FzZCcpO1xyXG4gICAgICAgICAgJChcIi5cIityb3dDbGFzcykucmVtb3ZlKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9KVxyXG4gICAgfVxyXG4gIH1cclxufSlcclxuIiwidmFyIHJvd1NlbGVjdGVkID0gMDtcclxudmFyIGluZGV4ID0gMDtcclxudmFyIGRlc2NyaXB0aW9ucyA9IFtdO1xyXG4kKCdib2R5Jykub24oJ2NsaWNrJywgJy5sZXZlbDItYnRuLWVkaXQnLCBmdW5jdGlvbigpe1xyXG4gIHJvd1NlbGVjdGVkID0gJCh0aGlzKS5wYXJlbnQoKS5wYXJlbnQoKS5hdHRyKFwiY2xhc3NcIik7XHJcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBzY2VuYXJpb3MubGVuZ3RoOyBpKyspe1xyXG4gICAgaWYoc2NlbmFyaW9zW2ldLmlkID09IHJvd1NlbGVjdGVkLnNwbGl0KFwiaW5kZXhcIilbMV0pe1xyXG4gICAgICBpbmRleCA9IGlcclxuICAgIH1cclxuICB9XHJcblxyXG4gICQucG9zdChcImluY2x1ZGUvZ2V0U2NlbmVyaW9EZXNjLnBocFwiICx7XHJcbiAgICBpZDogc2NlbmFyaW9zW2luZGV4XS5pZFxyXG4gIH0sIGZ1bmN0aW9uKHJlc3BvbnNlLHN0YXR1cyl7XHJcbiAgICBkZXNjcmlwdGlvbnMgPSBKU09OLnBhcnNlKHJlc3BvbnNlKVxyXG5cclxuICAgIGRlc2NyaXB0aW9ucy5tYXAoZnVuY3Rpb24oY3AsaSl7XHJcbiAgICAgIGNwLmluZGV4ID0gaSsxO1xyXG4gICAgfSlcclxuICAgIGNvbnNvbGUubG9nKGRlc2NyaXB0aW9ucylcclxuXHJcbiAgICB2YXIgdGVtcGxhdGUgPSAkKFwiLmxldmVsMi1zY2VuYXJpby1lZGl0LXRlbXBsYXRlXCIpLmh0bWwoKTtcclxuICAgIHZhciByZW5kZXJUZW1wbGF0ZSA9IE11c3RhY2hlLnJlbmRlcih0ZW1wbGF0ZSwgZGVzY3JpcHRpb25zKTtcclxuXHJcbiAgICAkKFwiLnNjZW5hcmlvLWVkaXQtb3B0aW9ucy1jb250YWluZXJcIikuaHRtbChyZW5kZXJUZW1wbGF0ZSk7XHJcblxyXG4gICAgJCgnLnNjZW5hcmlvLWVkaXQnKS5tb2RhbCgnc2hvdycpO1xyXG4gICAgJCgnLnVwZGF0ZS1zY2VuYXJpb3MtbmFtZScpLnZhbChzY2VuYXJpb3NbaW5kZXhdLm5hbWUpXHJcbiAgfSlcclxufSlcclxuXHJcbiQoJ2JvZHknKS5vbignY2xpY2snLCAnLnVwZGF0ZS1zY2VuYXJpb3MtdXBkYXRlJywgZnVuY3Rpb24oKXtcclxuICBjb25zb2xlLmxvZyhcInVwZGF0ZVwiKVxyXG4gICQoJy5zY2VuYXJpby1lZGl0JykubW9kYWwoJ2hpZGUnKTtcclxufSlcclxuXHJcbiQoJ2JvZHknKS5vbignY2xpY2snLCAnLmpzLXNjZW5hcmlvLWVkaXQtZGVsZXRlJyxmdW5jdGlvbigpe1xyXG4gICAgdmFyIHBhcmVudCA9ICQodGhpcykuY2xvc2VzdCgnLmpzLXNjZW5hcmlvLWVkaXQtc3RlcCcpO1xyXG4gICAgaWYgKCEkKHBhcmVudCkuaXMoJzpmaXJzdC1jaGlsZCcpKSB7XHJcbiAgICAgICAgJChwYXJlbnQpLnJlbW92ZSgpO1xyXG4gICAgICAgIHVwZGF0ZVN0ZXBzKCk7XHJcbiAgICB9XHJcbiAgICBlbHNlIHtcclxuICAgICAgICBzaG93Rmxhc2hNZXNzYWdlKCdKZSBrdW50IG5pZXQgZGUgZWVyc3RlIHN0YXAgdmVyd2lqZGVyZW4nLCAnZGFuZ2VyJyk7XHJcbiAgICB9XHJcbn0pO1xyXG4iLCJ2YXIgcm93U2VsZWN0ZWQgPSAwO1xyXG52YXIgaW5kZXggPSAwO1xyXG4kKCdib2R5Jykub24oJ2NsaWNrJywgJy5sZXZlbDEtYnRuLWVkaXQnLCBmdW5jdGlvbigpe1xyXG4gIHJvd1NlbGVjdGVkID0gJCh0aGlzKS5wYXJlbnQoKS5wYXJlbnQoKS5hdHRyKFwiY2xhc3NcIik7XHJcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCB1c2Vycy5sZW5ndGg7IGkrKyl7XHJcbiAgICBpZih1c2Vyc1tpXS5pZCA9PSByb3dTZWxlY3RlZC5zcGxpdChcImluZGV4XCIpWzFdKXtcclxuICAgICAgaW5kZXggPSBpXHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICAkKCcudXBkYXRlLXVzZXJzJykubW9kYWwoJ3Nob3cnKTtcclxuICAkKCcudXBkYXRlLXVzZXJzLXVzZXJuYW1lJykudmFsKHVzZXJzW2luZGV4XS51c2VybmFtZSlcclxuICAkKCcudXBkYXRlLXVzZXItb3B0aW9ucycpLnJlbW92ZUF0dHIoXCJzZWxlY3RlZFwiKVxyXG5cclxuICBpZih1c2Vyc1tpbmRleF0udXNlcmxldmVsID09IDIpe1xyXG4gICAgJCgnLnVwZGF0ZS11c2VyLW9wdGlvbjInKS5hdHRyKFwic2VsZWN0ZWRcIixcInNlbGVjdGVkXCIpXHJcbiAgfWVsc2V7XHJcbiAgICAkKCcudXBkYXRlLXVzZXItb3B0aW9uMScpLmF0dHIoXCJzZWxlY3RlZFwiLFwic2VsZWN0ZWRcIilcclxuICB9XHJcbn0pXHJcblxyXG4kKCdib2R5Jykub24oJ2NsaWNrJywgJy51cGRhdGUtdXNlcnMtdXBkYXRlJywgZnVuY3Rpb24oKXtcclxuICBjb25zb2xlLmxvZyhcInVwZGF0ZVwiKVxyXG4gIGNvbnNvbGUubG9nKCQoJy51cGRhdGUtdXNlcnMtdXNlcm5hbWUnKS52YWwoKSlcclxuICBjb25zb2xlLmxvZygkKCcudXBkYXRlLXVzZXJzLXBhc3N3b3JkJykudmFsKCkpXHJcbiAgY29uc29sZS5sb2coJCgnLnVwZGF0ZS11c2Vycy1yZXBlYXQtcGFzc3dvcmQnKS52YWwoKSlcclxuXHJcbiAgaWYoJCgnLnVwZGF0ZS11c2Vycy11c2VybmFtZScpLnZhbCgpID09IFwiXCIgJiYgJCgnLnVwZGF0ZS11c2Vycy1wYXNzd29yZCcpLnZhbCgpID09IFwiXCIgJiYgJCgnLnVwZGF0ZS11c2Vycy1yZXBlYXQtcGFzc3dvcmQnKS52YWwoKSA9PSBcIlwiKXtcclxuICAgIGNvbnNvbGUubG9nKFwiZ2VicnVpa2Vyc25hYW0gZW4gd2FjaHR3b29yZCBtb2dlbiBuaWV0IGxlZWcgemlqblwiKTtcclxuICB9ZWxzZXtcclxuICAgIGlmKCQoJy51cGRhdGUtdXNlcnMtcGFzc3dvcmQnKS52YWwoKSAhPSAkKCcudXBkYXRlLXVzZXJzLXJlcGVhdC1wYXNzd29yZCcpLnZhbCgpKXtcclxuICAgICAgY29uc29sZS5sb2coXCJ3YWNodHdvb3JkZW4gemlqbiBuaWV0IGdlbGlqayBhYW4gZWxrYWFyXCIpXHJcbiAgICB9ZWxzZXtcclxuICAgICAgLy8gY29uc29sZS5sb2codXNlcnNbcm93U2VsZWN0ZWQuc3BsaXQoXCJpbmRleFwiKVsxXV0pXHJcbiAgICAgICQucG9zdChcImluY2x1ZGUvdXBkYXRlVXNlci5waHBcIiAse1xyXG4gICAgICAgIGlkOiB1c2Vyc1tpbmRleF0uaWQsXHJcbiAgICAgICAgbmFtZTogJCgnLnVwZGF0ZS11c2Vycy11c2VybmFtZScpLnZhbCgpLFxyXG4gICAgICAgIHBhc3M6ICQoJy51cGRhdGUtdXNlcnMtcGFzc3dvcmQnKS52YWwoKSxcclxuICAgICAgICBsZXZlbDogJCgnLnVwZGF0ZS11c2VyLWxldmVsJykudmFsKClcclxuICAgICAgfSwgZnVuY3Rpb24ocmVzcG9uc2Usc3RhdHVzKXtcclxuICAgICAgICBjb25zb2xlLmxvZyhyZXNwb25zZSlcclxuICAgICAgICBpZihyZXNwb25zZSA9PSBcInN1Y2Nlc1wiKXtcclxuICAgICAgICAgICQoJy51cGRhdGUtdXNlcnMnKS5tb2RhbCgnaGlkZScpO1xyXG4gICAgICAgICAgdXNlcnNbaW5kZXhdLnVzZXJuYW1lID0gJCgnLnVwZGF0ZS11c2Vycy11c2VybmFtZScpLnZhbCgpO1xyXG4gICAgICAgICAgY29uc29sZS5sb2coJChcIi5cIityb3dTZWxlY3RlZCkuZmluZChcIi51c2VybmFtZVwiKSlcclxuICAgICAgICAgIC8vICQoJy5vcHRpb25zJykudHJpZ2dlcignY2xpY2snKTtcclxuICAgICAgICAgIHVwZGF0ZUxldmVsMVRlbXBsYXRlcygpO1xyXG4gICAgICAgICAgLy8gb3B0aW9uc1xyXG4gICAgICAgIH1cclxuICAgICAgfSlcclxuICAgIH1cclxuICB9XHJcbn0pXHJcbiIsImZ1bmN0aW9uIHNob3dGbGFzaE1lc3NhZ2UobWVzLCB0eXBlLCBzZWNzID0gMjAwMCl7XHJcbiAgICB2YXIgZWxlbSA9ICQoJy5qcy1mbGFzaCcpO1xyXG4gICAgJChlbGVtKS5yZW1vdmVDbGFzcygnYWxlcnQtZGFuZ2VyJykucmVtb3ZlQ2xhc3MoJ2FsZXJ0LXN1Y2Nlc3MnKVxyXG4gICAgICAgIC5hZGRDbGFzcygnZmxhc2gtbWVzc2FnZS0tc2hvdycpXHJcbiAgICAgICAgLmFkZENsYXNzKCdhbGVydC0nICsgdHlwZSlcclxuICAgICAgICAuaHRtbChtZXMpO1xyXG4gICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdW5zaG93Rmxhc2hNZXNzYWdlKCk7XHJcbiAgICB9LCBzZWNzKTtcclxufVxyXG5cclxuZnVuY3Rpb24gdW5zaG93Rmxhc2hNZXNzYWdlKCl7XHJcbiAgICB2YXIgZWxlbSA9ICQoJy5qcy1mbGFzaCcpO1xyXG4gICAgY29uc29sZS5sb2coZWxlbSk7XHJcbiAgICAkKGVsZW0pLnJlbW92ZUNsYXNzKCdmbGFzaC1tZXNzYWdlLS1zaG93Jyk7XHJcbn1cclxuIiwiZnVuY3Rpb24gbG9naW4oYV91c2VyTGV2ZWwpe1xyXG4gICQoJy5sb2dpbi1jb250YWluZXInKS5hZGRDbGFzcyhcImhpZGRlblwiKTtcclxuICAkKCcubG9naW4tc3RhdHVzJykudGV4dChcIldlbGtvbTogXCIrbG9nZ2VkSW5Vc2VyLnVzZXJuYW1lICsgXCIgICAgXCIpXHJcbiAgJCgnLmxvZ291dCcpLnJlbW92ZUNsYXNzKFwiaGlkZGVuXCIpXHJcbiAgbG9nZ2VkSW4gPSB0cnVlO1xyXG4gIHVzZXJMZXZlbCA9IGFfdXNlckxldmVsO1xyXG5cclxuICAkKFwiLnVzZXItbGV2ZWxcIikuYWRkQ2xhc3MoXCJoaWRkZW5cIilcclxuICAkKFwiLnZpZXdcIikuYWRkQ2xhc3MoXCJoaWRkZW5cIilcclxuXHJcbiAgc3dpdGNoICh1c2VyTGV2ZWwpIHtcclxuICAgIGNhc2UgMTpcclxuICAgICAgJChcIi51c2VyLWxldmVsXzFcIikucmVtb3ZlQ2xhc3MoXCJoaWRkZW5cIilcclxuICAgICAgJChcIi52aWV3XzEtMVwiKS5yZW1vdmVDbGFzcyhcImhpZGRlblwiKVxyXG4gICAgICAkKFwiLm9wdGlvbl8xXCIpLmFkZENsYXNzKFwib3B0aW9ucy0tYWN0aXZlXCIpXHJcbiAgICAgICQoJy5zZXR0aW5ncycpLnJlbW92ZUNsYXNzKFwiaGlkZGVuXCIpXHJcbiAgICAgIHVwZGF0ZUxldmVsMVRlbXBsYXRlcygpO1xyXG4gICAgICBicmVhaztcclxuICAgIGNhc2UgMjpcclxuICAgICAgJChcIi51c2VyLWxldmVsXzJcIikucmVtb3ZlQ2xhc3MoXCJoaWRkZW5cIilcclxuICAgICAgJChcIi52aWV3XzItMVwiKS5yZW1vdmVDbGFzcyhcImhpZGRlblwiKVxyXG4gICAgICAkKFwiLm9wdGlvbl8xXCIpLmFkZENsYXNzKFwib3B0aW9ucy0tYWN0aXZlXCIpXHJcbiAgICAgICQoJy5zZXR0aW5ncycpLnJlbW92ZUNsYXNzKFwiaGlkZGVuXCIpXHJcbiAgICAgIHVwZGF0ZUxldmVsMlRlbXBsYXRlcygpO1xyXG4gICAgICBicmVhaztcclxuICAgIGNhc2UgMzpcclxuICAgICAgJChcIi51c2VyLWxldmVsXzNcIikucmVtb3ZlQ2xhc3MoXCJoaWRkZW5cIilcclxuICAgICAgYnJlYWs7XHJcbiAgfVxyXG59XHJcblxyXG5mdW5jdGlvbiBsb2dvdXQoKXtcclxuICAkKCcubG9naW4tY29udGFpbmVyJykucmVtb3ZlQ2xhc3MoXCJoaWRkZW5cIik7XHJcbiAgJCgnLmxvZ2luLXN0YXR1cycpLnRleHQoXCJVIGJlbnQgbm9nIG5pZXQgaW5nZWxvZ2RcIilcclxuICAkKCcubG9nb3V0JykuYWRkQ2xhc3MoXCJoaWRkZW5cIilcclxuICAkKFwiLnVzZXItbGV2ZWxcIikuYWRkQ2xhc3MoXCJoaWRkZW5cIilcclxuICAkKCcuc2V0dGluZ3MnKS5hZGRDbGFzcyhcImhpZGRlblwiKVxyXG4gIGxvZ2dlZEluID0gZmFsc2U7XHJcbiAgdXNlckxldmVsID0gMDtcclxuICBjb25zb2xlLmxvZyhcImxvZ291dFwiKVxyXG5cclxuICAkLnBvc3QoXCJpbmNsdWRlL2xvZ2luLnBocFwiLHtcclxuICAgICAgbG9nb3V0U3ViOiAnJ1xyXG4gIH0sIGZ1bmN0aW9uKHJlc3BvbnNlLHN0YXR1cyl7XHJcbiAgICAgIHNob3dGbGFzaE1lc3NhZ2UoJ0plIGJlbnQgdWl0Z2Vsb2dkJywgJ3N1Y2Nlc3MnKTtcclxuICB9KVxyXG59XHJcblxyXG5mdW5jdGlvbiB1cGRhdGVMZXZlbDFUZW1wbGF0ZXMoKXtcclxuICAkLnBvc3QoXCJpbmNsdWRlL2dldFVzZXJzLnBocFwiLHtcclxuICB9LCBmdW5jdGlvbihyZXNwb25zZSxzdGF0dXMpe1xyXG4gICAgLy8gY29uc29sZS5sb2cocmVzcG9uc2UpXHJcbiAgICB1c2VycyA9IEpTT04ucGFyc2UocmVzcG9uc2UpXHJcblxyXG4gICAgZm9yKHZhciBpID0gMDsgaSA8IDI7IGkrKyl7XHJcbiAgICAgIC8vIGNvbnNvbGUubG9nKGkpXHJcbiAgICAgIHVzZXJzLm1hcChmdW5jdGlvbihjcCxqKXtcclxuICAgICAgICBjcC5pbmRleCA9IGNwLmlkO1xyXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKGkpXHJcbiAgICAgICAgaWYoY3AudXNlcmxldmVsID09IDIpe1xyXG4gICAgICAgICAgY3AubGV2ZWwgPSBcIkRvY2VudFwiXHJcbiAgICAgICAgfWVsc2UgaWYoY3AudXNlcmxldmVsID09IDMpe1xyXG4gICAgICAgICAgY3AubGV2ZWwgPSBcIlN0dWRlbnRcIlxyXG4gICAgICAgIH1cclxuICAgICAgICBpZihpID09IDApe1xyXG4gICAgICAgICAgY3AuY2xhc3MgPSBcImVkaXRcIlxyXG4gICAgICAgICAgY3AuY2xhc3NUZXh0ID0gXCJhYW5wYXNzZW5cIlxyXG4gICAgICAgIH1lbHNlIGlmKGkgPT0gMSl7XHJcbiAgICAgICAgICBjcC5jbGFzcyA9IFwiZGVsZXRlXCJcclxuICAgICAgICAgIGNwLmNsYXNzVGV4dCA9IFwidmVyd2lqZGVyZW5cIlxyXG4gICAgICAgIH1cclxuICAgICAgfSlcclxuXHJcbiAgICAgIGZvcih2YXIgaiA9IDA7IGogPCB1c2Vycy5sZW5ndGg7IGorKyl7XHJcbiAgICAgICAgaWYodXNlcnNbal0udXNlcmxldmVsID09IDEpe1xyXG4gICAgICAgICAgdXNlcnMuc3BsaWNlKGosMSlcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIC8vIGNvbnNvbGUubG9nKHVzZXJzKVxyXG5cclxuICAgICAgdmFyIHRlbXBsYXRlID0gJChcIi5sZXZlbDEtdXNlci10ZW1wbGF0ZVwiKS5odG1sKCk7XHJcbiAgICAgIHZhciByZW5kZXJUZW1wbGF0ZSA9IE11c3RhY2hlLnJlbmRlcih0ZW1wbGF0ZSwgdXNlcnMpO1xyXG5cclxuICAgICAgaWYoaSA9PSAwKXtcclxuICAgICAgICAkKFwiLnVzZXItbGV2ZWwxLWVkaXRcIikuaHRtbChyZW5kZXJUZW1wbGF0ZSk7XHJcbiAgICAgIH1lbHNlIGlmKGkgPT0gMSl7XHJcbiAgICAgICAgJChcIi51c2VyLWxldmVsMS1kZWxldGVcIikuaHRtbChyZW5kZXJUZW1wbGF0ZSk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9KVxyXG59XHJcblxyXG5mdW5jdGlvbiB1cGRhdGVMZXZlbDJUZW1wbGF0ZXMoKXtcclxuICAkLnBvc3QoXCJpbmNsdWRlL2dldFNjZW5hcmlvcy5waHBcIix7XHJcbiAgfSwgZnVuY3Rpb24ocmVzcG9uc2Usc3RhdHVzKXtcclxuICAgIHNjZW5hcmlvcyA9IEpTT04ucGFyc2UocmVzcG9uc2UpXHJcbiAgICBjb25zb2xlLmxvZyhzY2VuYXJpb3MpXHJcblxyXG4gICAgJCgnLnNjZW5hcmlvLXNlbGVjdG9yJykuaHRtbChcIlwiKVxyXG4gICAgZm9yKHZhciBpID0gMCA7IGkgPCBzY2VuYXJpb3MubGVuZ3RoOyBpKyspe1xyXG4gICAgICBjb25zb2xlLmxvZyhzY2VuYXJpb3NbaV0ubmFtZSlcclxuICAgICAgJCgnLnNjZW5hcmlvLXNlbGVjdG9yJykuYXBwZW5kKFwiPG9wdGlvbj5cIiArIHNjZW5hcmlvc1tpXS5uYW1lICsgXCI8L29wdGlvbj5cIilcclxuICAgIH1cclxuXHJcbiAgICAvLyBmb3IodmFyIGkgPSAwOyBpIDwgMjsgaSsrKXtcclxuXHJcbiAgICAgIHZhciB0ZW1wbGF0ZSA9ICQoXCIubGV2ZWwyLXNjZW5hcmlvLXRlbXBsYXRlXCIpLmh0bWwoKTtcclxuICAgICAgdmFyIHJlbmRlclRlbXBsYXRlID0gTXVzdGFjaGUucmVuZGVyKHRlbXBsYXRlLCBzY2VuYXJpb3MpO1xyXG5cclxuICAgICAgJChcIi5qcy1zY2VuYXJpby1jb250YWluZXJcIikuaHRtbChyZW5kZXJUZW1wbGF0ZSk7XHJcbiAgICAvLyB9XHJcbiAgfSlcclxufVxyXG4iLCJ2YXIgbG9nZ2VkSW4gPSBmYWxzZTtcclxudmFyIHVzZXJMZXZlbCA9IDA7XHJcbnZhciBsb2dnZWRJblVzZXIgPSBbXTtcclxudmFyIHVzZXJzID0gW107XHJcbnZhciBzY2VuYXJpb3MgPSBbXTtcclxudmFyIGFsZXJ0QWN0aXZlID0gZmFsc2U7XHJcblxyXG4kKGRvY3VtZW50KS5yZWFkeShmdW5jdGlvbigpe1xyXG4gICAgY29uc29sZS5sb2coXCJob21lLmpzIGxvYWRlZFwiKVxyXG4gICAgJCgnYm9keScpLm9uKCdjbGljaycsICcubWVudS1pdGVtJywgZnVuY3Rpb24oKXtcclxuICAgICAgICB2YXIgaWQgPSAkKHRoaXMpLmF0dHIoXCJjbGFzc1wiKS5zcGxpdCgnXycpWzFdO1xyXG4gICAgICAgIGNvbnNvbGUubG9nKGlkKVxyXG5cclxuICAgICAgICAkKCcudmVyZGllcGluZycpLmFkZENsYXNzKFwiaGlkZGVuXCIpXHJcbiAgICAgICAgJCgnLnZlcmRpZXBpbmdfXycraWQpLnJlbW92ZUNsYXNzKFwiaGlkZGVuXCIpXHJcbiAgICB9KVxyXG5cclxuICAgICQoJ2JvZHknKS5vbignY2xpY2snLCAnLmxvZ2luJywgZnVuY3Rpb24oKXtcclxuICAgICAgICBjb25zb2xlLmxvZygkKCcudXNlcm5hbWUnKS52YWwoKS50b0xvd2VyQ2FzZSgpKVxyXG4gICAgICAgIGNvbnNvbGUubG9nKCQoJy5wYXNzd29yZCcpLnZhbCgpLnRvTG93ZXJDYXNlKCkpXHJcblxyXG4gICAgICAgICQucG9zdChcImluY2x1ZGUvbG9naW4ucGhwXCIgLHtcclxuICAgICAgICAgICAgbG9naW5TdWI6IFwiXCIsXHJcbiAgICAgICAgICAgIHVzZXJuYW1lOiAkKCcudXNlcm5hbWUnKS52YWwoKS50b0xvd2VyQ2FzZSgpLFxyXG4gICAgICAgICAgICBwYXNzd29yZDogJCgnLnBhc3N3b3JkJykudmFsKClcclxuICAgICAgICB9LCBmdW5jdGlvbihyZXNwb25zZSxzdGF0dXMpe1xyXG4gICAgICAgICAgICB2YXIgZGF0YSA9IEpTT04ucGFyc2UocmVzcG9uc2UpO1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhkYXRhKTtcclxuICAgICAgICAgICAgbG9nZ2VkSW5Vc2VyID0gZGF0YTtcclxuICAgICAgICAgICAgaWYgKGRhdGEubG9nZ2VkSW4gPT0gMSkge1xyXG4gICAgICAgICAgICAgICAgbG9naW4oZGF0YS5sZXZlbCk7XHJcbiAgICAgICAgICAgICAgICBzaG93Rmxhc2hNZXNzYWdlKCdVIGJlbnQgc3VjY2Vzdm9sIGluZ2Vsb2dkJywgJ3N1Y2Nlc3MnKVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgc2hvd0ZsYXNoTWVzc2FnZSgnVXcgZ2VicnVpa2Vyc25hYW0gb2Ygd2FjaHR3b29yZCBpcyBpbmNvcnJlY3QnLCAnZGFuZ2VyJylcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pXHJcbiAgICB9KVxyXG5cclxuICAgICQoJ2JvZHknKS5vbignY2xpY2snLCAnLmxvZ291dCcsIGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgbG9nb3V0KCk7XHJcbiAgICB9KVxyXG5cclxuICAgICQoJ2JvZHknKS5vbignY2xpY2snLCAnLmxva2FhbCcsIGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgY29uc29sZS5sb2cobG9nZ2VkSW4pXHJcbiAgICAgICAgaWYobG9nZ2VkSW4gPT0gdHJ1ZSl7XHJcbiAgICAgICAgICAgIHZhciBsb2thYWxuciA9ICQodGhpcykuYXR0cihcImNsYXNzXCIpLnNwbGl0KFwiIFwiKVswXTtcclxuICAgICAgICAgICAgJCgnLmpzLWxva2FhbCcpLmh0bWwobG9rYWFsbnIpO1xyXG4gICAgICAgIH1cclxuICAgIH0pXHJcblxyXG4gICAgJChkb2N1bWVudCkua2V5cHJlc3MoZnVuY3Rpb24oZSkge1xyXG4gICAgICAgIGlmKGUud2hpY2ggPT0gMTMpIHtcclxuICAgICAgICAgICAgaWYgKCFsb2dnZWRJbikge1xyXG4gICAgICAgICAgICAgICAgJCgnLmxvZ2luJykudHJpZ2dlcignY2xpY2snKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH0pO1xyXG59KVxyXG4iLCIkKCdib2R5Jykub24oJ2NsaWNrJywgJy5sb2thYWwnLCBmdW5jdGlvbigpe1xyXG4gICAgY29uc29sZS5sb2cobG9nZ2VkSW4pXHJcbiAgICBpZihsb2dnZWRJbiA9PSB0cnVlKXtcclxuICAgICAgICB2YXIgbG9rYWFsbnIgPSAkKHRoaXMpLmF0dHIoXCJjbGFzc1wiKS5zcGxpdChcIiBcIilbMF07XHJcbiAgICAgICAgJCgnLmpzLWxva2FhbCcpLmh0bWwobG9rYWFsbnIpO1xyXG4gICAgfVxyXG59KVxyXG4iLCIkKFwiYm9keVwiKS5vbihcImNsaWNrXCIsIFwiLm5ldy11c2VyXCIsZnVuY3Rpb24oKXtcclxuICBpZigkKFwiLm5ldy11c2VyLW5hbWVcIikudmFsKCkgPT0gXCJcIiB8fCAkKFwiLm5ldy11c2VyLXBhc3N3b3JkXCIpLnZhbCgpID09IFwiXCIgfHwgJChcIi5uZXctdXNlci1sZXZlbFwiKS52YWwoKSA9PSBudWxsKXtcclxuICAgIGNvbnNvbGUubG9nKFwiZ2VlbiBnZWJydWlrZXJzbmFhbSwgd2FjaHR3b29yZCBvZiBsZXZlbCBnZXNlbGVjdGVlcmRcIilcclxuICB9ZWxzZXtcclxuICAgIGNvbnNvbGUubG9nKCQoXCIubmV3LXVzZXItbGV2ZWxcIikudmFsKCkpXHJcbiAgICAkLnBvc3QoXCJpbmNsdWRlL2FkZFVzZXIucGhwXCIse1xyXG4gICAgICB1c2VybmFtZTogJChcIi5uZXctdXNlci1uYW1lXCIpLnZhbCgpLFxyXG4gICAgICB1c2VycGFzc3dvcmQ6ICQoXCIubmV3LXVzZXItcGFzc3dvcmRcIikudmFsKCksXHJcbiAgICAgIHVzZXJsZXZlbDogJChcIi5uZXctdXNlci1sZXZlbFwiKS52YWwoKVxyXG4gICAgfSwgZnVuY3Rpb24ocmVzcG9uc2Usc3RhdHVzKXtcclxuICAgICAgY29uc29sZS5sb2cocmVzcG9uc2UpXHJcbiAgICB9KVxyXG4gIH1cclxufSlcclxuIiwiJChcImJvZHlcIikub24oXCJjbGlja1wiLCBcIi5vcHRpb25zXCIsIGZ1bmN0aW9uKCl7XHJcbiAgdmFyIGxldmVsID0gJCh0aGlzKS5hdHRyKFwiY2xhc3NcIikuc3BsaXQoXCIgXCIpWzFdLnNwbGl0KFwiX1wiKVsxXTtcclxuICB2YXIgb3B0aW9uID0gJCh0aGlzKS5hdHRyKFwiY2xhc3NcIikuc3BsaXQoXCIgXCIpWzJdLnNwbGl0KFwiX1wiKVsxXTtcclxuICBjb25zb2xlLmxvZyhsZXZlbClcclxuXHJcbiAgJChcIi52aWV3XCIpLmFkZENsYXNzKFwiaGlkZGVuXCIpXHJcbiAgJChcIi52aWV3X1wiK2xldmVsK1wiLVwiK29wdGlvbikucmVtb3ZlQ2xhc3MoXCJoaWRkZW5cIilcclxuICAkKCcub3B0aW9ucycpLnJlbW92ZUNsYXNzKCdvcHRpb25zLS1hY3RpdmUnKTtcclxuICAkKHRoaXMpLmFkZENsYXNzKCdvcHRpb25zLS1hY3RpdmUnKTtcclxuICBzd2l0Y2ggKGxldmVsKSB7XHJcbiAgICBjYXNlIFwiMVwiOlxyXG4gICAgICB1cGRhdGVMZXZlbDFUZW1wbGF0ZXMoKTtcclxuICAgICAgYnJlYWs7XHJcbiAgICBjYXNlIFwiMlwiOlxyXG4gICAgICB1cGRhdGVMZXZlbDJUZW1wbGF0ZXMoKTtcclxuICAgICAgYnJlYWs7XHJcbiAgfVxyXG59KVxyXG4iLCIkKGRvY3VtZW50KS5yZWFkeShmdW5jdGlvbigpe1xyXG4gICAgJC5wb3N0KFwiaW5jbHVkZS9yZXR1cm5TZXNzaW9uLnBocFwiLHtcclxuICAgIH0sIGZ1bmN0aW9uKHJlc3BvbnNlLHN0YXR1cyl7XHJcbiAgICAgICAgdmFyIGRhdGEgPSBKU09OLnBhcnNlKHJlc3BvbnNlKTtcclxuICAgICAgICBpZiAoZGF0YS5sb2dnZWRJbikge1xyXG4gICAgICAgICAgICBsb2dnZWRJblVzZXIgPSBkYXRhO1xyXG4gICAgICAgICAgICBsb2dpbihkYXRhLmxldmVsKTtcclxuICAgICAgICB9XHJcbiAgICB9KVxyXG59KTtcclxuIiwiJChcIi5zZXR0aW5ncy1pbnB1dHNcIikua2V5cHJlc3MoZnVuY3Rpb24oZSkge1xyXG4gIGNvbnNvbGUubG9nKFwiZW50ZXJcIilcclxuICAgIGlmKGUud2hpY2ggPT0gMTMpIHtcclxuICAgICAgJCgnLnNldHRpbmdzLXVwZGF0ZScpLnRyaWdnZXIoJ2NsaWNrJyk7XHJcbiAgICB9XHJcbn0pO1xyXG5cclxuJCgnYm9keScpLm9uKCdjbGljaycsICcuc2V0dGluZ3MnLCBmdW5jdGlvbigpe1xyXG4gIGNvbnNvbGUubG9nKFwic2V0dGluZ3NcIilcclxuICAkKCcuc2V0dGluZ3MtdXNlcm5hbWUnKS52YWwobG9nZ2VkSW5Vc2VyLnVzZXJuYW1lKVxyXG4gICQoJy51c2VyLXNldHRpbmdzJykubW9kYWwoJ3Nob3cnKTtcclxuICBjb25zb2xlLmxvZyhsb2dnZWRJblVzZXIudXNlcm5hbWUpXHJcbn0pXHJcblxyXG4kKCdib2R5Jykub24oJ2NsaWNrJywgJy5zZXR0aW5ncy11cGRhdGUnLCBmdW5jdGlvbigpe1xyXG4gIGNvbnNvbGUubG9nKFwidXBkYXRlXCIpXHJcbiAgY29uc29sZS5sb2coJCgnLnNldHRpbmdzLXVzZXJuYW1lJykudmFsKCkpXHJcbiAgY29uc29sZS5sb2coJCgnLnNldHRpbmdzLXBhc3N3b3JkJykudmFsKCkpXHJcbiAgY29uc29sZS5sb2coJCgnLnNldHRpbmdzLXJlcGVhdC1wYXNzd29yZCcpLnZhbCgpKVxyXG5cclxuICBpZigkKCcuc2V0dGluZ3MtdXNlcm5hbWUnKS52YWwoKSA9PSBcIlwiICYmICQoJy5zZXR0aW5ncy1wYXNzd29yZCcpLnZhbCgpID09IFwiXCIgJiYgJCgnLnNldHRpbmdzLXJlcGVhdC1wYXNzd29yZCcpLnZhbCgpID09IFwiXCIpe1xyXG4gICAgY29uc29sZS5sb2coXCJnZWJydWlrZXJzbmFhbSBlbiB3YWNodHdvb3JkIG1vZ2VuIG5pZXQgbGVlZyB6aWpuXCIpO1xyXG4gIH1lbHNle1xyXG4gICAgaWYoJCgnLnNldHRpbmdzLXBhc3N3b3JkJykudmFsKCkgIT0gJCgnLnNldHRpbmdzLXJlcGVhdC1wYXNzd29yZCcpLnZhbCgpKXtcclxuICAgICAgY29uc29sZS5sb2coXCJ3YWNodHdvb3JkZW4gemlqbiBuaWV0IGdlbGlqayBhYW4gZWxrYWFyXCIpXHJcbiAgICB9ZWxzZXtcclxuICAgICAgY29uc29sZS5sb2cobG9nZ2VkSW5Vc2VyKVxyXG4gICAgICAkLnBvc3QoXCJpbmNsdWRlL3VwZGF0ZVVzZXIucGhwXCIgLHtcclxuICAgICAgICBpZDogbG9nZ2VkSW5Vc2VyLnVzZXJJRCxcclxuICAgICAgICBuYW1lOiAkKCcuc2V0dGluZ3MtdXNlcm5hbWUnKS52YWwoKSxcclxuICAgICAgICBwYXNzOiAkKCcuc2V0dGluZ3MtcGFzc3dvcmQnKS52YWwoKVxyXG4gICAgICB9LCBmdW5jdGlvbihyZXNwb25zZSxzdGF0dXMpe1xyXG4gICAgICAgICAgY29uc29sZS5sb2cocmVzcG9uc2UpO1xyXG4gICAgICAgIGlmKHJlc3BvbnNlID09IFwic3VjY2VzXCIpe1xyXG4gICAgICAgICQoJy51c2VyLXNldHRpbmdzJykubW9kYWwoJ2hpZGUnKTtcclxuICAgICAgICB9XHJcbiAgICAgIH0pXHJcbiAgICB9XHJcbiAgfVxyXG59KVxyXG4iXX0=
