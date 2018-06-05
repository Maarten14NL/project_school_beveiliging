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
  descriptionNames = [];
  console.log(scenarios[index])
  for(var i = 1 ; i < (descriptions.length+1); i++){
    if($('.js-scenario-edit-'+i).val() != ""){
      descriptionNames.push($('.js-scenario-edit-'+i).val())
    }
  }

  console.log(descriptionNames)

  $.post("include/updateScenario.php" ,{
    scenarioID: scenarios[index].id,
    name: $('.update-scenarios-name').val(),
    descriptions: descriptions
  }, function(response,status){
    console.log(response)
    $('.scenario-edit').modal('hide');
  })
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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFkZFNjZW5hcmlvLmpzIiwiY2hlY2tBbGVydC5qcyIsImRlbGV0ZS1zY2VuYXJpby5qcyIsImRlbGV0ZS11c2VyLmpzIiwiZWRpdC1zY2VuYXJpby5qcyIsImVkaXQtdXNlci5qcyIsImZsYXNoLW1lc3NhZ2UuanMiLCJmdW5jdGlvbnMuanMiLCJob21lLmpzIiwibWFrZUFjdGl2ZVNjZW5hcmlvLmpzIiwibmV3LXVzZXIuanMiLCJvcHRpb25zLmpzIiwic2Vzc2lvbkNoZWNrLmpzIiwic2V0dGluZ3MuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMzRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3RCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDbkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDbEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzlEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNyREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2hCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2xIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMzREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ1BBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDbEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNWQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6Im1haW4uanMiLCJzb3VyY2VzQ29udGVudCI6WyIkKCdib2R5Jykub24oJ3Byb3BlcnR5Y2hhbmdlIGlucHV0JywgJy5qcy1uZXdzdGVwJyxmdW5jdGlvbihlKXtcclxuICAgIHZhciBwYXJlbnQgPSAkKHRoaXMpLmNsb3Nlc3QoJy5qcy1zdGVwJylcclxuICAgIGlmICgkKHBhcmVudCkuaXMoJzpsYXN0LWNoaWxkJykpIHtcclxuICAgICAgICB2YXIgbnJzdHIgPSAkKCcuanMtbGFzdG5yJykuaHRtbCgpO1xyXG4gICAgICAgIHZhciBuZXduciA9IHBhcnNlSW50KG5yc3RyKSArIDE7XHJcbiAgICAgICAgJCgnLmpzLWxhc3RucicpLnJlbW92ZUNsYXNzKCdqcy1sYXN0bnInKTtcclxuICAgICAgICAkKCcuanMtY29weXN0ZXAnKS5jbG9uZSgpLmFwcGVuZFRvKCcuanMtc3RlcHMtY29udGFpbmVyJylcclxuICAgICAgICAucmVtb3ZlQ2xhc3MoJ2pzLWNvcHlzdGVwJykucmVtb3ZlQ2xhc3MoJ2hpZGRlbicpLmFkZENsYXNzKCdqcy1zdGVwJylcclxuICAgICAgICAuZmluZCgnLmpzLW5ld25yJykucmVtb3ZlQ2xhc3MoJ2pzLW5ld25yJykuYWRkQ2xhc3MoJ2pzLWxhc3RucicpLmh0bWwobmV3bnIpO1xyXG4gICAgICAgIHVwZGF0ZVN0ZXBzKCk7XHJcbiAgICB9XHJcbn0pO1xyXG5mdW5jdGlvbiB1cGRhdGVTdGVwcygpe1xyXG4gICAgdmFyIGNvdW50ID0gMTtcclxuICAgICQoJy5qcy1zdGVwbnInKS5lYWNoKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAkKHRoaXMpLmh0bWwoY291bnQpO1xyXG4gICAgICAgIGNvdW50Kys7XHJcbiAgICB9KTtcclxufVxyXG4kKCdib2R5Jykub24oJ2NsaWNrJywgJy5qcy1hZGRzdGVwJyxmdW5jdGlvbigpe1xyXG4gICAgdmFyIG5yc3RyID0gJCgnLmpzLWxhc3RucicpLmh0bWwoKTtcclxuICAgIHZhciBuZXduciA9IHBhcnNlSW50KG5yc3RyKSArIDE7XHJcbiAgICAkKCcuanMtbGFzdG5yJykucmVtb3ZlQ2xhc3MoJ2pzLWxhc3RucicpO1xyXG4gICAgJCgnLmpzLWNvcHlzdGVwJykuY2xvbmUoKS5hcHBlbmRUbygnLmpzLXN0ZXBzLWNvbnRhaW5lcicpXHJcbiAgICAucmVtb3ZlQ2xhc3MoJ2pzLWNvcHlzdGVwJykucmVtb3ZlQ2xhc3MoJ2hpZGRlbicpLmFkZENsYXNzKCdqcy1zdGVwJylcclxuICAgIC5maW5kKCcuanMtbmV3bnInKS5yZW1vdmVDbGFzcygnanMtbmV3bnInKS5hZGRDbGFzcygnanMtbGFzdG5yJykuaHRtbChuZXducik7XHJcbiAgICB1cGRhdGVTdGVwcygpO1xyXG59KTtcclxuJCgnYm9keScpLm9uKCdjbGljaycsICcuanMtc2F2ZS1uZXctc2NlbmFyaW8nLGZ1bmN0aW9uKCl7XHJcbiAgICB2YXIgbmFtZSA9ICQoJy5qcy1uZXctc2NlbmFyaW8tbmFtZScpLnZhbCgpO1xyXG4gICAgdmFyIHN0ZXBzID0gW107XHJcbiAgICBpZiAobmFtZSA9PSAnJykge1xyXG4gICAgICAgIHNob3dGbGFzaE1lc3NhZ2UoJ1Z1bCBlZXJzdCBlZW4gbmFhbSBpbicsICdkYW5nZXInKTtcclxuICAgIH1cclxuICAgIGVsc2V7XHJcbiAgICAgICAgJCgnLmpzLW5ld3N0ZXAnKS5lYWNoKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgdmFyIHRlbXB2YWwgPSAkKHRoaXMpLnZhbCgpO1xyXG4gICAgICAgICAgICBpZiAodGVtcHZhbCAhPSBcIlwiKSB7XHJcbiAgICAgICAgICAgICAgICBzdGVwcy5wdXNoKHRlbXB2YWwpO1xyXG5cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIGlmIChzdGVwcy5sZW5ndGggPT0gMCkge1xyXG4gICAgICAgICAgICBzaG93Rmxhc2hNZXNzYWdlKCdWdWwgbWluc3RlbnMgMSBzdGFwIGluJywgJ2RhbmdlcicpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNle1xyXG4gICAgICAgICAgICAkLnBvc3QoXCJpbmNsdWRlL3NhdmVOZXdTY2VuYXJpby5waHBcIiAse1xyXG4gICAgICAgICAgICAgICAgbmFtZTogbmFtZSxcclxuICAgICAgICAgICAgICAgIHN0ZXBzOiBzdGVwc1xyXG4gICAgICAgICAgICB9LCBmdW5jdGlvbihyZXNwb25zZSxzdGF0dXMpe1xyXG4gICAgICAgICAgICAgICAgaWYocmVzcG9uc2UgPT0gXCJzdWNjZXNcIil7XHJcbiAgICAgICAgICAgICAgICAgICAgc2hvd0ZsYXNoTWVzc2FnZSgnU2NlbmFyaW8gc3VjY2Vzdm9sIHRvZWdldm9lZ2QnLCAnc3VjY2VzcycpO1xyXG4gICAgICAgICAgICAgICAgICAgICQoJy5qcy1zdGVwcy1jb250YWluZXInKS5odG1sKCcnKTtcclxuICAgICAgICAgICAgICAgICAgICAkKCcuanMtbmV3LXNjZW5hcmlvLW5hbWUnKS52YWwoJycpO1xyXG4gICAgICAgICAgICAgICAgICAgICQoJy5qcy1jb3B5c3RlcCcpLmNsb25lKCkuYXBwZW5kVG8oJy5qcy1zdGVwcy1jb250YWluZXInKVxyXG4gICAgICAgICAgICAgICAgICAgIC5yZW1vdmVDbGFzcygnanMtY29weXN0ZXAnKS5yZW1vdmVDbGFzcygnaGlkZGVuJylcclxuICAgICAgICAgICAgICAgICAgICAuYWRkQ2xhc3MoJ2pzLXN0ZXAnKS5hZGRDbGFzcygnVW5pcXVldGVtcCcpXHJcbiAgICAgICAgICAgICAgICAgICAgLmZpbmQoJy5qcy1uZXducicpLnJlbW92ZUNsYXNzKCdqcy1uZXducicpLmFkZENsYXNzKCdqcy1sYXN0bnInKS5odG1sKCcxJyk7XHJcblxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgIH1cclxuICAgIH1cclxufSk7XHJcblxyXG4kKCdib2R5Jykub24oJ2NsaWNrJywgJy5qcy1kZWxldGUtc3RlcCcsZnVuY3Rpb24oKXtcclxuICAgIHZhciBwYXJlbnQgPSAkKHRoaXMpLmNsb3Nlc3QoJy5qcy1zdGVwJyk7XHJcbiAgICBpZiAoISQocGFyZW50KS5pcygnOmZpcnN0LWNoaWxkJykpIHtcclxuICAgICAgICAkKHBhcmVudCkucmVtb3ZlKCk7XHJcbiAgICAgICAgdXBkYXRlU3RlcHMoKTtcclxuICAgIH1cclxuICAgIGVsc2Uge1xyXG4gICAgICAgIHNob3dGbGFzaE1lc3NhZ2UoJ0plIGt1bnQgbmlldCBkZSBlZXJzdGUgc3RhcCB2ZXJ3aWpkZXJlbicsICdkYW5nZXInKTtcclxuICAgIH1cclxufSk7XHJcbiIsImZ1bmN0aW9uIGNoZWNrQWxlcnQoKSB7XHJcbiAgaWYobG9nZ2VkSW5Vc2VyLmxldmVsID09IDMgJiYgIWFsZXJ0QWN0aXZlICYmIGxvZ2dlZEluID09IHRydWUpe1xyXG4gICAgY29uc29sZS5sb2coXCJvcGVuXCIpXHJcbiAgICAkLnBvc3QoXCJpbmNsdWRlL2dldFNjZW5hcmlvc0FjdGl2ZS5waHBcIiAse1xyXG4gICAgfSwgZnVuY3Rpb24ocmVzcG9uc2Usc3RhdHVzKXtcclxuICAgICAgcmVzcG9uc2UgPSBKU09OLnBhcnNlKHJlc3BvbnNlKTtcclxuICAgICAgaWYocmVzcG9uc2UubGVuZ3RoID4gMCl7XHJcbiAgICAgICAgJCgnLnNjZW5hcmlvJykubW9kYWwoJ3Nob3cnKTtcclxuICAgICAgICBhbGVydEFjdGl2ZSA9IHRydWU7XHJcbiAgICAgIH1cclxuICAgIH0pXHJcbiAgfVxyXG4gIHNldFRpbWVvdXQoY2hlY2tBbGVydCwgMTAwMCk7XHJcbn1cclxuc2V0VGltZW91dChjaGVja0FsZXJ0LCAxMDAwKTtcclxuXHJcbiQoJy5zY2VuYXJpbycpLm9uKCdoaWRkZW4uYnMubW9kYWwnLCBmdW5jdGlvbiAoKSB7XHJcbiAgY29uc29sZS5sb2coXCJjbG9zZVwiKVxyXG4gIGlmKGxvZ2dlZEluVXNlci5sZXZlbCA9PSAzICYmIGxvZ2dlZEluID09IHRydWUpe1xyXG4gICAgYWxlcnRBY3RpdmUgPSBmYWxzZTtcclxuICB9XHJcbn0pXHJcbiIsIiQoJ2JvZHknKS5vbignY2xpY2snLCAnLmxldmVsMi1idG4tZGVsZXRlJyxmdW5jdGlvbigpe1xyXG4gIHZhciByb3dDbGFzcyA9ICQodGhpcykucGFyZW50KCkucGFyZW50KCkuYXR0cihcImNsYXNzXCIpO1xyXG4gIHZhciByb3cgPSAkKHRoaXMpLnBhcmVudCgpLnBhcmVudCgpLmF0dHIoXCJjbGFzc1wiKS5zcGxpdChcImluZGV4XCIpWzFdO1xyXG4gIGZvcih2YXIgaSA9IDA7IGkgPCBzY2VuYXJpb3MubGVuZ3RoOyBpKyspe1xyXG4gICAgaWYoc2NlbmFyaW9zW2ldLmlkID09IHJvdyl7XHJcbiAgICAgICQucG9zdChcImluY2x1ZGUvZGVsZXRlU2NlbmFyaW9zLnBocFwiICx7XHJcbiAgICAgICAgaWQ6IHNjZW5hcmlvc1tpXS5pZFxyXG4gICAgICB9LCBmdW5jdGlvbihyZXNwb25zZSxzdGF0dXMpe1xyXG4gICAgICAgIGNvbnNvbGUubG9nKHJlc3BvbnNlKVxyXG4gICAgICAgIGlmKHJlc3BvbnNlID09IFwic3VjY2Vzc3VjY2Vzc3VjY2VzXCIpe1xyXG4gICAgICAgICAgY29uc29sZS5sb2cocm93Q2xhc3MpXHJcbiAgICAgICAgICBzY2VuYXJpb3Muc3BsaWNlKGksMSlcclxuICAgICAgICAgICQoXCIuXCIrcm93Q2xhc3MpLnJlbW92ZSgpO1xyXG4gICAgICAgICAgdXBkYXRlTGV2ZWwyVGVtcGxhdGVzKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9KVxyXG4gICAgfVxyXG4gIH1cclxufSlcclxuIiwiJCgnYm9keScpLm9uKCdjbGljaycsICcubGV2ZWwxLWJ0bi1kZWxldGUnLGZ1bmN0aW9uKCl7XHJcbiAgdmFyIHJvd0NsYXNzID0gJCh0aGlzKS5wYXJlbnQoKS5wYXJlbnQoKS5hdHRyKFwiY2xhc3NcIik7XHJcbiAgdmFyIHJvdyA9ICQodGhpcykucGFyZW50KCkucGFyZW50KCkuYXR0cihcImNsYXNzXCIpLnNwbGl0KFwiaW5kZXhcIilbMV07XHJcbiAgY29uc29sZS5sb2codXNlcnMpXHJcbiAgZm9yKHZhciBpID0gMDsgaSA8IHVzZXJzLmxlbmd0aDsgaSsrKXtcclxuICAgIGlmKHVzZXJzW2ldLmlkID09IHJvdyl7XHJcbiAgICAgICQucG9zdChcImluY2x1ZGUvZGVsZXRlVXNlci5waHBcIiAse1xyXG4gICAgICAgIGlkOiB1c2Vyc1tpXS5pZFxyXG4gICAgICB9LCBmdW5jdGlvbihyZXNwb25zZSxzdGF0dXMpe1xyXG4gICAgICAgIGlmKHJlc3BvbnNlID09IFwic3VjY2VzXCIpe1xyXG4gICAgICAgICAgY29uc29sZS5sb2cocm93Q2xhc3MpXHJcbiAgICAgICAgICBjb25zb2xlLmxvZygnYXNkJyk7XHJcbiAgICAgICAgICAkKFwiLlwiK3Jvd0NsYXNzKS5yZW1vdmUoKTtcclxuICAgICAgICB9XHJcbiAgICAgIH0pXHJcbiAgICB9XHJcbiAgfVxyXG59KVxyXG4iLCJ2YXIgcm93U2VsZWN0ZWQgPSAwO1xyXG52YXIgaW5kZXggPSAwO1xyXG52YXIgZGVzY3JpcHRpb25zID0gW107XHJcbiQoJ2JvZHknKS5vbignY2xpY2snLCAnLmxldmVsMi1idG4tZWRpdCcsIGZ1bmN0aW9uKCl7XHJcbiAgcm93U2VsZWN0ZWQgPSAkKHRoaXMpLnBhcmVudCgpLnBhcmVudCgpLmF0dHIoXCJjbGFzc1wiKTtcclxuICBmb3IgKHZhciBpID0gMDsgaSA8IHNjZW5hcmlvcy5sZW5ndGg7IGkrKyl7XHJcbiAgICBpZihzY2VuYXJpb3NbaV0uaWQgPT0gcm93U2VsZWN0ZWQuc3BsaXQoXCJpbmRleFwiKVsxXSl7XHJcbiAgICAgIGluZGV4ID0gaVxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgJC5wb3N0KFwiaW5jbHVkZS9nZXRTY2VuZXJpb0Rlc2MucGhwXCIgLHtcclxuICAgIGlkOiBzY2VuYXJpb3NbaW5kZXhdLmlkXHJcbiAgfSwgZnVuY3Rpb24ocmVzcG9uc2Usc3RhdHVzKXtcclxuICAgIGRlc2NyaXB0aW9ucyA9IEpTT04ucGFyc2UocmVzcG9uc2UpXHJcblxyXG4gICAgZGVzY3JpcHRpb25zLm1hcChmdW5jdGlvbihjcCxpKXtcclxuICAgICAgY3AuaW5kZXggPSBpKzE7XHJcbiAgICB9KVxyXG4gICAgY29uc29sZS5sb2coZGVzY3JpcHRpb25zKVxyXG5cclxuICAgIHZhciB0ZW1wbGF0ZSA9ICQoXCIubGV2ZWwyLXNjZW5hcmlvLWVkaXQtdGVtcGxhdGVcIikuaHRtbCgpO1xyXG4gICAgdmFyIHJlbmRlclRlbXBsYXRlID0gTXVzdGFjaGUucmVuZGVyKHRlbXBsYXRlLCBkZXNjcmlwdGlvbnMpO1xyXG5cclxuICAgICQoXCIuc2NlbmFyaW8tZWRpdC1vcHRpb25zLWNvbnRhaW5lclwiKS5odG1sKHJlbmRlclRlbXBsYXRlKTtcclxuXHJcbiAgICAkKCcuc2NlbmFyaW8tZWRpdCcpLm1vZGFsKCdzaG93Jyk7XHJcbiAgICAkKCcudXBkYXRlLXNjZW5hcmlvcy1uYW1lJykudmFsKHNjZW5hcmlvc1tpbmRleF0ubmFtZSlcclxuICB9KVxyXG59KVxyXG5cclxuJCgnYm9keScpLm9uKCdjbGljaycsICcudXBkYXRlLXNjZW5hcmlvcy11cGRhdGUnLCBmdW5jdGlvbigpe1xyXG4gIGRlc2NyaXB0aW9uTmFtZXMgPSBbXTtcclxuICBjb25zb2xlLmxvZyhzY2VuYXJpb3NbaW5kZXhdKVxyXG4gIGZvcih2YXIgaSA9IDEgOyBpIDwgKGRlc2NyaXB0aW9ucy5sZW5ndGgrMSk7IGkrKyl7XHJcbiAgICBpZigkKCcuanMtc2NlbmFyaW8tZWRpdC0nK2kpLnZhbCgpICE9IFwiXCIpe1xyXG4gICAgICBkZXNjcmlwdGlvbk5hbWVzLnB1c2goJCgnLmpzLXNjZW5hcmlvLWVkaXQtJytpKS52YWwoKSlcclxuICAgIH1cclxuICB9XHJcblxyXG4gIGNvbnNvbGUubG9nKGRlc2NyaXB0aW9uTmFtZXMpXHJcblxyXG4gICQucG9zdChcImluY2x1ZGUvdXBkYXRlU2NlbmFyaW8ucGhwXCIgLHtcclxuICAgIHNjZW5hcmlvSUQ6IHNjZW5hcmlvc1tpbmRleF0uaWQsXHJcbiAgICBuYW1lOiAkKCcudXBkYXRlLXNjZW5hcmlvcy1uYW1lJykudmFsKCksXHJcbiAgICBkZXNjcmlwdGlvbnM6IGRlc2NyaXB0aW9uc1xyXG4gIH0sIGZ1bmN0aW9uKHJlc3BvbnNlLHN0YXR1cyl7XHJcbiAgICBjb25zb2xlLmxvZyhyZXNwb25zZSlcclxuICAgICQoJy5zY2VuYXJpby1lZGl0JykubW9kYWwoJ2hpZGUnKTtcclxuICB9KVxyXG59KVxyXG5cclxuJCgnYm9keScpLm9uKCdjbGljaycsICcuanMtc2NlbmFyaW8tZWRpdC1kZWxldGUnLGZ1bmN0aW9uKCl7XHJcbiAgICB2YXIgcGFyZW50ID0gJCh0aGlzKS5jbG9zZXN0KCcuanMtc2NlbmFyaW8tZWRpdC1zdGVwJyk7XHJcbiAgICBpZiAoISQocGFyZW50KS5pcygnOmZpcnN0LWNoaWxkJykpIHtcclxuICAgICAgICAkKHBhcmVudCkucmVtb3ZlKCk7XHJcbiAgICAgICAgdXBkYXRlU3RlcHMoKTtcclxuICAgIH1cclxuICAgIGVsc2Uge1xyXG4gICAgICAgIHNob3dGbGFzaE1lc3NhZ2UoJ0plIGt1bnQgbmlldCBkZSBlZXJzdGUgc3RhcCB2ZXJ3aWpkZXJlbicsICdkYW5nZXInKTtcclxuICAgIH1cclxufSk7XHJcbiIsInZhciByb3dTZWxlY3RlZCA9IDA7XHJcbnZhciBpbmRleCA9IDA7XHJcbiQoJ2JvZHknKS5vbignY2xpY2snLCAnLmxldmVsMS1idG4tZWRpdCcsIGZ1bmN0aW9uKCl7XHJcbiAgcm93U2VsZWN0ZWQgPSAkKHRoaXMpLnBhcmVudCgpLnBhcmVudCgpLmF0dHIoXCJjbGFzc1wiKTtcclxuICBmb3IgKHZhciBpID0gMDsgaSA8IHVzZXJzLmxlbmd0aDsgaSsrKXtcclxuICAgIGlmKHVzZXJzW2ldLmlkID09IHJvd1NlbGVjdGVkLnNwbGl0KFwiaW5kZXhcIilbMV0pe1xyXG4gICAgICBpbmRleCA9IGlcclxuICAgIH1cclxuICB9XHJcblxyXG4gICQoJy51cGRhdGUtdXNlcnMnKS5tb2RhbCgnc2hvdycpO1xyXG4gICQoJy51cGRhdGUtdXNlcnMtdXNlcm5hbWUnKS52YWwodXNlcnNbaW5kZXhdLnVzZXJuYW1lKVxyXG4gICQoJy51cGRhdGUtdXNlci1vcHRpb25zJykucmVtb3ZlQXR0cihcInNlbGVjdGVkXCIpXHJcblxyXG4gIGlmKHVzZXJzW2luZGV4XS51c2VybGV2ZWwgPT0gMil7XHJcbiAgICAkKCcudXBkYXRlLXVzZXItb3B0aW9uMicpLmF0dHIoXCJzZWxlY3RlZFwiLFwic2VsZWN0ZWRcIilcclxuICB9ZWxzZXtcclxuICAgICQoJy51cGRhdGUtdXNlci1vcHRpb24xJykuYXR0cihcInNlbGVjdGVkXCIsXCJzZWxlY3RlZFwiKVxyXG4gIH1cclxufSlcclxuXHJcbiQoJ2JvZHknKS5vbignY2xpY2snLCAnLnVwZGF0ZS11c2Vycy11cGRhdGUnLCBmdW5jdGlvbigpe1xyXG4gIGNvbnNvbGUubG9nKFwidXBkYXRlXCIpXHJcbiAgY29uc29sZS5sb2coJCgnLnVwZGF0ZS11c2Vycy11c2VybmFtZScpLnZhbCgpKVxyXG4gIGNvbnNvbGUubG9nKCQoJy51cGRhdGUtdXNlcnMtcGFzc3dvcmQnKS52YWwoKSlcclxuICBjb25zb2xlLmxvZygkKCcudXBkYXRlLXVzZXJzLXJlcGVhdC1wYXNzd29yZCcpLnZhbCgpKVxyXG5cclxuICBpZigkKCcudXBkYXRlLXVzZXJzLXVzZXJuYW1lJykudmFsKCkgPT0gXCJcIiAmJiAkKCcudXBkYXRlLXVzZXJzLXBhc3N3b3JkJykudmFsKCkgPT0gXCJcIiAmJiAkKCcudXBkYXRlLXVzZXJzLXJlcGVhdC1wYXNzd29yZCcpLnZhbCgpID09IFwiXCIpe1xyXG4gICAgY29uc29sZS5sb2coXCJnZWJydWlrZXJzbmFhbSBlbiB3YWNodHdvb3JkIG1vZ2VuIG5pZXQgbGVlZyB6aWpuXCIpO1xyXG4gIH1lbHNle1xyXG4gICAgaWYoJCgnLnVwZGF0ZS11c2Vycy1wYXNzd29yZCcpLnZhbCgpICE9ICQoJy51cGRhdGUtdXNlcnMtcmVwZWF0LXBhc3N3b3JkJykudmFsKCkpe1xyXG4gICAgICBjb25zb2xlLmxvZyhcIndhY2h0d29vcmRlbiB6aWpuIG5pZXQgZ2VsaWprIGFhbiBlbGthYXJcIilcclxuICAgIH1lbHNle1xyXG4gICAgICAvLyBjb25zb2xlLmxvZyh1c2Vyc1tyb3dTZWxlY3RlZC5zcGxpdChcImluZGV4XCIpWzFdXSlcclxuICAgICAgJC5wb3N0KFwiaW5jbHVkZS91cGRhdGVVc2VyLnBocFwiICx7XHJcbiAgICAgICAgaWQ6IHVzZXJzW2luZGV4XS5pZCxcclxuICAgICAgICBuYW1lOiAkKCcudXBkYXRlLXVzZXJzLXVzZXJuYW1lJykudmFsKCksXHJcbiAgICAgICAgcGFzczogJCgnLnVwZGF0ZS11c2Vycy1wYXNzd29yZCcpLnZhbCgpLFxyXG4gICAgICAgIGxldmVsOiAkKCcudXBkYXRlLXVzZXItbGV2ZWwnKS52YWwoKVxyXG4gICAgICB9LCBmdW5jdGlvbihyZXNwb25zZSxzdGF0dXMpe1xyXG4gICAgICAgIGNvbnNvbGUubG9nKHJlc3BvbnNlKVxyXG4gICAgICAgIGlmKHJlc3BvbnNlID09IFwic3VjY2VzXCIpe1xyXG4gICAgICAgICAgJCgnLnVwZGF0ZS11c2VycycpLm1vZGFsKCdoaWRlJyk7XHJcbiAgICAgICAgICB1c2Vyc1tpbmRleF0udXNlcm5hbWUgPSAkKCcudXBkYXRlLXVzZXJzLXVzZXJuYW1lJykudmFsKCk7XHJcbiAgICAgICAgICBjb25zb2xlLmxvZygkKFwiLlwiK3Jvd1NlbGVjdGVkKS5maW5kKFwiLnVzZXJuYW1lXCIpKVxyXG4gICAgICAgICAgLy8gJCgnLm9wdGlvbnMnKS50cmlnZ2VyKCdjbGljaycpO1xyXG4gICAgICAgICAgdXBkYXRlTGV2ZWwxVGVtcGxhdGVzKCk7XHJcbiAgICAgICAgICAvLyBvcHRpb25zXHJcbiAgICAgICAgfVxyXG4gICAgICB9KVxyXG4gICAgfVxyXG4gIH1cclxufSlcclxuIiwiZnVuY3Rpb24gc2hvd0ZsYXNoTWVzc2FnZShtZXMsIHR5cGUsIHNlY3MgPSAyMDAwKXtcclxuICAgIHZhciBlbGVtID0gJCgnLmpzLWZsYXNoJyk7XHJcbiAgICAkKGVsZW0pLnJlbW92ZUNsYXNzKCdhbGVydC1kYW5nZXInKS5yZW1vdmVDbGFzcygnYWxlcnQtc3VjY2VzcycpXHJcbiAgICAgICAgLmFkZENsYXNzKCdmbGFzaC1tZXNzYWdlLS1zaG93JylcclxuICAgICAgICAuYWRkQ2xhc3MoJ2FsZXJ0LScgKyB0eXBlKVxyXG4gICAgICAgIC5odG1sKG1lcyk7XHJcbiAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB1bnNob3dGbGFzaE1lc3NhZ2UoKTtcclxuICAgIH0sIHNlY3MpO1xyXG59XHJcblxyXG5mdW5jdGlvbiB1bnNob3dGbGFzaE1lc3NhZ2UoKXtcclxuICAgIHZhciBlbGVtID0gJCgnLmpzLWZsYXNoJyk7XHJcbiAgICBjb25zb2xlLmxvZyhlbGVtKTtcclxuICAgICQoZWxlbSkucmVtb3ZlQ2xhc3MoJ2ZsYXNoLW1lc3NhZ2UtLXNob3cnKTtcclxufVxyXG4iLCJmdW5jdGlvbiBsb2dpbihhX3VzZXJMZXZlbCl7XHJcbiAgJCgnLmxvZ2luLWNvbnRhaW5lcicpLmFkZENsYXNzKFwiaGlkZGVuXCIpO1xyXG4gICQoJy5sb2dpbi1zdGF0dXMnKS50ZXh0KFwiV2Vsa29tOiBcIitsb2dnZWRJblVzZXIudXNlcm5hbWUgKyBcIiAgICBcIilcclxuICAkKCcubG9nb3V0JykucmVtb3ZlQ2xhc3MoXCJoaWRkZW5cIilcclxuICBsb2dnZWRJbiA9IHRydWU7XHJcbiAgdXNlckxldmVsID0gYV91c2VyTGV2ZWw7XHJcblxyXG4gICQoXCIudXNlci1sZXZlbFwiKS5hZGRDbGFzcyhcImhpZGRlblwiKVxyXG4gICQoXCIudmlld1wiKS5hZGRDbGFzcyhcImhpZGRlblwiKVxyXG5cclxuICBzd2l0Y2ggKHVzZXJMZXZlbCkge1xyXG4gICAgY2FzZSAxOlxyXG4gICAgICAkKFwiLnVzZXItbGV2ZWxfMVwiKS5yZW1vdmVDbGFzcyhcImhpZGRlblwiKVxyXG4gICAgICAkKFwiLnZpZXdfMS0xXCIpLnJlbW92ZUNsYXNzKFwiaGlkZGVuXCIpXHJcbiAgICAgICQoXCIub3B0aW9uXzFcIikuYWRkQ2xhc3MoXCJvcHRpb25zLS1hY3RpdmVcIilcclxuICAgICAgJCgnLnNldHRpbmdzJykucmVtb3ZlQ2xhc3MoXCJoaWRkZW5cIilcclxuICAgICAgdXBkYXRlTGV2ZWwxVGVtcGxhdGVzKCk7XHJcbiAgICAgIGJyZWFrO1xyXG4gICAgY2FzZSAyOlxyXG4gICAgICAkKFwiLnVzZXItbGV2ZWxfMlwiKS5yZW1vdmVDbGFzcyhcImhpZGRlblwiKVxyXG4gICAgICAkKFwiLnZpZXdfMi0xXCIpLnJlbW92ZUNsYXNzKFwiaGlkZGVuXCIpXHJcbiAgICAgICQoXCIub3B0aW9uXzFcIikuYWRkQ2xhc3MoXCJvcHRpb25zLS1hY3RpdmVcIilcclxuICAgICAgJCgnLnNldHRpbmdzJykucmVtb3ZlQ2xhc3MoXCJoaWRkZW5cIilcclxuICAgICAgdXBkYXRlTGV2ZWwyVGVtcGxhdGVzKCk7XHJcbiAgICAgIGJyZWFrO1xyXG4gICAgY2FzZSAzOlxyXG4gICAgICAkKFwiLnVzZXItbGV2ZWxfM1wiKS5yZW1vdmVDbGFzcyhcImhpZGRlblwiKVxyXG4gICAgICBicmVhaztcclxuICB9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGxvZ291dCgpe1xyXG4gICQoJy5sb2dpbi1jb250YWluZXInKS5yZW1vdmVDbGFzcyhcImhpZGRlblwiKTtcclxuICAkKCcubG9naW4tc3RhdHVzJykudGV4dChcIlUgYmVudCBub2cgbmlldCBpbmdlbG9nZFwiKVxyXG4gICQoJy5sb2dvdXQnKS5hZGRDbGFzcyhcImhpZGRlblwiKVxyXG4gICQoXCIudXNlci1sZXZlbFwiKS5hZGRDbGFzcyhcImhpZGRlblwiKVxyXG4gICQoJy5zZXR0aW5ncycpLmFkZENsYXNzKFwiaGlkZGVuXCIpXHJcbiAgbG9nZ2VkSW4gPSBmYWxzZTtcclxuICB1c2VyTGV2ZWwgPSAwO1xyXG4gIGNvbnNvbGUubG9nKFwibG9nb3V0XCIpXHJcblxyXG4gICQucG9zdChcImluY2x1ZGUvbG9naW4ucGhwXCIse1xyXG4gICAgICBsb2dvdXRTdWI6ICcnXHJcbiAgfSwgZnVuY3Rpb24ocmVzcG9uc2Usc3RhdHVzKXtcclxuICAgICAgc2hvd0ZsYXNoTWVzc2FnZSgnSmUgYmVudCB1aXRnZWxvZ2QnLCAnc3VjY2VzcycpO1xyXG4gIH0pXHJcbn1cclxuXHJcbmZ1bmN0aW9uIHVwZGF0ZUxldmVsMVRlbXBsYXRlcygpe1xyXG4gICQucG9zdChcImluY2x1ZGUvZ2V0VXNlcnMucGhwXCIse1xyXG4gIH0sIGZ1bmN0aW9uKHJlc3BvbnNlLHN0YXR1cyl7XHJcbiAgICAvLyBjb25zb2xlLmxvZyhyZXNwb25zZSlcclxuICAgIHVzZXJzID0gSlNPTi5wYXJzZShyZXNwb25zZSlcclxuXHJcbiAgICBmb3IodmFyIGkgPSAwOyBpIDwgMjsgaSsrKXtcclxuICAgICAgLy8gY29uc29sZS5sb2coaSlcclxuICAgICAgdXNlcnMubWFwKGZ1bmN0aW9uKGNwLGope1xyXG4gICAgICAgIGNwLmluZGV4ID0gY3AuaWQ7XHJcbiAgICAgICAgLy8gY29uc29sZS5sb2coaSlcclxuICAgICAgICBpZihjcC51c2VybGV2ZWwgPT0gMil7XHJcbiAgICAgICAgICBjcC5sZXZlbCA9IFwiRG9jZW50XCJcclxuICAgICAgICB9ZWxzZSBpZihjcC51c2VybGV2ZWwgPT0gMyl7XHJcbiAgICAgICAgICBjcC5sZXZlbCA9IFwiU3R1ZGVudFwiXHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmKGkgPT0gMCl7XHJcbiAgICAgICAgICBjcC5jbGFzcyA9IFwiZWRpdFwiXHJcbiAgICAgICAgICBjcC5jbGFzc1RleHQgPSBcImFhbnBhc3NlblwiXHJcbiAgICAgICAgfWVsc2UgaWYoaSA9PSAxKXtcclxuICAgICAgICAgIGNwLmNsYXNzID0gXCJkZWxldGVcIlxyXG4gICAgICAgICAgY3AuY2xhc3NUZXh0ID0gXCJ2ZXJ3aWpkZXJlblwiXHJcbiAgICAgICAgfVxyXG4gICAgICB9KVxyXG5cclxuICAgICAgZm9yKHZhciBqID0gMDsgaiA8IHVzZXJzLmxlbmd0aDsgaisrKXtcclxuICAgICAgICBpZih1c2Vyc1tqXS51c2VybGV2ZWwgPT0gMSl7XHJcbiAgICAgICAgICB1c2Vycy5zcGxpY2UoaiwxKVxyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG5cclxuICAgICAgLy8gY29uc29sZS5sb2codXNlcnMpXHJcblxyXG4gICAgICB2YXIgdGVtcGxhdGUgPSAkKFwiLmxldmVsMS11c2VyLXRlbXBsYXRlXCIpLmh0bWwoKTtcclxuICAgICAgdmFyIHJlbmRlclRlbXBsYXRlID0gTXVzdGFjaGUucmVuZGVyKHRlbXBsYXRlLCB1c2Vycyk7XHJcblxyXG4gICAgICBpZihpID09IDApe1xyXG4gICAgICAgICQoXCIudXNlci1sZXZlbDEtZWRpdFwiKS5odG1sKHJlbmRlclRlbXBsYXRlKTtcclxuICAgICAgfWVsc2UgaWYoaSA9PSAxKXtcclxuICAgICAgICAkKFwiLnVzZXItbGV2ZWwxLWRlbGV0ZVwiKS5odG1sKHJlbmRlclRlbXBsYXRlKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH0pXHJcbn1cclxuXHJcbmZ1bmN0aW9uIHVwZGF0ZUxldmVsMlRlbXBsYXRlcygpe1xyXG4gICQucG9zdChcImluY2x1ZGUvZ2V0U2NlbmFyaW9zLnBocFwiLHtcclxuICB9LCBmdW5jdGlvbihyZXNwb25zZSxzdGF0dXMpe1xyXG4gICAgc2NlbmFyaW9zID0gSlNPTi5wYXJzZShyZXNwb25zZSlcclxuICAgIGNvbnNvbGUubG9nKHNjZW5hcmlvcylcclxuXHJcbiAgICAkKCcuc2NlbmFyaW8tc2VsZWN0b3InKS5odG1sKFwiXCIpXHJcbiAgICBmb3IodmFyIGkgPSAwIDsgaSA8IHNjZW5hcmlvcy5sZW5ndGg7IGkrKyl7XHJcbiAgICAgIGNvbnNvbGUubG9nKHNjZW5hcmlvc1tpXS5uYW1lKVxyXG4gICAgICAkKCcuc2NlbmFyaW8tc2VsZWN0b3InKS5hcHBlbmQoXCI8b3B0aW9uPlwiICsgc2NlbmFyaW9zW2ldLm5hbWUgKyBcIjwvb3B0aW9uPlwiKVxyXG4gICAgfVxyXG5cclxuICAgIC8vIGZvcih2YXIgaSA9IDA7IGkgPCAyOyBpKyspe1xyXG5cclxuICAgICAgdmFyIHRlbXBsYXRlID0gJChcIi5sZXZlbDItc2NlbmFyaW8tdGVtcGxhdGVcIikuaHRtbCgpO1xyXG4gICAgICB2YXIgcmVuZGVyVGVtcGxhdGUgPSBNdXN0YWNoZS5yZW5kZXIodGVtcGxhdGUsIHNjZW5hcmlvcyk7XHJcblxyXG4gICAgICAkKFwiLmpzLXNjZW5hcmlvLWNvbnRhaW5lclwiKS5odG1sKHJlbmRlclRlbXBsYXRlKTtcclxuICAgIC8vIH1cclxuICB9KVxyXG59XHJcbiIsInZhciBsb2dnZWRJbiA9IGZhbHNlO1xyXG52YXIgdXNlckxldmVsID0gMDtcclxudmFyIGxvZ2dlZEluVXNlciA9IFtdO1xyXG52YXIgdXNlcnMgPSBbXTtcclxudmFyIHNjZW5hcmlvcyA9IFtdO1xyXG52YXIgYWxlcnRBY3RpdmUgPSBmYWxzZTtcclxuXHJcbiQoZG9jdW1lbnQpLnJlYWR5KGZ1bmN0aW9uKCl7XHJcbiAgICBjb25zb2xlLmxvZyhcImhvbWUuanMgbG9hZGVkXCIpXHJcbiAgICAkKCdib2R5Jykub24oJ2NsaWNrJywgJy5tZW51LWl0ZW0nLCBmdW5jdGlvbigpe1xyXG4gICAgICAgIHZhciBpZCA9ICQodGhpcykuYXR0cihcImNsYXNzXCIpLnNwbGl0KCdfJylbMV07XHJcbiAgICAgICAgY29uc29sZS5sb2coaWQpXHJcblxyXG4gICAgICAgICQoJy52ZXJkaWVwaW5nJykuYWRkQ2xhc3MoXCJoaWRkZW5cIilcclxuICAgICAgICAkKCcudmVyZGllcGluZ19fJytpZCkucmVtb3ZlQ2xhc3MoXCJoaWRkZW5cIilcclxuICAgIH0pXHJcblxyXG4gICAgJCgnYm9keScpLm9uKCdjbGljaycsICcubG9naW4nLCBmdW5jdGlvbigpe1xyXG4gICAgICAgIGNvbnNvbGUubG9nKCQoJy51c2VybmFtZScpLnZhbCgpLnRvTG93ZXJDYXNlKCkpXHJcbiAgICAgICAgY29uc29sZS5sb2coJCgnLnBhc3N3b3JkJykudmFsKCkudG9Mb3dlckNhc2UoKSlcclxuXHJcbiAgICAgICAgJC5wb3N0KFwiaW5jbHVkZS9sb2dpbi5waHBcIiAse1xyXG4gICAgICAgICAgICBsb2dpblN1YjogXCJcIixcclxuICAgICAgICAgICAgdXNlcm5hbWU6ICQoJy51c2VybmFtZScpLnZhbCgpLnRvTG93ZXJDYXNlKCksXHJcbiAgICAgICAgICAgIHBhc3N3b3JkOiAkKCcucGFzc3dvcmQnKS52YWwoKVxyXG4gICAgICAgIH0sIGZ1bmN0aW9uKHJlc3BvbnNlLHN0YXR1cyl7XHJcbiAgICAgICAgICAgIHZhciBkYXRhID0gSlNPTi5wYXJzZShyZXNwb25zZSk7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGRhdGEpO1xyXG4gICAgICAgICAgICBsb2dnZWRJblVzZXIgPSBkYXRhO1xyXG4gICAgICAgICAgICBpZiAoZGF0YS5sb2dnZWRJbiA9PSAxKSB7XHJcbiAgICAgICAgICAgICAgICBsb2dpbihkYXRhLmxldmVsKTtcclxuICAgICAgICAgICAgICAgIHNob3dGbGFzaE1lc3NhZ2UoJ1UgYmVudCBzdWNjZXN2b2wgaW5nZWxvZ2QnLCAnc3VjY2VzcycpXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBzaG93Rmxhc2hNZXNzYWdlKCdVdyBnZWJydWlrZXJzbmFhbSBvZiB3YWNodHdvb3JkIGlzIGluY29ycmVjdCcsICdkYW5nZXInKVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSlcclxuICAgIH0pXHJcblxyXG4gICAgJCgnYm9keScpLm9uKCdjbGljaycsICcubG9nb3V0JywgZnVuY3Rpb24oKXtcclxuICAgICAgICBsb2dvdXQoKTtcclxuICAgIH0pXHJcblxyXG4gICAgJCgnYm9keScpLm9uKCdjbGljaycsICcubG9rYWFsJywgZnVuY3Rpb24oKXtcclxuICAgICAgICBjb25zb2xlLmxvZyhsb2dnZWRJbilcclxuICAgICAgICBpZihsb2dnZWRJbiA9PSB0cnVlKXtcclxuICAgICAgICAgICAgdmFyIGxva2FhbG5yID0gJCh0aGlzKS5hdHRyKFwiY2xhc3NcIikuc3BsaXQoXCIgXCIpWzBdO1xyXG4gICAgICAgICAgICAkKCcuanMtbG9rYWFsJykuaHRtbChsb2thYWxucik7XHJcbiAgICAgICAgfVxyXG4gICAgfSlcclxuXHJcbiAgICAkKGRvY3VtZW50KS5rZXlwcmVzcyhmdW5jdGlvbihlKSB7XHJcbiAgICAgICAgaWYoZS53aGljaCA9PSAxMykge1xyXG4gICAgICAgICAgICBpZiAoIWxvZ2dlZEluKSB7XHJcbiAgICAgICAgICAgICAgICAkKCcubG9naW4nKS50cmlnZ2VyKCdjbGljaycpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfSk7XHJcbn0pXHJcbiIsIiQoJ2JvZHknKS5vbignY2xpY2snLCAnLmxva2FhbCcsIGZ1bmN0aW9uKCl7XHJcbiAgICBjb25zb2xlLmxvZyhsb2dnZWRJbilcclxuICAgIGlmKGxvZ2dlZEluID09IHRydWUpe1xyXG4gICAgICAgIHZhciBsb2thYWxuciA9ICQodGhpcykuYXR0cihcImNsYXNzXCIpLnNwbGl0KFwiIFwiKVswXTtcclxuICAgICAgICAkKCcuanMtbG9rYWFsJykuaHRtbChsb2thYWxucik7XHJcbiAgICB9XHJcbn0pXHJcbiIsIiQoXCJib2R5XCIpLm9uKFwiY2xpY2tcIiwgXCIubmV3LXVzZXJcIixmdW5jdGlvbigpe1xyXG4gIGlmKCQoXCIubmV3LXVzZXItbmFtZVwiKS52YWwoKSA9PSBcIlwiIHx8ICQoXCIubmV3LXVzZXItcGFzc3dvcmRcIikudmFsKCkgPT0gXCJcIiB8fCAkKFwiLm5ldy11c2VyLWxldmVsXCIpLnZhbCgpID09IG51bGwpe1xyXG4gICAgY29uc29sZS5sb2coXCJnZWVuIGdlYnJ1aWtlcnNuYWFtLCB3YWNodHdvb3JkIG9mIGxldmVsIGdlc2VsZWN0ZWVyZFwiKVxyXG4gIH1lbHNle1xyXG4gICAgY29uc29sZS5sb2coJChcIi5uZXctdXNlci1sZXZlbFwiKS52YWwoKSlcclxuICAgICQucG9zdChcImluY2x1ZGUvYWRkVXNlci5waHBcIix7XHJcbiAgICAgIHVzZXJuYW1lOiAkKFwiLm5ldy11c2VyLW5hbWVcIikudmFsKCksXHJcbiAgICAgIHVzZXJwYXNzd29yZDogJChcIi5uZXctdXNlci1wYXNzd29yZFwiKS52YWwoKSxcclxuICAgICAgdXNlcmxldmVsOiAkKFwiLm5ldy11c2VyLWxldmVsXCIpLnZhbCgpXHJcbiAgICB9LCBmdW5jdGlvbihyZXNwb25zZSxzdGF0dXMpe1xyXG4gICAgICBjb25zb2xlLmxvZyhyZXNwb25zZSlcclxuICAgIH0pXHJcbiAgfVxyXG59KVxyXG4iLCIkKFwiYm9keVwiKS5vbihcImNsaWNrXCIsIFwiLm9wdGlvbnNcIiwgZnVuY3Rpb24oKXtcclxuICB2YXIgbGV2ZWwgPSAkKHRoaXMpLmF0dHIoXCJjbGFzc1wiKS5zcGxpdChcIiBcIilbMV0uc3BsaXQoXCJfXCIpWzFdO1xyXG4gIHZhciBvcHRpb24gPSAkKHRoaXMpLmF0dHIoXCJjbGFzc1wiKS5zcGxpdChcIiBcIilbMl0uc3BsaXQoXCJfXCIpWzFdO1xyXG4gIGNvbnNvbGUubG9nKGxldmVsKVxyXG5cclxuICAkKFwiLnZpZXdcIikuYWRkQ2xhc3MoXCJoaWRkZW5cIilcclxuICAkKFwiLnZpZXdfXCIrbGV2ZWwrXCItXCIrb3B0aW9uKS5yZW1vdmVDbGFzcyhcImhpZGRlblwiKVxyXG4gICQoJy5vcHRpb25zJykucmVtb3ZlQ2xhc3MoJ29wdGlvbnMtLWFjdGl2ZScpO1xyXG4gICQodGhpcykuYWRkQ2xhc3MoJ29wdGlvbnMtLWFjdGl2ZScpO1xyXG4gIHN3aXRjaCAobGV2ZWwpIHtcclxuICAgIGNhc2UgXCIxXCI6XHJcbiAgICAgIHVwZGF0ZUxldmVsMVRlbXBsYXRlcygpO1xyXG4gICAgICBicmVhaztcclxuICAgIGNhc2UgXCIyXCI6XHJcbiAgICAgIHVwZGF0ZUxldmVsMlRlbXBsYXRlcygpO1xyXG4gICAgICBicmVhaztcclxuICB9XHJcbn0pXHJcbiIsIiQoZG9jdW1lbnQpLnJlYWR5KGZ1bmN0aW9uKCl7XHJcbiAgICAkLnBvc3QoXCJpbmNsdWRlL3JldHVyblNlc3Npb24ucGhwXCIse1xyXG4gICAgfSwgZnVuY3Rpb24ocmVzcG9uc2Usc3RhdHVzKXtcclxuICAgICAgICB2YXIgZGF0YSA9IEpTT04ucGFyc2UocmVzcG9uc2UpO1xyXG4gICAgICAgIGlmIChkYXRhLmxvZ2dlZEluKSB7XHJcbiAgICAgICAgICAgIGxvZ2dlZEluVXNlciA9IGRhdGE7XHJcbiAgICAgICAgICAgIGxvZ2luKGRhdGEubGV2ZWwpO1xyXG4gICAgICAgIH1cclxuICAgIH0pXHJcbn0pO1xyXG4iLCIkKFwiLnNldHRpbmdzLWlucHV0c1wiKS5rZXlwcmVzcyhmdW5jdGlvbihlKSB7XHJcbiAgY29uc29sZS5sb2coXCJlbnRlclwiKVxyXG4gICAgaWYoZS53aGljaCA9PSAxMykge1xyXG4gICAgICAkKCcuc2V0dGluZ3MtdXBkYXRlJykudHJpZ2dlcignY2xpY2snKTtcclxuICAgIH1cclxufSk7XHJcblxyXG4kKCdib2R5Jykub24oJ2NsaWNrJywgJy5zZXR0aW5ncycsIGZ1bmN0aW9uKCl7XHJcbiAgY29uc29sZS5sb2coXCJzZXR0aW5nc1wiKVxyXG4gICQoJy5zZXR0aW5ncy11c2VybmFtZScpLnZhbChsb2dnZWRJblVzZXIudXNlcm5hbWUpXHJcbiAgJCgnLnVzZXItc2V0dGluZ3MnKS5tb2RhbCgnc2hvdycpO1xyXG4gIGNvbnNvbGUubG9nKGxvZ2dlZEluVXNlci51c2VybmFtZSlcclxufSlcclxuXHJcbiQoJ2JvZHknKS5vbignY2xpY2snLCAnLnNldHRpbmdzLXVwZGF0ZScsIGZ1bmN0aW9uKCl7XHJcbiAgY29uc29sZS5sb2coXCJ1cGRhdGVcIilcclxuICBjb25zb2xlLmxvZygkKCcuc2V0dGluZ3MtdXNlcm5hbWUnKS52YWwoKSlcclxuICBjb25zb2xlLmxvZygkKCcuc2V0dGluZ3MtcGFzc3dvcmQnKS52YWwoKSlcclxuICBjb25zb2xlLmxvZygkKCcuc2V0dGluZ3MtcmVwZWF0LXBhc3N3b3JkJykudmFsKCkpXHJcblxyXG4gIGlmKCQoJy5zZXR0aW5ncy11c2VybmFtZScpLnZhbCgpID09IFwiXCIgJiYgJCgnLnNldHRpbmdzLXBhc3N3b3JkJykudmFsKCkgPT0gXCJcIiAmJiAkKCcuc2V0dGluZ3MtcmVwZWF0LXBhc3N3b3JkJykudmFsKCkgPT0gXCJcIil7XHJcbiAgICBjb25zb2xlLmxvZyhcImdlYnJ1aWtlcnNuYWFtIGVuIHdhY2h0d29vcmQgbW9nZW4gbmlldCBsZWVnIHppam5cIik7XHJcbiAgfWVsc2V7XHJcbiAgICBpZigkKCcuc2V0dGluZ3MtcGFzc3dvcmQnKS52YWwoKSAhPSAkKCcuc2V0dGluZ3MtcmVwZWF0LXBhc3N3b3JkJykudmFsKCkpe1xyXG4gICAgICBjb25zb2xlLmxvZyhcIndhY2h0d29vcmRlbiB6aWpuIG5pZXQgZ2VsaWprIGFhbiBlbGthYXJcIilcclxuICAgIH1lbHNle1xyXG4gICAgICBjb25zb2xlLmxvZyhsb2dnZWRJblVzZXIpXHJcbiAgICAgICQucG9zdChcImluY2x1ZGUvdXBkYXRlVXNlci5waHBcIiAse1xyXG4gICAgICAgIGlkOiBsb2dnZWRJblVzZXIudXNlcklELFxyXG4gICAgICAgIG5hbWU6ICQoJy5zZXR0aW5ncy11c2VybmFtZScpLnZhbCgpLFxyXG4gICAgICAgIHBhc3M6ICQoJy5zZXR0aW5ncy1wYXNzd29yZCcpLnZhbCgpXHJcbiAgICAgIH0sIGZ1bmN0aW9uKHJlc3BvbnNlLHN0YXR1cyl7XHJcbiAgICAgICAgICBjb25zb2xlLmxvZyhyZXNwb25zZSk7XHJcbiAgICAgICAgaWYocmVzcG9uc2UgPT0gXCJzdWNjZXNcIil7XHJcbiAgICAgICAgJCgnLnVzZXItc2V0dGluZ3MnKS5tb2RhbCgnaGlkZScpO1xyXG4gICAgICAgIH1cclxuICAgICAgfSlcclxuICAgIH1cclxuICB9XHJcbn0pXHJcbiJdfQ==
