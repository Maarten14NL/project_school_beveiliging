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
        $.post("include/getScenariosActive.php" ,{
        }, function(response,status){
            response = JSON.parse(response);
            if(response.length > 0){
                $('.scenario').modal('show');
                $('.scenario.modal').find('.modal-title').html(response[0].name + ' in lokaal: ' + response[0].location);
                alertActive = true;
                $('.scenario.modal').find('.js-close-scenario-modal').attr('data-activeid', response[0].active_id);
                if (!response[0].tools ) {
                    $('.scenario.modal').find('.modal-body').html('De docent heeft toegang tot deze hulpmiddelen uitgeschakeld');
                }
                else {
                    var steps = response[0].steps;
                    console.log(steps);
                }
            }
        })
    }
    setTimeout(checkAlert, 1000);
}
setTimeout(checkAlert, 1000);
$('body').on('click', '.js-close-scenario-modal', function(){
    var activeid = $(this).attr('data-activeid');
    console.log(activeid);
    $.post("include/finishActiveScenario",{
        activeid : activeid
        }, function(response,status){
            console.log(response);
            if (response == 'success') {

            }
        });
});
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

// function showFlashMessage(mes, type, dismissable = false, secs = 2000){
//     var elem = $('.js-flash');
//     $(elem).removeClass('alert-danger').removeClass('alert-success')
//         .addClass('flash-message--show')
//         .addClass('alert-' + type)
//         .html(mes);
//     if (dismissable) {
//         $(elem).append('<button class="js-dismiss btn">Ok</button>');
//     }
//     else {
//         setTimeout(function () {
//             unshowFlashMessage();
//         }, secs);
//     }
// }
// $('body').on('click', '.js-dismiss', function(){
//     unshowFlashMessage();
// });
//
// function unshowFlashMessage(){
//     var elem = $('.js-flash');
//     console.log(elem);
//     $(elem).removeClass('flash-message--show');
// }

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
      $('.scenario-selector').append('<option data-id="' + scenarios[i].id  + '">' + scenarios[i].name + "</option>")
    }

    // for(var i = 0; i < 2; i++){

      var template = $(".level2-scenario-template").html();
      var renderTemplate = Mustache.render(template, scenarios);

      $(".js-scenario-container").html(renderTemplate);
    // }
  })
}

