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
            finished: 0,
            alerted: 0
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
                    $('.scenario.modal').find('.modal-body').html('');
                    for (var i = 0; i < steps.length; i++) {
                        var step = i + 1;
                        $('.scenario.modal').find('.modal-body').append('Stap ' + step + ": " + steps[i].description + "<br>");
                    }
                }
            }
        })
    }
    if(loggedInUser.level == 2 && loggedIn == true){
        $.post("include/getScenariosActive.php",{
            alerted: 0,
            finished: 1
        }, function(response,status){
            var data = JSON.parse(response);
            console.log(data);
            for (var i = 0; i < data.length; i++) {
                showFlashMessage(data[i].name + " in lokaal: " + data[i].location + " is afgerond", "success", true);
                $.post("include/finishActiveScenario.php",{
                    alerted: 1,
                    finished: 1,
                    activeid: data[i].active_id
                }, function(response,status){

                });
            }

        });
    }
    setTimeout(checkAlert, 1000);
}
setTimeout(checkAlert, 1000);
$('body').on('click', '.js-close-scenario-modal', function(){
    var activeid = $(this).attr('data-activeid');
    console.log(activeid);
    $.post("include/finishActiveScenario.php",{
        activeid : activeid,
        finished: 1,
        alerted: 0
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

$("body").on('click','.close-confirm',function(){
  $('.js-confirm').modal("hide")
})

$("body").on('click','.confirm-save-change',function(){
  $('.js-confirm').modal("hide")
})

var rowClass;
var row;
$('body').on('click', '.level2-btn-delete',function(){
  confirmModal("Senario Verwijderen","Weet u zeker dat u dit scenario wilt verwijderen","confirm-scenario-delete");
  rowClass = $(this).parent().parent().attr("class");
  row = $(this).parent().parent().attr("class").split("index")[1];
})

$('body').on('click','.confirm-scenario-delete',function(){
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

var rowClass = "";
var row = "";
$('body').on('click', '.level1-btn-delete',function(){
  confirmModal("Gebruiker Verwijderen","Weet u zeker dat u deze gebruiker wilt verwijderen","confirm-user-delete");
  rowClass = $(this).parent().parent().attr("class");
  row = $(this).parent().parent().attr("class").split("index")[1];
  console.log(users)
})

$("body").on('click','.confirm-user-delete',function(){
  console.log("user-delete")
  for(var i = 0; i < users.length; i++){
    if(users[i].id == row){
      $.post("include/deleteUser.php" ,{
        id: users[i].id
      }, function(response,status){
        if(response == "succes"){
          showFlashMessage('U heeft de gebruiker succesvol verwijderd', 'success');
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
  // console.log("update")
  // console.log($('.update-users-username').val())
  // console.log($('.update-users-password').val())
  // console.log($('.update-users-repeat-password').val())

  if($('.update-users-username').val() == ""){
    console.log("gebruikersnaam en wachtwoord mogen niet leeg zijn");
    showFlashMessage('Gebruikers naam mag niet leeg zijn', 'danger');
  }else{
    if($('.update-users-username').val() == ""){
      showFlashMessage('Uw gebruikersnaam mag niet leeg zijn', 'danger');
    }else if($('.update-users-password').val() != $('.update-users-repeat-password').val()){
      showFlashMessage('Uw wachtwoorden zijn niet gelijk aan elkaar', 'danger');
    }else{
      // console.log(users[rowSelected.split("index")[1]])
      $.post("include/updateUser.php" ,{
        id: users[index].id,
        name: $('.update-users-username').val(),
        pass: $('.update-users-password').val(),
        level: $('.update-user-level').val()
      }, function(response,status){
        // console.log(response)
        if(response == "succes"){
          $('.update-users').modal('hide');
          users[index].username = $('.update-users-username').val();
          // console.log($("."+rowSelected).find(".username"))
          // $('.options').trigger('click');
          updateLevel1Templates();
          // options
        }
      })
    }
  }
})

$('body').on('click','.update-users-cancel',function(){
  $('.update-users').modal('hide');
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
        $('#' + randStr).append('<button data-id="' + randStr + '" class="js-dismiss btn btn-block">Ok</button>');
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
    // console.log("logout")

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

            $(".new-user-name").val("");
            $(".new-user-password").val("");
            $(".new-user-options").removeAttr("selected");
            $(".new-user-option1").attr("selected","selected");

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
        // console.log(scenarios)

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

var confirmClassOld = "";
var deleteClassOld = "";
function confirmModal(title, body, confirmClass, deleteClass){
    if(deleteClass == undefined){
        deleteClass = "close-confirm"
    }
    if(confirmClass != "" && deleteClassOld != ""){
        $('.confirm-save-change').removeClass(confirmClassOld)
        $('.confirm-delete-change').removeClass(deleteClassOld)
    }
    $('.confirm-save-change').addClass(confirmClass)
    $('.confirm-delete-change').addClass(deleteClass)

    confirmClassOld = confirmClass;
    deleteClassOld = deleteClass;

    $('.confirm-title').text(title)
    $('.confirm-text').text(body)

    $('.js-confirm').modal("show")
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
    if($(".new-user-name").val() == ""){
      showFlashMessage('U heeft nog geen gebruikersnaam ingevuld', 'danger');
    }else if($(".new-user-password").val() == ""){
      showFlashMessage('U heeft nog geen passwoord ingevuld', 'danger');
    }else if($(".new-user-level").val() == null){
      showFlashMessage('U heeft nog geen level geselecteerd', 'danger');
    }
  }else{
    console.log($(".new-user-level").val())
    $.post("include/addUser.php",{
      username: $(".new-user-name").val(),
      userpassword: $(".new-user-password").val(),
      userlevel: $(".new-user-level").val()
    }, function(response,status){
      console.log(response)
      if(response == "success"){
        showFlashMessage('Er is een nieuwe gebruiker aangemaakt', 'success');
        $(".new-user-name").val("");
        $(".new-user-password").val("");
        $(".new-user-options").removeAttr("selected");
        $(".new-user-option1").attr("selected","selected");
      }
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
    // console.log("enter")
    if(e.which == 13) {
        $('.settings-update').trigger('click');
    }
});

$('body').on('click', '.settings', function(){
    // console.log("settings")
    $('.settings-username').val(loggedInUser.username)
    $('.user-settings').modal('show');
    // console.log(loggedInUser.username)
})

$('body').on('click', '.settings-update', function(){
    // console.log("update")
    // console.log($('.settings-username').val())
    // console.log($('.settings-password').val())
    // console.log($('.settings-repeat-password').val())

    if($('.settings-username').val() == "" || $('.settings-password').val() == ""){
        // console.log("gebruikersnaam en wachtwoord mogen niet leeg zijn");
        if($('.settings-username').val() == ""){
          showFlashMessage('U heeft geen gebruikersnaam ingevuld', 'danger');
        }else if($('.settings-password').val() == ""){
          showFlashMessage('U heeft geen wachtwoord ingevuld', 'danger');
        }
    }else{
        if($('.settings-password').val() != $('.settings-repeat-password').val()){
          showFlashMessage('Uw wachtwoorden zijn niet gelijk aan elkaar', 'danger');
        }else{
            // console.log(loggedInUser)
            $.post("include/updateUser.php" ,{
                id: loggedInUser.userID,
                name: $('.settings-username').val(),
                pass: $('.settings-password').val()
            }, function(response,status){
                // console.log(response);
                if(response == "succes"){
                    $('.user-settings').modal('hide');
                }
            });
        }
    }
});

$("body").on('click','.settings-cancel',function(){
  $('.user-settings').modal('hide');
})

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFkZFNjZW5hcmlvLmpzIiwiY2hlY2tBbGVydC5qcyIsImNsb3NlLWNvbmZpcm0uanMiLCJkZWxldGUtc2NlbmFyaW8uanMiLCJkZWxldGUtdXNlci5qcyIsImVkaXQtc2NlbmFyaW8uanMiLCJlZGl0LXVzZXIuanMiLCJmbGFzaC1tZXNzYWdlLmpzIiwiZnVuY3Rpb25zLmpzIiwiaG9tZS5qcyIsIm1ha2VBY3RpdmVTY2VuYXJpby5qcyIsIm5ldy11c2VyLmpzIiwib3B0aW9ucy5qcyIsInNlc3Npb25DaGVjay5qcyIsInNldHRpbmdzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3JFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDUEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3hCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUM5REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUM1REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ25FQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUM3S0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzFEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN0Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMzQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNsQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ1ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZXNDb250ZW50IjpbIiQoJ2JvZHknKS5vbigncHJvcGVydHljaGFuZ2UgaW5wdXQnLCAnLmpzLW5ld3N0ZXAnLGZ1bmN0aW9uKGUpe1xyXG4gICAgdmFyIHBhcmVudCA9ICQodGhpcykuY2xvc2VzdCgnLmpzLXN0ZXAnKVxyXG4gICAgaWYgKCQocGFyZW50KS5pcygnOmxhc3QtY2hpbGQnKSkge1xyXG4gICAgICAgIHZhciBucnN0ciA9ICQoJy5qcy1sYXN0bnInKS5odG1sKCk7XHJcbiAgICAgICAgdmFyIG5ld25yID0gcGFyc2VJbnQobnJzdHIpICsgMTtcclxuICAgICAgICAkKCcuanMtbGFzdG5yJykucmVtb3ZlQ2xhc3MoJ2pzLWxhc3RucicpO1xyXG4gICAgICAgICQoJy5qcy1jb3B5c3RlcCcpLmNsb25lKCkuYXBwZW5kVG8oJy5qcy1zdGVwcy1jb250YWluZXInKVxyXG4gICAgICAgIC5yZW1vdmVDbGFzcygnanMtY29weXN0ZXAnKS5yZW1vdmVDbGFzcygnaGlkZGVuJykuYWRkQ2xhc3MoJ2pzLXN0ZXAnKVxyXG4gICAgICAgIC5maW5kKCcuanMtbmV3bnInKS5yZW1vdmVDbGFzcygnanMtbmV3bnInKS5hZGRDbGFzcygnanMtbGFzdG5yJykuaHRtbChuZXducik7XHJcbiAgICAgICAgdXBkYXRlU3RlcHMoKTtcclxuICAgIH1cclxufSk7XHJcbmZ1bmN0aW9uIHVwZGF0ZVN0ZXBzKCl7XHJcbiAgICB2YXIgY291bnQgPSAxO1xyXG4gICAgJCgnLmpzLXN0ZXBucicpLmVhY2goZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICQodGhpcykuaHRtbChjb3VudCk7XHJcbiAgICAgICAgY291bnQrKztcclxuICAgIH0pO1xyXG59XHJcbiQoJ2JvZHknKS5vbignY2xpY2snLCAnLmpzLWFkZHN0ZXAnLGZ1bmN0aW9uKCl7XHJcbiAgICB2YXIgbnJzdHIgPSAkKCcuanMtbGFzdG5yJykuaHRtbCgpO1xyXG4gICAgdmFyIG5ld25yID0gcGFyc2VJbnQobnJzdHIpICsgMTtcclxuICAgICQoJy5qcy1sYXN0bnInKS5yZW1vdmVDbGFzcygnanMtbGFzdG5yJyk7XHJcbiAgICAkKCcuanMtY29weXN0ZXAnKS5jbG9uZSgpLmFwcGVuZFRvKCcuanMtc3RlcHMtY29udGFpbmVyJylcclxuICAgIC5yZW1vdmVDbGFzcygnanMtY29weXN0ZXAnKS5yZW1vdmVDbGFzcygnaGlkZGVuJykuYWRkQ2xhc3MoJ2pzLXN0ZXAnKVxyXG4gICAgLmZpbmQoJy5qcy1uZXducicpLnJlbW92ZUNsYXNzKCdqcy1uZXducicpLmFkZENsYXNzKCdqcy1sYXN0bnInKS5odG1sKG5ld25yKTtcclxuICAgIHVwZGF0ZVN0ZXBzKCk7XHJcbn0pO1xyXG4kKCdib2R5Jykub24oJ2NsaWNrJywgJy5qcy1zYXZlLW5ldy1zY2VuYXJpbycsZnVuY3Rpb24oKXtcclxuICAgIHZhciBuYW1lID0gJCgnLmpzLW5ldy1zY2VuYXJpby1uYW1lJykudmFsKCk7XHJcbiAgICB2YXIgc3RlcHMgPSBbXTtcclxuICAgIGlmIChuYW1lID09ICcnKSB7XHJcbiAgICAgICAgc2hvd0ZsYXNoTWVzc2FnZSgnVnVsIGVlcnN0IGVlbiBuYWFtIGluJywgJ2RhbmdlcicpO1xyXG4gICAgfVxyXG4gICAgZWxzZXtcclxuICAgICAgICAkKCcuanMtbmV3c3RlcCcpLmVhY2goZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICB2YXIgdGVtcHZhbCA9ICQodGhpcykudmFsKCk7XHJcbiAgICAgICAgICAgIGlmICh0ZW1wdmFsICE9IFwiXCIpIHtcclxuICAgICAgICAgICAgICAgIHN0ZXBzLnB1c2godGVtcHZhbCk7XHJcblxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgaWYgKHN0ZXBzLmxlbmd0aCA9PSAwKSB7XHJcbiAgICAgICAgICAgIHNob3dGbGFzaE1lc3NhZ2UoJ1Z1bCBtaW5zdGVucyAxIHN0YXAgaW4nLCAnZGFuZ2VyJyk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2V7XHJcbiAgICAgICAgICAgICQucG9zdChcImluY2x1ZGUvc2F2ZU5ld1NjZW5hcmlvLnBocFwiICx7XHJcbiAgICAgICAgICAgICAgICBuYW1lOiBuYW1lLFxyXG4gICAgICAgICAgICAgICAgc3RlcHM6IHN0ZXBzXHJcbiAgICAgICAgICAgIH0sIGZ1bmN0aW9uKHJlc3BvbnNlLHN0YXR1cyl7XHJcbiAgICAgICAgICAgICAgICBpZihyZXNwb25zZSA9PSBcInN1Y2Nlc1wiKXtcclxuICAgICAgICAgICAgICAgICAgICBzaG93Rmxhc2hNZXNzYWdlKCdTY2VuYXJpbyBzdWNjZXN2b2wgdG9lZ2V2b2VnZCcsICdzdWNjZXNzJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgJCgnLmpzLXN0ZXBzLWNvbnRhaW5lcicpLmh0bWwoJycpO1xyXG4gICAgICAgICAgICAgICAgICAgICQoJy5qcy1uZXctc2NlbmFyaW8tbmFtZScpLnZhbCgnJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgJCgnLmpzLWNvcHlzdGVwJykuY2xvbmUoKS5hcHBlbmRUbygnLmpzLXN0ZXBzLWNvbnRhaW5lcicpXHJcbiAgICAgICAgICAgICAgICAgICAgLnJlbW92ZUNsYXNzKCdqcy1jb3B5c3RlcCcpLnJlbW92ZUNsYXNzKCdoaWRkZW4nKVxyXG4gICAgICAgICAgICAgICAgICAgIC5hZGRDbGFzcygnanMtc3RlcCcpLmFkZENsYXNzKCdVbmlxdWV0ZW1wJylcclxuICAgICAgICAgICAgICAgICAgICAuZmluZCgnLmpzLW5ld25yJykucmVtb3ZlQ2xhc3MoJ2pzLW5ld25yJykuYWRkQ2xhc3MoJ2pzLWxhc3RucicpLmh0bWwoJzEnKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSlcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn0pO1xyXG5cclxuJCgnYm9keScpLm9uKCdjbGljaycsICcuanMtZGVsZXRlLXN0ZXAnLGZ1bmN0aW9uKCl7XHJcbiAgICB2YXIgcGFyZW50ID0gJCh0aGlzKS5jbG9zZXN0KCcuanMtc3RlcCcpO1xyXG4gICAgaWYgKCEkKHBhcmVudCkuaXMoJzpmaXJzdC1jaGlsZCcpKSB7XHJcbiAgICAgICAgJChwYXJlbnQpLnJlbW92ZSgpO1xyXG4gICAgICAgIHVwZGF0ZVN0ZXBzKCk7XHJcbiAgICB9XHJcbiAgICBlbHNlIHtcclxuICAgICAgICBzaG93Rmxhc2hNZXNzYWdlKCdKZSBrdW50IG5pZXQgZGUgZWVyc3RlIHN0YXAgdmVyd2lqZGVyZW4nLCAnZGFuZ2VyJyk7XHJcbiAgICB9XHJcbn0pO1xyXG4iLCJmdW5jdGlvbiBjaGVja0FsZXJ0KCkge1xyXG4gICAgaWYobG9nZ2VkSW5Vc2VyLmxldmVsID09IDMgJiYgIWFsZXJ0QWN0aXZlICYmIGxvZ2dlZEluID09IHRydWUpe1xyXG4gICAgICAgICQucG9zdChcImluY2x1ZGUvZ2V0U2NlbmFyaW9zQWN0aXZlLnBocFwiICx7XHJcbiAgICAgICAgICAgIGZpbmlzaGVkOiAwLFxyXG4gICAgICAgICAgICBhbGVydGVkOiAwXHJcbiAgICAgICAgfSwgZnVuY3Rpb24ocmVzcG9uc2Usc3RhdHVzKXtcclxuICAgICAgICAgICAgcmVzcG9uc2UgPSBKU09OLnBhcnNlKHJlc3BvbnNlKTtcclxuICAgICAgICAgICAgaWYocmVzcG9uc2UubGVuZ3RoID4gMCl7XHJcbiAgICAgICAgICAgICAgICAkKCcuc2NlbmFyaW8nKS5tb2RhbCgnc2hvdycpO1xyXG4gICAgICAgICAgICAgICAgJCgnLnNjZW5hcmlvLm1vZGFsJykuZmluZCgnLm1vZGFsLXRpdGxlJykuaHRtbChyZXNwb25zZVswXS5uYW1lICsgJyBpbiBsb2thYWw6ICcgKyByZXNwb25zZVswXS5sb2NhdGlvbik7XHJcbiAgICAgICAgICAgICAgICBhbGVydEFjdGl2ZSA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAkKCcuc2NlbmFyaW8ubW9kYWwnKS5maW5kKCcuanMtY2xvc2Utc2NlbmFyaW8tbW9kYWwnKS5hdHRyKCdkYXRhLWFjdGl2ZWlkJywgcmVzcG9uc2VbMF0uYWN0aXZlX2lkKTtcclxuICAgICAgICAgICAgICAgIGlmICghcmVzcG9uc2VbMF0udG9vbHMgKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgJCgnLnNjZW5hcmlvLm1vZGFsJykuZmluZCgnLm1vZGFsLWJvZHknKS5odG1sKCdEZSBkb2NlbnQgaGVlZnQgdG9lZ2FuZyB0b3QgZGV6ZSBodWxwbWlkZGVsZW4gdWl0Z2VzY2hha2VsZCcpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIHN0ZXBzID0gcmVzcG9uc2VbMF0uc3RlcHM7XHJcbiAgICAgICAgICAgICAgICAgICAgJCgnLnNjZW5hcmlvLm1vZGFsJykuZmluZCgnLm1vZGFsLWJvZHknKS5odG1sKCcnKTtcclxuICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHN0ZXBzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBzdGVwID0gaSArIDE7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICQoJy5zY2VuYXJpby5tb2RhbCcpLmZpbmQoJy5tb2RhbC1ib2R5JykuYXBwZW5kKCdTdGFwICcgKyBzdGVwICsgXCI6IFwiICsgc3RlcHNbaV0uZGVzY3JpcHRpb24gKyBcIjxicj5cIik7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSlcclxuICAgIH1cclxuICAgIGlmKGxvZ2dlZEluVXNlci5sZXZlbCA9PSAyICYmIGxvZ2dlZEluID09IHRydWUpe1xyXG4gICAgICAgICQucG9zdChcImluY2x1ZGUvZ2V0U2NlbmFyaW9zQWN0aXZlLnBocFwiLHtcclxuICAgICAgICAgICAgYWxlcnRlZDogMCxcclxuICAgICAgICAgICAgZmluaXNoZWQ6IDFcclxuICAgICAgICB9LCBmdW5jdGlvbihyZXNwb25zZSxzdGF0dXMpe1xyXG4gICAgICAgICAgICB2YXIgZGF0YSA9IEpTT04ucGFyc2UocmVzcG9uc2UpO1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhkYXRhKTtcclxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBkYXRhLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICBzaG93Rmxhc2hNZXNzYWdlKGRhdGFbaV0ubmFtZSArIFwiIGluIGxva2FhbDogXCIgKyBkYXRhW2ldLmxvY2F0aW9uICsgXCIgaXMgYWZnZXJvbmRcIiwgXCJzdWNjZXNzXCIsIHRydWUpO1xyXG4gICAgICAgICAgICAgICAgJC5wb3N0KFwiaW5jbHVkZS9maW5pc2hBY3RpdmVTY2VuYXJpby5waHBcIix7XHJcbiAgICAgICAgICAgICAgICAgICAgYWxlcnRlZDogMSxcclxuICAgICAgICAgICAgICAgICAgICBmaW5pc2hlZDogMSxcclxuICAgICAgICAgICAgICAgICAgICBhY3RpdmVpZDogZGF0YVtpXS5hY3RpdmVfaWRcclxuICAgICAgICAgICAgICAgIH0sIGZ1bmN0aW9uKHJlc3BvbnNlLHN0YXR1cyl7XHJcbiAgICAgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICB9KTtcclxuICAgIH1cclxuICAgIHNldFRpbWVvdXQoY2hlY2tBbGVydCwgMTAwMCk7XHJcbn1cclxuc2V0VGltZW91dChjaGVja0FsZXJ0LCAxMDAwKTtcclxuJCgnYm9keScpLm9uKCdjbGljaycsICcuanMtY2xvc2Utc2NlbmFyaW8tbW9kYWwnLCBmdW5jdGlvbigpe1xyXG4gICAgdmFyIGFjdGl2ZWlkID0gJCh0aGlzKS5hdHRyKCdkYXRhLWFjdGl2ZWlkJyk7XHJcbiAgICBjb25zb2xlLmxvZyhhY3RpdmVpZCk7XHJcbiAgICAkLnBvc3QoXCJpbmNsdWRlL2ZpbmlzaEFjdGl2ZVNjZW5hcmlvLnBocFwiLHtcclxuICAgICAgICBhY3RpdmVpZCA6IGFjdGl2ZWlkLFxyXG4gICAgICAgIGZpbmlzaGVkOiAxLFxyXG4gICAgICAgIGFsZXJ0ZWQ6IDBcclxuICAgICAgICB9LCBmdW5jdGlvbihyZXNwb25zZSxzdGF0dXMpe1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhyZXNwb25zZSk7XHJcbiAgICAgICAgICAgIGlmIChyZXNwb25zZSA9PSAnc3VjY2VzcycpIHtcclxuXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxufSk7XHJcbiQoJy5zY2VuYXJpbycpLm9uKCdoaWRkZW4uYnMubW9kYWwnLCBmdW5jdGlvbiAoKSB7XHJcbiAgICBjb25zb2xlLmxvZyhcImNsb3NlXCIpXHJcbiAgICBpZihsb2dnZWRJblVzZXIubGV2ZWwgPT0gMyAmJiBsb2dnZWRJbiA9PSB0cnVlKXtcclxuICAgICAgICBhbGVydEFjdGl2ZSA9IGZhbHNlO1xyXG4gICAgfVxyXG59KVxyXG4iLCIkKFwiYm9keVwiKS5vbignY2xpY2snLCcuY2xvc2UtY29uZmlybScsZnVuY3Rpb24oKXtcclxuICAkKCcuanMtY29uZmlybScpLm1vZGFsKFwiaGlkZVwiKVxyXG59KVxyXG5cclxuJChcImJvZHlcIikub24oJ2NsaWNrJywnLmNvbmZpcm0tc2F2ZS1jaGFuZ2UnLGZ1bmN0aW9uKCl7XHJcbiAgJCgnLmpzLWNvbmZpcm0nKS5tb2RhbChcImhpZGVcIilcclxufSlcclxuIiwidmFyIHJvd0NsYXNzO1xyXG52YXIgcm93O1xyXG4kKCdib2R5Jykub24oJ2NsaWNrJywgJy5sZXZlbDItYnRuLWRlbGV0ZScsZnVuY3Rpb24oKXtcclxuICBjb25maXJtTW9kYWwoXCJTZW5hcmlvIFZlcndpamRlcmVuXCIsXCJXZWV0IHUgemVrZXIgZGF0IHUgZGl0IHNjZW5hcmlvIHdpbHQgdmVyd2lqZGVyZW5cIixcImNvbmZpcm0tc2NlbmFyaW8tZGVsZXRlXCIpO1xyXG4gIHJvd0NsYXNzID0gJCh0aGlzKS5wYXJlbnQoKS5wYXJlbnQoKS5hdHRyKFwiY2xhc3NcIik7XHJcbiAgcm93ID0gJCh0aGlzKS5wYXJlbnQoKS5wYXJlbnQoKS5hdHRyKFwiY2xhc3NcIikuc3BsaXQoXCJpbmRleFwiKVsxXTtcclxufSlcclxuXHJcbiQoJ2JvZHknKS5vbignY2xpY2snLCcuY29uZmlybS1zY2VuYXJpby1kZWxldGUnLGZ1bmN0aW9uKCl7XHJcbiAgZm9yKHZhciBpID0gMDsgaSA8IHNjZW5hcmlvcy5sZW5ndGg7IGkrKyl7XHJcbiAgICBpZihzY2VuYXJpb3NbaV0uaWQgPT0gcm93KXtcclxuICAgICAgJC5wb3N0KFwiaW5jbHVkZS9kZWxldGVTY2VuYXJpb3MucGhwXCIgLHtcclxuICAgICAgICBpZDogc2NlbmFyaW9zW2ldLmlkXHJcbiAgICAgIH0sIGZ1bmN0aW9uKHJlc3BvbnNlLHN0YXR1cyl7XHJcbiAgICAgICAgY29uc29sZS5sb2cocmVzcG9uc2UpXHJcbiAgICAgICAgaWYocmVzcG9uc2UgPT0gXCJzdWNjZXNzdWNjZXNzdWNjZXNcIil7XHJcbiAgICAgICAgICBjb25zb2xlLmxvZyhyb3dDbGFzcylcclxuICAgICAgICAgIHNjZW5hcmlvcy5zcGxpY2UoaSwxKVxyXG4gICAgICAgICAgJChcIi5cIityb3dDbGFzcykucmVtb3ZlKCk7XHJcbiAgICAgICAgICB1cGRhdGVMZXZlbDJUZW1wbGF0ZXMoKTtcclxuICAgICAgICB9XHJcbiAgICAgIH0pXHJcbiAgICB9XHJcbiAgfVxyXG59KVxyXG4iLCJ2YXIgcm93Q2xhc3MgPSBcIlwiO1xyXG52YXIgcm93ID0gXCJcIjtcclxuJCgnYm9keScpLm9uKCdjbGljaycsICcubGV2ZWwxLWJ0bi1kZWxldGUnLGZ1bmN0aW9uKCl7XHJcbiAgY29uZmlybU1vZGFsKFwiR2VicnVpa2VyIFZlcndpamRlcmVuXCIsXCJXZWV0IHUgemVrZXIgZGF0IHUgZGV6ZSBnZWJydWlrZXIgd2lsdCB2ZXJ3aWpkZXJlblwiLFwiY29uZmlybS11c2VyLWRlbGV0ZVwiKTtcclxuICByb3dDbGFzcyA9ICQodGhpcykucGFyZW50KCkucGFyZW50KCkuYXR0cihcImNsYXNzXCIpO1xyXG4gIHJvdyA9ICQodGhpcykucGFyZW50KCkucGFyZW50KCkuYXR0cihcImNsYXNzXCIpLnNwbGl0KFwiaW5kZXhcIilbMV07XHJcbiAgY29uc29sZS5sb2codXNlcnMpXHJcbn0pXHJcblxyXG4kKFwiYm9keVwiKS5vbignY2xpY2snLCcuY29uZmlybS11c2VyLWRlbGV0ZScsZnVuY3Rpb24oKXtcclxuICBjb25zb2xlLmxvZyhcInVzZXItZGVsZXRlXCIpXHJcbiAgZm9yKHZhciBpID0gMDsgaSA8IHVzZXJzLmxlbmd0aDsgaSsrKXtcclxuICAgIGlmKHVzZXJzW2ldLmlkID09IHJvdyl7XHJcbiAgICAgICQucG9zdChcImluY2x1ZGUvZGVsZXRlVXNlci5waHBcIiAse1xyXG4gICAgICAgIGlkOiB1c2Vyc1tpXS5pZFxyXG4gICAgICB9LCBmdW5jdGlvbihyZXNwb25zZSxzdGF0dXMpe1xyXG4gICAgICAgIGlmKHJlc3BvbnNlID09IFwic3VjY2VzXCIpe1xyXG4gICAgICAgICAgc2hvd0ZsYXNoTWVzc2FnZSgnVSBoZWVmdCBkZSBnZWJydWlrZXIgc3VjY2Vzdm9sIHZlcndpamRlcmQnLCAnc3VjY2VzcycpO1xyXG4gICAgICAgICAgJChcIi5cIityb3dDbGFzcykucmVtb3ZlKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9KVxyXG4gICAgfVxyXG4gIH1cclxufSlcclxuIiwidmFyIHJvd1NlbGVjdGVkID0gMDtcclxudmFyIGluZGV4ID0gMDtcclxudmFyIGRlc2NyaXB0aW9ucyA9IFtdO1xyXG4kKCdib2R5Jykub24oJ2NsaWNrJywgJy5sZXZlbDItYnRuLWVkaXQnLCBmdW5jdGlvbigpe1xyXG4gIHJvd1NlbGVjdGVkID0gJCh0aGlzKS5wYXJlbnQoKS5wYXJlbnQoKS5hdHRyKFwiY2xhc3NcIik7XHJcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBzY2VuYXJpb3MubGVuZ3RoOyBpKyspe1xyXG4gICAgaWYoc2NlbmFyaW9zW2ldLmlkID09IHJvd1NlbGVjdGVkLnNwbGl0KFwiaW5kZXhcIilbMV0pe1xyXG4gICAgICBpbmRleCA9IGlcclxuICAgIH1cclxuICB9XHJcblxyXG4gICQucG9zdChcImluY2x1ZGUvZ2V0U2NlbmVyaW9EZXNjLnBocFwiICx7XHJcbiAgICBpZDogc2NlbmFyaW9zW2luZGV4XS5pZFxyXG4gIH0sIGZ1bmN0aW9uKHJlc3BvbnNlLHN0YXR1cyl7XHJcbiAgICBkZXNjcmlwdGlvbnMgPSBKU09OLnBhcnNlKHJlc3BvbnNlKVxyXG5cclxuICAgIGRlc2NyaXB0aW9ucy5tYXAoZnVuY3Rpb24oY3AsaSl7XHJcbiAgICAgIGNwLmluZGV4ID0gaSsxO1xyXG4gICAgfSlcclxuICAgIGNvbnNvbGUubG9nKGRlc2NyaXB0aW9ucylcclxuXHJcbiAgICB2YXIgdGVtcGxhdGUgPSAkKFwiLmxldmVsMi1zY2VuYXJpby1lZGl0LXRlbXBsYXRlXCIpLmh0bWwoKTtcclxuICAgIHZhciByZW5kZXJUZW1wbGF0ZSA9IE11c3RhY2hlLnJlbmRlcih0ZW1wbGF0ZSwgZGVzY3JpcHRpb25zKTtcclxuXHJcbiAgICAkKFwiLnNjZW5hcmlvLWVkaXQtb3B0aW9ucy1jb250YWluZXJcIikuaHRtbChyZW5kZXJUZW1wbGF0ZSk7XHJcblxyXG4gICAgJCgnLnNjZW5hcmlvLWVkaXQnKS5tb2RhbCgnc2hvdycpO1xyXG4gICAgJCgnLnVwZGF0ZS1zY2VuYXJpb3MtbmFtZScpLnZhbChzY2VuYXJpb3NbaW5kZXhdLm5hbWUpXHJcbiAgfSlcclxufSlcclxuXHJcbiQoJ2JvZHknKS5vbignY2xpY2snLCAnLnVwZGF0ZS1zY2VuYXJpb3MtdXBkYXRlJywgZnVuY3Rpb24oKXtcclxuICBkZXNjcmlwdGlvbk5hbWVzID0gW107XHJcbiAgY29uc29sZS5sb2coc2NlbmFyaW9zW2luZGV4XSlcclxuICBmb3IodmFyIGkgPSAxIDsgaSA8IChkZXNjcmlwdGlvbnMubGVuZ3RoKzEpOyBpKyspe1xyXG4gICAgaWYoJCgnLmpzLXNjZW5hcmlvLWVkaXQtJytpKS52YWwoKSAhPSBcIlwiKXtcclxuICAgICAgZGVzY3JpcHRpb25OYW1lcy5wdXNoKCQoJy5qcy1zY2VuYXJpby1lZGl0LScraSkudmFsKCkpXHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBjb25zb2xlLmxvZyhkZXNjcmlwdGlvbk5hbWVzKVxyXG5cclxuICAkLnBvc3QoXCJpbmNsdWRlL3VwZGF0ZVNjZW5hcmlvLnBocFwiICx7XHJcbiAgICBzY2VuYXJpb0lEOiBzY2VuYXJpb3NbaW5kZXhdLmlkLFxyXG4gICAgbmFtZTogJCgnLnVwZGF0ZS1zY2VuYXJpb3MtbmFtZScpLnZhbCgpLFxyXG4gICAgZGVzY3JpcHRpb25zOiBkZXNjcmlwdGlvbnNcclxuICB9LCBmdW5jdGlvbihyZXNwb25zZSxzdGF0dXMpe1xyXG4gICAgY29uc29sZS5sb2cocmVzcG9uc2UpXHJcbiAgICAkKCcuc2NlbmFyaW8tZWRpdCcpLm1vZGFsKCdoaWRlJyk7XHJcbiAgfSlcclxufSlcclxuXHJcbiQoJ2JvZHknKS5vbignY2xpY2snLCAnLmpzLXNjZW5hcmlvLWVkaXQtZGVsZXRlJyxmdW5jdGlvbigpe1xyXG4gICAgdmFyIHBhcmVudCA9ICQodGhpcykuY2xvc2VzdCgnLmpzLXNjZW5hcmlvLWVkaXQtc3RlcCcpO1xyXG4gICAgaWYgKCEkKHBhcmVudCkuaXMoJzpmaXJzdC1jaGlsZCcpKSB7XHJcbiAgICAgICAgJChwYXJlbnQpLnJlbW92ZSgpO1xyXG4gICAgICAgIHVwZGF0ZVN0ZXBzKCk7XHJcbiAgICB9XHJcbiAgICBlbHNlIHtcclxuICAgICAgICBzaG93Rmxhc2hNZXNzYWdlKCdKZSBrdW50IG5pZXQgZGUgZWVyc3RlIHN0YXAgdmVyd2lqZGVyZW4nLCAnZGFuZ2VyJyk7XHJcbiAgICB9XHJcbn0pO1xyXG4iLCJ2YXIgcm93U2VsZWN0ZWQgPSAwO1xyXG52YXIgaW5kZXggPSAwO1xyXG4kKCdib2R5Jykub24oJ2NsaWNrJywgJy5sZXZlbDEtYnRuLWVkaXQnLCBmdW5jdGlvbigpe1xyXG4gIHJvd1NlbGVjdGVkID0gJCh0aGlzKS5wYXJlbnQoKS5wYXJlbnQoKS5hdHRyKFwiY2xhc3NcIik7XHJcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCB1c2Vycy5sZW5ndGg7IGkrKyl7XHJcbiAgICBpZih1c2Vyc1tpXS5pZCA9PSByb3dTZWxlY3RlZC5zcGxpdChcImluZGV4XCIpWzFdKXtcclxuICAgICAgaW5kZXggPSBpXHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICAkKCcudXBkYXRlLXVzZXJzJykubW9kYWwoJ3Nob3cnKTtcclxuICAkKCcudXBkYXRlLXVzZXJzLXVzZXJuYW1lJykudmFsKHVzZXJzW2luZGV4XS51c2VybmFtZSlcclxuICAkKCcudXBkYXRlLXVzZXItb3B0aW9ucycpLnJlbW92ZUF0dHIoXCJzZWxlY3RlZFwiKVxyXG5cclxuICBpZih1c2Vyc1tpbmRleF0udXNlcmxldmVsID09IDIpe1xyXG4gICAgJCgnLnVwZGF0ZS11c2VyLW9wdGlvbjInKS5hdHRyKFwic2VsZWN0ZWRcIixcInNlbGVjdGVkXCIpXHJcbiAgfWVsc2V7XHJcbiAgICAkKCcudXBkYXRlLXVzZXItb3B0aW9uMScpLmF0dHIoXCJzZWxlY3RlZFwiLFwic2VsZWN0ZWRcIilcclxuICB9XHJcbn0pXHJcblxyXG4kKCdib2R5Jykub24oJ2NsaWNrJywgJy51cGRhdGUtdXNlcnMtdXBkYXRlJywgZnVuY3Rpb24oKXtcclxuICAvLyBjb25zb2xlLmxvZyhcInVwZGF0ZVwiKVxyXG4gIC8vIGNvbnNvbGUubG9nKCQoJy51cGRhdGUtdXNlcnMtdXNlcm5hbWUnKS52YWwoKSlcclxuICAvLyBjb25zb2xlLmxvZygkKCcudXBkYXRlLXVzZXJzLXBhc3N3b3JkJykudmFsKCkpXHJcbiAgLy8gY29uc29sZS5sb2coJCgnLnVwZGF0ZS11c2Vycy1yZXBlYXQtcGFzc3dvcmQnKS52YWwoKSlcclxuXHJcbiAgaWYoJCgnLnVwZGF0ZS11c2Vycy11c2VybmFtZScpLnZhbCgpID09IFwiXCIpe1xyXG4gICAgY29uc29sZS5sb2coXCJnZWJydWlrZXJzbmFhbSBlbiB3YWNodHdvb3JkIG1vZ2VuIG5pZXQgbGVlZyB6aWpuXCIpO1xyXG4gICAgc2hvd0ZsYXNoTWVzc2FnZSgnR2VicnVpa2VycyBuYWFtIG1hZyBuaWV0IGxlZWcgemlqbicsICdkYW5nZXInKTtcclxuICB9ZWxzZXtcclxuICAgIGlmKCQoJy51cGRhdGUtdXNlcnMtdXNlcm5hbWUnKS52YWwoKSA9PSBcIlwiKXtcclxuICAgICAgc2hvd0ZsYXNoTWVzc2FnZSgnVXcgZ2VicnVpa2Vyc25hYW0gbWFnIG5pZXQgbGVlZyB6aWpuJywgJ2RhbmdlcicpO1xyXG4gICAgfWVsc2UgaWYoJCgnLnVwZGF0ZS11c2Vycy1wYXNzd29yZCcpLnZhbCgpICE9ICQoJy51cGRhdGUtdXNlcnMtcmVwZWF0LXBhc3N3b3JkJykudmFsKCkpe1xyXG4gICAgICBzaG93Rmxhc2hNZXNzYWdlKCdVdyB3YWNodHdvb3JkZW4gemlqbiBuaWV0IGdlbGlqayBhYW4gZWxrYWFyJywgJ2RhbmdlcicpO1xyXG4gICAgfWVsc2V7XHJcbiAgICAgIC8vIGNvbnNvbGUubG9nKHVzZXJzW3Jvd1NlbGVjdGVkLnNwbGl0KFwiaW5kZXhcIilbMV1dKVxyXG4gICAgICAkLnBvc3QoXCJpbmNsdWRlL3VwZGF0ZVVzZXIucGhwXCIgLHtcclxuICAgICAgICBpZDogdXNlcnNbaW5kZXhdLmlkLFxyXG4gICAgICAgIG5hbWU6ICQoJy51cGRhdGUtdXNlcnMtdXNlcm5hbWUnKS52YWwoKSxcclxuICAgICAgICBwYXNzOiAkKCcudXBkYXRlLXVzZXJzLXBhc3N3b3JkJykudmFsKCksXHJcbiAgICAgICAgbGV2ZWw6ICQoJy51cGRhdGUtdXNlci1sZXZlbCcpLnZhbCgpXHJcbiAgICAgIH0sIGZ1bmN0aW9uKHJlc3BvbnNlLHN0YXR1cyl7XHJcbiAgICAgICAgLy8gY29uc29sZS5sb2cocmVzcG9uc2UpXHJcbiAgICAgICAgaWYocmVzcG9uc2UgPT0gXCJzdWNjZXNcIil7XHJcbiAgICAgICAgICAkKCcudXBkYXRlLXVzZXJzJykubW9kYWwoJ2hpZGUnKTtcclxuICAgICAgICAgIHVzZXJzW2luZGV4XS51c2VybmFtZSA9ICQoJy51cGRhdGUtdXNlcnMtdXNlcm5hbWUnKS52YWwoKTtcclxuICAgICAgICAgIC8vIGNvbnNvbGUubG9nKCQoXCIuXCIrcm93U2VsZWN0ZWQpLmZpbmQoXCIudXNlcm5hbWVcIikpXHJcbiAgICAgICAgICAvLyAkKCcub3B0aW9ucycpLnRyaWdnZXIoJ2NsaWNrJyk7XHJcbiAgICAgICAgICB1cGRhdGVMZXZlbDFUZW1wbGF0ZXMoKTtcclxuICAgICAgICAgIC8vIG9wdGlvbnNcclxuICAgICAgICB9XHJcbiAgICAgIH0pXHJcbiAgICB9XHJcbiAgfVxyXG59KVxyXG5cclxuJCgnYm9keScpLm9uKCdjbGljaycsJy51cGRhdGUtdXNlcnMtY2FuY2VsJyxmdW5jdGlvbigpe1xyXG4gICQoJy51cGRhdGUtdXNlcnMnKS5tb2RhbCgnaGlkZScpO1xyXG59KVxyXG4iLCJ2YXIgZmxhc2hNZXNzYWdlcyA9IFtdO1xyXG5mdW5jdGlvbiBzaG93Rmxhc2hNZXNzYWdlKG1lcywgdHlwZSwgZGlzbWlzc2FibGUgPSBmYWxzZSwgc2VjcyA9IDIwMDApe1xyXG4gICAgdmFyIHJhbmRTdHIgPSByYW5kb21TdHJpbmcyKDIwKTtcclxuICAgICQoJy5qcy1mbC1jb250JykuYXBwZW5kKCc8ZGl2IGlkPVwiJyArIHJhbmRTdHIgKyAnXCIgY2xhc3M9XCJqcy1mbGFzaCBhbGVydC0nICsgdHlwZSArICcgZmxhc2gtbWVzc2FnZVwiPicrIG1lcyArICc8L2Rpdj4nKTtcclxuICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICQoJyMnICsgcmFuZFN0cikuYWRkQ2xhc3MoJ2ZsYXNoLW1lc3NhZ2UtLXNob3cnKTtcclxuICAgIH0sIDEpO1xyXG4gICAgaWYgKCFkaXNtaXNzYWJsZSkge1xyXG4gICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICBkZWxldGVGbGFzaE1lc3NhZ2UocmFuZFN0cik7XHJcbiAgICAgICAgfSwgc2Vjcyk7XHJcbiAgICB9XHJcbiAgICBlbHNle1xyXG4gICAgICAgICQoJyMnICsgcmFuZFN0cikuYXBwZW5kKCc8YnV0dG9uIGRhdGEtaWQ9XCInICsgcmFuZFN0ciArICdcIiBjbGFzcz1cImpzLWRpc21pc3MgYnRuIGJ0bi1ibG9ja1wiPk9rPC9idXR0b24+Jyk7XHJcbiAgICB9XHJcbn1cclxuPDw8PDw8PCBIRUFEXHJcbj09PT09PT1cclxuLy8gc2hvd0ZsYXNoTWVzc2FnZSgnaGFsbG9hc2RramFzZGtqZGhhc2thc2Roa2phc2Roa2FzZGpoc2Fka2poc2RramhkJywnc3VjY2VzcycsIHRydWUpO1xyXG4vLyBzaG93Rmxhc2hNZXNzYWdlKCdoYWxsb2FzZGtqYXNka2pkaGFza2FzZGhramFzZGhrYXNkamhzYWRramhzZGtqaGQnLCdkYW5nZXInLCB0cnVlKTtcclxuLy8gc2hvd0ZsYXNoTWVzc2FnZSgnaGFsbG9hc2RramFzZGtqZGhhc2thc2Roa2phc2Roa2FzZGpoc2Fka2poc2RramhkJywnd2FybmluZycsIHRydWUpO1xyXG4+Pj4+Pj4+IDU2NDUwOTI0NGYzYTYxYWU1N2Q5YmMzNjgzYTEzMGZiYzhhMDRmZDNcclxuJCgnYm9keScpLm9uKCdjbGljaycsICcuanMtZGlzbWlzcycsIGZ1bmN0aW9uKCl7XHJcbiAgICB2YXIgZGVsc3RyID0gJCh0aGlzKS5kYXRhKCdpZCcpO1xyXG4gICAgZGVsZXRlRmxhc2hNZXNzYWdlKGRlbHN0cik7XHJcbn0pO1xyXG5cclxuZnVuY3Rpb24gZGVsZXRlRmxhc2hNZXNzYWdlKGlkKXtcclxuICAgICQoJyMnICsgaWQpLnJlbW92ZUNsYXNzKCdmbGFzaC1tZXNzYWdlLS1zaG93Jyk7XHJcbiAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAkKCcjJyArIGlkKS5yZW1vdmUoKTtcclxuICAgIH0sIDIwMCk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHJhbmRvbVN0cmluZzIobGVuLCBiZWZvcmVzdHIgPSAnJywgYXJyYXl0b2NoZWNrID0gbnVsbCkge1xyXG4gICAgLy8gQ2hhcnNldCwgZXZlcnkgY2hhcmFjdGVyIGluIHRoaXMgc3RyaW5nIGlzIGFuIG9wdGlvbmFsIG9uZSBpdCBjYW4gdXNlIGFzIGEgcmFuZG9tIGNoYXJhY3Rlci5cclxuICAgIHZhciBjaGFyU2V0ID0gJ0FCQ0RFRkdISUpLTE1OT1BRUlNUVVZXWFlaYWJjZGVmZ2hpamtsbW5vcHFyc3R1dnd4eXonO1xyXG4gICAgdmFyIHJhbmRvbVN0cmluZyA9ICcnO1xyXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW47IGkrKykge1xyXG4gICAgICAgIC8vIGNyZWF0ZXMgYSByYW5kb20gbnVtYmVyIGJldHdlZW4gMCBhbmQgdGhlIGNoYXJTZXQgbGVuZ3RoLiBSb3VuZHMgaXQgZG93biB0byBhIHdob2xlIG51bWJlclxyXG4gICAgICAgIHZhciByYW5kb21Qb3ogPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiBjaGFyU2V0Lmxlbmd0aCk7XHJcbiAgICAgICAgcmFuZG9tU3RyaW5nICs9IGNoYXJTZXQuc3Vic3RyaW5nKHJhbmRvbVBveiwgcmFuZG9tUG96ICsgMSk7XHJcbiAgICB9XHJcbiAgICAvLyBJZiBhbiBhcnJheSBpcyBnaXZlbiBpdCB3aWxsIGNoZWNrIHRoZSBhcnJheSwgYW5kIGlmIHRoZSBnZW5lcmF0ZWQgc3RyaW5nIGV4aXN0cyBpbiBpdCBpdCB3aWxsIGNyZWF0ZSBhIG5ldyBvbmUgdW50aWwgYSB1bmlxdWUgb25lIGlzIGZvdW5kICpXQVRDSCBPVVQuIElmIGFsbCBhdmFpbGFibGUgb3B0aW9ucyBhcmUgdXNlZCBpdCB3aWxsIGNhdXNlIGEgbG9vcCBpdCBjYW5ub3QgYnJlYWsgb3V0KlxyXG4gICAgaWYgKGFycmF5dG9jaGVjayA9PSBudWxsKSB7XHJcbiAgICAgICAgcmV0dXJuIGJlZm9yZXN0ciArIHJhbmRvbVN0cmluZztcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICAgdmFyIGlzSW4gPSAkLmluQXJyYXkoYmVmb3Jlc3RyICsgcmFuZG9tU3RyaW5nLCBhcnJheXRvY2hlY2spOyAvLyBjaGVja3MgaWYgdGhlIHN0cmluZyBpcyBpbiB0aGUgYXJyYXksIHJldHVybnMgYSBwb3NpdGlvblxyXG4gICAgICAgIGlmIChpc0luID4gLTEpIHtcclxuICAgICAgICAgICAgLy8gaWYgdGhlIHBvc2l0aW9uIGlzIG5vdCAtMSAobWVhbmluZywgaXQgaXMgbm90IGluIHRoZSBhcnJheSkgaXQgd2lsbCBzdGFydCBkb2luZyBhIGxvb3BcclxuICAgICAgICAgICAgdmFyIGNvdW50ID0gMDtcclxuICAgICAgICAgICAgZG8ge1xyXG4gICAgICAgICAgICAgICAgcmFuZG9tU3RyaW5nID0gJyc7XHJcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbjsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIHJhbmRvbVBveiA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIGNoYXJTZXQubGVuZ3RoKTtcclxuICAgICAgICAgICAgICAgICAgICByYW5kb21TdHJpbmcgKz0gY2hhclNldC5zdWJzdHJpbmcocmFuZG9tUG96LCByYW5kb21Qb3ogKyAxKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGlzSW4gPSAkLmluQXJyYXkoYmVmb3Jlc3RyICsgcmFuZG9tU3RyaW5nLCBhcnJheXRvY2hlY2spO1xyXG4gICAgICAgICAgICAgICAgY291bnQrKztcclxuICAgICAgICAgICAgfSB3aGlsZSAoaXNJbiA+IC0xKTtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coJ2l0IHRvb2sgJyArIGNvdW50ICsgJyB0cmllcycpO1xyXG4gICAgICAgICAgICByZXR1cm4gYmVmb3Jlc3RyICsgcmFuZG9tU3RyaW5nO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHJldHVybiBiZWZvcmVzdHIgKyByYW5kb21TdHJpbmc7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcbiIsImZ1bmN0aW9uIGxvZ2luKGFfdXNlckxldmVsKXtcclxuICAgICQoJy5sb2dpbi1jb250YWluZXInKS5hZGRDbGFzcyhcImhpZGRlblwiKTtcclxuICAgICQoJy5sb2dpbi1zdGF0dXMnKS50ZXh0KFwiV2Vsa29tOiBcIitsb2dnZWRJblVzZXIudXNlcm5hbWUgKyBcIiAgICBcIilcclxuICAgICQoJy5sb2dvdXQnKS5yZW1vdmVDbGFzcyhcImhpZGRlblwiKVxyXG4gICAgbG9nZ2VkSW4gPSB0cnVlO1xyXG4gICAgdXNlckxldmVsID0gYV91c2VyTGV2ZWw7XHJcblxyXG4gICAgJChcIi51c2VyLWxldmVsXCIpLmFkZENsYXNzKFwiaGlkZGVuXCIpXHJcbiAgICAkKFwiLnZpZXdcIikuYWRkQ2xhc3MoXCJoaWRkZW5cIilcclxuXHJcbiAgICBzd2l0Y2ggKHVzZXJMZXZlbCkge1xyXG4gICAgICAgIGNhc2UgMTpcclxuICAgICAgICAkKFwiLnVzZXItbGV2ZWxfMVwiKS5yZW1vdmVDbGFzcyhcImhpZGRlblwiKVxyXG4gICAgICAgICQoXCIudmlld18xLTFcIikucmVtb3ZlQ2xhc3MoXCJoaWRkZW5cIilcclxuICAgICAgICAkKFwiLm9wdGlvbl8xXCIpLmFkZENsYXNzKFwib3B0aW9ucy0tYWN0aXZlXCIpXHJcbiAgICAgICAgJCgnLnNldHRpbmdzJykucmVtb3ZlQ2xhc3MoXCJoaWRkZW5cIilcclxuICAgICAgICB1cGRhdGVMZXZlbDFUZW1wbGF0ZXMoKTtcclxuICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlIDI6XHJcbiAgICAgICAgJChcIi51c2VyLWxldmVsXzJcIikucmVtb3ZlQ2xhc3MoXCJoaWRkZW5cIilcclxuICAgICAgICAkKFwiLnZpZXdfMi0xXCIpLnJlbW92ZUNsYXNzKFwiaGlkZGVuXCIpXHJcbiAgICAgICAgJChcIi5vcHRpb25fMVwiKS5hZGRDbGFzcyhcIm9wdGlvbnMtLWFjdGl2ZVwiKVxyXG4gICAgICAgICQoJy5zZXR0aW5ncycpLnJlbW92ZUNsYXNzKFwiaGlkZGVuXCIpXHJcbiAgICAgICAgdXBkYXRlTGV2ZWwyVGVtcGxhdGVzKCk7XHJcbiAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSAzOlxyXG4gICAgICAgICQoXCIudXNlci1sZXZlbF8zXCIpLnJlbW92ZUNsYXNzKFwiaGlkZGVuXCIpXHJcbiAgICAgICAgYnJlYWs7XHJcbiAgICB9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGxvZ291dCgpe1xyXG4gICAgJCgnLmxvZ2luLWNvbnRhaW5lcicpLnJlbW92ZUNsYXNzKFwiaGlkZGVuXCIpO1xyXG4gICAgJCgnLmxvZ2luLXN0YXR1cycpLnRleHQoXCJVIGJlbnQgbm9nIG5pZXQgaW5nZWxvZ2RcIilcclxuICAgICQoJy5sb2dvdXQnKS5hZGRDbGFzcyhcImhpZGRlblwiKVxyXG4gICAgJChcIi51c2VyLWxldmVsXCIpLmFkZENsYXNzKFwiaGlkZGVuXCIpXHJcbiAgICAkKCcuc2V0dGluZ3MnKS5hZGRDbGFzcyhcImhpZGRlblwiKVxyXG4gICAgbG9nZ2VkSW4gPSBmYWxzZTtcclxuICAgIHVzZXJMZXZlbCA9IDA7XHJcbiAgICAvLyBjb25zb2xlLmxvZyhcImxvZ291dFwiKVxyXG5cclxuICAgICQucG9zdChcImluY2x1ZGUvbG9naW4ucGhwXCIse1xyXG4gICAgICAgIGxvZ291dFN1YjogJydcclxuICAgIH0sIGZ1bmN0aW9uKHJlc3BvbnNlLHN0YXR1cyl7XHJcbiAgICAgICAgc2hvd0ZsYXNoTWVzc2FnZSgnSmUgYmVudCB1aXRnZWxvZ2QnLCAnc3VjY2VzcycpO1xyXG4gICAgfSlcclxufVxyXG5cclxuZnVuY3Rpb24gdXBkYXRlTGV2ZWwxVGVtcGxhdGVzKCl7XHJcbiAgICAkLnBvc3QoXCJpbmNsdWRlL2dldFVzZXJzLnBocFwiLHtcclxuICAgIH0sIGZ1bmN0aW9uKHJlc3BvbnNlLHN0YXR1cyl7XHJcbiAgICAgICAgLy8gY29uc29sZS5sb2cocmVzcG9uc2UpXHJcbiAgICAgICAgdXNlcnMgPSBKU09OLnBhcnNlKHJlc3BvbnNlKVxyXG5cclxuICAgICAgICBmb3IodmFyIGkgPSAwOyBpIDwgMjsgaSsrKXtcclxuICAgICAgICAgICAgLy8gY29uc29sZS5sb2coaSlcclxuICAgICAgICAgICAgdXNlcnMubWFwKGZ1bmN0aW9uKGNwLGope1xyXG4gICAgICAgICAgICAgICAgY3AuaW5kZXggPSBjcC5pZDtcclxuICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKGkpXHJcbiAgICAgICAgICAgICAgICBpZihjcC51c2VybGV2ZWwgPT0gMil7XHJcbiAgICAgICAgICAgICAgICAgICAgY3AubGV2ZWwgPSBcIkRvY2VudFwiXHJcbiAgICAgICAgICAgICAgICB9ZWxzZSBpZihjcC51c2VybGV2ZWwgPT0gMyl7XHJcbiAgICAgICAgICAgICAgICAgICAgY3AubGV2ZWwgPSBcIlN0dWRlbnRcIlxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgaWYoaSA9PSAwKXtcclxuICAgICAgICAgICAgICAgICAgICBjcC5jbGFzcyA9IFwiZWRpdFwiXHJcbiAgICAgICAgICAgICAgICAgICAgY3AuY2xhc3NUZXh0ID0gXCJhYW5wYXNzZW5cIlxyXG4gICAgICAgICAgICAgICAgfWVsc2UgaWYoaSA9PSAxKXtcclxuICAgICAgICAgICAgICAgICAgICBjcC5jbGFzcyA9IFwiZGVsZXRlXCJcclxuICAgICAgICAgICAgICAgICAgICBjcC5jbGFzc1RleHQgPSBcInZlcndpamRlcmVuXCJcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSlcclxuXHJcbiAgICAgICAgICAgIGZvcih2YXIgaiA9IDA7IGogPCB1c2Vycy5sZW5ndGg7IGorKyl7XHJcbiAgICAgICAgICAgICAgICBpZih1c2Vyc1tqXS51c2VybGV2ZWwgPT0gMSl7XHJcbiAgICAgICAgICAgICAgICAgICAgdXNlcnMuc3BsaWNlKGosMSlcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgJChcIi5uZXctdXNlci1uYW1lXCIpLnZhbChcIlwiKTtcclxuICAgICAgICAgICAgJChcIi5uZXctdXNlci1wYXNzd29yZFwiKS52YWwoXCJcIik7XHJcbiAgICAgICAgICAgICQoXCIubmV3LXVzZXItb3B0aW9uc1wiKS5yZW1vdmVBdHRyKFwic2VsZWN0ZWRcIik7XHJcbiAgICAgICAgICAgICQoXCIubmV3LXVzZXItb3B0aW9uMVwiKS5hdHRyKFwic2VsZWN0ZWRcIixcInNlbGVjdGVkXCIpO1xyXG5cclxuICAgICAgICAgICAgLy8gY29uc29sZS5sb2codXNlcnMpXHJcblxyXG4gICAgICAgICAgICB2YXIgdGVtcGxhdGUgPSAkKFwiLmxldmVsMS11c2VyLXRlbXBsYXRlXCIpLmh0bWwoKTtcclxuICAgICAgICAgICAgdmFyIHJlbmRlclRlbXBsYXRlID0gTXVzdGFjaGUucmVuZGVyKHRlbXBsYXRlLCB1c2Vycyk7XHJcblxyXG4gICAgICAgICAgICBpZihpID09IDApe1xyXG4gICAgICAgICAgICAgICAgJChcIi51c2VyLWxldmVsMS1lZGl0XCIpLmh0bWwocmVuZGVyVGVtcGxhdGUpO1xyXG4gICAgICAgICAgICB9ZWxzZSBpZihpID09IDEpe1xyXG4gICAgICAgICAgICAgICAgJChcIi51c2VyLWxldmVsMS1kZWxldGVcIikuaHRtbChyZW5kZXJUZW1wbGF0ZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9KVxyXG59XHJcblxyXG5mdW5jdGlvbiB1cGRhdGVMZXZlbDJUZW1wbGF0ZXMoKXtcclxuICAgICQucG9zdChcImluY2x1ZGUvZ2V0U2NlbmFyaW9zLnBocFwiLHtcclxuICAgIH0sIGZ1bmN0aW9uKHJlc3BvbnNlLHN0YXR1cyl7XHJcbiAgICAgICAgc2NlbmFyaW9zID0gSlNPTi5wYXJzZShyZXNwb25zZSlcclxuICAgICAgICAvLyBjb25zb2xlLmxvZyhzY2VuYXJpb3MpXHJcblxyXG4gICAgICAgICQoJy5zY2VuYXJpby1zZWxlY3RvcicpLmh0bWwoXCJcIilcclxuICAgICAgICBmb3IodmFyIGkgPSAwIDsgaSA8IHNjZW5hcmlvcy5sZW5ndGg7IGkrKyl7XHJcbiAgICAgICAgICAgICQoJy5zY2VuYXJpby1zZWxlY3RvcicpLmFwcGVuZCgnPG9wdGlvbiBkYXRhLWlkPVwiJyArIHNjZW5hcmlvc1tpXS5pZCAgKyAnXCI+JyArIHNjZW5hcmlvc1tpXS5uYW1lICsgXCI8L29wdGlvbj5cIilcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIGZvcih2YXIgaSA9IDA7IGkgPCAyOyBpKyspe1xyXG5cclxuICAgICAgICB2YXIgdGVtcGxhdGUgPSAkKFwiLmxldmVsMi1zY2VuYXJpby10ZW1wbGF0ZVwiKS5odG1sKCk7XHJcbiAgICAgICAgdmFyIHJlbmRlclRlbXBsYXRlID0gTXVzdGFjaGUucmVuZGVyKHRlbXBsYXRlLCBzY2VuYXJpb3MpO1xyXG5cclxuICAgICAgICAkKFwiLmpzLXNjZW5hcmlvLWNvbnRhaW5lclwiKS5odG1sKHJlbmRlclRlbXBsYXRlKTtcclxuICAgICAgICAvLyB9XHJcbiAgICB9KVxyXG59XHJcblxyXG52YXIgY29uZmlybUNsYXNzT2xkID0gXCJcIjtcclxudmFyIGRlbGV0ZUNsYXNzT2xkID0gXCJcIjtcclxuZnVuY3Rpb24gY29uZmlybU1vZGFsKHRpdGxlLCBib2R5LCBjb25maXJtQ2xhc3MsIGRlbGV0ZUNsYXNzKXtcclxuICAgIGlmKGRlbGV0ZUNsYXNzID09IHVuZGVmaW5lZCl7XHJcbiAgICAgICAgZGVsZXRlQ2xhc3MgPSBcImNsb3NlLWNvbmZpcm1cIlxyXG4gICAgfVxyXG4gICAgaWYoY29uZmlybUNsYXNzICE9IFwiXCIgJiYgZGVsZXRlQ2xhc3NPbGQgIT0gXCJcIil7XHJcbiAgICAgICAgJCgnLmNvbmZpcm0tc2F2ZS1jaGFuZ2UnKS5yZW1vdmVDbGFzcyhjb25maXJtQ2xhc3NPbGQpXHJcbiAgICAgICAgJCgnLmNvbmZpcm0tZGVsZXRlLWNoYW5nZScpLnJlbW92ZUNsYXNzKGRlbGV0ZUNsYXNzT2xkKVxyXG4gICAgfVxyXG4gICAgJCgnLmNvbmZpcm0tc2F2ZS1jaGFuZ2UnKS5hZGRDbGFzcyhjb25maXJtQ2xhc3MpXHJcbiAgICAkKCcuY29uZmlybS1kZWxldGUtY2hhbmdlJykuYWRkQ2xhc3MoZGVsZXRlQ2xhc3MpXHJcblxyXG4gICAgY29uZmlybUNsYXNzT2xkID0gY29uZmlybUNsYXNzO1xyXG4gICAgZGVsZXRlQ2xhc3NPbGQgPSBkZWxldGVDbGFzcztcclxuXHJcbiAgICAkKCcuY29uZmlybS10aXRsZScpLnRleHQodGl0bGUpXHJcbiAgICAkKCcuY29uZmlybS10ZXh0JykudGV4dChib2R5KVxyXG5cclxuICAgICQoJy5qcy1jb25maXJtJykubW9kYWwoXCJzaG93XCIpXHJcbiAgICBmdW5jdGlvbiByYW5kb21TdHJpbmcyKGxlbiwgYmVmb3Jlc3RyID0gJycsIGFycmF5dG9jaGVjayA9IG51bGwpIHtcclxuICAgICAgICAvLyBDaGFyc2V0LCBldmVyeSBjaGFyYWN0ZXIgaW4gdGhpcyBzdHJpbmcgaXMgYW4gb3B0aW9uYWwgb25lIGl0IGNhbiB1c2UgYXMgYSByYW5kb20gY2hhcmFjdGVyLlxyXG4gICAgICAgIHZhciBjaGFyU2V0ID0gJ0FCQ0RFRkdISUpLTE1OT1BRUlNUVVZXWFlaYWJjZGVmZ2hpamtsbW5vcHFyc3R1dnd4eXonO1xyXG4gICAgICAgIHZhciByYW5kb21TdHJpbmcgPSAnJztcclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbjsgaSsrKSB7XHJcbiAgICAgICAgICAgIC8vIGNyZWF0ZXMgYSByYW5kb20gbnVtYmVyIGJldHdlZW4gMCBhbmQgdGhlIGNoYXJTZXQgbGVuZ3RoLiBSb3VuZHMgaXQgZG93biB0byBhIHdob2xlIG51bWJlclxyXG4gICAgICAgICAgICB2YXIgcmFuZG9tUG96ID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogY2hhclNldC5sZW5ndGgpO1xyXG4gICAgICAgICAgICByYW5kb21TdHJpbmcgKz0gY2hhclNldC5zdWJzdHJpbmcocmFuZG9tUG96LCByYW5kb21Qb3ogKyAxKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgLy8gSWYgYW4gYXJyYXkgaXMgZ2l2ZW4gaXQgd2lsbCBjaGVjayB0aGUgYXJyYXksIGFuZCBpZiB0aGUgZ2VuZXJhdGVkIHN0cmluZyBleGlzdHMgaW4gaXQgaXQgd2lsbCBjcmVhdGUgYSBuZXcgb25lIHVudGlsIGEgdW5pcXVlIG9uZSBpcyBmb3VuZCAqV0FUQ0ggT1VULiBJZiBhbGwgYXZhaWxhYmxlIG9wdGlvbnMgYXJlIHVzZWQgaXQgd2lsbCBjYXVzZSBhIGxvb3AgaXQgY2Fubm90IGJyZWFrIG91dCpcclxuICAgICAgICBpZiAoYXJyYXl0b2NoZWNrID09IG51bGwpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGJlZm9yZXN0ciArIHJhbmRvbVN0cmluZztcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB2YXIgaXNJbiA9ICQuaW5BcnJheShiZWZvcmVzdHIgKyByYW5kb21TdHJpbmcsIGFycmF5dG9jaGVjayk7IC8vIGNoZWNrcyBpZiB0aGUgc3RyaW5nIGlzIGluIHRoZSBhcnJheSwgcmV0dXJucyBhIHBvc2l0aW9uXHJcbiAgICAgICAgICAgIGlmIChpc0luID4gLTEpIHtcclxuICAgICAgICAgICAgICAgIC8vIGlmIHRoZSBwb3NpdGlvbiBpcyBub3QgLTEgKG1lYW5pbmcsIGl0IGlzIG5vdCBpbiB0aGUgYXJyYXkpIGl0IHdpbGwgc3RhcnQgZG9pbmcgYSBsb29wXHJcbiAgICAgICAgICAgICAgICB2YXIgY291bnQgPSAwO1xyXG4gICAgICAgICAgICAgICAgZG8ge1xyXG4gICAgICAgICAgICAgICAgICAgIHJhbmRvbVN0cmluZyA9ICcnO1xyXG4gICAgICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuOyBpKyspIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHJhbmRvbVBveiA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIGNoYXJTZXQubGVuZ3RoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmFuZG9tU3RyaW5nICs9IGNoYXJTZXQuc3Vic3RyaW5nKHJhbmRvbVBveiwgcmFuZG9tUG96ICsgMSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGlzSW4gPSAkLmluQXJyYXkoYmVmb3Jlc3RyICsgcmFuZG9tU3RyaW5nLCBhcnJheXRvY2hlY2spO1xyXG4gICAgICAgICAgICAgICAgICAgIGNvdW50Kys7XHJcbiAgICAgICAgICAgICAgICB9IHdoaWxlIChpc0luID4gLTEpO1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ2l0IHRvb2sgJyArIGNvdW50ICsgJyB0cmllcycpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGJlZm9yZXN0ciArIHJhbmRvbVN0cmluZztcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBiZWZvcmVzdHIgKyByYW5kb21TdHJpbmc7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuIiwidmFyIGxvZ2dlZEluID0gZmFsc2U7XHJcbnZhciB1c2VyTGV2ZWwgPSAwO1xyXG52YXIgbG9nZ2VkSW5Vc2VyID0gW107XHJcbnZhciB1c2VycyA9IFtdO1xyXG52YXIgc2NlbmFyaW9zID0gW107XHJcbnZhciBhbGVydEFjdGl2ZSA9IGZhbHNlO1xyXG5cclxuJChkb2N1bWVudCkucmVhZHkoZnVuY3Rpb24oKXtcclxuICAgIGNvbnNvbGUubG9nKFwiaG9tZS5qcyBsb2FkZWRcIilcclxuICAgICQoJ2JvZHknKS5vbignY2xpY2snLCAnLm1lbnUtaXRlbScsIGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgdmFyIGlkID0gJCh0aGlzKS5hdHRyKFwiY2xhc3NcIikuc3BsaXQoJ18nKVsxXTtcclxuICAgICAgICBjb25zb2xlLmxvZyhpZClcclxuXHJcbiAgICAgICAgJCgnLnZlcmRpZXBpbmcnKS5hZGRDbGFzcyhcImhpZGRlblwiKVxyXG4gICAgICAgICQoJy52ZXJkaWVwaW5nX18nK2lkKS5yZW1vdmVDbGFzcyhcImhpZGRlblwiKVxyXG4gICAgfSlcclxuXHJcbiAgICAkKCdib2R5Jykub24oJ2NsaWNrJywgJy5sb2dpbicsIGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgY29uc29sZS5sb2coJCgnLnVzZXJuYW1lJykudmFsKCkudG9Mb3dlckNhc2UoKSlcclxuICAgICAgICBjb25zb2xlLmxvZygkKCcucGFzc3dvcmQnKS52YWwoKS50b0xvd2VyQ2FzZSgpKVxyXG4gICAgICAgICQucG9zdChcImluY2x1ZGUvbG9naW4ucGhwXCIgLHtcclxuICAgICAgICAgICAgbG9naW5TdWI6IFwiXCIsXHJcbiAgICAgICAgICAgIHVzZXJuYW1lOiAkKCcudXNlcm5hbWUnKS52YWwoKS50b0xvd2VyQ2FzZSgpLFxyXG4gICAgICAgICAgICBwYXNzd29yZDogJCgnLnBhc3N3b3JkJykudmFsKClcclxuICAgICAgICB9LCBmdW5jdGlvbihyZXNwb25zZSxzdGF0dXMpe1xyXG4gICAgICAgICAgICB2YXIgZGF0YSA9IEpTT04ucGFyc2UocmVzcG9uc2UpO1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhkYXRhKTtcclxuICAgICAgICAgICAgbG9nZ2VkSW5Vc2VyID0gZGF0YTtcclxuICAgICAgICAgICAgaWYgKGRhdGEubG9nZ2VkSW4gPT0gMSkge1xyXG4gICAgICAgICAgICAgICAgbG9naW4oZGF0YS5sZXZlbCk7XHJcbiAgICAgICAgICAgICAgICBzaG93Rmxhc2hNZXNzYWdlKCdVIGJlbnQgc3VjY2Vzdm9sIGluZ2Vsb2dkJywgJ3N1Y2Nlc3MnKVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgc2hvd0ZsYXNoTWVzc2FnZSgnVXcgZ2VicnVpa2Vyc25hYW0gb2Ygd2FjaHR3b29yZCBpcyBpbmNvcnJlY3QnLCAnZGFuZ2VyJylcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pXHJcbiAgICB9KVxyXG5cclxuICAgICQoJ2JvZHknKS5vbignY2xpY2snLCAnLmxvZ291dCcsIGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgbG9nb3V0KCk7XHJcbiAgICB9KVxyXG5cclxuICAgICQoJ2JvZHknKS5vbignY2xpY2snLCAnLmxva2FhbCcsIGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgY29uc29sZS5sb2cobG9nZ2VkSW4pXHJcbiAgICAgICAgaWYobG9nZ2VkSW4gPT0gdHJ1ZSl7XHJcbiAgICAgICAgICAgIHZhciBsb2thYWxuciA9ICQodGhpcykuYXR0cihcImNsYXNzXCIpLnNwbGl0KFwiIFwiKVswXTtcclxuICAgICAgICAgICAgJCgnLmpzLWxva2FhbCcpLmh0bWwobG9rYWFsbnIpO1xyXG4gICAgICAgIH1cclxuICAgIH0pXHJcblxyXG4gICAgJChkb2N1bWVudCkua2V5cHJlc3MoZnVuY3Rpb24oZSkge1xyXG4gICAgICAgIGlmKGUud2hpY2ggPT0gMTMpIHtcclxuICAgICAgICAgICAgaWYgKCFsb2dnZWRJbikge1xyXG4gICAgICAgICAgICAgICAgJCgnLmxvZ2luJykudHJpZ2dlcignY2xpY2snKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH0pO1xyXG59KVxyXG4iLCIkKCdib2R5Jykub24oJ2NsaWNrJywgJy5sb2thYWwnLCBmdW5jdGlvbigpe1xyXG4gICAgaWYobG9nZ2VkSW4pe1xyXG4gICAgICAgIHZhciBsb2thYWxuciA9ICQodGhpcykuYXR0cihcImNsYXNzXCIpLnNwbGl0KFwiIFwiKVswXTtcclxuICAgICAgICAkKCcuanMtbG9rYWFsJykuaHRtbChsb2thYWxucik7XHJcbiAgICB9XHJcbn0pXHJcbiQoJ2JvZHknKS5vbignY2xpY2snLCAnLmpzLXN0YXJ0LXNjZW5hcmlvJywgZnVuY3Rpb24oKXtcclxuICAgIGlmIChsb2dnZWRJbikge1xyXG4gICAgICAgIHZhciBsb2thYWxuciA9ICQoJy5qcy1sb2thYWwnKS5odG1sKCk7XHJcbiAgICAgICAgdmFyIHNjZW5hcmlvSWQgPSAkKCcuanMtc2NlbmFyaW9zZWxlY3QnKS5maW5kKFwiOnNlbGVjdGVkXCIpLmRhdGEoJ2lkJyk7XHJcbiAgICAgICAgdmFyIHRvb2xzID0gMDtcclxuICAgICAgICBpZiAoJCgnLmpzLXN3aXRjaCcpLmlzKCc6Y2hlY2tlZCcpKSB7XHJcbiAgICAgICAgICAgIHRvb2xzID0gMTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKGxva2FhbG5yICE9IFwiXCIpIHtcclxuICAgICAgICAgICAgaWYgKHNjZW5hcmlvSWQgPj0gMSkge1xyXG4gICAgICAgICAgICAgICAgJC5wb3N0KFwiaW5jbHVkZS9tYWtlQWN0aXZlU2NlbmFyaW8ucGhwXCIse1xyXG4gICAgICAgICAgICAgICAgICAgIGxva2FhbG5yOiBsb2thYWxucixcclxuICAgICAgICAgICAgICAgICAgICBzY2VuYXJpb0lkOiBzY2VuYXJpb0lkLFxyXG4gICAgICAgICAgICAgICAgICAgIHRvb2xzOiB0b29sc1xyXG4gICAgICAgICAgICAgICAgICAgIH0sIGZ1bmN0aW9uKHJlc3BvbnNlLHN0YXR1cyl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChyZXNwb25zZSA9PSAnc3VjY2VzcycpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNob3dGbGFzaE1lc3NhZ2UoJ1NjZW5hcmlvIGlzIHN1Y2Nlc3ZvbCBhYW5nZW1hYWt0JywgJ3N1Y2Nlc3MnKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBlbHNle1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2hvd0ZsYXNoTWVzc2FnZSgnSGV0IG1ha2VuIHZhbiBlZW4gc2NlbmFyaW8gaXMgbWlzbHVrdCcsICdkYW5nZXInKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2V7XHJcbiAgICAgICAgICAgICAgICBzaG93Rmxhc2hNZXNzYWdlKCdFciBpcyBnZWVuIHNjZW5hcmlvIGdla296ZW4nLCAnZGFuZ2VyJyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIHNob3dGbGFzaE1lc3NhZ2UoJ0tpZXMgZWVuIGxva2FhbCcsICdkYW5nZXInKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn0pXHJcbiIsIiQoXCJib2R5XCIpLm9uKFwiY2xpY2tcIiwgXCIubmV3LXVzZXJcIixmdW5jdGlvbigpe1xyXG4gIGlmKCQoXCIubmV3LXVzZXItbmFtZVwiKS52YWwoKSA9PSBcIlwiIHx8ICQoXCIubmV3LXVzZXItcGFzc3dvcmRcIikudmFsKCkgPT0gXCJcIiB8fCAkKFwiLm5ldy11c2VyLWxldmVsXCIpLnZhbCgpID09IG51bGwpe1xyXG4gICAgaWYoJChcIi5uZXctdXNlci1uYW1lXCIpLnZhbCgpID09IFwiXCIpe1xyXG4gICAgICBzaG93Rmxhc2hNZXNzYWdlKCdVIGhlZWZ0IG5vZyBnZWVuIGdlYnJ1aWtlcnNuYWFtIGluZ2V2dWxkJywgJ2RhbmdlcicpO1xyXG4gICAgfWVsc2UgaWYoJChcIi5uZXctdXNlci1wYXNzd29yZFwiKS52YWwoKSA9PSBcIlwiKXtcclxuICAgICAgc2hvd0ZsYXNoTWVzc2FnZSgnVSBoZWVmdCBub2cgZ2VlbiBwYXNzd29vcmQgaW5nZXZ1bGQnLCAnZGFuZ2VyJyk7XHJcbiAgICB9ZWxzZSBpZigkKFwiLm5ldy11c2VyLWxldmVsXCIpLnZhbCgpID09IG51bGwpe1xyXG4gICAgICBzaG93Rmxhc2hNZXNzYWdlKCdVIGhlZWZ0IG5vZyBnZWVuIGxldmVsIGdlc2VsZWN0ZWVyZCcsICdkYW5nZXInKTtcclxuICAgIH1cclxuICB9ZWxzZXtcclxuICAgIGNvbnNvbGUubG9nKCQoXCIubmV3LXVzZXItbGV2ZWxcIikudmFsKCkpXHJcbiAgICAkLnBvc3QoXCJpbmNsdWRlL2FkZFVzZXIucGhwXCIse1xyXG4gICAgICB1c2VybmFtZTogJChcIi5uZXctdXNlci1uYW1lXCIpLnZhbCgpLFxyXG4gICAgICB1c2VycGFzc3dvcmQ6ICQoXCIubmV3LXVzZXItcGFzc3dvcmRcIikudmFsKCksXHJcbiAgICAgIHVzZXJsZXZlbDogJChcIi5uZXctdXNlci1sZXZlbFwiKS52YWwoKVxyXG4gICAgfSwgZnVuY3Rpb24ocmVzcG9uc2Usc3RhdHVzKXtcclxuICAgICAgY29uc29sZS5sb2cocmVzcG9uc2UpXHJcbiAgICAgIGlmKHJlc3BvbnNlID09IFwic3VjY2Vzc1wiKXtcclxuICAgICAgICBzaG93Rmxhc2hNZXNzYWdlKCdFciBpcyBlZW4gbmlldXdlIGdlYnJ1aWtlciBhYW5nZW1hYWt0JywgJ3N1Y2Nlc3MnKTtcclxuICAgICAgICAkKFwiLm5ldy11c2VyLW5hbWVcIikudmFsKFwiXCIpO1xyXG4gICAgICAgICQoXCIubmV3LXVzZXItcGFzc3dvcmRcIikudmFsKFwiXCIpO1xyXG4gICAgICAgICQoXCIubmV3LXVzZXItb3B0aW9uc1wiKS5yZW1vdmVBdHRyKFwic2VsZWN0ZWRcIik7XHJcbiAgICAgICAgJChcIi5uZXctdXNlci1vcHRpb24xXCIpLmF0dHIoXCJzZWxlY3RlZFwiLFwic2VsZWN0ZWRcIik7XHJcbiAgICAgIH1cclxuICAgIH0pXHJcbiAgfVxyXG59KVxyXG4iLCIkKFwiYm9keVwiKS5vbihcImNsaWNrXCIsIFwiLm9wdGlvbnNcIiwgZnVuY3Rpb24oKXtcclxuICB2YXIgbGV2ZWwgPSAkKHRoaXMpLmF0dHIoXCJjbGFzc1wiKS5zcGxpdChcIiBcIilbMV0uc3BsaXQoXCJfXCIpWzFdO1xyXG4gIHZhciBvcHRpb24gPSAkKHRoaXMpLmF0dHIoXCJjbGFzc1wiKS5zcGxpdChcIiBcIilbMl0uc3BsaXQoXCJfXCIpWzFdO1xyXG4gIGNvbnNvbGUubG9nKGxldmVsKVxyXG5cclxuICAkKFwiLnZpZXdcIikuYWRkQ2xhc3MoXCJoaWRkZW5cIilcclxuICAkKFwiLnZpZXdfXCIrbGV2ZWwrXCItXCIrb3B0aW9uKS5yZW1vdmVDbGFzcyhcImhpZGRlblwiKVxyXG4gICQoJy5vcHRpb25zJykucmVtb3ZlQ2xhc3MoJ29wdGlvbnMtLWFjdGl2ZScpO1xyXG4gICQodGhpcykuYWRkQ2xhc3MoJ29wdGlvbnMtLWFjdGl2ZScpO1xyXG4gIHN3aXRjaCAobGV2ZWwpIHtcclxuICAgIGNhc2UgXCIxXCI6XHJcbiAgICAgIHVwZGF0ZUxldmVsMVRlbXBsYXRlcygpO1xyXG4gICAgICBicmVhaztcclxuICAgIGNhc2UgXCIyXCI6XHJcbiAgICAgIHVwZGF0ZUxldmVsMlRlbXBsYXRlcygpO1xyXG4gICAgICBicmVhaztcclxuICB9XHJcbn0pXHJcbiIsIiQoZG9jdW1lbnQpLnJlYWR5KGZ1bmN0aW9uKCl7XHJcbiAgICAkLnBvc3QoXCJpbmNsdWRlL3JldHVyblNlc3Npb24ucGhwXCIse1xyXG4gICAgfSwgZnVuY3Rpb24ocmVzcG9uc2Usc3RhdHVzKXtcclxuICAgICAgICB2YXIgZGF0YSA9IEpTT04ucGFyc2UocmVzcG9uc2UpO1xyXG4gICAgICAgIGlmIChkYXRhLmxvZ2dlZEluKSB7XHJcbiAgICAgICAgICAgIGxvZ2dlZEluVXNlciA9IGRhdGE7XHJcbiAgICAgICAgICAgIGxvZ2luKGRhdGEubGV2ZWwpO1xyXG4gICAgICAgIH1cclxuICAgIH0pXHJcbn0pO1xyXG4iLCIkKFwiLnNldHRpbmdzLWlucHV0c1wiKS5rZXlwcmVzcyhmdW5jdGlvbihlKSB7XHJcbiAgICAvLyBjb25zb2xlLmxvZyhcImVudGVyXCIpXHJcbiAgICBpZihlLndoaWNoID09IDEzKSB7XHJcbiAgICAgICAgJCgnLnNldHRpbmdzLXVwZGF0ZScpLnRyaWdnZXIoJ2NsaWNrJyk7XHJcbiAgICB9XHJcbn0pO1xyXG5cclxuJCgnYm9keScpLm9uKCdjbGljaycsICcuc2V0dGluZ3MnLCBmdW5jdGlvbigpe1xyXG4gICAgLy8gY29uc29sZS5sb2coXCJzZXR0aW5nc1wiKVxyXG4gICAgJCgnLnNldHRpbmdzLXVzZXJuYW1lJykudmFsKGxvZ2dlZEluVXNlci51c2VybmFtZSlcclxuICAgICQoJy51c2VyLXNldHRpbmdzJykubW9kYWwoJ3Nob3cnKTtcclxuICAgIC8vIGNvbnNvbGUubG9nKGxvZ2dlZEluVXNlci51c2VybmFtZSlcclxufSlcclxuXHJcbiQoJ2JvZHknKS5vbignY2xpY2snLCAnLnNldHRpbmdzLXVwZGF0ZScsIGZ1bmN0aW9uKCl7XHJcbiAgICAvLyBjb25zb2xlLmxvZyhcInVwZGF0ZVwiKVxyXG4gICAgLy8gY29uc29sZS5sb2coJCgnLnNldHRpbmdzLXVzZXJuYW1lJykudmFsKCkpXHJcbiAgICAvLyBjb25zb2xlLmxvZygkKCcuc2V0dGluZ3MtcGFzc3dvcmQnKS52YWwoKSlcclxuICAgIC8vIGNvbnNvbGUubG9nKCQoJy5zZXR0aW5ncy1yZXBlYXQtcGFzc3dvcmQnKS52YWwoKSlcclxuXHJcbiAgICBpZigkKCcuc2V0dGluZ3MtdXNlcm5hbWUnKS52YWwoKSA9PSBcIlwiIHx8ICQoJy5zZXR0aW5ncy1wYXNzd29yZCcpLnZhbCgpID09IFwiXCIpe1xyXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKFwiZ2VicnVpa2Vyc25hYW0gZW4gd2FjaHR3b29yZCBtb2dlbiBuaWV0IGxlZWcgemlqblwiKTtcclxuICAgICAgICBpZigkKCcuc2V0dGluZ3MtdXNlcm5hbWUnKS52YWwoKSA9PSBcIlwiKXtcclxuICAgICAgICAgIHNob3dGbGFzaE1lc3NhZ2UoJ1UgaGVlZnQgZ2VlbiBnZWJydWlrZXJzbmFhbSBpbmdldnVsZCcsICdkYW5nZXInKTtcclxuICAgICAgICB9ZWxzZSBpZigkKCcuc2V0dGluZ3MtcGFzc3dvcmQnKS52YWwoKSA9PSBcIlwiKXtcclxuICAgICAgICAgIHNob3dGbGFzaE1lc3NhZ2UoJ1UgaGVlZnQgZ2VlbiB3YWNodHdvb3JkIGluZ2V2dWxkJywgJ2RhbmdlcicpO1xyXG4gICAgICAgIH1cclxuICAgIH1lbHNle1xyXG4gICAgICAgIGlmKCQoJy5zZXR0aW5ncy1wYXNzd29yZCcpLnZhbCgpICE9ICQoJy5zZXR0aW5ncy1yZXBlYXQtcGFzc3dvcmQnKS52YWwoKSl7XHJcbiAgICAgICAgICBzaG93Rmxhc2hNZXNzYWdlKCdVdyB3YWNodHdvb3JkZW4gemlqbiBuaWV0IGdlbGlqayBhYW4gZWxrYWFyJywgJ2RhbmdlcicpO1xyXG4gICAgICAgIH1lbHNle1xyXG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhsb2dnZWRJblVzZXIpXHJcbiAgICAgICAgICAgICQucG9zdChcImluY2x1ZGUvdXBkYXRlVXNlci5waHBcIiAse1xyXG4gICAgICAgICAgICAgICAgaWQ6IGxvZ2dlZEluVXNlci51c2VySUQsXHJcbiAgICAgICAgICAgICAgICBuYW1lOiAkKCcuc2V0dGluZ3MtdXNlcm5hbWUnKS52YWwoKSxcclxuICAgICAgICAgICAgICAgIHBhc3M6ICQoJy5zZXR0aW5ncy1wYXNzd29yZCcpLnZhbCgpXHJcbiAgICAgICAgICAgIH0sIGZ1bmN0aW9uKHJlc3BvbnNlLHN0YXR1cyl7XHJcbiAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhyZXNwb25zZSk7XHJcbiAgICAgICAgICAgICAgICBpZihyZXNwb25zZSA9PSBcInN1Y2Nlc1wiKXtcclxuICAgICAgICAgICAgICAgICAgICAkKCcudXNlci1zZXR0aW5ncycpLm1vZGFsKCdoaWRlJyk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufSk7XHJcblxyXG4kKFwiYm9keVwiKS5vbignY2xpY2snLCcuc2V0dGluZ3MtY2FuY2VsJyxmdW5jdGlvbigpe1xyXG4gICQoJy51c2VyLXNldHRpbmdzJykubW9kYWwoJ2hpZGUnKTtcclxufSlcclxuIl19