function randomString2(len, beforestr = '', arraytocheck = null) {
    // Charset, every character in this string is an optional one it can use as a random character.
    var charSet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    var randomString = '';
    for (var i = 0; i < len; i++) {
        // creates a random number between 0 and the charSet length. Rounds it down to a whole number
        var randomPoz = Math.floor(Math.random() * charSet.length);
        randomString += charSet.substring(randomPoz, randomPoz + 1);
    }
    // If an array is given it will check the array, and if the generated string exists in it it will create a new one until a unique one is found *WATCH OUT. If all available options are used it will cause a loop it cannot break out*
    if (arraytocheck == null) {
        return beforestr + randomString;
    } else {
        var isIn = $.inArray(beforestr + randomString, arraytocheck); // checks if the string is in the array, returns a position
        if (isIn > -1) {
            // if the position is not -1 (meaning, it is not in the array) it will start doing a loop
            var count = 0;
            do {
                randomString = '';
                for (var i = 0; i < len; i++) {
                    var randomPoz = Math.floor(Math.random() * charSet.length);
                    randomString += charSet.substring(randomPoz, randomPoz + 1);
                }
                isIn = $.inArray(beforestr + randomString, arraytocheck);
                count++;
            } while (isIn > -1);
            console.log('it took ' + count + ' tries');
            return beforestr + randomString;
        } else {
            return beforestr + randomString;
        }
    }
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
    if(loggedIn){
        var lokaalnr = $(this).attr("class").split(" ")[0];
        $('.js-lokaal').html(lokaalnr);
    }
})
$('body').on('click', '.js-start-scenario', function(){
    if (loggedIn) {
        var lokaalnr = $('.js-lokaal').html();
        var scenarioId = $('.js-scenarioselect').find(":selected").data('id');
        var tools = 0;
        if ($('.js-switch').is(':checked')) {
            tools = 1;
        }
        if (lokaalnr != "") {
            if (scenarioId >= 1) {
                $.post("include/makeActiveScenario.php",{
                    lokaalnr: lokaalnr,
                    scenarioId: scenarioId,
                    tools: tools
                    }, function(response,status){
                        if (response == 'success') {
                            showFlashMessage('Scenario is succesvol aangemaakt', 'success');
                        }
                        else{
                            showFlashMessage('Het maken van een scenario is mislukt', 'danger');
                        }
                    });
            }
            else{
                showFlashMessage('Er is geen scenario gekozen', 'danger');
            }
        }
        else {
            showFlashMessage('Kies een lokaal', 'danger');
        }
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

var flashMessages = [];
function showFlashMessage(mes, type, dismissable = false, secs = 2000){
    var randStr = randomString2(20);
    $('.js-fl-cont').append('<div id="' + randStr + '" class="js-flash alert-' + type + ' flash-message">'+ mes + '</div>');
    setTimeout(function () {
        $('#' + randStr).addClass('flash-message--show');
    }, 1);
    if (!dismissable) {
        setTimeout(function () {
            deleteFlashMessage(randStr);
        }, secs);
    }
    else{
        $('#' + randStr).append('<button data-id="' + randStr + '" class="js-dismiss btn">Ok</button>');
    }
}
$('body').on('click', '.js-dismiss', function(){
    var delstr = $(this).data('id');
    deleteFlashMessage(delstr);
});

function deleteFlashMessage(id){
    $('#' + id).removeClass('flash-message--show');
    setTimeout(function () {
        $('#' + id).remove();
    }, 200);
}
count = 0;
// testflash();
function testflash(){
    showFlashMessage('test message: ' + count, "success", isEven(count), count * 1000)
    setTimeout(function () {
        testflash();
    }, 2000);
    count ++;
}
function isEven(val){
     return (val%2 == 0);
}

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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFkZFNjZW5hcmlvLmpzIiwiY2hlY2tBbGVydC5qcyIsImRlbGV0ZS1zY2VuYXJpby5qcyIsImRlbGV0ZS11c2VyLmpzIiwiZWRpdC1zY2VuYXJpby5qcyIsImVkaXQtdXNlci5qcyIsImZsYXNoLW1lc3NhZ2UuanMiLCJmdW5jdGlvbnMuanMiLCJob21lLmpzIiwibWFrZUFjdGl2ZVNjZW5hcmlvLmpzIiwibmV3LXVzZXIuanMiLCJuZXdGbGFzaE1lc3NhZ2UuanMiLCJvcHRpb25zLmpzIiwic2Vzc2lvbkNoZWNrLmpzIiwic2V0dGluZ3MuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDMUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3pDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDbkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDbEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzlEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNyREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN4QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNuSkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzFEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN0Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDZEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN2Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNsQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ1ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZXNDb250ZW50IjpbIiQoJ2JvZHknKS5vbigncHJvcGVydHljaGFuZ2UgaW5wdXQnLCAnLmpzLW5ld3N0ZXAnLGZ1bmN0aW9uKGUpe1xyXG4gICAgdmFyIHBhcmVudCA9ICQodGhpcykuY2xvc2VzdCgnLmpzLXN0ZXAnKVxyXG4gICAgaWYgKCQocGFyZW50KS5pcygnOmxhc3QtY2hpbGQnKSkge1xyXG4gICAgICAgIHZhciBucnN0ciA9ICQoJy5qcy1sYXN0bnInKS5odG1sKCk7XHJcbiAgICAgICAgdmFyIG5ld25yID0gcGFyc2VJbnQobnJzdHIpICsgMTtcclxuICAgICAgICAkKCcuanMtbGFzdG5yJykucmVtb3ZlQ2xhc3MoJ2pzLWxhc3RucicpO1xyXG4gICAgICAgICQoJy5qcy1jb3B5c3RlcCcpLmNsb25lKCkuYXBwZW5kVG8oJy5qcy1zdGVwcy1jb250YWluZXInKVxyXG4gICAgICAgIC5yZW1vdmVDbGFzcygnanMtY29weXN0ZXAnKS5yZW1vdmVDbGFzcygnaGlkZGVuJykuYWRkQ2xhc3MoJ2pzLXN0ZXAnKVxyXG4gICAgICAgIC5maW5kKCcuanMtbmV3bnInKS5yZW1vdmVDbGFzcygnanMtbmV3bnInKS5hZGRDbGFzcygnanMtbGFzdG5yJykuaHRtbChuZXducik7XHJcbiAgICAgICAgdXBkYXRlU3RlcHMoKTtcclxuICAgIH1cclxufSk7XHJcbmZ1bmN0aW9uIHVwZGF0ZVN0ZXBzKCl7XHJcbiAgICB2YXIgY291bnQgPSAxO1xyXG4gICAgJCgnLmpzLXN0ZXBucicpLmVhY2goZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICQodGhpcykuaHRtbChjb3VudCk7XHJcbiAgICAgICAgY291bnQrKztcclxuICAgIH0pO1xyXG59XHJcbiQoJ2JvZHknKS5vbignY2xpY2snLCAnLmpzLWFkZHN0ZXAnLGZ1bmN0aW9uKCl7XHJcbiAgICB2YXIgbnJzdHIgPSAkKCcuanMtbGFzdG5yJykuaHRtbCgpO1xyXG4gICAgdmFyIG5ld25yID0gcGFyc2VJbnQobnJzdHIpICsgMTtcclxuICAgICQoJy5qcy1sYXN0bnInKS5yZW1vdmVDbGFzcygnanMtbGFzdG5yJyk7XHJcbiAgICAkKCcuanMtY29weXN0ZXAnKS5jbG9uZSgpLmFwcGVuZFRvKCcuanMtc3RlcHMtY29udGFpbmVyJylcclxuICAgIC5yZW1vdmVDbGFzcygnanMtY29weXN0ZXAnKS5yZW1vdmVDbGFzcygnaGlkZGVuJykuYWRkQ2xhc3MoJ2pzLXN0ZXAnKVxyXG4gICAgLmZpbmQoJy5qcy1uZXducicpLnJlbW92ZUNsYXNzKCdqcy1uZXducicpLmFkZENsYXNzKCdqcy1sYXN0bnInKS5odG1sKG5ld25yKTtcclxuICAgIHVwZGF0ZVN0ZXBzKCk7XHJcbn0pO1xyXG4kKCdib2R5Jykub24oJ2NsaWNrJywgJy5qcy1zYXZlLW5ldy1zY2VuYXJpbycsZnVuY3Rpb24oKXtcclxuICAgIHZhciBuYW1lID0gJCgnLmpzLW5ldy1zY2VuYXJpby1uYW1lJykudmFsKCk7XHJcbiAgICB2YXIgc3RlcHMgPSBbXTtcclxuICAgIGlmIChuYW1lID09ICcnKSB7XHJcbiAgICAgICAgc2hvd0ZsYXNoTWVzc2FnZSgnVnVsIGVlcnN0IGVlbiBuYWFtIGluJywgJ2RhbmdlcicpO1xyXG4gICAgfVxyXG4gICAgZWxzZXtcclxuICAgICAgICAkKCcuanMtbmV3c3RlcCcpLmVhY2goZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICB2YXIgdGVtcHZhbCA9ICQodGhpcykudmFsKCk7XHJcbiAgICAgICAgICAgIGlmICh0ZW1wdmFsICE9IFwiXCIpIHtcclxuICAgICAgICAgICAgICAgIHN0ZXBzLnB1c2godGVtcHZhbCk7XHJcblxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgaWYgKHN0ZXBzLmxlbmd0aCA9PSAwKSB7XHJcbiAgICAgICAgICAgIHNob3dGbGFzaE1lc3NhZ2UoJ1Z1bCBtaW5zdGVucyAxIHN0YXAgaW4nLCAnZGFuZ2VyJyk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2V7XHJcbiAgICAgICAgICAgICQucG9zdChcImluY2x1ZGUvc2F2ZU5ld1NjZW5hcmlvLnBocFwiICx7XHJcbiAgICAgICAgICAgICAgICBuYW1lOiBuYW1lLFxyXG4gICAgICAgICAgICAgICAgc3RlcHM6IHN0ZXBzXHJcbiAgICAgICAgICAgIH0sIGZ1bmN0aW9uKHJlc3BvbnNlLHN0YXR1cyl7XHJcbiAgICAgICAgICAgICAgICBpZihyZXNwb25zZSA9PSBcInN1Y2Nlc1wiKXtcclxuICAgICAgICAgICAgICAgICAgICBzaG93Rmxhc2hNZXNzYWdlKCdTY2VuYXJpbyBzdWNjZXN2b2wgdG9lZ2V2b2VnZCcsICdzdWNjZXNzJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgJCgnLmpzLXN0ZXBzLWNvbnRhaW5lcicpLmh0bWwoJycpO1xyXG4gICAgICAgICAgICAgICAgICAgICQoJy5qcy1uZXctc2NlbmFyaW8tbmFtZScpLnZhbCgnJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgJCgnLmpzLWNvcHlzdGVwJykuY2xvbmUoKS5hcHBlbmRUbygnLmpzLXN0ZXBzLWNvbnRhaW5lcicpXHJcbiAgICAgICAgICAgICAgICAgICAgLnJlbW92ZUNsYXNzKCdqcy1jb3B5c3RlcCcpLnJlbW92ZUNsYXNzKCdoaWRkZW4nKVxyXG4gICAgICAgICAgICAgICAgICAgIC5hZGRDbGFzcygnanMtc3RlcCcpLmFkZENsYXNzKCdVbmlxdWV0ZW1wJylcclxuICAgICAgICAgICAgICAgICAgICAuZmluZCgnLmpzLW5ld25yJykucmVtb3ZlQ2xhc3MoJ2pzLW5ld25yJykuYWRkQ2xhc3MoJ2pzLWxhc3RucicpLmh0bWwoJzEnKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSlcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn0pO1xyXG5cclxuJCgnYm9keScpLm9uKCdjbGljaycsICcuanMtZGVsZXRlLXN0ZXAnLGZ1bmN0aW9uKCl7XHJcbiAgICB2YXIgcGFyZW50ID0gJCh0aGlzKS5jbG9zZXN0KCcuanMtc3RlcCcpO1xyXG4gICAgaWYgKCEkKHBhcmVudCkuaXMoJzpmaXJzdC1jaGlsZCcpKSB7XHJcbiAgICAgICAgJChwYXJlbnQpLnJlbW92ZSgpO1xyXG4gICAgICAgIHVwZGF0ZVN0ZXBzKCk7XHJcbiAgICB9XHJcbiAgICBlbHNlIHtcclxuICAgICAgICBzaG93Rmxhc2hNZXNzYWdlKCdKZSBrdW50IG5pZXQgZGUgZWVyc3RlIHN0YXAgdmVyd2lqZGVyZW4nLCAnZGFuZ2VyJyk7XHJcbiAgICB9XHJcbn0pO1xyXG4iLCJmdW5jdGlvbiBjaGVja0FsZXJ0KCkge1xyXG4gICAgaWYobG9nZ2VkSW5Vc2VyLmxldmVsID09IDMgJiYgIWFsZXJ0QWN0aXZlICYmIGxvZ2dlZEluID09IHRydWUpe1xyXG4gICAgICAgICQucG9zdChcImluY2x1ZGUvZ2V0U2NlbmFyaW9zQWN0aXZlLnBocFwiICx7XHJcbiAgICAgICAgfSwgZnVuY3Rpb24ocmVzcG9uc2Usc3RhdHVzKXtcclxuICAgICAgICAgICAgcmVzcG9uc2UgPSBKU09OLnBhcnNlKHJlc3BvbnNlKTtcclxuICAgICAgICAgICAgaWYocmVzcG9uc2UubGVuZ3RoID4gMCl7XHJcbiAgICAgICAgICAgICAgICAkKCcuc2NlbmFyaW8nKS5tb2RhbCgnc2hvdycpO1xyXG4gICAgICAgICAgICAgICAgJCgnLnNjZW5hcmlvLm1vZGFsJykuZmluZCgnLm1vZGFsLXRpdGxlJykuaHRtbChyZXNwb25zZVswXS5uYW1lICsgJyBpbiBsb2thYWw6ICcgKyByZXNwb25zZVswXS5sb2NhdGlvbik7XHJcbiAgICAgICAgICAgICAgICBhbGVydEFjdGl2ZSA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAkKCcuc2NlbmFyaW8ubW9kYWwnKS5maW5kKCcuanMtY2xvc2Utc2NlbmFyaW8tbW9kYWwnKS5hdHRyKCdkYXRhLWFjdGl2ZWlkJywgcmVzcG9uc2VbMF0uYWN0aXZlX2lkKTtcclxuICAgICAgICAgICAgICAgIGlmICghcmVzcG9uc2VbMF0udG9vbHMgKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgJCgnLnNjZW5hcmlvLm1vZGFsJykuZmluZCgnLm1vZGFsLWJvZHknKS5odG1sKCdEZSBkb2NlbnQgaGVlZnQgdG9lZ2FuZyB0b3QgZGV6ZSBodWxwbWlkZGVsZW4gdWl0Z2VzY2hha2VsZCcpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIHN0ZXBzID0gcmVzcG9uc2VbMF0uc3RlcHM7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coc3RlcHMpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSlcclxuICAgIH1cclxuICAgIHNldFRpbWVvdXQoY2hlY2tBbGVydCwgMTAwMCk7XHJcbn1cclxuc2V0VGltZW91dChjaGVja0FsZXJ0LCAxMDAwKTtcclxuJCgnYm9keScpLm9uKCdjbGljaycsICcuanMtY2xvc2Utc2NlbmFyaW8tbW9kYWwnLCBmdW5jdGlvbigpe1xyXG4gICAgdmFyIGFjdGl2ZWlkID0gJCh0aGlzKS5hdHRyKCdkYXRhLWFjdGl2ZWlkJyk7XHJcbiAgICBjb25zb2xlLmxvZyhhY3RpdmVpZCk7XHJcbiAgICAkLnBvc3QoXCJpbmNsdWRlL2ZpbmlzaEFjdGl2ZVNjZW5hcmlvXCIse1xyXG4gICAgICAgIGFjdGl2ZWlkIDogYWN0aXZlaWRcclxuICAgICAgICB9LCBmdW5jdGlvbihyZXNwb25zZSxzdGF0dXMpe1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhyZXNwb25zZSk7XHJcbiAgICAgICAgICAgIGlmIChyZXNwb25zZSA9PSAnc3VjY2VzcycpIHtcclxuXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxufSk7XHJcbiQoJy5zY2VuYXJpbycpLm9uKCdoaWRkZW4uYnMubW9kYWwnLCBmdW5jdGlvbiAoKSB7XHJcbiAgICBjb25zb2xlLmxvZyhcImNsb3NlXCIpXHJcbiAgICBpZihsb2dnZWRJblVzZXIubGV2ZWwgPT0gMyAmJiBsb2dnZWRJbiA9PSB0cnVlKXtcclxuICAgICAgICBhbGVydEFjdGl2ZSA9IGZhbHNlO1xyXG4gICAgfVxyXG59KVxyXG4iLCIkKCdib2R5Jykub24oJ2NsaWNrJywgJy5sZXZlbDItYnRuLWRlbGV0ZScsZnVuY3Rpb24oKXtcclxuICB2YXIgcm93Q2xhc3MgPSAkKHRoaXMpLnBhcmVudCgpLnBhcmVudCgpLmF0dHIoXCJjbGFzc1wiKTtcclxuICB2YXIgcm93ID0gJCh0aGlzKS5wYXJlbnQoKS5wYXJlbnQoKS5hdHRyKFwiY2xhc3NcIikuc3BsaXQoXCJpbmRleFwiKVsxXTtcclxuICBmb3IodmFyIGkgPSAwOyBpIDwgc2NlbmFyaW9zLmxlbmd0aDsgaSsrKXtcclxuICAgIGlmKHNjZW5hcmlvc1tpXS5pZCA9PSByb3cpe1xyXG4gICAgICAkLnBvc3QoXCJpbmNsdWRlL2RlbGV0ZVNjZW5hcmlvcy5waHBcIiAse1xyXG4gICAgICAgIGlkOiBzY2VuYXJpb3NbaV0uaWRcclxuICAgICAgfSwgZnVuY3Rpb24ocmVzcG9uc2Usc3RhdHVzKXtcclxuICAgICAgICBjb25zb2xlLmxvZyhyZXNwb25zZSlcclxuICAgICAgICBpZihyZXNwb25zZSA9PSBcInN1Y2Nlc3N1Y2Nlc3N1Y2Nlc1wiKXtcclxuICAgICAgICAgIGNvbnNvbGUubG9nKHJvd0NsYXNzKVxyXG4gICAgICAgICAgc2NlbmFyaW9zLnNwbGljZShpLDEpXHJcbiAgICAgICAgICAkKFwiLlwiK3Jvd0NsYXNzKS5yZW1vdmUoKTtcclxuICAgICAgICAgIHVwZGF0ZUxldmVsMlRlbXBsYXRlcygpO1xyXG4gICAgICAgIH1cclxuICAgICAgfSlcclxuICAgIH1cclxuICB9XHJcbn0pXHJcbiIsIiQoJ2JvZHknKS5vbignY2xpY2snLCAnLmxldmVsMS1idG4tZGVsZXRlJyxmdW5jdGlvbigpe1xyXG4gIHZhciByb3dDbGFzcyA9ICQodGhpcykucGFyZW50KCkucGFyZW50KCkuYXR0cihcImNsYXNzXCIpO1xyXG4gIHZhciByb3cgPSAkKHRoaXMpLnBhcmVudCgpLnBhcmVudCgpLmF0dHIoXCJjbGFzc1wiKS5zcGxpdChcImluZGV4XCIpWzFdO1xyXG4gIGNvbnNvbGUubG9nKHVzZXJzKVxyXG4gIGZvcih2YXIgaSA9IDA7IGkgPCB1c2Vycy5sZW5ndGg7IGkrKyl7XHJcbiAgICBpZih1c2Vyc1tpXS5pZCA9PSByb3cpe1xyXG4gICAgICAkLnBvc3QoXCJpbmNsdWRlL2RlbGV0ZVVzZXIucGhwXCIgLHtcclxuICAgICAgICBpZDogdXNlcnNbaV0uaWRcclxuICAgICAgfSwgZnVuY3Rpb24ocmVzcG9uc2Usc3RhdHVzKXtcclxuICAgICAgICBpZihyZXNwb25zZSA9PSBcInN1Y2Nlc1wiKXtcclxuICAgICAgICAgIGNvbnNvbGUubG9nKHJvd0NsYXNzKVxyXG4gICAgICAgICAgY29uc29sZS5sb2coJ2FzZCcpO1xyXG4gICAgICAgICAgJChcIi5cIityb3dDbGFzcykucmVtb3ZlKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9KVxyXG4gICAgfVxyXG4gIH1cclxufSlcclxuIiwidmFyIHJvd1NlbGVjdGVkID0gMDtcclxudmFyIGluZGV4ID0gMDtcclxudmFyIGRlc2NyaXB0aW9ucyA9IFtdO1xyXG4kKCdib2R5Jykub24oJ2NsaWNrJywgJy5sZXZlbDItYnRuLWVkaXQnLCBmdW5jdGlvbigpe1xyXG4gIHJvd1NlbGVjdGVkID0gJCh0aGlzKS5wYXJlbnQoKS5wYXJlbnQoKS5hdHRyKFwiY2xhc3NcIik7XHJcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBzY2VuYXJpb3MubGVuZ3RoOyBpKyspe1xyXG4gICAgaWYoc2NlbmFyaW9zW2ldLmlkID09IHJvd1NlbGVjdGVkLnNwbGl0KFwiaW5kZXhcIilbMV0pe1xyXG4gICAgICBpbmRleCA9IGlcclxuICAgIH1cclxuICB9XHJcblxyXG4gICQucG9zdChcImluY2x1ZGUvZ2V0U2NlbmVyaW9EZXNjLnBocFwiICx7XHJcbiAgICBpZDogc2NlbmFyaW9zW2luZGV4XS5pZFxyXG4gIH0sIGZ1bmN0aW9uKHJlc3BvbnNlLHN0YXR1cyl7XHJcbiAgICBkZXNjcmlwdGlvbnMgPSBKU09OLnBhcnNlKHJlc3BvbnNlKVxyXG5cclxuICAgIGRlc2NyaXB0aW9ucy5tYXAoZnVuY3Rpb24oY3AsaSl7XHJcbiAgICAgIGNwLmluZGV4ID0gaSsxO1xyXG4gICAgfSlcclxuICAgIGNvbnNvbGUubG9nKGRlc2NyaXB0aW9ucylcclxuXHJcbiAgICB2YXIgdGVtcGxhdGUgPSAkKFwiLmxldmVsMi1zY2VuYXJpby1lZGl0LXRlbXBsYXRlXCIpLmh0bWwoKTtcclxuICAgIHZhciByZW5kZXJUZW1wbGF0ZSA9IE11c3RhY2hlLnJlbmRlcih0ZW1wbGF0ZSwgZGVzY3JpcHRpb25zKTtcclxuXHJcbiAgICAkKFwiLnNjZW5hcmlvLWVkaXQtb3B0aW9ucy1jb250YWluZXJcIikuaHRtbChyZW5kZXJUZW1wbGF0ZSk7XHJcblxyXG4gICAgJCgnLnNjZW5hcmlvLWVkaXQnKS5tb2RhbCgnc2hvdycpO1xyXG4gICAgJCgnLnVwZGF0ZS1zY2VuYXJpb3MtbmFtZScpLnZhbChzY2VuYXJpb3NbaW5kZXhdLm5hbWUpXHJcbiAgfSlcclxufSlcclxuXHJcbiQoJ2JvZHknKS5vbignY2xpY2snLCAnLnVwZGF0ZS1zY2VuYXJpb3MtdXBkYXRlJywgZnVuY3Rpb24oKXtcclxuICBkZXNjcmlwdGlvbk5hbWVzID0gW107XHJcbiAgY29uc29sZS5sb2coc2NlbmFyaW9zW2luZGV4XSlcclxuICBmb3IodmFyIGkgPSAxIDsgaSA8IChkZXNjcmlwdGlvbnMubGVuZ3RoKzEpOyBpKyspe1xyXG4gICAgaWYoJCgnLmpzLXNjZW5hcmlvLWVkaXQtJytpKS52YWwoKSAhPSBcIlwiKXtcclxuICAgICAgZGVzY3JpcHRpb25OYW1lcy5wdXNoKCQoJy5qcy1zY2VuYXJpby1lZGl0LScraSkudmFsKCkpXHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBjb25zb2xlLmxvZyhkZXNjcmlwdGlvbk5hbWVzKVxyXG5cclxuICAkLnBvc3QoXCJpbmNsdWRlL3VwZGF0ZVNjZW5hcmlvLnBocFwiICx7XHJcbiAgICBzY2VuYXJpb0lEOiBzY2VuYXJpb3NbaW5kZXhdLmlkLFxyXG4gICAgbmFtZTogJCgnLnVwZGF0ZS1zY2VuYXJpb3MtbmFtZScpLnZhbCgpLFxyXG4gICAgZGVzY3JpcHRpb25zOiBkZXNjcmlwdGlvbnNcclxuICB9LCBmdW5jdGlvbihyZXNwb25zZSxzdGF0dXMpe1xyXG4gICAgY29uc29sZS5sb2cocmVzcG9uc2UpXHJcbiAgICAkKCcuc2NlbmFyaW8tZWRpdCcpLm1vZGFsKCdoaWRlJyk7XHJcbiAgfSlcclxufSlcclxuXHJcbiQoJ2JvZHknKS5vbignY2xpY2snLCAnLmpzLXNjZW5hcmlvLWVkaXQtZGVsZXRlJyxmdW5jdGlvbigpe1xyXG4gICAgdmFyIHBhcmVudCA9ICQodGhpcykuY2xvc2VzdCgnLmpzLXNjZW5hcmlvLWVkaXQtc3RlcCcpO1xyXG4gICAgaWYgKCEkKHBhcmVudCkuaXMoJzpmaXJzdC1jaGlsZCcpKSB7XHJcbiAgICAgICAgJChwYXJlbnQpLnJlbW92ZSgpO1xyXG4gICAgICAgIHVwZGF0ZVN0ZXBzKCk7XHJcbiAgICB9XHJcbiAgICBlbHNlIHtcclxuICAgICAgICBzaG93Rmxhc2hNZXNzYWdlKCdKZSBrdW50IG5pZXQgZGUgZWVyc3RlIHN0YXAgdmVyd2lqZGVyZW4nLCAnZGFuZ2VyJyk7XHJcbiAgICB9XHJcbn0pO1xyXG4iLCJ2YXIgcm93U2VsZWN0ZWQgPSAwO1xyXG52YXIgaW5kZXggPSAwO1xyXG4kKCdib2R5Jykub24oJ2NsaWNrJywgJy5sZXZlbDEtYnRuLWVkaXQnLCBmdW5jdGlvbigpe1xyXG4gIHJvd1NlbGVjdGVkID0gJCh0aGlzKS5wYXJlbnQoKS5wYXJlbnQoKS5hdHRyKFwiY2xhc3NcIik7XHJcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCB1c2Vycy5sZW5ndGg7IGkrKyl7XHJcbiAgICBpZih1c2Vyc1tpXS5pZCA9PSByb3dTZWxlY3RlZC5zcGxpdChcImluZGV4XCIpWzFdKXtcclxuICAgICAgaW5kZXggPSBpXHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICAkKCcudXBkYXRlLXVzZXJzJykubW9kYWwoJ3Nob3cnKTtcclxuICAkKCcudXBkYXRlLXVzZXJzLXVzZXJuYW1lJykudmFsKHVzZXJzW2luZGV4XS51c2VybmFtZSlcclxuICAkKCcudXBkYXRlLXVzZXItb3B0aW9ucycpLnJlbW92ZUF0dHIoXCJzZWxlY3RlZFwiKVxyXG5cclxuICBpZih1c2Vyc1tpbmRleF0udXNlcmxldmVsID09IDIpe1xyXG4gICAgJCgnLnVwZGF0ZS11c2VyLW9wdGlvbjInKS5hdHRyKFwic2VsZWN0ZWRcIixcInNlbGVjdGVkXCIpXHJcbiAgfWVsc2V7XHJcbiAgICAkKCcudXBkYXRlLXVzZXItb3B0aW9uMScpLmF0dHIoXCJzZWxlY3RlZFwiLFwic2VsZWN0ZWRcIilcclxuICB9XHJcbn0pXHJcblxyXG4kKCdib2R5Jykub24oJ2NsaWNrJywgJy51cGRhdGUtdXNlcnMtdXBkYXRlJywgZnVuY3Rpb24oKXtcclxuICBjb25zb2xlLmxvZyhcInVwZGF0ZVwiKVxyXG4gIGNvbnNvbGUubG9nKCQoJy51cGRhdGUtdXNlcnMtdXNlcm5hbWUnKS52YWwoKSlcclxuICBjb25zb2xlLmxvZygkKCcudXBkYXRlLXVzZXJzLXBhc3N3b3JkJykudmFsKCkpXHJcbiAgY29uc29sZS5sb2coJCgnLnVwZGF0ZS11c2Vycy1yZXBlYXQtcGFzc3dvcmQnKS52YWwoKSlcclxuXHJcbiAgaWYoJCgnLnVwZGF0ZS11c2Vycy11c2VybmFtZScpLnZhbCgpID09IFwiXCIgJiYgJCgnLnVwZGF0ZS11c2Vycy1wYXNzd29yZCcpLnZhbCgpID09IFwiXCIgJiYgJCgnLnVwZGF0ZS11c2Vycy1yZXBlYXQtcGFzc3dvcmQnKS52YWwoKSA9PSBcIlwiKXtcclxuICAgIGNvbnNvbGUubG9nKFwiZ2VicnVpa2Vyc25hYW0gZW4gd2FjaHR3b29yZCBtb2dlbiBuaWV0IGxlZWcgemlqblwiKTtcclxuICB9ZWxzZXtcclxuICAgIGlmKCQoJy51cGRhdGUtdXNlcnMtcGFzc3dvcmQnKS52YWwoKSAhPSAkKCcudXBkYXRlLXVzZXJzLXJlcGVhdC1wYXNzd29yZCcpLnZhbCgpKXtcclxuICAgICAgY29uc29sZS5sb2coXCJ3YWNodHdvb3JkZW4gemlqbiBuaWV0IGdlbGlqayBhYW4gZWxrYWFyXCIpXHJcbiAgICB9ZWxzZXtcclxuICAgICAgLy8gY29uc29sZS5sb2codXNlcnNbcm93U2VsZWN0ZWQuc3BsaXQoXCJpbmRleFwiKVsxXV0pXHJcbiAgICAgICQucG9zdChcImluY2x1ZGUvdXBkYXRlVXNlci5waHBcIiAse1xyXG4gICAgICAgIGlkOiB1c2Vyc1tpbmRleF0uaWQsXHJcbiAgICAgICAgbmFtZTogJCgnLnVwZGF0ZS11c2Vycy11c2VybmFtZScpLnZhbCgpLFxyXG4gICAgICAgIHBhc3M6ICQoJy51cGRhdGUtdXNlcnMtcGFzc3dvcmQnKS52YWwoKSxcclxuICAgICAgICBsZXZlbDogJCgnLnVwZGF0ZS11c2VyLWxldmVsJykudmFsKClcclxuICAgICAgfSwgZnVuY3Rpb24ocmVzcG9uc2Usc3RhdHVzKXtcclxuICAgICAgICBjb25zb2xlLmxvZyhyZXNwb25zZSlcclxuICAgICAgICBpZihyZXNwb25zZSA9PSBcInN1Y2Nlc1wiKXtcclxuICAgICAgICAgICQoJy51cGRhdGUtdXNlcnMnKS5tb2RhbCgnaGlkZScpO1xyXG4gICAgICAgICAgdXNlcnNbaW5kZXhdLnVzZXJuYW1lID0gJCgnLnVwZGF0ZS11c2Vycy11c2VybmFtZScpLnZhbCgpO1xyXG4gICAgICAgICAgY29uc29sZS5sb2coJChcIi5cIityb3dTZWxlY3RlZCkuZmluZChcIi51c2VybmFtZVwiKSlcclxuICAgICAgICAgIC8vICQoJy5vcHRpb25zJykudHJpZ2dlcignY2xpY2snKTtcclxuICAgICAgICAgIHVwZGF0ZUxldmVsMVRlbXBsYXRlcygpO1xyXG4gICAgICAgICAgLy8gb3B0aW9uc1xyXG4gICAgICAgIH1cclxuICAgICAgfSlcclxuICAgIH1cclxuICB9XHJcbn0pXHJcbiIsIi8vIGZ1bmN0aW9uIHNob3dGbGFzaE1lc3NhZ2UobWVzLCB0eXBlLCBkaXNtaXNzYWJsZSA9IGZhbHNlLCBzZWNzID0gMjAwMCl7XHJcbi8vICAgICB2YXIgZWxlbSA9ICQoJy5qcy1mbGFzaCcpO1xyXG4vLyAgICAgJChlbGVtKS5yZW1vdmVDbGFzcygnYWxlcnQtZGFuZ2VyJykucmVtb3ZlQ2xhc3MoJ2FsZXJ0LXN1Y2Nlc3MnKVxyXG4vLyAgICAgICAgIC5hZGRDbGFzcygnZmxhc2gtbWVzc2FnZS0tc2hvdycpXHJcbi8vICAgICAgICAgLmFkZENsYXNzKCdhbGVydC0nICsgdHlwZSlcclxuLy8gICAgICAgICAuaHRtbChtZXMpO1xyXG4vLyAgICAgaWYgKGRpc21pc3NhYmxlKSB7XHJcbi8vICAgICAgICAgJChlbGVtKS5hcHBlbmQoJzxidXR0b24gY2xhc3M9XCJqcy1kaXNtaXNzIGJ0blwiPk9rPC9idXR0b24+Jyk7XHJcbi8vICAgICB9XHJcbi8vICAgICBlbHNlIHtcclxuLy8gICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcclxuLy8gICAgICAgICAgICAgdW5zaG93Rmxhc2hNZXNzYWdlKCk7XHJcbi8vICAgICAgICAgfSwgc2Vjcyk7XHJcbi8vICAgICB9XHJcbi8vIH1cclxuLy8gJCgnYm9keScpLm9uKCdjbGljaycsICcuanMtZGlzbWlzcycsIGZ1bmN0aW9uKCl7XHJcbi8vICAgICB1bnNob3dGbGFzaE1lc3NhZ2UoKTtcclxuLy8gfSk7XHJcbi8vXHJcbi8vIGZ1bmN0aW9uIHVuc2hvd0ZsYXNoTWVzc2FnZSgpe1xyXG4vLyAgICAgdmFyIGVsZW0gPSAkKCcuanMtZmxhc2gnKTtcclxuLy8gICAgIGNvbnNvbGUubG9nKGVsZW0pO1xyXG4vLyAgICAgJChlbGVtKS5yZW1vdmVDbGFzcygnZmxhc2gtbWVzc2FnZS0tc2hvdycpO1xyXG4vLyB9XHJcbiIsImZ1bmN0aW9uIGxvZ2luKGFfdXNlckxldmVsKXtcclxuICAkKCcubG9naW4tY29udGFpbmVyJykuYWRkQ2xhc3MoXCJoaWRkZW5cIik7XHJcbiAgJCgnLmxvZ2luLXN0YXR1cycpLnRleHQoXCJXZWxrb206IFwiK2xvZ2dlZEluVXNlci51c2VybmFtZSArIFwiICAgIFwiKVxyXG4gICQoJy5sb2dvdXQnKS5yZW1vdmVDbGFzcyhcImhpZGRlblwiKVxyXG4gIGxvZ2dlZEluID0gdHJ1ZTtcclxuICB1c2VyTGV2ZWwgPSBhX3VzZXJMZXZlbDtcclxuXHJcbiAgJChcIi51c2VyLWxldmVsXCIpLmFkZENsYXNzKFwiaGlkZGVuXCIpXHJcbiAgJChcIi52aWV3XCIpLmFkZENsYXNzKFwiaGlkZGVuXCIpXHJcblxyXG4gIHN3aXRjaCAodXNlckxldmVsKSB7XHJcbiAgICBjYXNlIDE6XHJcbiAgICAgICQoXCIudXNlci1sZXZlbF8xXCIpLnJlbW92ZUNsYXNzKFwiaGlkZGVuXCIpXHJcbiAgICAgICQoXCIudmlld18xLTFcIikucmVtb3ZlQ2xhc3MoXCJoaWRkZW5cIilcclxuICAgICAgJChcIi5vcHRpb25fMVwiKS5hZGRDbGFzcyhcIm9wdGlvbnMtLWFjdGl2ZVwiKVxyXG4gICAgICAkKCcuc2V0dGluZ3MnKS5yZW1vdmVDbGFzcyhcImhpZGRlblwiKVxyXG4gICAgICB1cGRhdGVMZXZlbDFUZW1wbGF0ZXMoKTtcclxuICAgICAgYnJlYWs7XHJcbiAgICBjYXNlIDI6XHJcbiAgICAgICQoXCIudXNlci1sZXZlbF8yXCIpLnJlbW92ZUNsYXNzKFwiaGlkZGVuXCIpXHJcbiAgICAgICQoXCIudmlld18yLTFcIikucmVtb3ZlQ2xhc3MoXCJoaWRkZW5cIilcclxuICAgICAgJChcIi5vcHRpb25fMVwiKS5hZGRDbGFzcyhcIm9wdGlvbnMtLWFjdGl2ZVwiKVxyXG4gICAgICAkKCcuc2V0dGluZ3MnKS5yZW1vdmVDbGFzcyhcImhpZGRlblwiKVxyXG4gICAgICB1cGRhdGVMZXZlbDJUZW1wbGF0ZXMoKTtcclxuICAgICAgYnJlYWs7XHJcbiAgICBjYXNlIDM6XHJcbiAgICAgICQoXCIudXNlci1sZXZlbF8zXCIpLnJlbW92ZUNsYXNzKFwiaGlkZGVuXCIpXHJcbiAgICAgIGJyZWFrO1xyXG4gIH1cclxufVxyXG5cclxuZnVuY3Rpb24gbG9nb3V0KCl7XHJcbiAgJCgnLmxvZ2luLWNvbnRhaW5lcicpLnJlbW92ZUNsYXNzKFwiaGlkZGVuXCIpO1xyXG4gICQoJy5sb2dpbi1zdGF0dXMnKS50ZXh0KFwiVSBiZW50IG5vZyBuaWV0IGluZ2Vsb2dkXCIpXHJcbiAgJCgnLmxvZ291dCcpLmFkZENsYXNzKFwiaGlkZGVuXCIpXHJcbiAgJChcIi51c2VyLWxldmVsXCIpLmFkZENsYXNzKFwiaGlkZGVuXCIpXHJcbiAgJCgnLnNldHRpbmdzJykuYWRkQ2xhc3MoXCJoaWRkZW5cIilcclxuICBsb2dnZWRJbiA9IGZhbHNlO1xyXG4gIHVzZXJMZXZlbCA9IDA7XHJcbiAgY29uc29sZS5sb2coXCJsb2dvdXRcIilcclxuXHJcbiAgJC5wb3N0KFwiaW5jbHVkZS9sb2dpbi5waHBcIix7XHJcbiAgICAgIGxvZ291dFN1YjogJydcclxuICB9LCBmdW5jdGlvbihyZXNwb25zZSxzdGF0dXMpe1xyXG4gICAgICBzaG93Rmxhc2hNZXNzYWdlKCdKZSBiZW50IHVpdGdlbG9nZCcsICdzdWNjZXNzJyk7XHJcbiAgfSlcclxufVxyXG5cclxuZnVuY3Rpb24gdXBkYXRlTGV2ZWwxVGVtcGxhdGVzKCl7XHJcbiAgJC5wb3N0KFwiaW5jbHVkZS9nZXRVc2Vycy5waHBcIix7XHJcbiAgfSwgZnVuY3Rpb24ocmVzcG9uc2Usc3RhdHVzKXtcclxuICAgIC8vIGNvbnNvbGUubG9nKHJlc3BvbnNlKVxyXG4gICAgdXNlcnMgPSBKU09OLnBhcnNlKHJlc3BvbnNlKVxyXG5cclxuICAgIGZvcih2YXIgaSA9IDA7IGkgPCAyOyBpKyspe1xyXG4gICAgICAvLyBjb25zb2xlLmxvZyhpKVxyXG4gICAgICB1c2Vycy5tYXAoZnVuY3Rpb24oY3Asail7XHJcbiAgICAgICAgY3AuaW5kZXggPSBjcC5pZDtcclxuICAgICAgICAvLyBjb25zb2xlLmxvZyhpKVxyXG4gICAgICAgIGlmKGNwLnVzZXJsZXZlbCA9PSAyKXtcclxuICAgICAgICAgIGNwLmxldmVsID0gXCJEb2NlbnRcIlxyXG4gICAgICAgIH1lbHNlIGlmKGNwLnVzZXJsZXZlbCA9PSAzKXtcclxuICAgICAgICAgIGNwLmxldmVsID0gXCJTdHVkZW50XCJcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYoaSA9PSAwKXtcclxuICAgICAgICAgIGNwLmNsYXNzID0gXCJlZGl0XCJcclxuICAgICAgICAgIGNwLmNsYXNzVGV4dCA9IFwiYWFucGFzc2VuXCJcclxuICAgICAgICB9ZWxzZSBpZihpID09IDEpe1xyXG4gICAgICAgICAgY3AuY2xhc3MgPSBcImRlbGV0ZVwiXHJcbiAgICAgICAgICBjcC5jbGFzc1RleHQgPSBcInZlcndpamRlcmVuXCJcclxuICAgICAgICB9XHJcbiAgICAgIH0pXHJcblxyXG4gICAgICBmb3IodmFyIGogPSAwOyBqIDwgdXNlcnMubGVuZ3RoOyBqKyspe1xyXG4gICAgICAgIGlmKHVzZXJzW2pdLnVzZXJsZXZlbCA9PSAxKXtcclxuICAgICAgICAgIHVzZXJzLnNwbGljZShqLDEpXHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcblxyXG4gICAgICAvLyBjb25zb2xlLmxvZyh1c2VycylcclxuXHJcbiAgICAgIHZhciB0ZW1wbGF0ZSA9ICQoXCIubGV2ZWwxLXVzZXItdGVtcGxhdGVcIikuaHRtbCgpO1xyXG4gICAgICB2YXIgcmVuZGVyVGVtcGxhdGUgPSBNdXN0YWNoZS5yZW5kZXIodGVtcGxhdGUsIHVzZXJzKTtcclxuXHJcbiAgICAgIGlmKGkgPT0gMCl7XHJcbiAgICAgICAgJChcIi51c2VyLWxldmVsMS1lZGl0XCIpLmh0bWwocmVuZGVyVGVtcGxhdGUpO1xyXG4gICAgICB9ZWxzZSBpZihpID09IDEpe1xyXG4gICAgICAgICQoXCIudXNlci1sZXZlbDEtZGVsZXRlXCIpLmh0bWwocmVuZGVyVGVtcGxhdGUpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfSlcclxufVxyXG5cclxuZnVuY3Rpb24gdXBkYXRlTGV2ZWwyVGVtcGxhdGVzKCl7XHJcbiAgJC5wb3N0KFwiaW5jbHVkZS9nZXRTY2VuYXJpb3MucGhwXCIse1xyXG4gIH0sIGZ1bmN0aW9uKHJlc3BvbnNlLHN0YXR1cyl7XHJcbiAgICBzY2VuYXJpb3MgPSBKU09OLnBhcnNlKHJlc3BvbnNlKVxyXG4gICAgY29uc29sZS5sb2coc2NlbmFyaW9zKVxyXG5cclxuICAgICQoJy5zY2VuYXJpby1zZWxlY3RvcicpLmh0bWwoXCJcIilcclxuICAgIGZvcih2YXIgaSA9IDAgOyBpIDwgc2NlbmFyaW9zLmxlbmd0aDsgaSsrKXtcclxuICAgICAgJCgnLnNjZW5hcmlvLXNlbGVjdG9yJykuYXBwZW5kKCc8b3B0aW9uIGRhdGEtaWQ9XCInICsgc2NlbmFyaW9zW2ldLmlkICArICdcIj4nICsgc2NlbmFyaW9zW2ldLm5hbWUgKyBcIjwvb3B0aW9uPlwiKVxyXG4gICAgfVxyXG5cclxuICAgIC8vIGZvcih2YXIgaSA9IDA7IGkgPCAyOyBpKyspe1xyXG5cclxuICAgICAgdmFyIHRlbXBsYXRlID0gJChcIi5sZXZlbDItc2NlbmFyaW8tdGVtcGxhdGVcIikuaHRtbCgpO1xyXG4gICAgICB2YXIgcmVuZGVyVGVtcGxhdGUgPSBNdXN0YWNoZS5yZW5kZXIodGVtcGxhdGUsIHNjZW5hcmlvcyk7XHJcblxyXG4gICAgICAkKFwiLmpzLXNjZW5hcmlvLWNvbnRhaW5lclwiKS5odG1sKHJlbmRlclRlbXBsYXRlKTtcclxuICAgIC8vIH1cclxuICB9KVxyXG59XHJcblxyXG5mdW5jdGlvbiByYW5kb21TdHJpbmcyKGxlbiwgYmVmb3Jlc3RyID0gJycsIGFycmF5dG9jaGVjayA9IG51bGwpIHtcclxuICAgIC8vIENoYXJzZXQsIGV2ZXJ5IGNoYXJhY3RlciBpbiB0aGlzIHN0cmluZyBpcyBhbiBvcHRpb25hbCBvbmUgaXQgY2FuIHVzZSBhcyBhIHJhbmRvbSBjaGFyYWN0ZXIuXHJcbiAgICB2YXIgY2hhclNldCA9ICdBQkNERUZHSElKS0xNTk9QUVJTVFVWV1hZWmFiY2RlZmdoaWprbG1ub3BxcnN0dXZ3eHl6JztcclxuICAgIHZhciByYW5kb21TdHJpbmcgPSAnJztcclxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuOyBpKyspIHtcclxuICAgICAgICAvLyBjcmVhdGVzIGEgcmFuZG9tIG51bWJlciBiZXR3ZWVuIDAgYW5kIHRoZSBjaGFyU2V0IGxlbmd0aC4gUm91bmRzIGl0IGRvd24gdG8gYSB3aG9sZSBudW1iZXJcclxuICAgICAgICB2YXIgcmFuZG9tUG96ID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogY2hhclNldC5sZW5ndGgpO1xyXG4gICAgICAgIHJhbmRvbVN0cmluZyArPSBjaGFyU2V0LnN1YnN0cmluZyhyYW5kb21Qb3osIHJhbmRvbVBveiArIDEpO1xyXG4gICAgfVxyXG4gICAgLy8gSWYgYW4gYXJyYXkgaXMgZ2l2ZW4gaXQgd2lsbCBjaGVjayB0aGUgYXJyYXksIGFuZCBpZiB0aGUgZ2VuZXJhdGVkIHN0cmluZyBleGlzdHMgaW4gaXQgaXQgd2lsbCBjcmVhdGUgYSBuZXcgb25lIHVudGlsIGEgdW5pcXVlIG9uZSBpcyBmb3VuZCAqV0FUQ0ggT1VULiBJZiBhbGwgYXZhaWxhYmxlIG9wdGlvbnMgYXJlIHVzZWQgaXQgd2lsbCBjYXVzZSBhIGxvb3AgaXQgY2Fubm90IGJyZWFrIG91dCpcclxuICAgIGlmIChhcnJheXRvY2hlY2sgPT0gbnVsbCkge1xyXG4gICAgICAgIHJldHVybiBiZWZvcmVzdHIgKyByYW5kb21TdHJpbmc7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAgIHZhciBpc0luID0gJC5pbkFycmF5KGJlZm9yZXN0ciArIHJhbmRvbVN0cmluZywgYXJyYXl0b2NoZWNrKTsgLy8gY2hlY2tzIGlmIHRoZSBzdHJpbmcgaXMgaW4gdGhlIGFycmF5LCByZXR1cm5zIGEgcG9zaXRpb25cclxuICAgICAgICBpZiAoaXNJbiA+IC0xKSB7XHJcbiAgICAgICAgICAgIC8vIGlmIHRoZSBwb3NpdGlvbiBpcyBub3QgLTEgKG1lYW5pbmcsIGl0IGlzIG5vdCBpbiB0aGUgYXJyYXkpIGl0IHdpbGwgc3RhcnQgZG9pbmcgYSBsb29wXHJcbiAgICAgICAgICAgIHZhciBjb3VudCA9IDA7XHJcbiAgICAgICAgICAgIGRvIHtcclxuICAgICAgICAgICAgICAgIHJhbmRvbVN0cmluZyA9ICcnO1xyXG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW47IGkrKykge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciByYW5kb21Qb3ogPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiBjaGFyU2V0Lmxlbmd0aCk7XHJcbiAgICAgICAgICAgICAgICAgICAgcmFuZG9tU3RyaW5nICs9IGNoYXJTZXQuc3Vic3RyaW5nKHJhbmRvbVBveiwgcmFuZG9tUG96ICsgMSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBpc0luID0gJC5pbkFycmF5KGJlZm9yZXN0ciArIHJhbmRvbVN0cmluZywgYXJyYXl0b2NoZWNrKTtcclxuICAgICAgICAgICAgICAgIGNvdW50Kys7XHJcbiAgICAgICAgICAgIH0gd2hpbGUgKGlzSW4gPiAtMSk7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdpdCB0b29rICcgKyBjb3VudCArICcgdHJpZXMnKTtcclxuICAgICAgICAgICAgcmV0dXJuIGJlZm9yZXN0ciArIHJhbmRvbVN0cmluZztcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICByZXR1cm4gYmVmb3Jlc3RyICsgcmFuZG9tU3RyaW5nO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG4iLCJ2YXIgbG9nZ2VkSW4gPSBmYWxzZTtcclxudmFyIHVzZXJMZXZlbCA9IDA7XHJcbnZhciBsb2dnZWRJblVzZXIgPSBbXTtcclxudmFyIHVzZXJzID0gW107XHJcbnZhciBzY2VuYXJpb3MgPSBbXTtcclxudmFyIGFsZXJ0QWN0aXZlID0gZmFsc2U7XHJcblxyXG4kKGRvY3VtZW50KS5yZWFkeShmdW5jdGlvbigpe1xyXG4gICAgY29uc29sZS5sb2coXCJob21lLmpzIGxvYWRlZFwiKVxyXG4gICAgJCgnYm9keScpLm9uKCdjbGljaycsICcubWVudS1pdGVtJywgZnVuY3Rpb24oKXtcclxuICAgICAgICB2YXIgaWQgPSAkKHRoaXMpLmF0dHIoXCJjbGFzc1wiKS5zcGxpdCgnXycpWzFdO1xyXG4gICAgICAgIGNvbnNvbGUubG9nKGlkKVxyXG5cclxuICAgICAgICAkKCcudmVyZGllcGluZycpLmFkZENsYXNzKFwiaGlkZGVuXCIpXHJcbiAgICAgICAgJCgnLnZlcmRpZXBpbmdfXycraWQpLnJlbW92ZUNsYXNzKFwiaGlkZGVuXCIpXHJcbiAgICB9KVxyXG5cclxuICAgICQoJ2JvZHknKS5vbignY2xpY2snLCAnLmxvZ2luJywgZnVuY3Rpb24oKXtcclxuICAgICAgICBjb25zb2xlLmxvZygkKCcudXNlcm5hbWUnKS52YWwoKS50b0xvd2VyQ2FzZSgpKVxyXG4gICAgICAgIGNvbnNvbGUubG9nKCQoJy5wYXNzd29yZCcpLnZhbCgpLnRvTG93ZXJDYXNlKCkpXHJcbiAgICAgICAgJC5wb3N0KFwiaW5jbHVkZS9sb2dpbi5waHBcIiAse1xyXG4gICAgICAgICAgICBsb2dpblN1YjogXCJcIixcclxuICAgICAgICAgICAgdXNlcm5hbWU6ICQoJy51c2VybmFtZScpLnZhbCgpLnRvTG93ZXJDYXNlKCksXHJcbiAgICAgICAgICAgIHBhc3N3b3JkOiAkKCcucGFzc3dvcmQnKS52YWwoKVxyXG4gICAgICAgIH0sIGZ1bmN0aW9uKHJlc3BvbnNlLHN0YXR1cyl7XHJcbiAgICAgICAgICAgIHZhciBkYXRhID0gSlNPTi5wYXJzZShyZXNwb25zZSk7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGRhdGEpO1xyXG4gICAgICAgICAgICBsb2dnZWRJblVzZXIgPSBkYXRhO1xyXG4gICAgICAgICAgICBpZiAoZGF0YS5sb2dnZWRJbiA9PSAxKSB7XHJcbiAgICAgICAgICAgICAgICBsb2dpbihkYXRhLmxldmVsKTtcclxuICAgICAgICAgICAgICAgIHNob3dGbGFzaE1lc3NhZ2UoJ1UgYmVudCBzdWNjZXN2b2wgaW5nZWxvZ2QnLCAnc3VjY2VzcycpXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBzaG93Rmxhc2hNZXNzYWdlKCdVdyBnZWJydWlrZXJzbmFhbSBvZiB3YWNodHdvb3JkIGlzIGluY29ycmVjdCcsICdkYW5nZXInKVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSlcclxuICAgIH0pXHJcblxyXG4gICAgJCgnYm9keScpLm9uKCdjbGljaycsICcubG9nb3V0JywgZnVuY3Rpb24oKXtcclxuICAgICAgICBsb2dvdXQoKTtcclxuICAgIH0pXHJcblxyXG4gICAgJCgnYm9keScpLm9uKCdjbGljaycsICcubG9rYWFsJywgZnVuY3Rpb24oKXtcclxuICAgICAgICBjb25zb2xlLmxvZyhsb2dnZWRJbilcclxuICAgICAgICBpZihsb2dnZWRJbiA9PSB0cnVlKXtcclxuICAgICAgICAgICAgdmFyIGxva2FhbG5yID0gJCh0aGlzKS5hdHRyKFwiY2xhc3NcIikuc3BsaXQoXCIgXCIpWzBdO1xyXG4gICAgICAgICAgICAkKCcuanMtbG9rYWFsJykuaHRtbChsb2thYWxucik7XHJcbiAgICAgICAgfVxyXG4gICAgfSlcclxuXHJcbiAgICAkKGRvY3VtZW50KS5rZXlwcmVzcyhmdW5jdGlvbihlKSB7XHJcbiAgICAgICAgaWYoZS53aGljaCA9PSAxMykge1xyXG4gICAgICAgICAgICBpZiAoIWxvZ2dlZEluKSB7XHJcbiAgICAgICAgICAgICAgICAkKCcubG9naW4nKS50cmlnZ2VyKCdjbGljaycpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfSk7XHJcbn0pXHJcbiIsIiQoJ2JvZHknKS5vbignY2xpY2snLCAnLmxva2FhbCcsIGZ1bmN0aW9uKCl7XHJcbiAgICBpZihsb2dnZWRJbil7XHJcbiAgICAgICAgdmFyIGxva2FhbG5yID0gJCh0aGlzKS5hdHRyKFwiY2xhc3NcIikuc3BsaXQoXCIgXCIpWzBdO1xyXG4gICAgICAgICQoJy5qcy1sb2thYWwnKS5odG1sKGxva2FhbG5yKTtcclxuICAgIH1cclxufSlcclxuJCgnYm9keScpLm9uKCdjbGljaycsICcuanMtc3RhcnQtc2NlbmFyaW8nLCBmdW5jdGlvbigpe1xyXG4gICAgaWYgKGxvZ2dlZEluKSB7XHJcbiAgICAgICAgdmFyIGxva2FhbG5yID0gJCgnLmpzLWxva2FhbCcpLmh0bWwoKTtcclxuICAgICAgICB2YXIgc2NlbmFyaW9JZCA9ICQoJy5qcy1zY2VuYXJpb3NlbGVjdCcpLmZpbmQoXCI6c2VsZWN0ZWRcIikuZGF0YSgnaWQnKTtcclxuICAgICAgICB2YXIgdG9vbHMgPSAwO1xyXG4gICAgICAgIGlmICgkKCcuanMtc3dpdGNoJykuaXMoJzpjaGVja2VkJykpIHtcclxuICAgICAgICAgICAgdG9vbHMgPSAxO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAobG9rYWFsbnIgIT0gXCJcIikge1xyXG4gICAgICAgICAgICBpZiAoc2NlbmFyaW9JZCA+PSAxKSB7XHJcbiAgICAgICAgICAgICAgICAkLnBvc3QoXCJpbmNsdWRlL21ha2VBY3RpdmVTY2VuYXJpby5waHBcIix7XHJcbiAgICAgICAgICAgICAgICAgICAgbG9rYWFsbnI6IGxva2FhbG5yLFxyXG4gICAgICAgICAgICAgICAgICAgIHNjZW5hcmlvSWQ6IHNjZW5hcmlvSWQsXHJcbiAgICAgICAgICAgICAgICAgICAgdG9vbHM6IHRvb2xzXHJcbiAgICAgICAgICAgICAgICAgICAgfSwgZnVuY3Rpb24ocmVzcG9uc2Usc3RhdHVzKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHJlc3BvbnNlID09ICdzdWNjZXNzJykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2hvd0ZsYXNoTWVzc2FnZSgnU2NlbmFyaW8gaXMgc3VjY2Vzdm9sIGFhbmdlbWFha3QnLCAnc3VjY2VzcycpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGVsc2V7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzaG93Rmxhc2hNZXNzYWdlKCdIZXQgbWFrZW4gdmFuIGVlbiBzY2VuYXJpbyBpcyBtaXNsdWt0JywgJ2RhbmdlcicpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZXtcclxuICAgICAgICAgICAgICAgIHNob3dGbGFzaE1lc3NhZ2UoJ0VyIGlzIGdlZW4gc2NlbmFyaW8gZ2Vrb3plbicsICdkYW5nZXInKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgc2hvd0ZsYXNoTWVzc2FnZSgnS2llcyBlZW4gbG9rYWFsJywgJ2RhbmdlcicpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufSlcclxuIiwiJChcImJvZHlcIikub24oXCJjbGlja1wiLCBcIi5uZXctdXNlclwiLGZ1bmN0aW9uKCl7XHJcbiAgaWYoJChcIi5uZXctdXNlci1uYW1lXCIpLnZhbCgpID09IFwiXCIgfHwgJChcIi5uZXctdXNlci1wYXNzd29yZFwiKS52YWwoKSA9PSBcIlwiIHx8ICQoXCIubmV3LXVzZXItbGV2ZWxcIikudmFsKCkgPT0gbnVsbCl7XHJcbiAgICBjb25zb2xlLmxvZyhcImdlZW4gZ2VicnVpa2Vyc25hYW0sIHdhY2h0d29vcmQgb2YgbGV2ZWwgZ2VzZWxlY3RlZXJkXCIpXHJcbiAgfWVsc2V7XHJcbiAgICBjb25zb2xlLmxvZygkKFwiLm5ldy11c2VyLWxldmVsXCIpLnZhbCgpKVxyXG4gICAgJC5wb3N0KFwiaW5jbHVkZS9hZGRVc2VyLnBocFwiLHtcclxuICAgICAgdXNlcm5hbWU6ICQoXCIubmV3LXVzZXItbmFtZVwiKS52YWwoKSxcclxuICAgICAgdXNlcnBhc3N3b3JkOiAkKFwiLm5ldy11c2VyLXBhc3N3b3JkXCIpLnZhbCgpLFxyXG4gICAgICB1c2VybGV2ZWw6ICQoXCIubmV3LXVzZXItbGV2ZWxcIikudmFsKClcclxuICAgIH0sIGZ1bmN0aW9uKHJlc3BvbnNlLHN0YXR1cyl7XHJcbiAgICAgIGNvbnNvbGUubG9nKHJlc3BvbnNlKVxyXG4gICAgfSlcclxuICB9XHJcbn0pXHJcbiIsInZhciBmbGFzaE1lc3NhZ2VzID0gW107XHJcbmZ1bmN0aW9uIHNob3dGbGFzaE1lc3NhZ2UobWVzLCB0eXBlLCBkaXNtaXNzYWJsZSA9IGZhbHNlLCBzZWNzID0gMjAwMCl7XHJcbiAgICB2YXIgcmFuZFN0ciA9IHJhbmRvbVN0cmluZzIoMjApO1xyXG4gICAgJCgnLmpzLWZsLWNvbnQnKS5hcHBlbmQoJzxkaXYgaWQ9XCInICsgcmFuZFN0ciArICdcIiBjbGFzcz1cImpzLWZsYXNoIGFsZXJ0LScgKyB0eXBlICsgJyBmbGFzaC1tZXNzYWdlXCI+JysgbWVzICsgJzwvZGl2PicpO1xyXG4gICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgJCgnIycgKyByYW5kU3RyKS5hZGRDbGFzcygnZmxhc2gtbWVzc2FnZS0tc2hvdycpO1xyXG4gICAgfSwgMSk7XHJcbiAgICBpZiAoIWRpc21pc3NhYmxlKSB7XHJcbiAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIGRlbGV0ZUZsYXNoTWVzc2FnZShyYW5kU3RyKTtcclxuICAgICAgICB9LCBzZWNzKTtcclxuICAgIH1cclxuICAgIGVsc2V7XHJcbiAgICAgICAgJCgnIycgKyByYW5kU3RyKS5hcHBlbmQoJzxidXR0b24gZGF0YS1pZD1cIicgKyByYW5kU3RyICsgJ1wiIGNsYXNzPVwianMtZGlzbWlzcyBidG5cIj5PazwvYnV0dG9uPicpO1xyXG4gICAgfVxyXG59XHJcbiQoJ2JvZHknKS5vbignY2xpY2snLCAnLmpzLWRpc21pc3MnLCBmdW5jdGlvbigpe1xyXG4gICAgdmFyIGRlbHN0ciA9ICQodGhpcykuZGF0YSgnaWQnKTtcclxuICAgIGRlbGV0ZUZsYXNoTWVzc2FnZShkZWxzdHIpO1xyXG59KTtcclxuXHJcbmZ1bmN0aW9uIGRlbGV0ZUZsYXNoTWVzc2FnZShpZCl7XHJcbiAgICAkKCcjJyArIGlkKS5yZW1vdmVDbGFzcygnZmxhc2gtbWVzc2FnZS0tc2hvdycpO1xyXG4gICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgJCgnIycgKyBpZCkucmVtb3ZlKCk7XHJcbiAgICB9LCAyMDApO1xyXG59XHJcbmNvdW50ID0gMDtcclxuLy8gdGVzdGZsYXNoKCk7XHJcbmZ1bmN0aW9uIHRlc3RmbGFzaCgpe1xyXG4gICAgc2hvd0ZsYXNoTWVzc2FnZSgndGVzdCBtZXNzYWdlOiAnICsgY291bnQsIFwic3VjY2Vzc1wiLCBpc0V2ZW4oY291bnQpLCBjb3VudCAqIDEwMDApXHJcbiAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB0ZXN0Zmxhc2goKTtcclxuICAgIH0sIDIwMDApO1xyXG4gICAgY291bnQgKys7XHJcbn1cclxuZnVuY3Rpb24gaXNFdmVuKHZhbCl7XHJcbiAgICAgcmV0dXJuICh2YWwlMiA9PSAwKTtcclxufVxyXG4iLCIkKFwiYm9keVwiKS5vbihcImNsaWNrXCIsIFwiLm9wdGlvbnNcIiwgZnVuY3Rpb24oKXtcclxuICB2YXIgbGV2ZWwgPSAkKHRoaXMpLmF0dHIoXCJjbGFzc1wiKS5zcGxpdChcIiBcIilbMV0uc3BsaXQoXCJfXCIpWzFdO1xyXG4gIHZhciBvcHRpb24gPSAkKHRoaXMpLmF0dHIoXCJjbGFzc1wiKS5zcGxpdChcIiBcIilbMl0uc3BsaXQoXCJfXCIpWzFdO1xyXG4gIGNvbnNvbGUubG9nKGxldmVsKVxyXG5cclxuICAkKFwiLnZpZXdcIikuYWRkQ2xhc3MoXCJoaWRkZW5cIilcclxuICAkKFwiLnZpZXdfXCIrbGV2ZWwrXCItXCIrb3B0aW9uKS5yZW1vdmVDbGFzcyhcImhpZGRlblwiKVxyXG4gICQoJy5vcHRpb25zJykucmVtb3ZlQ2xhc3MoJ29wdGlvbnMtLWFjdGl2ZScpO1xyXG4gICQodGhpcykuYWRkQ2xhc3MoJ29wdGlvbnMtLWFjdGl2ZScpO1xyXG4gIHN3aXRjaCAobGV2ZWwpIHtcclxuICAgIGNhc2UgXCIxXCI6XHJcbiAgICAgIHVwZGF0ZUxldmVsMVRlbXBsYXRlcygpO1xyXG4gICAgICBicmVhaztcclxuICAgIGNhc2UgXCIyXCI6XHJcbiAgICAgIHVwZGF0ZUxldmVsMlRlbXBsYXRlcygpO1xyXG4gICAgICBicmVhaztcclxuICB9XHJcbn0pXHJcbiIsIiQoZG9jdW1lbnQpLnJlYWR5KGZ1bmN0aW9uKCl7XHJcbiAgICAkLnBvc3QoXCJpbmNsdWRlL3JldHVyblNlc3Npb24ucGhwXCIse1xyXG4gICAgfSwgZnVuY3Rpb24ocmVzcG9uc2Usc3RhdHVzKXtcclxuICAgICAgICB2YXIgZGF0YSA9IEpTT04ucGFyc2UocmVzcG9uc2UpO1xyXG4gICAgICAgIGlmIChkYXRhLmxvZ2dlZEluKSB7XHJcbiAgICAgICAgICAgIGxvZ2dlZEluVXNlciA9IGRhdGE7XHJcbiAgICAgICAgICAgIGxvZ2luKGRhdGEubGV2ZWwpO1xyXG4gICAgICAgIH1cclxuICAgIH0pXHJcbn0pO1xyXG4iLCIkKFwiLnNldHRpbmdzLWlucHV0c1wiKS5rZXlwcmVzcyhmdW5jdGlvbihlKSB7XHJcbiAgY29uc29sZS5sb2coXCJlbnRlclwiKVxyXG4gICAgaWYoZS53aGljaCA9PSAxMykge1xyXG4gICAgICAkKCcuc2V0dGluZ3MtdXBkYXRlJykudHJpZ2dlcignY2xpY2snKTtcclxuICAgIH1cclxufSk7XHJcblxyXG4kKCdib2R5Jykub24oJ2NsaWNrJywgJy5zZXR0aW5ncycsIGZ1bmN0aW9uKCl7XHJcbiAgY29uc29sZS5sb2coXCJzZXR0aW5nc1wiKVxyXG4gICQoJy5zZXR0aW5ncy11c2VybmFtZScpLnZhbChsb2dnZWRJblVzZXIudXNlcm5hbWUpXHJcbiAgJCgnLnVzZXItc2V0dGluZ3MnKS5tb2RhbCgnc2hvdycpO1xyXG4gIGNvbnNvbGUubG9nKGxvZ2dlZEluVXNlci51c2VybmFtZSlcclxufSlcclxuXHJcbiQoJ2JvZHknKS5vbignY2xpY2snLCAnLnNldHRpbmdzLXVwZGF0ZScsIGZ1bmN0aW9uKCl7XHJcbiAgY29uc29sZS5sb2coXCJ1cGRhdGVcIilcclxuICBjb25zb2xlLmxvZygkKCcuc2V0dGluZ3MtdXNlcm5hbWUnKS52YWwoKSlcclxuICBjb25zb2xlLmxvZygkKCcuc2V0dGluZ3MtcGFzc3dvcmQnKS52YWwoKSlcclxuICBjb25zb2xlLmxvZygkKCcuc2V0dGluZ3MtcmVwZWF0LXBhc3N3b3JkJykudmFsKCkpXHJcblxyXG4gIGlmKCQoJy5zZXR0aW5ncy11c2VybmFtZScpLnZhbCgpID09IFwiXCIgJiYgJCgnLnNldHRpbmdzLXBhc3N3b3JkJykudmFsKCkgPT0gXCJcIiAmJiAkKCcuc2V0dGluZ3MtcmVwZWF0LXBhc3N3b3JkJykudmFsKCkgPT0gXCJcIil7XHJcbiAgICBjb25zb2xlLmxvZyhcImdlYnJ1aWtlcnNuYWFtIGVuIHdhY2h0d29vcmQgbW9nZW4gbmlldCBsZWVnIHppam5cIik7XHJcbiAgfWVsc2V7XHJcbiAgICBpZigkKCcuc2V0dGluZ3MtcGFzc3dvcmQnKS52YWwoKSAhPSAkKCcuc2V0dGluZ3MtcmVwZWF0LXBhc3N3b3JkJykudmFsKCkpe1xyXG4gICAgICBjb25zb2xlLmxvZyhcIndhY2h0d29vcmRlbiB6aWpuIG5pZXQgZ2VsaWprIGFhbiBlbGthYXJcIilcclxuICAgIH1lbHNle1xyXG4gICAgICBjb25zb2xlLmxvZyhsb2dnZWRJblVzZXIpXHJcbiAgICAgICQucG9zdChcImluY2x1ZGUvdXBkYXRlVXNlci5waHBcIiAse1xyXG4gICAgICAgIGlkOiBsb2dnZWRJblVzZXIudXNlcklELFxyXG4gICAgICAgIG5hbWU6ICQoJy5zZXR0aW5ncy11c2VybmFtZScpLnZhbCgpLFxyXG4gICAgICAgIHBhc3M6ICQoJy5zZXR0aW5ncy1wYXNzd29yZCcpLnZhbCgpXHJcbiAgICAgIH0sIGZ1bmN0aW9uKHJlc3BvbnNlLHN0YXR1cyl7XHJcbiAgICAgICAgICBjb25zb2xlLmxvZyhyZXNwb25zZSk7XHJcbiAgICAgICAgaWYocmVzcG9uc2UgPT0gXCJzdWNjZXNcIil7XHJcbiAgICAgICAgJCgnLnVzZXItc2V0dGluZ3MnKS5tb2RhbCgnaGlkZScpO1xyXG4gICAgICAgIH1cclxuICAgICAgfSlcclxuICAgIH1cclxuICB9XHJcbn0pXHJcbiJdfQ==
