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

  if($('.update-users-username').val() == "" && $('.update-users-password').val() == "" && $('.update-users-repeat-password').val() == ""){
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
            });
        }
    }
});

<<<<<<< HEAD
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFkZFNjZW5hcmlvLmpzIiwiY2hlY2tBbGVydC5qcyIsImNsb3NlLWNvbmZpcm0uanMiLCJkZWxldGUtc2NlbmFyaW8uanMiLCJkZWxldGUtdXNlci5qcyIsImVkaXQtc2NlbmFyaW8uanMiLCJlZGl0LXVzZXIuanMiLCJmbGFzaC1tZXNzYWdlLmpzIiwiZnVuY3Rpb25zLmpzIiwiaG9tZS5qcyIsIm1ha2VBY3RpdmVTY2VuYXJpby5qcyIsIm5ldy11c2VyLmpzIiwib3B0aW9ucy5qcyIsInNlc3Npb25DaGVjay5qcyIsInNldHRpbmdzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN6Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ1BBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNuQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN4QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDOURBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3hEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDN0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzdLQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDMURBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3RDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzNCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2xCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDVkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJtYWluLmpzIiwic291cmNlc0NvbnRlbnQiOlsiJCgnYm9keScpLm9uKCdwcm9wZXJ0eWNoYW5nZSBpbnB1dCcsICcuanMtbmV3c3RlcCcsZnVuY3Rpb24oZSl7XHJcbiAgICB2YXIgcGFyZW50ID0gJCh0aGlzKS5jbG9zZXN0KCcuanMtc3RlcCcpXHJcbiAgICBpZiAoJChwYXJlbnQpLmlzKCc6bGFzdC1jaGlsZCcpKSB7XHJcbiAgICAgICAgdmFyIG5yc3RyID0gJCgnLmpzLWxhc3RucicpLmh0bWwoKTtcclxuICAgICAgICB2YXIgbmV3bnIgPSBwYXJzZUludChucnN0cikgKyAxO1xyXG4gICAgICAgICQoJy5qcy1sYXN0bnInKS5yZW1vdmVDbGFzcygnanMtbGFzdG5yJyk7XHJcbiAgICAgICAgJCgnLmpzLWNvcHlzdGVwJykuY2xvbmUoKS5hcHBlbmRUbygnLmpzLXN0ZXBzLWNvbnRhaW5lcicpXHJcbiAgICAgICAgLnJlbW92ZUNsYXNzKCdqcy1jb3B5c3RlcCcpLnJlbW92ZUNsYXNzKCdoaWRkZW4nKS5hZGRDbGFzcygnanMtc3RlcCcpXHJcbiAgICAgICAgLmZpbmQoJy5qcy1uZXducicpLnJlbW92ZUNsYXNzKCdqcy1uZXducicpLmFkZENsYXNzKCdqcy1sYXN0bnInKS5odG1sKG5ld25yKTtcclxuICAgICAgICB1cGRhdGVTdGVwcygpO1xyXG4gICAgfVxyXG59KTtcclxuZnVuY3Rpb24gdXBkYXRlU3RlcHMoKXtcclxuICAgIHZhciBjb3VudCA9IDE7XHJcbiAgICAkKCcuanMtc3RlcG5yJykuZWFjaChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgJCh0aGlzKS5odG1sKGNvdW50KTtcclxuICAgICAgICBjb3VudCsrO1xyXG4gICAgfSk7XHJcbn1cclxuJCgnYm9keScpLm9uKCdjbGljaycsICcuanMtYWRkc3RlcCcsZnVuY3Rpb24oKXtcclxuICAgIHZhciBucnN0ciA9ICQoJy5qcy1sYXN0bnInKS5odG1sKCk7XHJcbiAgICB2YXIgbmV3bnIgPSBwYXJzZUludChucnN0cikgKyAxO1xyXG4gICAgJCgnLmpzLWxhc3RucicpLnJlbW92ZUNsYXNzKCdqcy1sYXN0bnInKTtcclxuICAgICQoJy5qcy1jb3B5c3RlcCcpLmNsb25lKCkuYXBwZW5kVG8oJy5qcy1zdGVwcy1jb250YWluZXInKVxyXG4gICAgLnJlbW92ZUNsYXNzKCdqcy1jb3B5c3RlcCcpLnJlbW92ZUNsYXNzKCdoaWRkZW4nKS5hZGRDbGFzcygnanMtc3RlcCcpXHJcbiAgICAuZmluZCgnLmpzLW5ld25yJykucmVtb3ZlQ2xhc3MoJ2pzLW5ld25yJykuYWRkQ2xhc3MoJ2pzLWxhc3RucicpLmh0bWwobmV3bnIpO1xyXG4gICAgdXBkYXRlU3RlcHMoKTtcclxufSk7XHJcbiQoJ2JvZHknKS5vbignY2xpY2snLCAnLmpzLXNhdmUtbmV3LXNjZW5hcmlvJyxmdW5jdGlvbigpe1xyXG4gICAgdmFyIG5hbWUgPSAkKCcuanMtbmV3LXNjZW5hcmlvLW5hbWUnKS52YWwoKTtcclxuICAgIHZhciBzdGVwcyA9IFtdO1xyXG4gICAgaWYgKG5hbWUgPT0gJycpIHtcclxuICAgICAgICBzaG93Rmxhc2hNZXNzYWdlKCdWdWwgZWVyc3QgZWVuIG5hYW0gaW4nLCAnZGFuZ2VyJyk7XHJcbiAgICB9XHJcbiAgICBlbHNle1xyXG4gICAgICAgICQoJy5qcy1uZXdzdGVwJykuZWFjaChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHZhciB0ZW1wdmFsID0gJCh0aGlzKS52YWwoKTtcclxuICAgICAgICAgICAgaWYgKHRlbXB2YWwgIT0gXCJcIikge1xyXG4gICAgICAgICAgICAgICAgc3RlcHMucHVzaCh0ZW1wdmFsKTtcclxuXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgICAgICBpZiAoc3RlcHMubGVuZ3RoID09IDApIHtcclxuICAgICAgICAgICAgc2hvd0ZsYXNoTWVzc2FnZSgnVnVsIG1pbnN0ZW5zIDEgc3RhcCBpbicsICdkYW5nZXInKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZXtcclxuICAgICAgICAgICAgJC5wb3N0KFwiaW5jbHVkZS9zYXZlTmV3U2NlbmFyaW8ucGhwXCIgLHtcclxuICAgICAgICAgICAgICAgIG5hbWU6IG5hbWUsXHJcbiAgICAgICAgICAgICAgICBzdGVwczogc3RlcHNcclxuICAgICAgICAgICAgfSwgZnVuY3Rpb24ocmVzcG9uc2Usc3RhdHVzKXtcclxuICAgICAgICAgICAgICAgIGlmKHJlc3BvbnNlID09IFwic3VjY2VzXCIpe1xyXG4gICAgICAgICAgICAgICAgICAgIHNob3dGbGFzaE1lc3NhZ2UoJ1NjZW5hcmlvIHN1Y2Nlc3ZvbCB0b2VnZXZvZWdkJywgJ3N1Y2Nlc3MnKTtcclxuICAgICAgICAgICAgICAgICAgICAkKCcuanMtc3RlcHMtY29udGFpbmVyJykuaHRtbCgnJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgJCgnLmpzLW5ldy1zY2VuYXJpby1uYW1lJykudmFsKCcnKTtcclxuICAgICAgICAgICAgICAgICAgICAkKCcuanMtY29weXN0ZXAnKS5jbG9uZSgpLmFwcGVuZFRvKCcuanMtc3RlcHMtY29udGFpbmVyJylcclxuICAgICAgICAgICAgICAgICAgICAucmVtb3ZlQ2xhc3MoJ2pzLWNvcHlzdGVwJykucmVtb3ZlQ2xhc3MoJ2hpZGRlbicpXHJcbiAgICAgICAgICAgICAgICAgICAgLmFkZENsYXNzKCdqcy1zdGVwJykuYWRkQ2xhc3MoJ1VuaXF1ZXRlbXAnKVxyXG4gICAgICAgICAgICAgICAgICAgIC5maW5kKCcuanMtbmV3bnInKS5yZW1vdmVDbGFzcygnanMtbmV3bnInKS5hZGRDbGFzcygnanMtbGFzdG5yJykuaHRtbCgnMScpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgIH1cclxuICAgIH1cclxufSk7XHJcblxyXG4kKCdib2R5Jykub24oJ2NsaWNrJywgJy5qcy1kZWxldGUtc3RlcCcsZnVuY3Rpb24oKXtcclxuICAgIHZhciBwYXJlbnQgPSAkKHRoaXMpLmNsb3Nlc3QoJy5qcy1zdGVwJyk7XHJcbiAgICBpZiAoISQocGFyZW50KS5pcygnOmZpcnN0LWNoaWxkJykpIHtcclxuICAgICAgICAkKHBhcmVudCkucmVtb3ZlKCk7XHJcbiAgICAgICAgdXBkYXRlU3RlcHMoKTtcclxuICAgIH1cclxuICAgIGVsc2Uge1xyXG4gICAgICAgIHNob3dGbGFzaE1lc3NhZ2UoJ0plIGt1bnQgbmlldCBkZSBlZXJzdGUgc3RhcCB2ZXJ3aWpkZXJlbicsICdkYW5nZXInKTtcclxuICAgIH1cclxufSk7XHJcbiIsImZ1bmN0aW9uIGNoZWNrQWxlcnQoKSB7XHJcbiAgICBpZihsb2dnZWRJblVzZXIubGV2ZWwgPT0gMyAmJiAhYWxlcnRBY3RpdmUgJiYgbG9nZ2VkSW4gPT0gdHJ1ZSl7XHJcbiAgICAgICAgJC5wb3N0KFwiaW5jbHVkZS9nZXRTY2VuYXJpb3NBY3RpdmUucGhwXCIgLHtcclxuICAgICAgICB9LCBmdW5jdGlvbihyZXNwb25zZSxzdGF0dXMpe1xyXG4gICAgICAgICAgICByZXNwb25zZSA9IEpTT04ucGFyc2UocmVzcG9uc2UpO1xyXG4gICAgICAgICAgICBpZihyZXNwb25zZS5sZW5ndGggPiAwKXtcclxuICAgICAgICAgICAgICAgICQoJy5zY2VuYXJpbycpLm1vZGFsKCdzaG93Jyk7XHJcbiAgICAgICAgICAgICAgICAkKCcuc2NlbmFyaW8ubW9kYWwnKS5maW5kKCcubW9kYWwtdGl0bGUnKS5odG1sKHJlc3BvbnNlWzBdLm5hbWUgKyAnIGluIGxva2FhbDogJyArIHJlc3BvbnNlWzBdLmxvY2F0aW9uKTtcclxuICAgICAgICAgICAgICAgIGFsZXJ0QWN0aXZlID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICQoJy5zY2VuYXJpby5tb2RhbCcpLmZpbmQoJy5qcy1jbG9zZS1zY2VuYXJpby1tb2RhbCcpLmF0dHIoJ2RhdGEtYWN0aXZlaWQnLCByZXNwb25zZVswXS5hY3RpdmVfaWQpO1xyXG4gICAgICAgICAgICAgICAgaWYgKCFyZXNwb25zZVswXS50b29scyApIHtcclxuICAgICAgICAgICAgICAgICAgICAkKCcuc2NlbmFyaW8ubW9kYWwnKS5maW5kKCcubW9kYWwtYm9keScpLmh0bWwoJ0RlIGRvY2VudCBoZWVmdCB0b2VnYW5nIHRvdCBkZXplIGh1bHBtaWRkZWxlbiB1aXRnZXNjaGFrZWxkJyk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgc3RlcHMgPSByZXNwb25zZVswXS5zdGVwcztcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhzdGVwcyk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KVxyXG4gICAgfVxyXG4gICAgc2V0VGltZW91dChjaGVja0FsZXJ0LCAxMDAwKTtcclxufVxyXG5zZXRUaW1lb3V0KGNoZWNrQWxlcnQsIDEwMDApO1xyXG4kKCdib2R5Jykub24oJ2NsaWNrJywgJy5qcy1jbG9zZS1zY2VuYXJpby1tb2RhbCcsIGZ1bmN0aW9uKCl7XHJcbiAgICB2YXIgYWN0aXZlaWQgPSAkKHRoaXMpLmF0dHIoJ2RhdGEtYWN0aXZlaWQnKTtcclxuICAgIGNvbnNvbGUubG9nKGFjdGl2ZWlkKTtcclxuICAgICQucG9zdChcImluY2x1ZGUvZmluaXNoQWN0aXZlU2NlbmFyaW9cIix7XHJcbiAgICAgICAgYWN0aXZlaWQgOiBhY3RpdmVpZFxyXG4gICAgICAgIH0sIGZ1bmN0aW9uKHJlc3BvbnNlLHN0YXR1cyl7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKHJlc3BvbnNlKTtcclxuICAgICAgICAgICAgaWYgKHJlc3BvbnNlID09ICdzdWNjZXNzJykge1xyXG5cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG59KTtcclxuJCgnLnNjZW5hcmlvJykub24oJ2hpZGRlbi5icy5tb2RhbCcsIGZ1bmN0aW9uICgpIHtcclxuICAgIGNvbnNvbGUubG9nKFwiY2xvc2VcIilcclxuICAgIGlmKGxvZ2dlZEluVXNlci5sZXZlbCA9PSAzICYmIGxvZ2dlZEluID09IHRydWUpe1xyXG4gICAgICAgIGFsZXJ0QWN0aXZlID0gZmFsc2U7XHJcbiAgICB9XHJcbn0pXHJcbiIsIiQoXCJib2R5XCIpLm9uKCdjbGljaycsJy5jbG9zZS1jb25maXJtJyxmdW5jdGlvbigpe1xyXG4gICQoJy5qcy1jb25maXJtJykubW9kYWwoXCJoaWRlXCIpXHJcbn0pXHJcblxyXG4kKFwiYm9keVwiKS5vbignY2xpY2snLCcuY29uZmlybS1zYXZlLWNoYW5nZScsZnVuY3Rpb24oKXtcclxuICAkKCcuanMtY29uZmlybScpLm1vZGFsKFwiaGlkZVwiKVxyXG59KVxyXG4iLCIkKCdib2R5Jykub24oJ2NsaWNrJywgJy5sZXZlbDItYnRuLWRlbGV0ZScsZnVuY3Rpb24oKXtcclxuICB2YXIgcm93Q2xhc3MgPSAkKHRoaXMpLnBhcmVudCgpLnBhcmVudCgpLmF0dHIoXCJjbGFzc1wiKTtcclxuICB2YXIgcm93ID0gJCh0aGlzKS5wYXJlbnQoKS5wYXJlbnQoKS5hdHRyKFwiY2xhc3NcIikuc3BsaXQoXCJpbmRleFwiKVsxXTtcclxuICBmb3IodmFyIGkgPSAwOyBpIDwgc2NlbmFyaW9zLmxlbmd0aDsgaSsrKXtcclxuICAgIGlmKHNjZW5hcmlvc1tpXS5pZCA9PSByb3cpe1xyXG4gICAgICAkLnBvc3QoXCJpbmNsdWRlL2RlbGV0ZVNjZW5hcmlvcy5waHBcIiAse1xyXG4gICAgICAgIGlkOiBzY2VuYXJpb3NbaV0uaWRcclxuICAgICAgfSwgZnVuY3Rpb24ocmVzcG9uc2Usc3RhdHVzKXtcclxuICAgICAgICBjb25zb2xlLmxvZyhyZXNwb25zZSlcclxuICAgICAgICBpZihyZXNwb25zZSA9PSBcInN1Y2Nlc3N1Y2Nlc3N1Y2Nlc1wiKXtcclxuICAgICAgICAgIGNvbnNvbGUubG9nKHJvd0NsYXNzKVxyXG4gICAgICAgICAgc2NlbmFyaW9zLnNwbGljZShpLDEpXHJcbiAgICAgICAgICAkKFwiLlwiK3Jvd0NsYXNzKS5yZW1vdmUoKTtcclxuICAgICAgICAgIHVwZGF0ZUxldmVsMlRlbXBsYXRlcygpO1xyXG4gICAgICAgIH1cclxuICAgICAgfSlcclxuICAgIH1cclxuICB9XHJcbn0pXHJcbiIsInZhciByb3dDbGFzcyA9IFwiXCI7XHJcbnZhciByb3cgPSBcIlwiO1xyXG4kKCdib2R5Jykub24oJ2NsaWNrJywgJy5sZXZlbDEtYnRuLWRlbGV0ZScsZnVuY3Rpb24oKXtcclxuICBjb25maXJtTW9kYWwoXCJHZWJydWlrZXIgVmVyd2lqZGVyZW5cIixcIldlZXQgdSB6ZWtlciBkYXQgdSBkZXplIGdlYnJ1aWtlciB3aWx0IHZlcndpamRlcmVuXCIsXCJjb25maXJtLXVzZXItZGVsZXRlXCIpO1xyXG4gIHJvd0NsYXNzID0gJCh0aGlzKS5wYXJlbnQoKS5wYXJlbnQoKS5hdHRyKFwiY2xhc3NcIik7XHJcbiAgcm93ID0gJCh0aGlzKS5wYXJlbnQoKS5wYXJlbnQoKS5hdHRyKFwiY2xhc3NcIikuc3BsaXQoXCJpbmRleFwiKVsxXTtcclxuICBjb25zb2xlLmxvZyh1c2VycylcclxufSlcclxuXHJcbiQoXCJib2R5XCIpLm9uKCdjbGljaycsJy5jb25maXJtLXVzZXItZGVsZXRlJyxmdW5jdGlvbigpe1xyXG4gIGNvbnNvbGUubG9nKFwidXNlci1kZWxldGVcIilcclxuICBmb3IodmFyIGkgPSAwOyBpIDwgdXNlcnMubGVuZ3RoOyBpKyspe1xyXG4gICAgaWYodXNlcnNbaV0uaWQgPT0gcm93KXtcclxuICAgICAgJC5wb3N0KFwiaW5jbHVkZS9kZWxldGVVc2VyLnBocFwiICx7XHJcbiAgICAgICAgaWQ6IHVzZXJzW2ldLmlkXHJcbiAgICAgIH0sIGZ1bmN0aW9uKHJlc3BvbnNlLHN0YXR1cyl7XHJcbiAgICAgICAgaWYocmVzcG9uc2UgPT0gXCJzdWNjZXNcIil7XHJcbiAgICAgICAgICBzaG93Rmxhc2hNZXNzYWdlKCdVIGhlZWZ0IGRlIGdlYnJ1aWtlciBzdWNjZXN2b2wgdmVyd2lqZGVyZCcsICdzdWNjZXNzJyk7XHJcbiAgICAgICAgICAkKFwiLlwiK3Jvd0NsYXNzKS5yZW1vdmUoKTtcclxuICAgICAgICB9XHJcbiAgICAgIH0pXHJcbiAgICB9XHJcbiAgfVxyXG59KVxyXG4iLCJ2YXIgcm93U2VsZWN0ZWQgPSAwO1xyXG52YXIgaW5kZXggPSAwO1xyXG52YXIgZGVzY3JpcHRpb25zID0gW107XHJcbiQoJ2JvZHknKS5vbignY2xpY2snLCAnLmxldmVsMi1idG4tZWRpdCcsIGZ1bmN0aW9uKCl7XHJcbiAgcm93U2VsZWN0ZWQgPSAkKHRoaXMpLnBhcmVudCgpLnBhcmVudCgpLmF0dHIoXCJjbGFzc1wiKTtcclxuICBmb3IgKHZhciBpID0gMDsgaSA8IHNjZW5hcmlvcy5sZW5ndGg7IGkrKyl7XHJcbiAgICBpZihzY2VuYXJpb3NbaV0uaWQgPT0gcm93U2VsZWN0ZWQuc3BsaXQoXCJpbmRleFwiKVsxXSl7XHJcbiAgICAgIGluZGV4ID0gaVxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgJC5wb3N0KFwiaW5jbHVkZS9nZXRTY2VuZXJpb0Rlc2MucGhwXCIgLHtcclxuICAgIGlkOiBzY2VuYXJpb3NbaW5kZXhdLmlkXHJcbiAgfSwgZnVuY3Rpb24ocmVzcG9uc2Usc3RhdHVzKXtcclxuICAgIGRlc2NyaXB0aW9ucyA9IEpTT04ucGFyc2UocmVzcG9uc2UpXHJcblxyXG4gICAgZGVzY3JpcHRpb25zLm1hcChmdW5jdGlvbihjcCxpKXtcclxuICAgICAgY3AuaW5kZXggPSBpKzE7XHJcbiAgICB9KVxyXG4gICAgY29uc29sZS5sb2coZGVzY3JpcHRpb25zKVxyXG5cclxuICAgIHZhciB0ZW1wbGF0ZSA9ICQoXCIubGV2ZWwyLXNjZW5hcmlvLWVkaXQtdGVtcGxhdGVcIikuaHRtbCgpO1xyXG4gICAgdmFyIHJlbmRlclRlbXBsYXRlID0gTXVzdGFjaGUucmVuZGVyKHRlbXBsYXRlLCBkZXNjcmlwdGlvbnMpO1xyXG5cclxuICAgICQoXCIuc2NlbmFyaW8tZWRpdC1vcHRpb25zLWNvbnRhaW5lclwiKS5odG1sKHJlbmRlclRlbXBsYXRlKTtcclxuXHJcbiAgICAkKCcuc2NlbmFyaW8tZWRpdCcpLm1vZGFsKCdzaG93Jyk7XHJcbiAgICAkKCcudXBkYXRlLXNjZW5hcmlvcy1uYW1lJykudmFsKHNjZW5hcmlvc1tpbmRleF0ubmFtZSlcclxuICB9KVxyXG59KVxyXG5cclxuJCgnYm9keScpLm9uKCdjbGljaycsICcudXBkYXRlLXNjZW5hcmlvcy11cGRhdGUnLCBmdW5jdGlvbigpe1xyXG4gIGRlc2NyaXB0aW9uTmFtZXMgPSBbXTtcclxuICBjb25zb2xlLmxvZyhzY2VuYXJpb3NbaW5kZXhdKVxyXG4gIGZvcih2YXIgaSA9IDEgOyBpIDwgKGRlc2NyaXB0aW9ucy5sZW5ndGgrMSk7IGkrKyl7XHJcbiAgICBpZigkKCcuanMtc2NlbmFyaW8tZWRpdC0nK2kpLnZhbCgpICE9IFwiXCIpe1xyXG4gICAgICBkZXNjcmlwdGlvbk5hbWVzLnB1c2goJCgnLmpzLXNjZW5hcmlvLWVkaXQtJytpKS52YWwoKSlcclxuICAgIH1cclxuICB9XHJcblxyXG4gIGNvbnNvbGUubG9nKGRlc2NyaXB0aW9uTmFtZXMpXHJcblxyXG4gICQucG9zdChcImluY2x1ZGUvdXBkYXRlU2NlbmFyaW8ucGhwXCIgLHtcclxuICAgIHNjZW5hcmlvSUQ6IHNjZW5hcmlvc1tpbmRleF0uaWQsXHJcbiAgICBuYW1lOiAkKCcudXBkYXRlLXNjZW5hcmlvcy1uYW1lJykudmFsKCksXHJcbiAgICBkZXNjcmlwdGlvbnM6IGRlc2NyaXB0aW9uc1xyXG4gIH0sIGZ1bmN0aW9uKHJlc3BvbnNlLHN0YXR1cyl7XHJcbiAgICBjb25zb2xlLmxvZyhyZXNwb25zZSlcclxuICAgICQoJy5zY2VuYXJpby1lZGl0JykubW9kYWwoJ2hpZGUnKTtcclxuICB9KVxyXG59KVxyXG5cclxuJCgnYm9keScpLm9uKCdjbGljaycsICcuanMtc2NlbmFyaW8tZWRpdC1kZWxldGUnLGZ1bmN0aW9uKCl7XHJcbiAgICB2YXIgcGFyZW50ID0gJCh0aGlzKS5jbG9zZXN0KCcuanMtc2NlbmFyaW8tZWRpdC1zdGVwJyk7XHJcbiAgICBpZiAoISQocGFyZW50KS5pcygnOmZpcnN0LWNoaWxkJykpIHtcclxuICAgICAgICAkKHBhcmVudCkucmVtb3ZlKCk7XHJcbiAgICAgICAgdXBkYXRlU3RlcHMoKTtcclxuICAgIH1cclxuICAgIGVsc2Uge1xyXG4gICAgICAgIHNob3dGbGFzaE1lc3NhZ2UoJ0plIGt1bnQgbmlldCBkZSBlZXJzdGUgc3RhcCB2ZXJ3aWpkZXJlbicsICdkYW5nZXInKTtcclxuICAgIH1cclxufSk7XHJcbiIsInZhciByb3dTZWxlY3RlZCA9IDA7XHJcbnZhciBpbmRleCA9IDA7XHJcbiQoJ2JvZHknKS5vbignY2xpY2snLCAnLmxldmVsMS1idG4tZWRpdCcsIGZ1bmN0aW9uKCl7XHJcbiAgcm93U2VsZWN0ZWQgPSAkKHRoaXMpLnBhcmVudCgpLnBhcmVudCgpLmF0dHIoXCJjbGFzc1wiKTtcclxuICBmb3IgKHZhciBpID0gMDsgaSA8IHVzZXJzLmxlbmd0aDsgaSsrKXtcclxuICAgIGlmKHVzZXJzW2ldLmlkID09IHJvd1NlbGVjdGVkLnNwbGl0KFwiaW5kZXhcIilbMV0pe1xyXG4gICAgICBpbmRleCA9IGlcclxuICAgIH1cclxuICB9XHJcblxyXG4gICQoJy51cGRhdGUtdXNlcnMnKS5tb2RhbCgnc2hvdycpO1xyXG4gICQoJy51cGRhdGUtdXNlcnMtdXNlcm5hbWUnKS52YWwodXNlcnNbaW5kZXhdLnVzZXJuYW1lKVxyXG4gICQoJy51cGRhdGUtdXNlci1vcHRpb25zJykucmVtb3ZlQXR0cihcInNlbGVjdGVkXCIpXHJcblxyXG4gIGlmKHVzZXJzW2luZGV4XS51c2VybGV2ZWwgPT0gMil7XHJcbiAgICAkKCcudXBkYXRlLXVzZXItb3B0aW9uMicpLmF0dHIoXCJzZWxlY3RlZFwiLFwic2VsZWN0ZWRcIilcclxuICB9ZWxzZXtcclxuICAgICQoJy51cGRhdGUtdXNlci1vcHRpb24xJykuYXR0cihcInNlbGVjdGVkXCIsXCJzZWxlY3RlZFwiKVxyXG4gIH1cclxufSlcclxuXHJcbiQoJ2JvZHknKS5vbignY2xpY2snLCAnLnVwZGF0ZS11c2Vycy11cGRhdGUnLCBmdW5jdGlvbigpe1xyXG4gIC8vIGNvbnNvbGUubG9nKFwidXBkYXRlXCIpXHJcbiAgLy8gY29uc29sZS5sb2coJCgnLnVwZGF0ZS11c2Vycy11c2VybmFtZScpLnZhbCgpKVxyXG4gIC8vIGNvbnNvbGUubG9nKCQoJy51cGRhdGUtdXNlcnMtcGFzc3dvcmQnKS52YWwoKSlcclxuICAvLyBjb25zb2xlLmxvZygkKCcudXBkYXRlLXVzZXJzLXJlcGVhdC1wYXNzd29yZCcpLnZhbCgpKVxyXG5cclxuICBpZigkKCcudXBkYXRlLXVzZXJzLXVzZXJuYW1lJykudmFsKCkgPT0gXCJcIiAmJiAkKCcudXBkYXRlLXVzZXJzLXBhc3N3b3JkJykudmFsKCkgPT0gXCJcIiAmJiAkKCcudXBkYXRlLXVzZXJzLXJlcGVhdC1wYXNzd29yZCcpLnZhbCgpID09IFwiXCIpe1xyXG4gICAgY29uc29sZS5sb2coXCJnZWJydWlrZXJzbmFhbSBlbiB3YWNodHdvb3JkIG1vZ2VuIG5pZXQgbGVlZyB6aWpuXCIpO1xyXG4gICAgc2hvd0ZsYXNoTWVzc2FnZSgnR2VicnVpa2VycyBuYWFtIG1hZyBuaWV0IGxlZWcgemlqbicsICdkYW5nZXInKTtcclxuICB9ZWxzZXtcclxuICAgIGlmKCQoJy51cGRhdGUtdXNlcnMtdXNlcm5hbWUnKS52YWwoKSA9PSBcIlwiKXtcclxuICAgICAgc2hvd0ZsYXNoTWVzc2FnZSgnVXcgZ2VicnVpa2Vyc25hYW0gbWFnIG5pZXQgbGVlZyB6aWpuJywgJ2RhbmdlcicpO1xyXG4gICAgfWVsc2UgaWYoJCgnLnVwZGF0ZS11c2Vycy1wYXNzd29yZCcpLnZhbCgpICE9ICQoJy51cGRhdGUtdXNlcnMtcmVwZWF0LXBhc3N3b3JkJykudmFsKCkpe1xyXG4gICAgICBzaG93Rmxhc2hNZXNzYWdlKCdVdyB3YWNodHdvb3JkZW4gemlqbiBuaWV0IGdlbGlqayBhYW4gZWxrYWFyJywgJ2RhbmdlcicpO1xyXG4gICAgfWVsc2V7XHJcbiAgICAgIC8vIGNvbnNvbGUubG9nKHVzZXJzW3Jvd1NlbGVjdGVkLnNwbGl0KFwiaW5kZXhcIilbMV1dKVxyXG4gICAgICAkLnBvc3QoXCJpbmNsdWRlL3VwZGF0ZVVzZXIucGhwXCIgLHtcclxuICAgICAgICBpZDogdXNlcnNbaW5kZXhdLmlkLFxyXG4gICAgICAgIG5hbWU6ICQoJy51cGRhdGUtdXNlcnMtdXNlcm5hbWUnKS52YWwoKSxcclxuICAgICAgICBwYXNzOiAkKCcudXBkYXRlLXVzZXJzLXBhc3N3b3JkJykudmFsKCksXHJcbiAgICAgICAgbGV2ZWw6ICQoJy51cGRhdGUtdXNlci1sZXZlbCcpLnZhbCgpXHJcbiAgICAgIH0sIGZ1bmN0aW9uKHJlc3BvbnNlLHN0YXR1cyl7XHJcbiAgICAgICAgLy8gY29uc29sZS5sb2cocmVzcG9uc2UpXHJcbiAgICAgICAgaWYocmVzcG9uc2UgPT0gXCJzdWNjZXNcIil7XHJcbiAgICAgICAgICAkKCcudXBkYXRlLXVzZXJzJykubW9kYWwoJ2hpZGUnKTtcclxuICAgICAgICAgIHVzZXJzW2luZGV4XS51c2VybmFtZSA9ICQoJy51cGRhdGUtdXNlcnMtdXNlcm5hbWUnKS52YWwoKTtcclxuICAgICAgICAgIC8vIGNvbnNvbGUubG9nKCQoXCIuXCIrcm93U2VsZWN0ZWQpLmZpbmQoXCIudXNlcm5hbWVcIikpXHJcbiAgICAgICAgICAvLyAkKCcub3B0aW9ucycpLnRyaWdnZXIoJ2NsaWNrJyk7XHJcbiAgICAgICAgICB1cGRhdGVMZXZlbDFUZW1wbGF0ZXMoKTtcclxuICAgICAgICAgIC8vIG9wdGlvbnNcclxuICAgICAgICB9XHJcbiAgICAgIH0pXHJcbiAgICB9XHJcbiAgfVxyXG59KVxyXG4iLCJ2YXIgZmxhc2hNZXNzYWdlcyA9IFtdO1xyXG5mdW5jdGlvbiBzaG93Rmxhc2hNZXNzYWdlKG1lcywgdHlwZSwgZGlzbWlzc2FibGUgPSBmYWxzZSwgc2VjcyA9IDIwMDApe1xyXG4gICAgdmFyIHJhbmRTdHIgPSByYW5kb21TdHJpbmcyKDIwKTtcclxuICAgICQoJy5qcy1mbC1jb250JykuYXBwZW5kKCc8ZGl2IGlkPVwiJyArIHJhbmRTdHIgKyAnXCIgY2xhc3M9XCJqcy1mbGFzaCBhbGVydC0nICsgdHlwZSArICcgZmxhc2gtbWVzc2FnZVwiPicrIG1lcyArICc8L2Rpdj4nKTtcclxuICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICQoJyMnICsgcmFuZFN0cikuYWRkQ2xhc3MoJ2ZsYXNoLW1lc3NhZ2UtLXNob3cnKTtcclxuICAgIH0sIDEpO1xyXG4gICAgaWYgKCFkaXNtaXNzYWJsZSkge1xyXG4gICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICBkZWxldGVGbGFzaE1lc3NhZ2UocmFuZFN0cik7XHJcbiAgICAgICAgfSwgc2Vjcyk7XHJcbiAgICB9XHJcbiAgICBlbHNle1xyXG4gICAgICAgICQoJyMnICsgcmFuZFN0cikuYXBwZW5kKCc8YnV0dG9uIGRhdGEtaWQ9XCInICsgcmFuZFN0ciArICdcIiBjbGFzcz1cImpzLWRpc21pc3MgYnRuXCI+T2s8L2J1dHRvbj4nKTtcclxuICAgIH1cclxufVxyXG4kKCdib2R5Jykub24oJ2NsaWNrJywgJy5qcy1kaXNtaXNzJywgZnVuY3Rpb24oKXtcclxuICAgIHZhciBkZWxzdHIgPSAkKHRoaXMpLmRhdGEoJ2lkJyk7XHJcbiAgICBkZWxldGVGbGFzaE1lc3NhZ2UoZGVsc3RyKTtcclxufSk7XHJcblxyXG5mdW5jdGlvbiBkZWxldGVGbGFzaE1lc3NhZ2UoaWQpe1xyXG4gICAgJCgnIycgKyBpZCkucmVtb3ZlQ2xhc3MoJ2ZsYXNoLW1lc3NhZ2UtLXNob3cnKTtcclxuICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICQoJyMnICsgaWQpLnJlbW92ZSgpO1xyXG4gICAgfSwgMjAwKTtcclxufVxyXG5cclxuZnVuY3Rpb24gcmFuZG9tU3RyaW5nMihsZW4sIGJlZm9yZXN0ciA9ICcnLCBhcnJheXRvY2hlY2sgPSBudWxsKSB7XHJcbiAgICAvLyBDaGFyc2V0LCBldmVyeSBjaGFyYWN0ZXIgaW4gdGhpcyBzdHJpbmcgaXMgYW4gb3B0aW9uYWwgb25lIGl0IGNhbiB1c2UgYXMgYSByYW5kb20gY2hhcmFjdGVyLlxyXG4gICAgdmFyIGNoYXJTZXQgPSAnQUJDREVGR0hJSktMTU5PUFFSU1RVVldYWVphYmNkZWZnaGlqa2xtbm9wcXJzdHV2d3h5eic7XHJcbiAgICB2YXIgcmFuZG9tU3RyaW5nID0gJyc7XHJcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbjsgaSsrKSB7XHJcbiAgICAgICAgLy8gY3JlYXRlcyBhIHJhbmRvbSBudW1iZXIgYmV0d2VlbiAwIGFuZCB0aGUgY2hhclNldCBsZW5ndGguIFJvdW5kcyBpdCBkb3duIHRvIGEgd2hvbGUgbnVtYmVyXHJcbiAgICAgICAgdmFyIHJhbmRvbVBveiA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIGNoYXJTZXQubGVuZ3RoKTtcclxuICAgICAgICByYW5kb21TdHJpbmcgKz0gY2hhclNldC5zdWJzdHJpbmcocmFuZG9tUG96LCByYW5kb21Qb3ogKyAxKTtcclxuICAgIH1cclxuICAgIC8vIElmIGFuIGFycmF5IGlzIGdpdmVuIGl0IHdpbGwgY2hlY2sgdGhlIGFycmF5LCBhbmQgaWYgdGhlIGdlbmVyYXRlZCBzdHJpbmcgZXhpc3RzIGluIGl0IGl0IHdpbGwgY3JlYXRlIGEgbmV3IG9uZSB1bnRpbCBhIHVuaXF1ZSBvbmUgaXMgZm91bmQgKldBVENIIE9VVC4gSWYgYWxsIGF2YWlsYWJsZSBvcHRpb25zIGFyZSB1c2VkIGl0IHdpbGwgY2F1c2UgYSBsb29wIGl0IGNhbm5vdCBicmVhayBvdXQqXHJcbiAgICBpZiAoYXJyYXl0b2NoZWNrID09IG51bGwpIHtcclxuICAgICAgICByZXR1cm4gYmVmb3Jlc3RyICsgcmFuZG9tU3RyaW5nO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgICB2YXIgaXNJbiA9ICQuaW5BcnJheShiZWZvcmVzdHIgKyByYW5kb21TdHJpbmcsIGFycmF5dG9jaGVjayk7IC8vIGNoZWNrcyBpZiB0aGUgc3RyaW5nIGlzIGluIHRoZSBhcnJheSwgcmV0dXJucyBhIHBvc2l0aW9uXHJcbiAgICAgICAgaWYgKGlzSW4gPiAtMSkge1xyXG4gICAgICAgICAgICAvLyBpZiB0aGUgcG9zaXRpb24gaXMgbm90IC0xIChtZWFuaW5nLCBpdCBpcyBub3QgaW4gdGhlIGFycmF5KSBpdCB3aWxsIHN0YXJ0IGRvaW5nIGEgbG9vcFxyXG4gICAgICAgICAgICB2YXIgY291bnQgPSAwO1xyXG4gICAgICAgICAgICBkbyB7XHJcbiAgICAgICAgICAgICAgICByYW5kb21TdHJpbmcgPSAnJztcclxuICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuOyBpKyspIHtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgcmFuZG9tUG96ID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogY2hhclNldC5sZW5ndGgpO1xyXG4gICAgICAgICAgICAgICAgICAgIHJhbmRvbVN0cmluZyArPSBjaGFyU2V0LnN1YnN0cmluZyhyYW5kb21Qb3osIHJhbmRvbVBveiArIDEpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgaXNJbiA9ICQuaW5BcnJheShiZWZvcmVzdHIgKyByYW5kb21TdHJpbmcsIGFycmF5dG9jaGVjayk7XHJcbiAgICAgICAgICAgICAgICBjb3VudCsrO1xyXG4gICAgICAgICAgICB9IHdoaWxlIChpc0luID4gLTEpO1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZygnaXQgdG9vayAnICsgY291bnQgKyAnIHRyaWVzJyk7XHJcbiAgICAgICAgICAgIHJldHVybiBiZWZvcmVzdHIgKyByYW5kb21TdHJpbmc7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgcmV0dXJuIGJlZm9yZXN0ciArIHJhbmRvbVN0cmluZztcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuIiwiZnVuY3Rpb24gbG9naW4oYV91c2VyTGV2ZWwpe1xyXG4gICAgJCgnLmxvZ2luLWNvbnRhaW5lcicpLmFkZENsYXNzKFwiaGlkZGVuXCIpO1xyXG4gICAgJCgnLmxvZ2luLXN0YXR1cycpLnRleHQoXCJXZWxrb206IFwiK2xvZ2dlZEluVXNlci51c2VybmFtZSArIFwiICAgIFwiKVxyXG4gICAgJCgnLmxvZ291dCcpLnJlbW92ZUNsYXNzKFwiaGlkZGVuXCIpXHJcbiAgICBsb2dnZWRJbiA9IHRydWU7XHJcbiAgICB1c2VyTGV2ZWwgPSBhX3VzZXJMZXZlbDtcclxuXHJcbiAgICAkKFwiLnVzZXItbGV2ZWxcIikuYWRkQ2xhc3MoXCJoaWRkZW5cIilcclxuICAgICQoXCIudmlld1wiKS5hZGRDbGFzcyhcImhpZGRlblwiKVxyXG5cclxuICAgIHN3aXRjaCAodXNlckxldmVsKSB7XHJcbiAgICAgICAgY2FzZSAxOlxyXG4gICAgICAgICQoXCIudXNlci1sZXZlbF8xXCIpLnJlbW92ZUNsYXNzKFwiaGlkZGVuXCIpXHJcbiAgICAgICAgJChcIi52aWV3XzEtMVwiKS5yZW1vdmVDbGFzcyhcImhpZGRlblwiKVxyXG4gICAgICAgICQoXCIub3B0aW9uXzFcIikuYWRkQ2xhc3MoXCJvcHRpb25zLS1hY3RpdmVcIilcclxuICAgICAgICAkKCcuc2V0dGluZ3MnKS5yZW1vdmVDbGFzcyhcImhpZGRlblwiKVxyXG4gICAgICAgIHVwZGF0ZUxldmVsMVRlbXBsYXRlcygpO1xyXG4gICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgMjpcclxuICAgICAgICAkKFwiLnVzZXItbGV2ZWxfMlwiKS5yZW1vdmVDbGFzcyhcImhpZGRlblwiKVxyXG4gICAgICAgICQoXCIudmlld18yLTFcIikucmVtb3ZlQ2xhc3MoXCJoaWRkZW5cIilcclxuICAgICAgICAkKFwiLm9wdGlvbl8xXCIpLmFkZENsYXNzKFwib3B0aW9ucy0tYWN0aXZlXCIpXHJcbiAgICAgICAgJCgnLnNldHRpbmdzJykucmVtb3ZlQ2xhc3MoXCJoaWRkZW5cIilcclxuICAgICAgICB1cGRhdGVMZXZlbDJUZW1wbGF0ZXMoKTtcclxuICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlIDM6XHJcbiAgICAgICAgJChcIi51c2VyLWxldmVsXzNcIikucmVtb3ZlQ2xhc3MoXCJoaWRkZW5cIilcclxuICAgICAgICBicmVhaztcclxuICAgIH1cclxufVxyXG5cclxuZnVuY3Rpb24gbG9nb3V0KCl7XHJcbiAgICAkKCcubG9naW4tY29udGFpbmVyJykucmVtb3ZlQ2xhc3MoXCJoaWRkZW5cIik7XHJcbiAgICAkKCcubG9naW4tc3RhdHVzJykudGV4dChcIlUgYmVudCBub2cgbmlldCBpbmdlbG9nZFwiKVxyXG4gICAgJCgnLmxvZ291dCcpLmFkZENsYXNzKFwiaGlkZGVuXCIpXHJcbiAgICAkKFwiLnVzZXItbGV2ZWxcIikuYWRkQ2xhc3MoXCJoaWRkZW5cIilcclxuICAgICQoJy5zZXR0aW5ncycpLmFkZENsYXNzKFwiaGlkZGVuXCIpXHJcbiAgICBsb2dnZWRJbiA9IGZhbHNlO1xyXG4gICAgdXNlckxldmVsID0gMDtcclxuICAgIC8vIGNvbnNvbGUubG9nKFwibG9nb3V0XCIpXHJcblxyXG4gICAgJC5wb3N0KFwiaW5jbHVkZS9sb2dpbi5waHBcIix7XHJcbiAgICAgICAgbG9nb3V0U3ViOiAnJ1xyXG4gICAgfSwgZnVuY3Rpb24ocmVzcG9uc2Usc3RhdHVzKXtcclxuICAgICAgICBzaG93Rmxhc2hNZXNzYWdlKCdKZSBiZW50IHVpdGdlbG9nZCcsICdzdWNjZXNzJyk7XHJcbiAgICB9KVxyXG59XHJcblxyXG5mdW5jdGlvbiB1cGRhdGVMZXZlbDFUZW1wbGF0ZXMoKXtcclxuICAgICQucG9zdChcImluY2x1ZGUvZ2V0VXNlcnMucGhwXCIse1xyXG4gICAgfSwgZnVuY3Rpb24ocmVzcG9uc2Usc3RhdHVzKXtcclxuICAgICAgICAvLyBjb25zb2xlLmxvZyhyZXNwb25zZSlcclxuICAgICAgICB1c2VycyA9IEpTT04ucGFyc2UocmVzcG9uc2UpXHJcblxyXG4gICAgICAgIGZvcih2YXIgaSA9IDA7IGkgPCAyOyBpKyspe1xyXG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhpKVxyXG4gICAgICAgICAgICB1c2Vycy5tYXAoZnVuY3Rpb24oY3Asail7XHJcbiAgICAgICAgICAgICAgICBjcC5pbmRleCA9IGNwLmlkO1xyXG4gICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coaSlcclxuICAgICAgICAgICAgICAgIGlmKGNwLnVzZXJsZXZlbCA9PSAyKXtcclxuICAgICAgICAgICAgICAgICAgICBjcC5sZXZlbCA9IFwiRG9jZW50XCJcclxuICAgICAgICAgICAgICAgIH1lbHNlIGlmKGNwLnVzZXJsZXZlbCA9PSAzKXtcclxuICAgICAgICAgICAgICAgICAgICBjcC5sZXZlbCA9IFwiU3R1ZGVudFwiXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBpZihpID09IDApe1xyXG4gICAgICAgICAgICAgICAgICAgIGNwLmNsYXNzID0gXCJlZGl0XCJcclxuICAgICAgICAgICAgICAgICAgICBjcC5jbGFzc1RleHQgPSBcImFhbnBhc3NlblwiXHJcbiAgICAgICAgICAgICAgICB9ZWxzZSBpZihpID09IDEpe1xyXG4gICAgICAgICAgICAgICAgICAgIGNwLmNsYXNzID0gXCJkZWxldGVcIlxyXG4gICAgICAgICAgICAgICAgICAgIGNwLmNsYXNzVGV4dCA9IFwidmVyd2lqZGVyZW5cIlxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KVxyXG5cclxuICAgICAgICAgICAgZm9yKHZhciBqID0gMDsgaiA8IHVzZXJzLmxlbmd0aDsgaisrKXtcclxuICAgICAgICAgICAgICAgIGlmKHVzZXJzW2pdLnVzZXJsZXZlbCA9PSAxKXtcclxuICAgICAgICAgICAgICAgICAgICB1c2Vycy5zcGxpY2UoaiwxKVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAkKFwiLm5ldy11c2VyLW5hbWVcIikudmFsKFwiXCIpO1xyXG4gICAgICAgICAgICAkKFwiLm5ldy11c2VyLXBhc3N3b3JkXCIpLnZhbChcIlwiKTtcclxuICAgICAgICAgICAgJChcIi5uZXctdXNlci1vcHRpb25zXCIpLnJlbW92ZUF0dHIoXCJzZWxlY3RlZFwiKTtcclxuICAgICAgICAgICAgJChcIi5uZXctdXNlci1vcHRpb24xXCIpLmF0dHIoXCJzZWxlY3RlZFwiLFwic2VsZWN0ZWRcIik7XHJcblxyXG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZyh1c2VycylcclxuXHJcbiAgICAgICAgICAgIHZhciB0ZW1wbGF0ZSA9ICQoXCIubGV2ZWwxLXVzZXItdGVtcGxhdGVcIikuaHRtbCgpO1xyXG4gICAgICAgICAgICB2YXIgcmVuZGVyVGVtcGxhdGUgPSBNdXN0YWNoZS5yZW5kZXIodGVtcGxhdGUsIHVzZXJzKTtcclxuXHJcbiAgICAgICAgICAgIGlmKGkgPT0gMCl7XHJcbiAgICAgICAgICAgICAgICAkKFwiLnVzZXItbGV2ZWwxLWVkaXRcIikuaHRtbChyZW5kZXJUZW1wbGF0ZSk7XHJcbiAgICAgICAgICAgIH1lbHNlIGlmKGkgPT0gMSl7XHJcbiAgICAgICAgICAgICAgICAkKFwiLnVzZXItbGV2ZWwxLWRlbGV0ZVwiKS5odG1sKHJlbmRlclRlbXBsYXRlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH0pXHJcbn1cclxuXHJcbmZ1bmN0aW9uIHVwZGF0ZUxldmVsMlRlbXBsYXRlcygpe1xyXG4gICAgJC5wb3N0KFwiaW5jbHVkZS9nZXRTY2VuYXJpb3MucGhwXCIse1xyXG4gICAgfSwgZnVuY3Rpb24ocmVzcG9uc2Usc3RhdHVzKXtcclxuICAgICAgICBzY2VuYXJpb3MgPSBKU09OLnBhcnNlKHJlc3BvbnNlKVxyXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKHNjZW5hcmlvcylcclxuXHJcbiAgICAgICAgJCgnLnNjZW5hcmlvLXNlbGVjdG9yJykuaHRtbChcIlwiKVxyXG4gICAgICAgIGZvcih2YXIgaSA9IDAgOyBpIDwgc2NlbmFyaW9zLmxlbmd0aDsgaSsrKXtcclxuICAgICAgICAgICAgJCgnLnNjZW5hcmlvLXNlbGVjdG9yJykuYXBwZW5kKCc8b3B0aW9uIGRhdGEtaWQ9XCInICsgc2NlbmFyaW9zW2ldLmlkICArICdcIj4nICsgc2NlbmFyaW9zW2ldLm5hbWUgKyBcIjwvb3B0aW9uPlwiKVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gZm9yKHZhciBpID0gMDsgaSA8IDI7IGkrKyl7XHJcblxyXG4gICAgICAgIHZhciB0ZW1wbGF0ZSA9ICQoXCIubGV2ZWwyLXNjZW5hcmlvLXRlbXBsYXRlXCIpLmh0bWwoKTtcclxuICAgICAgICB2YXIgcmVuZGVyVGVtcGxhdGUgPSBNdXN0YWNoZS5yZW5kZXIodGVtcGxhdGUsIHNjZW5hcmlvcyk7XHJcblxyXG4gICAgICAgICQoXCIuanMtc2NlbmFyaW8tY29udGFpbmVyXCIpLmh0bWwocmVuZGVyVGVtcGxhdGUpO1xyXG4gICAgICAgIC8vIH1cclxuICAgIH0pXHJcbn1cclxuXHJcbnZhciBjb25maXJtQ2xhc3NPbGQgPSBcIlwiO1xyXG52YXIgZGVsZXRlQ2xhc3NPbGQgPSBcIlwiO1xyXG5mdW5jdGlvbiBjb25maXJtTW9kYWwodGl0bGUsIGJvZHksIGNvbmZpcm1DbGFzcywgZGVsZXRlQ2xhc3Mpe1xyXG4gICAgaWYoZGVsZXRlQ2xhc3MgPT0gdW5kZWZpbmVkKXtcclxuICAgICAgICBkZWxldGVDbGFzcyA9IFwiY2xvc2UtY29uZmlybVwiXHJcbiAgICB9XHJcbiAgICBpZihjb25maXJtQ2xhc3MgIT0gXCJcIiAmJiBkZWxldGVDbGFzc09sZCAhPSBcIlwiKXtcclxuICAgICAgICAkKCcuY29uZmlybS1zYXZlLWNoYW5nZScpLnJlbW92ZUNsYXNzKGNvbmZpcm1DbGFzc09sZClcclxuICAgICAgICAkKCcuY29uZmlybS1kZWxldGUtY2hhbmdlJykucmVtb3ZlQ2xhc3MoZGVsZXRlQ2xhc3NPbGQpXHJcbiAgICB9XHJcbiAgICAkKCcuY29uZmlybS1zYXZlLWNoYW5nZScpLmFkZENsYXNzKGNvbmZpcm1DbGFzcylcclxuICAgICQoJy5jb25maXJtLWRlbGV0ZS1jaGFuZ2UnKS5hZGRDbGFzcyhkZWxldGVDbGFzcylcclxuXHJcbiAgICBjb25maXJtQ2xhc3NPbGQgPSBjb25maXJtQ2xhc3M7XHJcbiAgICBkZWxldGVDbGFzc09sZCA9IGRlbGV0ZUNsYXNzO1xyXG5cclxuICAgICQoJy5jb25maXJtLXRpdGxlJykudGV4dCh0aXRsZSlcclxuICAgICQoJy5jb25maXJtLXRleHQnKS50ZXh0KGJvZHkpXHJcblxyXG4gICAgJCgnLmpzLWNvbmZpcm0nKS5tb2RhbChcInNob3dcIilcclxuICAgIGZ1bmN0aW9uIHJhbmRvbVN0cmluZzIobGVuLCBiZWZvcmVzdHIgPSAnJywgYXJyYXl0b2NoZWNrID0gbnVsbCkge1xyXG4gICAgICAgIC8vIENoYXJzZXQsIGV2ZXJ5IGNoYXJhY3RlciBpbiB0aGlzIHN0cmluZyBpcyBhbiBvcHRpb25hbCBvbmUgaXQgY2FuIHVzZSBhcyBhIHJhbmRvbSBjaGFyYWN0ZXIuXHJcbiAgICAgICAgdmFyIGNoYXJTZXQgPSAnQUJDREVGR0hJSktMTU5PUFFSU1RVVldYWVphYmNkZWZnaGlqa2xtbm9wcXJzdHV2d3h5eic7XHJcbiAgICAgICAgdmFyIHJhbmRvbVN0cmluZyA9ICcnO1xyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuOyBpKyspIHtcclxuICAgICAgICAgICAgLy8gY3JlYXRlcyBhIHJhbmRvbSBudW1iZXIgYmV0d2VlbiAwIGFuZCB0aGUgY2hhclNldCBsZW5ndGguIFJvdW5kcyBpdCBkb3duIHRvIGEgd2hvbGUgbnVtYmVyXHJcbiAgICAgICAgICAgIHZhciByYW5kb21Qb3ogPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiBjaGFyU2V0Lmxlbmd0aCk7XHJcbiAgICAgICAgICAgIHJhbmRvbVN0cmluZyArPSBjaGFyU2V0LnN1YnN0cmluZyhyYW5kb21Qb3osIHJhbmRvbVBveiArIDEpO1xyXG4gICAgICAgIH1cclxuICAgICAgICAvLyBJZiBhbiBhcnJheSBpcyBnaXZlbiBpdCB3aWxsIGNoZWNrIHRoZSBhcnJheSwgYW5kIGlmIHRoZSBnZW5lcmF0ZWQgc3RyaW5nIGV4aXN0cyBpbiBpdCBpdCB3aWxsIGNyZWF0ZSBhIG5ldyBvbmUgdW50aWwgYSB1bmlxdWUgb25lIGlzIGZvdW5kICpXQVRDSCBPVVQuIElmIGFsbCBhdmFpbGFibGUgb3B0aW9ucyBhcmUgdXNlZCBpdCB3aWxsIGNhdXNlIGEgbG9vcCBpdCBjYW5ub3QgYnJlYWsgb3V0KlxyXG4gICAgICAgIGlmIChhcnJheXRvY2hlY2sgPT0gbnVsbCkge1xyXG4gICAgICAgICAgICByZXR1cm4gYmVmb3Jlc3RyICsgcmFuZG9tU3RyaW5nO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHZhciBpc0luID0gJC5pbkFycmF5KGJlZm9yZXN0ciArIHJhbmRvbVN0cmluZywgYXJyYXl0b2NoZWNrKTsgLy8gY2hlY2tzIGlmIHRoZSBzdHJpbmcgaXMgaW4gdGhlIGFycmF5LCByZXR1cm5zIGEgcG9zaXRpb25cclxuICAgICAgICAgICAgaWYgKGlzSW4gPiAtMSkge1xyXG4gICAgICAgICAgICAgICAgLy8gaWYgdGhlIHBvc2l0aW9uIGlzIG5vdCAtMSAobWVhbmluZywgaXQgaXMgbm90IGluIHRoZSBhcnJheSkgaXQgd2lsbCBzdGFydCBkb2luZyBhIGxvb3BcclxuICAgICAgICAgICAgICAgIHZhciBjb3VudCA9IDA7XHJcbiAgICAgICAgICAgICAgICBkbyB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmFuZG9tU3RyaW5nID0gJyc7XHJcbiAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW47IGkrKykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgcmFuZG9tUG96ID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogY2hhclNldC5sZW5ndGgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByYW5kb21TdHJpbmcgKz0gY2hhclNldC5zdWJzdHJpbmcocmFuZG9tUG96LCByYW5kb21Qb3ogKyAxKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgaXNJbiA9ICQuaW5BcnJheShiZWZvcmVzdHIgKyByYW5kb21TdHJpbmcsIGFycmF5dG9jaGVjayk7XHJcbiAgICAgICAgICAgICAgICAgICAgY291bnQrKztcclxuICAgICAgICAgICAgICAgIH0gd2hpbGUgKGlzSW4gPiAtMSk7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnaXQgdG9vayAnICsgY291bnQgKyAnIHRyaWVzJyk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gYmVmb3Jlc3RyICsgcmFuZG9tU3RyaW5nO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGJlZm9yZXN0ciArIHJhbmRvbVN0cmluZztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG4iLCJ2YXIgbG9nZ2VkSW4gPSBmYWxzZTtcclxudmFyIHVzZXJMZXZlbCA9IDA7XHJcbnZhciBsb2dnZWRJblVzZXIgPSBbXTtcclxudmFyIHVzZXJzID0gW107XHJcbnZhciBzY2VuYXJpb3MgPSBbXTtcclxudmFyIGFsZXJ0QWN0aXZlID0gZmFsc2U7XHJcblxyXG4kKGRvY3VtZW50KS5yZWFkeShmdW5jdGlvbigpe1xyXG4gICAgY29uc29sZS5sb2coXCJob21lLmpzIGxvYWRlZFwiKVxyXG4gICAgJCgnYm9keScpLm9uKCdjbGljaycsICcubWVudS1pdGVtJywgZnVuY3Rpb24oKXtcclxuICAgICAgICB2YXIgaWQgPSAkKHRoaXMpLmF0dHIoXCJjbGFzc1wiKS5zcGxpdCgnXycpWzFdO1xyXG4gICAgICAgIGNvbnNvbGUubG9nKGlkKVxyXG5cclxuICAgICAgICAkKCcudmVyZGllcGluZycpLmFkZENsYXNzKFwiaGlkZGVuXCIpXHJcbiAgICAgICAgJCgnLnZlcmRpZXBpbmdfXycraWQpLnJlbW92ZUNsYXNzKFwiaGlkZGVuXCIpXHJcbiAgICB9KVxyXG5cclxuICAgICQoJ2JvZHknKS5vbignY2xpY2snLCAnLmxvZ2luJywgZnVuY3Rpb24oKXtcclxuICAgICAgICBjb25zb2xlLmxvZygkKCcudXNlcm5hbWUnKS52YWwoKS50b0xvd2VyQ2FzZSgpKVxyXG4gICAgICAgIGNvbnNvbGUubG9nKCQoJy5wYXNzd29yZCcpLnZhbCgpLnRvTG93ZXJDYXNlKCkpXHJcbiAgICAgICAgJC5wb3N0KFwiaW5jbHVkZS9sb2dpbi5waHBcIiAse1xyXG4gICAgICAgICAgICBsb2dpblN1YjogXCJcIixcclxuICAgICAgICAgICAgdXNlcm5hbWU6ICQoJy51c2VybmFtZScpLnZhbCgpLnRvTG93ZXJDYXNlKCksXHJcbiAgICAgICAgICAgIHBhc3N3b3JkOiAkKCcucGFzc3dvcmQnKS52YWwoKVxyXG4gICAgICAgIH0sIGZ1bmN0aW9uKHJlc3BvbnNlLHN0YXR1cyl7XHJcbiAgICAgICAgICAgIHZhciBkYXRhID0gSlNPTi5wYXJzZShyZXNwb25zZSk7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGRhdGEpO1xyXG4gICAgICAgICAgICBsb2dnZWRJblVzZXIgPSBkYXRhO1xyXG4gICAgICAgICAgICBpZiAoZGF0YS5sb2dnZWRJbiA9PSAxKSB7XHJcbiAgICAgICAgICAgICAgICBsb2dpbihkYXRhLmxldmVsKTtcclxuICAgICAgICAgICAgICAgIHNob3dGbGFzaE1lc3NhZ2UoJ1UgYmVudCBzdWNjZXN2b2wgaW5nZWxvZ2QnLCAnc3VjY2VzcycpXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBzaG93Rmxhc2hNZXNzYWdlKCdVdyBnZWJydWlrZXJzbmFhbSBvZiB3YWNodHdvb3JkIGlzIGluY29ycmVjdCcsICdkYW5nZXInKVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSlcclxuICAgIH0pXHJcblxyXG4gICAgJCgnYm9keScpLm9uKCdjbGljaycsICcubG9nb3V0JywgZnVuY3Rpb24oKXtcclxuICAgICAgICBsb2dvdXQoKTtcclxuICAgIH0pXHJcblxyXG4gICAgJCgnYm9keScpLm9uKCdjbGljaycsICcubG9rYWFsJywgZnVuY3Rpb24oKXtcclxuICAgICAgICBjb25zb2xlLmxvZyhsb2dnZWRJbilcclxuICAgICAgICBpZihsb2dnZWRJbiA9PSB0cnVlKXtcclxuICAgICAgICAgICAgdmFyIGxva2FhbG5yID0gJCh0aGlzKS5hdHRyKFwiY2xhc3NcIikuc3BsaXQoXCIgXCIpWzBdO1xyXG4gICAgICAgICAgICAkKCcuanMtbG9rYWFsJykuaHRtbChsb2thYWxucik7XHJcbiAgICAgICAgfVxyXG4gICAgfSlcclxuXHJcbiAgICAkKGRvY3VtZW50KS5rZXlwcmVzcyhmdW5jdGlvbihlKSB7XHJcbiAgICAgICAgaWYoZS53aGljaCA9PSAxMykge1xyXG4gICAgICAgICAgICBpZiAoIWxvZ2dlZEluKSB7XHJcbiAgICAgICAgICAgICAgICAkKCcubG9naW4nKS50cmlnZ2VyKCdjbGljaycpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfSk7XHJcbn0pXHJcbiIsIiQoJ2JvZHknKS5vbignY2xpY2snLCAnLmxva2FhbCcsIGZ1bmN0aW9uKCl7XHJcbiAgICBpZihsb2dnZWRJbil7XHJcbiAgICAgICAgdmFyIGxva2FhbG5yID0gJCh0aGlzKS5hdHRyKFwiY2xhc3NcIikuc3BsaXQoXCIgXCIpWzBdO1xyXG4gICAgICAgICQoJy5qcy1sb2thYWwnKS5odG1sKGxva2FhbG5yKTtcclxuICAgIH1cclxufSlcclxuJCgnYm9keScpLm9uKCdjbGljaycsICcuanMtc3RhcnQtc2NlbmFyaW8nLCBmdW5jdGlvbigpe1xyXG4gICAgaWYgKGxvZ2dlZEluKSB7XHJcbiAgICAgICAgdmFyIGxva2FhbG5yID0gJCgnLmpzLWxva2FhbCcpLmh0bWwoKTtcclxuICAgICAgICB2YXIgc2NlbmFyaW9JZCA9ICQoJy5qcy1zY2VuYXJpb3NlbGVjdCcpLmZpbmQoXCI6c2VsZWN0ZWRcIikuZGF0YSgnaWQnKTtcclxuICAgICAgICB2YXIgdG9vbHMgPSAwO1xyXG4gICAgICAgIGlmICgkKCcuanMtc3dpdGNoJykuaXMoJzpjaGVja2VkJykpIHtcclxuICAgICAgICAgICAgdG9vbHMgPSAxO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAobG9rYWFsbnIgIT0gXCJcIikge1xyXG4gICAgICAgICAgICBpZiAoc2NlbmFyaW9JZCA+PSAxKSB7XHJcbiAgICAgICAgICAgICAgICAkLnBvc3QoXCJpbmNsdWRlL21ha2VBY3RpdmVTY2VuYXJpby5waHBcIix7XHJcbiAgICAgICAgICAgICAgICAgICAgbG9rYWFsbnI6IGxva2FhbG5yLFxyXG4gICAgICAgICAgICAgICAgICAgIHNjZW5hcmlvSWQ6IHNjZW5hcmlvSWQsXHJcbiAgICAgICAgICAgICAgICAgICAgdG9vbHM6IHRvb2xzXHJcbiAgICAgICAgICAgICAgICAgICAgfSwgZnVuY3Rpb24ocmVzcG9uc2Usc3RhdHVzKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHJlc3BvbnNlID09ICdzdWNjZXNzJykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2hvd0ZsYXNoTWVzc2FnZSgnU2NlbmFyaW8gaXMgc3VjY2Vzdm9sIGFhbmdlbWFha3QnLCAnc3VjY2VzcycpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGVsc2V7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzaG93Rmxhc2hNZXNzYWdlKCdIZXQgbWFrZW4gdmFuIGVlbiBzY2VuYXJpbyBpcyBtaXNsdWt0JywgJ2RhbmdlcicpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZXtcclxuICAgICAgICAgICAgICAgIHNob3dGbGFzaE1lc3NhZ2UoJ0VyIGlzIGdlZW4gc2NlbmFyaW8gZ2Vrb3plbicsICdkYW5nZXInKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgc2hvd0ZsYXNoTWVzc2FnZSgnS2llcyBlZW4gbG9rYWFsJywgJ2RhbmdlcicpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufSlcclxuIiwiJChcImJvZHlcIikub24oXCJjbGlja1wiLCBcIi5uZXctdXNlclwiLGZ1bmN0aW9uKCl7XHJcbiAgaWYoJChcIi5uZXctdXNlci1uYW1lXCIpLnZhbCgpID09IFwiXCIgfHwgJChcIi5uZXctdXNlci1wYXNzd29yZFwiKS52YWwoKSA9PSBcIlwiIHx8ICQoXCIubmV3LXVzZXItbGV2ZWxcIikudmFsKCkgPT0gbnVsbCl7XHJcbiAgICBpZigkKFwiLm5ldy11c2VyLW5hbWVcIikudmFsKCkgPT0gXCJcIil7XHJcbiAgICAgIHNob3dGbGFzaE1lc3NhZ2UoJ1UgaGVlZnQgbm9nIGdlZW4gZ2VicnVpa2Vyc25hYW0gaW5nZXZ1bGQnLCAnZGFuZ2VyJyk7XHJcbiAgICB9ZWxzZSBpZigkKFwiLm5ldy11c2VyLXBhc3N3b3JkXCIpLnZhbCgpID09IFwiXCIpe1xyXG4gICAgICBzaG93Rmxhc2hNZXNzYWdlKCdVIGhlZWZ0IG5vZyBnZWVuIHBhc3N3b29yZCBpbmdldnVsZCcsICdkYW5nZXInKTtcclxuICAgIH1lbHNlIGlmKCQoXCIubmV3LXVzZXItbGV2ZWxcIikudmFsKCkgPT0gbnVsbCl7XHJcbiAgICAgIHNob3dGbGFzaE1lc3NhZ2UoJ1UgaGVlZnQgbm9nIGdlZW4gbGV2ZWwgZ2VzZWxlY3RlZXJkJywgJ2RhbmdlcicpO1xyXG4gICAgfVxyXG4gIH1lbHNle1xyXG4gICAgY29uc29sZS5sb2coJChcIi5uZXctdXNlci1sZXZlbFwiKS52YWwoKSlcclxuICAgICQucG9zdChcImluY2x1ZGUvYWRkVXNlci5waHBcIix7XHJcbiAgICAgIHVzZXJuYW1lOiAkKFwiLm5ldy11c2VyLW5hbWVcIikudmFsKCksXHJcbiAgICAgIHVzZXJwYXNzd29yZDogJChcIi5uZXctdXNlci1wYXNzd29yZFwiKS52YWwoKSxcclxuICAgICAgdXNlcmxldmVsOiAkKFwiLm5ldy11c2VyLWxldmVsXCIpLnZhbCgpXHJcbiAgICB9LCBmdW5jdGlvbihyZXNwb25zZSxzdGF0dXMpe1xyXG4gICAgICBjb25zb2xlLmxvZyhyZXNwb25zZSlcclxuICAgICAgaWYocmVzcG9uc2UgPT0gXCJzdWNjZXNzXCIpe1xyXG4gICAgICAgIHNob3dGbGFzaE1lc3NhZ2UoJ0VyIGlzIGVlbiBuaWV1d2UgZ2VicnVpa2VyIGFhbmdlbWFha3QnLCAnc3VjY2VzcycpO1xyXG4gICAgICAgICQoXCIubmV3LXVzZXItbmFtZVwiKS52YWwoXCJcIik7XHJcbiAgICAgICAgJChcIi5uZXctdXNlci1wYXNzd29yZFwiKS52YWwoXCJcIik7XHJcbiAgICAgICAgJChcIi5uZXctdXNlci1vcHRpb25zXCIpLnJlbW92ZUF0dHIoXCJzZWxlY3RlZFwiKTtcclxuICAgICAgICAkKFwiLm5ldy11c2VyLW9wdGlvbjFcIikuYXR0cihcInNlbGVjdGVkXCIsXCJzZWxlY3RlZFwiKTtcclxuICAgICAgfVxyXG4gICAgfSlcclxuICB9XHJcbn0pXHJcbiIsIiQoXCJib2R5XCIpLm9uKFwiY2xpY2tcIiwgXCIub3B0aW9uc1wiLCBmdW5jdGlvbigpe1xyXG4gIHZhciBsZXZlbCA9ICQodGhpcykuYXR0cihcImNsYXNzXCIpLnNwbGl0KFwiIFwiKVsxXS5zcGxpdChcIl9cIilbMV07XHJcbiAgdmFyIG9wdGlvbiA9ICQodGhpcykuYXR0cihcImNsYXNzXCIpLnNwbGl0KFwiIFwiKVsyXS5zcGxpdChcIl9cIilbMV07XHJcbiAgY29uc29sZS5sb2cobGV2ZWwpXHJcblxyXG4gICQoXCIudmlld1wiKS5hZGRDbGFzcyhcImhpZGRlblwiKVxyXG4gICQoXCIudmlld19cIitsZXZlbCtcIi1cIitvcHRpb24pLnJlbW92ZUNsYXNzKFwiaGlkZGVuXCIpXHJcbiAgJCgnLm9wdGlvbnMnKS5yZW1vdmVDbGFzcygnb3B0aW9ucy0tYWN0aXZlJyk7XHJcbiAgJCh0aGlzKS5hZGRDbGFzcygnb3B0aW9ucy0tYWN0aXZlJyk7XHJcbiAgc3dpdGNoIChsZXZlbCkge1xyXG4gICAgY2FzZSBcIjFcIjpcclxuICAgICAgdXBkYXRlTGV2ZWwxVGVtcGxhdGVzKCk7XHJcbiAgICAgIGJyZWFrO1xyXG4gICAgY2FzZSBcIjJcIjpcclxuICAgICAgdXBkYXRlTGV2ZWwyVGVtcGxhdGVzKCk7XHJcbiAgICAgIGJyZWFrO1xyXG4gIH1cclxufSlcclxuIiwiJChkb2N1bWVudCkucmVhZHkoZnVuY3Rpb24oKXtcclxuICAgICQucG9zdChcImluY2x1ZGUvcmV0dXJuU2Vzc2lvbi5waHBcIix7XHJcbiAgICB9LCBmdW5jdGlvbihyZXNwb25zZSxzdGF0dXMpe1xyXG4gICAgICAgIHZhciBkYXRhID0gSlNPTi5wYXJzZShyZXNwb25zZSk7XHJcbiAgICAgICAgaWYgKGRhdGEubG9nZ2VkSW4pIHtcclxuICAgICAgICAgICAgbG9nZ2VkSW5Vc2VyID0gZGF0YTtcclxuICAgICAgICAgICAgbG9naW4oZGF0YS5sZXZlbCk7XHJcbiAgICAgICAgfVxyXG4gICAgfSlcclxufSk7XHJcbiIsIiQoXCIuc2V0dGluZ3MtaW5wdXRzXCIpLmtleXByZXNzKGZ1bmN0aW9uKGUpIHtcclxuICAgIGNvbnNvbGUubG9nKFwiZW50ZXJcIilcclxuICAgIGlmKGUud2hpY2ggPT0gMTMpIHtcclxuICAgICAgICAkKCcuc2V0dGluZ3MtdXBkYXRlJykudHJpZ2dlcignY2xpY2snKTtcclxuICAgIH1cclxufSk7XHJcblxyXG4kKCdib2R5Jykub24oJ2NsaWNrJywgJy5zZXR0aW5ncycsIGZ1bmN0aW9uKCl7XHJcbiAgICBjb25zb2xlLmxvZyhcInNldHRpbmdzXCIpXHJcbiAgICAkKCcuc2V0dGluZ3MtdXNlcm5hbWUnKS52YWwobG9nZ2VkSW5Vc2VyLnVzZXJuYW1lKVxyXG4gICAgJCgnLnVzZXItc2V0dGluZ3MnKS5tb2RhbCgnc2hvdycpO1xyXG4gICAgY29uc29sZS5sb2cobG9nZ2VkSW5Vc2VyLnVzZXJuYW1lKVxyXG59KVxyXG5cclxuJCgnYm9keScpLm9uKCdjbGljaycsICcuc2V0dGluZ3MtdXBkYXRlJywgZnVuY3Rpb24oKXtcclxuICAgIGNvbnNvbGUubG9nKFwidXBkYXRlXCIpXHJcbiAgICBjb25zb2xlLmxvZygkKCcuc2V0dGluZ3MtdXNlcm5hbWUnKS52YWwoKSlcclxuICAgIGNvbnNvbGUubG9nKCQoJy5zZXR0aW5ncy1wYXNzd29yZCcpLnZhbCgpKVxyXG4gICAgY29uc29sZS5sb2coJCgnLnNldHRpbmdzLXJlcGVhdC1wYXNzd29yZCcpLnZhbCgpKVxyXG5cclxuICAgIGlmKCQoJy5zZXR0aW5ncy11c2VybmFtZScpLnZhbCgpID09IFwiXCIgJiYgJCgnLnNldHRpbmdzLXBhc3N3b3JkJykudmFsKCkgPT0gXCJcIiAmJiAkKCcuc2V0dGluZ3MtcmVwZWF0LXBhc3N3b3JkJykudmFsKCkgPT0gXCJcIil7XHJcbiAgICAgICAgY29uc29sZS5sb2coXCJnZWJydWlrZXJzbmFhbSBlbiB3YWNodHdvb3JkIG1vZ2VuIG5pZXQgbGVlZyB6aWpuXCIpO1xyXG4gICAgfWVsc2V7XHJcbiAgICAgICAgaWYoJCgnLnNldHRpbmdzLXBhc3N3b3JkJykudmFsKCkgIT0gJCgnLnNldHRpbmdzLXJlcGVhdC1wYXNzd29yZCcpLnZhbCgpKXtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJ3YWNodHdvb3JkZW4gemlqbiBuaWV0IGdlbGlqayBhYW4gZWxrYWFyXCIpXHJcbiAgICAgICAgfWVsc2V7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGxvZ2dlZEluVXNlcilcclxuICAgICAgICAgICAgJC5wb3N0KFwiaW5jbHVkZS91cGRhdGVVc2VyLnBocFwiICx7XHJcbiAgICAgICAgICAgICAgICBpZDogbG9nZ2VkSW5Vc2VyLnVzZXJJRCxcclxuICAgICAgICAgICAgICAgIG5hbWU6ICQoJy5zZXR0aW5ncy11c2VybmFtZScpLnZhbCgpLFxyXG4gICAgICAgICAgICAgICAgcGFzczogJCgnLnNldHRpbmdzLXBhc3N3b3JkJykudmFsKClcclxuICAgICAgICAgICAgfSwgZnVuY3Rpb24ocmVzcG9uc2Usc3RhdHVzKXtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKHJlc3BvbnNlKTtcclxuICAgICAgICAgICAgICAgIGlmKHJlc3BvbnNlID09IFwic3VjY2VzXCIpe1xyXG4gICAgICAgICAgICAgICAgICAgICQoJy51c2VyLXNldHRpbmdzJykubW9kYWwoJ2hpZGUnKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59KTtcclxuIl19
=======
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFkZFNjZW5hcmlvLmpzIiwiY2hlY2tBbGVydC5qcyIsImNsb3NlLWNvbmZpcm0uanMiLCJkZWxldGUtc2NlbmFyaW8uanMiLCJkZWxldGUtdXNlci5qcyIsImVkaXQtc2NlbmFyaW8uanMiLCJlZGl0LXVzZXIuanMiLCJmbGFzaC1tZXNzYWdlLmpzIiwiZnVuY3Rpb25zLmpzIiwiaG9tZS5qcyIsIm1ha2VBY3RpdmVTY2VuYXJpby5qcyIsIm5ldy11c2VyLmpzIiwibmV3Rmxhc2hNZXNzYWdlLmpzIiwib3B0aW9ucy5qcyIsInNlc3Npb25DaGVjay5qcyIsInNldHRpbmdzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN6Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ1BBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN6QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN4QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDOURBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3hEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3hCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDL0tBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMxREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDdENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDM0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDdkNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDbEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNWQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6Im1haW4uanMiLCJzb3VyY2VzQ29udGVudCI6WyIkKCdib2R5Jykub24oJ3Byb3BlcnR5Y2hhbmdlIGlucHV0JywgJy5qcy1uZXdzdGVwJyxmdW5jdGlvbihlKXtcclxuICAgIHZhciBwYXJlbnQgPSAkKHRoaXMpLmNsb3Nlc3QoJy5qcy1zdGVwJylcclxuICAgIGlmICgkKHBhcmVudCkuaXMoJzpsYXN0LWNoaWxkJykpIHtcclxuICAgICAgICB2YXIgbnJzdHIgPSAkKCcuanMtbGFzdG5yJykuaHRtbCgpO1xyXG4gICAgICAgIHZhciBuZXduciA9IHBhcnNlSW50KG5yc3RyKSArIDE7XHJcbiAgICAgICAgJCgnLmpzLWxhc3RucicpLnJlbW92ZUNsYXNzKCdqcy1sYXN0bnInKTtcclxuICAgICAgICAkKCcuanMtY29weXN0ZXAnKS5jbG9uZSgpLmFwcGVuZFRvKCcuanMtc3RlcHMtY29udGFpbmVyJylcclxuICAgICAgICAucmVtb3ZlQ2xhc3MoJ2pzLWNvcHlzdGVwJykucmVtb3ZlQ2xhc3MoJ2hpZGRlbicpLmFkZENsYXNzKCdqcy1zdGVwJylcclxuICAgICAgICAuZmluZCgnLmpzLW5ld25yJykucmVtb3ZlQ2xhc3MoJ2pzLW5ld25yJykuYWRkQ2xhc3MoJ2pzLWxhc3RucicpLmh0bWwobmV3bnIpO1xyXG4gICAgICAgIHVwZGF0ZVN0ZXBzKCk7XHJcbiAgICB9XHJcbn0pO1xyXG5mdW5jdGlvbiB1cGRhdGVTdGVwcygpe1xyXG4gICAgdmFyIGNvdW50ID0gMTtcclxuICAgICQoJy5qcy1zdGVwbnInKS5lYWNoKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAkKHRoaXMpLmh0bWwoY291bnQpO1xyXG4gICAgICAgIGNvdW50Kys7XHJcbiAgICB9KTtcclxufVxyXG4kKCdib2R5Jykub24oJ2NsaWNrJywgJy5qcy1hZGRzdGVwJyxmdW5jdGlvbigpe1xyXG4gICAgdmFyIG5yc3RyID0gJCgnLmpzLWxhc3RucicpLmh0bWwoKTtcclxuICAgIHZhciBuZXduciA9IHBhcnNlSW50KG5yc3RyKSArIDE7XHJcbiAgICAkKCcuanMtbGFzdG5yJykucmVtb3ZlQ2xhc3MoJ2pzLWxhc3RucicpO1xyXG4gICAgJCgnLmpzLWNvcHlzdGVwJykuY2xvbmUoKS5hcHBlbmRUbygnLmpzLXN0ZXBzLWNvbnRhaW5lcicpXHJcbiAgICAucmVtb3ZlQ2xhc3MoJ2pzLWNvcHlzdGVwJykucmVtb3ZlQ2xhc3MoJ2hpZGRlbicpLmFkZENsYXNzKCdqcy1zdGVwJylcclxuICAgIC5maW5kKCcuanMtbmV3bnInKS5yZW1vdmVDbGFzcygnanMtbmV3bnInKS5hZGRDbGFzcygnanMtbGFzdG5yJykuaHRtbChuZXducik7XHJcbiAgICB1cGRhdGVTdGVwcygpO1xyXG59KTtcclxuJCgnYm9keScpLm9uKCdjbGljaycsICcuanMtc2F2ZS1uZXctc2NlbmFyaW8nLGZ1bmN0aW9uKCl7XHJcbiAgICB2YXIgbmFtZSA9ICQoJy5qcy1uZXctc2NlbmFyaW8tbmFtZScpLnZhbCgpO1xyXG4gICAgdmFyIHN0ZXBzID0gW107XHJcbiAgICBpZiAobmFtZSA9PSAnJykge1xyXG4gICAgICAgIHNob3dGbGFzaE1lc3NhZ2UoJ1Z1bCBlZXJzdCBlZW4gbmFhbSBpbicsICdkYW5nZXInKTtcclxuICAgIH1cclxuICAgIGVsc2V7XHJcbiAgICAgICAgJCgnLmpzLW5ld3N0ZXAnKS5lYWNoKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgdmFyIHRlbXB2YWwgPSAkKHRoaXMpLnZhbCgpO1xyXG4gICAgICAgICAgICBpZiAodGVtcHZhbCAhPSBcIlwiKSB7XHJcbiAgICAgICAgICAgICAgICBzdGVwcy5wdXNoKHRlbXB2YWwpO1xyXG5cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIGlmIChzdGVwcy5sZW5ndGggPT0gMCkge1xyXG4gICAgICAgICAgICBzaG93Rmxhc2hNZXNzYWdlKCdWdWwgbWluc3RlbnMgMSBzdGFwIGluJywgJ2RhbmdlcicpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNle1xyXG4gICAgICAgICAgICAkLnBvc3QoXCJpbmNsdWRlL3NhdmVOZXdTY2VuYXJpby5waHBcIiAse1xyXG4gICAgICAgICAgICAgICAgbmFtZTogbmFtZSxcclxuICAgICAgICAgICAgICAgIHN0ZXBzOiBzdGVwc1xyXG4gICAgICAgICAgICB9LCBmdW5jdGlvbihyZXNwb25zZSxzdGF0dXMpe1xyXG4gICAgICAgICAgICAgICAgaWYocmVzcG9uc2UgPT0gXCJzdWNjZXNcIil7XHJcbiAgICAgICAgICAgICAgICAgICAgc2hvd0ZsYXNoTWVzc2FnZSgnU2NlbmFyaW8gc3VjY2Vzdm9sIHRvZWdldm9lZ2QnLCAnc3VjY2VzcycpO1xyXG4gICAgICAgICAgICAgICAgICAgICQoJy5qcy1zdGVwcy1jb250YWluZXInKS5odG1sKCcnKTtcclxuICAgICAgICAgICAgICAgICAgICAkKCcuanMtbmV3LXNjZW5hcmlvLW5hbWUnKS52YWwoJycpO1xyXG4gICAgICAgICAgICAgICAgICAgICQoJy5qcy1jb3B5c3RlcCcpLmNsb25lKCkuYXBwZW5kVG8oJy5qcy1zdGVwcy1jb250YWluZXInKVxyXG4gICAgICAgICAgICAgICAgICAgIC5yZW1vdmVDbGFzcygnanMtY29weXN0ZXAnKS5yZW1vdmVDbGFzcygnaGlkZGVuJylcclxuICAgICAgICAgICAgICAgICAgICAuYWRkQ2xhc3MoJ2pzLXN0ZXAnKS5hZGRDbGFzcygnVW5pcXVldGVtcCcpXHJcbiAgICAgICAgICAgICAgICAgICAgLmZpbmQoJy5qcy1uZXducicpLnJlbW92ZUNsYXNzKCdqcy1uZXducicpLmFkZENsYXNzKCdqcy1sYXN0bnInKS5odG1sKCcxJyk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59KTtcclxuXHJcbiQoJ2JvZHknKS5vbignY2xpY2snLCAnLmpzLWRlbGV0ZS1zdGVwJyxmdW5jdGlvbigpe1xyXG4gICAgdmFyIHBhcmVudCA9ICQodGhpcykuY2xvc2VzdCgnLmpzLXN0ZXAnKTtcclxuICAgIGlmICghJChwYXJlbnQpLmlzKCc6Zmlyc3QtY2hpbGQnKSkge1xyXG4gICAgICAgICQocGFyZW50KS5yZW1vdmUoKTtcclxuICAgICAgICB1cGRhdGVTdGVwcygpO1xyXG4gICAgfVxyXG4gICAgZWxzZSB7XHJcbiAgICAgICAgc2hvd0ZsYXNoTWVzc2FnZSgnSmUga3VudCBuaWV0IGRlIGVlcnN0ZSBzdGFwIHZlcndpamRlcmVuJywgJ2RhbmdlcicpO1xyXG4gICAgfVxyXG59KTtcclxuIiwiZnVuY3Rpb24gY2hlY2tBbGVydCgpIHtcclxuICAgIGlmKGxvZ2dlZEluVXNlci5sZXZlbCA9PSAzICYmICFhbGVydEFjdGl2ZSAmJiBsb2dnZWRJbiA9PSB0cnVlKXtcclxuICAgICAgICAkLnBvc3QoXCJpbmNsdWRlL2dldFNjZW5hcmlvc0FjdGl2ZS5waHBcIiAse1xyXG4gICAgICAgIH0sIGZ1bmN0aW9uKHJlc3BvbnNlLHN0YXR1cyl7XHJcbiAgICAgICAgICAgIHJlc3BvbnNlID0gSlNPTi5wYXJzZShyZXNwb25zZSk7XHJcbiAgICAgICAgICAgIGlmKHJlc3BvbnNlLmxlbmd0aCA+IDApe1xyXG4gICAgICAgICAgICAgICAgJCgnLnNjZW5hcmlvJykubW9kYWwoJ3Nob3cnKTtcclxuICAgICAgICAgICAgICAgICQoJy5zY2VuYXJpby5tb2RhbCcpLmZpbmQoJy5tb2RhbC10aXRsZScpLmh0bWwocmVzcG9uc2VbMF0ubmFtZSArICcgaW4gbG9rYWFsOiAnICsgcmVzcG9uc2VbMF0ubG9jYXRpb24pO1xyXG4gICAgICAgICAgICAgICAgYWxlcnRBY3RpdmUgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgJCgnLnNjZW5hcmlvLm1vZGFsJykuZmluZCgnLmpzLWNsb3NlLXNjZW5hcmlvLW1vZGFsJykuYXR0cignZGF0YS1hY3RpdmVpZCcsIHJlc3BvbnNlWzBdLmFjdGl2ZV9pZCk7XHJcbiAgICAgICAgICAgICAgICBpZiAoIXJlc3BvbnNlWzBdLnRvb2xzICkge1xyXG4gICAgICAgICAgICAgICAgICAgICQoJy5zY2VuYXJpby5tb2RhbCcpLmZpbmQoJy5tb2RhbC1ib2R5JykuaHRtbCgnRGUgZG9jZW50IGhlZWZ0IHRvZWdhbmcgdG90IGRlemUgaHVscG1pZGRlbGVuIHVpdGdlc2NoYWtlbGQnKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBzdGVwcyA9IHJlc3BvbnNlWzBdLnN0ZXBzO1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKHN0ZXBzKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pXHJcbiAgICB9XHJcbiAgICBzZXRUaW1lb3V0KGNoZWNrQWxlcnQsIDEwMDApO1xyXG59XHJcbnNldFRpbWVvdXQoY2hlY2tBbGVydCwgMTAwMCk7XHJcbiQoJ2JvZHknKS5vbignY2xpY2snLCAnLmpzLWNsb3NlLXNjZW5hcmlvLW1vZGFsJywgZnVuY3Rpb24oKXtcclxuICAgIHZhciBhY3RpdmVpZCA9ICQodGhpcykuYXR0cignZGF0YS1hY3RpdmVpZCcpO1xyXG4gICAgY29uc29sZS5sb2coYWN0aXZlaWQpO1xyXG4gICAgJC5wb3N0KFwiaW5jbHVkZS9maW5pc2hBY3RpdmVTY2VuYXJpb1wiLHtcclxuICAgICAgICBhY3RpdmVpZCA6IGFjdGl2ZWlkXHJcbiAgICAgICAgfSwgZnVuY3Rpb24ocmVzcG9uc2Usc3RhdHVzKXtcclxuICAgICAgICAgICAgY29uc29sZS5sb2cocmVzcG9uc2UpO1xyXG4gICAgICAgICAgICBpZiAocmVzcG9uc2UgPT0gJ3N1Y2Nlc3MnKSB7XHJcblxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbn0pO1xyXG4kKCcuc2NlbmFyaW8nKS5vbignaGlkZGVuLmJzLm1vZGFsJywgZnVuY3Rpb24gKCkge1xyXG4gICAgY29uc29sZS5sb2coXCJjbG9zZVwiKVxyXG4gICAgaWYobG9nZ2VkSW5Vc2VyLmxldmVsID09IDMgJiYgbG9nZ2VkSW4gPT0gdHJ1ZSl7XHJcbiAgICAgICAgYWxlcnRBY3RpdmUgPSBmYWxzZTtcclxuICAgIH1cclxufSlcclxuIiwiJChcImJvZHlcIikub24oJ2NsaWNrJywnLmNsb3NlLWNvbmZpcm0nLGZ1bmN0aW9uKCl7XHJcbiAgJCgnLmpzLWNvbmZpcm0nKS5tb2RhbChcImhpZGVcIilcclxufSlcclxuXHJcbiQoXCJib2R5XCIpLm9uKCdjbGljaycsJy5jb25maXJtLXNhdmUtY2hhbmdlJyxmdW5jdGlvbigpe1xyXG4gICQoJy5qcy1jb25maXJtJykubW9kYWwoXCJoaWRlXCIpXHJcbn0pXHJcbiIsInZhciByb3dDbGFzcztcclxudmFyIHJvdztcclxuJCgnYm9keScpLm9uKCdjbGljaycsICcubGV2ZWwyLWJ0bi1kZWxldGUnLGZ1bmN0aW9uKCl7XHJcbiAgY29uZmlybU1vZGFsKFwiU2VuYXJpbyBWZXJ3aWpkZXJlblwiLFwiV2VldCB1IHpla2VyIGRhdCB1IGRpdCBzY2VuYXJpbyB3aWx0IHZlcndpamRlcmVuXCIsXCJjb25maXJtLXNjZW5hcmlvLWRlbGV0ZVwiKTtcclxuICByb3dDbGFzcyA9ICQodGhpcykucGFyZW50KCkucGFyZW50KCkuYXR0cihcImNsYXNzXCIpO1xyXG4gIHJvdyA9ICQodGhpcykucGFyZW50KCkucGFyZW50KCkuYXR0cihcImNsYXNzXCIpLnNwbGl0KFwiaW5kZXhcIilbMV07XHJcbn0pXHJcblxyXG4kKCdib2R5Jykub24oJ2NsaWNrJywnLmNvbmZpcm0tc2NlbmFyaW8tZGVsZXRlJyxmdW5jdGlvbigpe1xyXG4gIGZvcih2YXIgaSA9IDA7IGkgPCBzY2VuYXJpb3MubGVuZ3RoOyBpKyspe1xyXG4gICAgaWYoc2NlbmFyaW9zW2ldLmlkID09IHJvdyl7XHJcbiAgICAgICQucG9zdChcImluY2x1ZGUvZGVsZXRlU2NlbmFyaW9zLnBocFwiICx7XHJcbiAgICAgICAgaWQ6IHNjZW5hcmlvc1tpXS5pZFxyXG4gICAgICB9LCBmdW5jdGlvbihyZXNwb25zZSxzdGF0dXMpe1xyXG4gICAgICAgIGNvbnNvbGUubG9nKHJlc3BvbnNlKVxyXG4gICAgICAgIGlmKHJlc3BvbnNlID09IFwic3VjY2Vzc3VjY2Vzc3VjY2VzXCIpe1xyXG4gICAgICAgICAgY29uc29sZS5sb2cocm93Q2xhc3MpXHJcbiAgICAgICAgICBzY2VuYXJpb3Muc3BsaWNlKGksMSlcclxuICAgICAgICAgICQoXCIuXCIrcm93Q2xhc3MpLnJlbW92ZSgpO1xyXG4gICAgICAgICAgdXBkYXRlTGV2ZWwyVGVtcGxhdGVzKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9KVxyXG4gICAgfVxyXG4gIH1cclxufSlcclxuIiwidmFyIHJvd0NsYXNzID0gXCJcIjtcclxudmFyIHJvdyA9IFwiXCI7XHJcbiQoJ2JvZHknKS5vbignY2xpY2snLCAnLmxldmVsMS1idG4tZGVsZXRlJyxmdW5jdGlvbigpe1xyXG4gIGNvbmZpcm1Nb2RhbChcIkdlYnJ1aWtlciBWZXJ3aWpkZXJlblwiLFwiV2VldCB1IHpla2VyIGRhdCB1IGRlemUgZ2VicnVpa2VyIHdpbHQgdmVyd2lqZGVyZW5cIixcImNvbmZpcm0tdXNlci1kZWxldGVcIik7XHJcbiAgcm93Q2xhc3MgPSAkKHRoaXMpLnBhcmVudCgpLnBhcmVudCgpLmF0dHIoXCJjbGFzc1wiKTtcclxuICByb3cgPSAkKHRoaXMpLnBhcmVudCgpLnBhcmVudCgpLmF0dHIoXCJjbGFzc1wiKS5zcGxpdChcImluZGV4XCIpWzFdO1xyXG4gIGNvbnNvbGUubG9nKHVzZXJzKVxyXG59KVxyXG5cclxuJChcImJvZHlcIikub24oJ2NsaWNrJywnLmNvbmZpcm0tdXNlci1kZWxldGUnLGZ1bmN0aW9uKCl7XHJcbiAgY29uc29sZS5sb2coXCJ1c2VyLWRlbGV0ZVwiKVxyXG4gIGZvcih2YXIgaSA9IDA7IGkgPCB1c2Vycy5sZW5ndGg7IGkrKyl7XHJcbiAgICBpZih1c2Vyc1tpXS5pZCA9PSByb3cpe1xyXG4gICAgICAkLnBvc3QoXCJpbmNsdWRlL2RlbGV0ZVVzZXIucGhwXCIgLHtcclxuICAgICAgICBpZDogdXNlcnNbaV0uaWRcclxuICAgICAgfSwgZnVuY3Rpb24ocmVzcG9uc2Usc3RhdHVzKXtcclxuICAgICAgICBpZihyZXNwb25zZSA9PSBcInN1Y2Nlc1wiKXtcclxuICAgICAgICAgIHNob3dGbGFzaE1lc3NhZ2UoJ1UgaGVlZnQgZGUgZ2VicnVpa2VyIHN1Y2Nlc3ZvbCB2ZXJ3aWpkZXJkJywgJ3N1Y2Nlc3MnKTtcclxuICAgICAgICAgICQoXCIuXCIrcm93Q2xhc3MpLnJlbW92ZSgpO1xyXG4gICAgICAgIH1cclxuICAgICAgfSlcclxuICAgIH1cclxuICB9XHJcbn0pXHJcbiIsInZhciByb3dTZWxlY3RlZCA9IDA7XHJcbnZhciBpbmRleCA9IDA7XHJcbnZhciBkZXNjcmlwdGlvbnMgPSBbXTtcclxuJCgnYm9keScpLm9uKCdjbGljaycsICcubGV2ZWwyLWJ0bi1lZGl0JywgZnVuY3Rpb24oKXtcclxuICByb3dTZWxlY3RlZCA9ICQodGhpcykucGFyZW50KCkucGFyZW50KCkuYXR0cihcImNsYXNzXCIpO1xyXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgc2NlbmFyaW9zLmxlbmd0aDsgaSsrKXtcclxuICAgIGlmKHNjZW5hcmlvc1tpXS5pZCA9PSByb3dTZWxlY3RlZC5zcGxpdChcImluZGV4XCIpWzFdKXtcclxuICAgICAgaW5kZXggPSBpXHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICAkLnBvc3QoXCJpbmNsdWRlL2dldFNjZW5lcmlvRGVzYy5waHBcIiAse1xyXG4gICAgaWQ6IHNjZW5hcmlvc1tpbmRleF0uaWRcclxuICB9LCBmdW5jdGlvbihyZXNwb25zZSxzdGF0dXMpe1xyXG4gICAgZGVzY3JpcHRpb25zID0gSlNPTi5wYXJzZShyZXNwb25zZSlcclxuXHJcbiAgICBkZXNjcmlwdGlvbnMubWFwKGZ1bmN0aW9uKGNwLGkpe1xyXG4gICAgICBjcC5pbmRleCA9IGkrMTtcclxuICAgIH0pXHJcbiAgICBjb25zb2xlLmxvZyhkZXNjcmlwdGlvbnMpXHJcblxyXG4gICAgdmFyIHRlbXBsYXRlID0gJChcIi5sZXZlbDItc2NlbmFyaW8tZWRpdC10ZW1wbGF0ZVwiKS5odG1sKCk7XHJcbiAgICB2YXIgcmVuZGVyVGVtcGxhdGUgPSBNdXN0YWNoZS5yZW5kZXIodGVtcGxhdGUsIGRlc2NyaXB0aW9ucyk7XHJcblxyXG4gICAgJChcIi5zY2VuYXJpby1lZGl0LW9wdGlvbnMtY29udGFpbmVyXCIpLmh0bWwocmVuZGVyVGVtcGxhdGUpO1xyXG5cclxuICAgICQoJy5zY2VuYXJpby1lZGl0JykubW9kYWwoJ3Nob3cnKTtcclxuICAgICQoJy51cGRhdGUtc2NlbmFyaW9zLW5hbWUnKS52YWwoc2NlbmFyaW9zW2luZGV4XS5uYW1lKVxyXG4gIH0pXHJcbn0pXHJcblxyXG4kKCdib2R5Jykub24oJ2NsaWNrJywgJy51cGRhdGUtc2NlbmFyaW9zLXVwZGF0ZScsIGZ1bmN0aW9uKCl7XHJcbiAgZGVzY3JpcHRpb25OYW1lcyA9IFtdO1xyXG4gIGNvbnNvbGUubG9nKHNjZW5hcmlvc1tpbmRleF0pXHJcbiAgZm9yKHZhciBpID0gMSA7IGkgPCAoZGVzY3JpcHRpb25zLmxlbmd0aCsxKTsgaSsrKXtcclxuICAgIGlmKCQoJy5qcy1zY2VuYXJpby1lZGl0LScraSkudmFsKCkgIT0gXCJcIil7XHJcbiAgICAgIGRlc2NyaXB0aW9uTmFtZXMucHVzaCgkKCcuanMtc2NlbmFyaW8tZWRpdC0nK2kpLnZhbCgpKVxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgY29uc29sZS5sb2coZGVzY3JpcHRpb25OYW1lcylcclxuXHJcbiAgJC5wb3N0KFwiaW5jbHVkZS91cGRhdGVTY2VuYXJpby5waHBcIiAse1xyXG4gICAgc2NlbmFyaW9JRDogc2NlbmFyaW9zW2luZGV4XS5pZCxcclxuICAgIG5hbWU6ICQoJy51cGRhdGUtc2NlbmFyaW9zLW5hbWUnKS52YWwoKSxcclxuICAgIGRlc2NyaXB0aW9uczogZGVzY3JpcHRpb25zXHJcbiAgfSwgZnVuY3Rpb24ocmVzcG9uc2Usc3RhdHVzKXtcclxuICAgIGNvbnNvbGUubG9nKHJlc3BvbnNlKVxyXG4gICAgJCgnLnNjZW5hcmlvLWVkaXQnKS5tb2RhbCgnaGlkZScpO1xyXG4gIH0pXHJcbn0pXHJcblxyXG4kKCdib2R5Jykub24oJ2NsaWNrJywgJy5qcy1zY2VuYXJpby1lZGl0LWRlbGV0ZScsZnVuY3Rpb24oKXtcclxuICAgIHZhciBwYXJlbnQgPSAkKHRoaXMpLmNsb3Nlc3QoJy5qcy1zY2VuYXJpby1lZGl0LXN0ZXAnKTtcclxuICAgIGlmICghJChwYXJlbnQpLmlzKCc6Zmlyc3QtY2hpbGQnKSkge1xyXG4gICAgICAgICQocGFyZW50KS5yZW1vdmUoKTtcclxuICAgICAgICB1cGRhdGVTdGVwcygpO1xyXG4gICAgfVxyXG4gICAgZWxzZSB7XHJcbiAgICAgICAgc2hvd0ZsYXNoTWVzc2FnZSgnSmUga3VudCBuaWV0IGRlIGVlcnN0ZSBzdGFwIHZlcndpamRlcmVuJywgJ2RhbmdlcicpO1xyXG4gICAgfVxyXG59KTtcclxuIiwidmFyIHJvd1NlbGVjdGVkID0gMDtcclxudmFyIGluZGV4ID0gMDtcclxuJCgnYm9keScpLm9uKCdjbGljaycsICcubGV2ZWwxLWJ0bi1lZGl0JywgZnVuY3Rpb24oKXtcclxuICByb3dTZWxlY3RlZCA9ICQodGhpcykucGFyZW50KCkucGFyZW50KCkuYXR0cihcImNsYXNzXCIpO1xyXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgdXNlcnMubGVuZ3RoOyBpKyspe1xyXG4gICAgaWYodXNlcnNbaV0uaWQgPT0gcm93U2VsZWN0ZWQuc3BsaXQoXCJpbmRleFwiKVsxXSl7XHJcbiAgICAgIGluZGV4ID0gaVxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgJCgnLnVwZGF0ZS11c2VycycpLm1vZGFsKCdzaG93Jyk7XHJcbiAgJCgnLnVwZGF0ZS11c2Vycy11c2VybmFtZScpLnZhbCh1c2Vyc1tpbmRleF0udXNlcm5hbWUpXHJcbiAgJCgnLnVwZGF0ZS11c2VyLW9wdGlvbnMnKS5yZW1vdmVBdHRyKFwic2VsZWN0ZWRcIilcclxuXHJcbiAgaWYodXNlcnNbaW5kZXhdLnVzZXJsZXZlbCA9PSAyKXtcclxuICAgICQoJy51cGRhdGUtdXNlci1vcHRpb24yJykuYXR0cihcInNlbGVjdGVkXCIsXCJzZWxlY3RlZFwiKVxyXG4gIH1lbHNle1xyXG4gICAgJCgnLnVwZGF0ZS11c2VyLW9wdGlvbjEnKS5hdHRyKFwic2VsZWN0ZWRcIixcInNlbGVjdGVkXCIpXHJcbiAgfVxyXG59KVxyXG5cclxuJCgnYm9keScpLm9uKCdjbGljaycsICcudXBkYXRlLXVzZXJzLXVwZGF0ZScsIGZ1bmN0aW9uKCl7XHJcbiAgLy8gY29uc29sZS5sb2coXCJ1cGRhdGVcIilcclxuICAvLyBjb25zb2xlLmxvZygkKCcudXBkYXRlLXVzZXJzLXVzZXJuYW1lJykudmFsKCkpXHJcbiAgLy8gY29uc29sZS5sb2coJCgnLnVwZGF0ZS11c2Vycy1wYXNzd29yZCcpLnZhbCgpKVxyXG4gIC8vIGNvbnNvbGUubG9nKCQoJy51cGRhdGUtdXNlcnMtcmVwZWF0LXBhc3N3b3JkJykudmFsKCkpXHJcblxyXG4gIGlmKCQoJy51cGRhdGUtdXNlcnMtdXNlcm5hbWUnKS52YWwoKSA9PSBcIlwiICYmICQoJy51cGRhdGUtdXNlcnMtcGFzc3dvcmQnKS52YWwoKSA9PSBcIlwiICYmICQoJy51cGRhdGUtdXNlcnMtcmVwZWF0LXBhc3N3b3JkJykudmFsKCkgPT0gXCJcIil7XHJcbiAgICBjb25zb2xlLmxvZyhcImdlYnJ1aWtlcnNuYWFtIGVuIHdhY2h0d29vcmQgbW9nZW4gbmlldCBsZWVnIHppam5cIik7XHJcbiAgICBzaG93Rmxhc2hNZXNzYWdlKCdHZWJydWlrZXJzIG5hYW0gbWFnIG5pZXQgbGVlZyB6aWpuJywgJ2RhbmdlcicpO1xyXG4gIH1lbHNle1xyXG4gICAgaWYoJCgnLnVwZGF0ZS11c2Vycy11c2VybmFtZScpLnZhbCgpID09IFwiXCIpe1xyXG4gICAgICBzaG93Rmxhc2hNZXNzYWdlKCdVdyBnZWJydWlrZXJzbmFhbSBtYWcgbmlldCBsZWVnIHppam4nLCAnZGFuZ2VyJyk7XHJcbiAgICB9ZWxzZSBpZigkKCcudXBkYXRlLXVzZXJzLXBhc3N3b3JkJykudmFsKCkgIT0gJCgnLnVwZGF0ZS11c2Vycy1yZXBlYXQtcGFzc3dvcmQnKS52YWwoKSl7XHJcbiAgICAgIHNob3dGbGFzaE1lc3NhZ2UoJ1V3IHdhY2h0d29vcmRlbiB6aWpuIG5pZXQgZ2VsaWprIGFhbiBlbGthYXInLCAnZGFuZ2VyJyk7XHJcbiAgICB9ZWxzZXtcclxuICAgICAgLy8gY29uc29sZS5sb2codXNlcnNbcm93U2VsZWN0ZWQuc3BsaXQoXCJpbmRleFwiKVsxXV0pXHJcbiAgICAgICQucG9zdChcImluY2x1ZGUvdXBkYXRlVXNlci5waHBcIiAse1xyXG4gICAgICAgIGlkOiB1c2Vyc1tpbmRleF0uaWQsXHJcbiAgICAgICAgbmFtZTogJCgnLnVwZGF0ZS11c2Vycy11c2VybmFtZScpLnZhbCgpLFxyXG4gICAgICAgIHBhc3M6ICQoJy51cGRhdGUtdXNlcnMtcGFzc3dvcmQnKS52YWwoKSxcclxuICAgICAgICBsZXZlbDogJCgnLnVwZGF0ZS11c2VyLWxldmVsJykudmFsKClcclxuICAgICAgfSwgZnVuY3Rpb24ocmVzcG9uc2Usc3RhdHVzKXtcclxuICAgICAgICAvLyBjb25zb2xlLmxvZyhyZXNwb25zZSlcclxuICAgICAgICBpZihyZXNwb25zZSA9PSBcInN1Y2Nlc1wiKXtcclxuICAgICAgICAgICQoJy51cGRhdGUtdXNlcnMnKS5tb2RhbCgnaGlkZScpO1xyXG4gICAgICAgICAgdXNlcnNbaW5kZXhdLnVzZXJuYW1lID0gJCgnLnVwZGF0ZS11c2Vycy11c2VybmFtZScpLnZhbCgpO1xyXG4gICAgICAgICAgLy8gY29uc29sZS5sb2coJChcIi5cIityb3dTZWxlY3RlZCkuZmluZChcIi51c2VybmFtZVwiKSlcclxuICAgICAgICAgIC8vICQoJy5vcHRpb25zJykudHJpZ2dlcignY2xpY2snKTtcclxuICAgICAgICAgIHVwZGF0ZUxldmVsMVRlbXBsYXRlcygpO1xyXG4gICAgICAgICAgLy8gb3B0aW9uc1xyXG4gICAgICAgIH1cclxuICAgICAgfSlcclxuICAgIH1cclxuICB9XHJcbn0pXHJcbiIsIi8vIGZ1bmN0aW9uIHNob3dGbGFzaE1lc3NhZ2UobWVzLCB0eXBlLCBkaXNtaXNzYWJsZSA9IGZhbHNlLCBzZWNzID0gMjAwMCl7XHJcbi8vICAgICB2YXIgZWxlbSA9ICQoJy5qcy1mbGFzaCcpO1xyXG4vLyAgICAgJChlbGVtKS5yZW1vdmVDbGFzcygnYWxlcnQtZGFuZ2VyJykucmVtb3ZlQ2xhc3MoJ2FsZXJ0LXN1Y2Nlc3MnKVxyXG4vLyAgICAgICAgIC5hZGRDbGFzcygnZmxhc2gtbWVzc2FnZS0tc2hvdycpXHJcbi8vICAgICAgICAgLmFkZENsYXNzKCdhbGVydC0nICsgdHlwZSlcclxuLy8gICAgICAgICAuaHRtbChtZXMpO1xyXG4vLyAgICAgaWYgKGRpc21pc3NhYmxlKSB7XHJcbi8vICAgICAgICAgJChlbGVtKS5hcHBlbmQoJzxidXR0b24gY2xhc3M9XCJqcy1kaXNtaXNzIGJ0blwiPk9rPC9idXR0b24+Jyk7XHJcbi8vICAgICB9XHJcbi8vICAgICBlbHNlIHtcclxuLy8gICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcclxuLy8gICAgICAgICAgICAgdW5zaG93Rmxhc2hNZXNzYWdlKCk7XHJcbi8vICAgICAgICAgfSwgc2Vjcyk7XHJcbi8vICAgICB9XHJcbi8vIH1cclxuLy8gJCgnYm9keScpLm9uKCdjbGljaycsICcuanMtZGlzbWlzcycsIGZ1bmN0aW9uKCl7XHJcbi8vICAgICB1bnNob3dGbGFzaE1lc3NhZ2UoKTtcclxuLy8gfSk7XHJcbi8vXHJcbi8vIGZ1bmN0aW9uIHVuc2hvd0ZsYXNoTWVzc2FnZSgpe1xyXG4vLyAgICAgdmFyIGVsZW0gPSAkKCcuanMtZmxhc2gnKTtcclxuLy8gICAgIGNvbnNvbGUubG9nKGVsZW0pO1xyXG4vLyAgICAgJChlbGVtKS5yZW1vdmVDbGFzcygnZmxhc2gtbWVzc2FnZS0tc2hvdycpO1xyXG4vLyB9XHJcbiIsImZ1bmN0aW9uIGxvZ2luKGFfdXNlckxldmVsKXtcclxuICAkKCcubG9naW4tY29udGFpbmVyJykuYWRkQ2xhc3MoXCJoaWRkZW5cIik7XHJcbiAgJCgnLmxvZ2luLXN0YXR1cycpLnRleHQoXCJXZWxrb206IFwiK2xvZ2dlZEluVXNlci51c2VybmFtZSArIFwiICAgIFwiKVxyXG4gICQoJy5sb2dvdXQnKS5yZW1vdmVDbGFzcyhcImhpZGRlblwiKVxyXG4gIGxvZ2dlZEluID0gdHJ1ZTtcclxuICB1c2VyTGV2ZWwgPSBhX3VzZXJMZXZlbDtcclxuXHJcbiAgJChcIi51c2VyLWxldmVsXCIpLmFkZENsYXNzKFwiaGlkZGVuXCIpXHJcbiAgJChcIi52aWV3XCIpLmFkZENsYXNzKFwiaGlkZGVuXCIpXHJcblxyXG4gIHN3aXRjaCAodXNlckxldmVsKSB7XHJcbiAgICBjYXNlIDE6XHJcbiAgICAgICQoXCIudXNlci1sZXZlbF8xXCIpLnJlbW92ZUNsYXNzKFwiaGlkZGVuXCIpXHJcbiAgICAgICQoXCIudmlld18xLTFcIikucmVtb3ZlQ2xhc3MoXCJoaWRkZW5cIilcclxuICAgICAgJChcIi5vcHRpb25fMVwiKS5hZGRDbGFzcyhcIm9wdGlvbnMtLWFjdGl2ZVwiKVxyXG4gICAgICAkKCcuc2V0dGluZ3MnKS5yZW1vdmVDbGFzcyhcImhpZGRlblwiKVxyXG4gICAgICB1cGRhdGVMZXZlbDFUZW1wbGF0ZXMoKTtcclxuICAgICAgYnJlYWs7XHJcbiAgICBjYXNlIDI6XHJcbiAgICAgICQoXCIudXNlci1sZXZlbF8yXCIpLnJlbW92ZUNsYXNzKFwiaGlkZGVuXCIpXHJcbiAgICAgICQoXCIudmlld18yLTFcIikucmVtb3ZlQ2xhc3MoXCJoaWRkZW5cIilcclxuICAgICAgJChcIi5vcHRpb25fMVwiKS5hZGRDbGFzcyhcIm9wdGlvbnMtLWFjdGl2ZVwiKVxyXG4gICAgICAkKCcuc2V0dGluZ3MnKS5yZW1vdmVDbGFzcyhcImhpZGRlblwiKVxyXG4gICAgICB1cGRhdGVMZXZlbDJUZW1wbGF0ZXMoKTtcclxuICAgICAgYnJlYWs7XHJcbiAgICBjYXNlIDM6XHJcbiAgICAgICQoXCIudXNlci1sZXZlbF8zXCIpLnJlbW92ZUNsYXNzKFwiaGlkZGVuXCIpXHJcbiAgICAgIGJyZWFrO1xyXG4gIH1cclxufVxyXG5cclxuZnVuY3Rpb24gbG9nb3V0KCl7XHJcbiAgJCgnLmxvZ2luLWNvbnRhaW5lcicpLnJlbW92ZUNsYXNzKFwiaGlkZGVuXCIpO1xyXG4gICQoJy5sb2dpbi1zdGF0dXMnKS50ZXh0KFwiVSBiZW50IG5vZyBuaWV0IGluZ2Vsb2dkXCIpXHJcbiAgJCgnLmxvZ291dCcpLmFkZENsYXNzKFwiaGlkZGVuXCIpXHJcbiAgJChcIi51c2VyLWxldmVsXCIpLmFkZENsYXNzKFwiaGlkZGVuXCIpXHJcbiAgJCgnLnNldHRpbmdzJykuYWRkQ2xhc3MoXCJoaWRkZW5cIilcclxuICBsb2dnZWRJbiA9IGZhbHNlO1xyXG4gIHVzZXJMZXZlbCA9IDA7XHJcbiAgLy8gY29uc29sZS5sb2coXCJsb2dvdXRcIilcclxuXHJcbiAgJC5wb3N0KFwiaW5jbHVkZS9sb2dpbi5waHBcIix7XHJcbiAgICAgIGxvZ291dFN1YjogJydcclxuICB9LCBmdW5jdGlvbihyZXNwb25zZSxzdGF0dXMpe1xyXG4gICAgICBzaG93Rmxhc2hNZXNzYWdlKCdKZSBiZW50IHVpdGdlbG9nZCcsICdzdWNjZXNzJyk7XHJcbiAgfSlcclxufVxyXG5cclxuZnVuY3Rpb24gdXBkYXRlTGV2ZWwxVGVtcGxhdGVzKCl7XHJcbiAgJC5wb3N0KFwiaW5jbHVkZS9nZXRVc2Vycy5waHBcIix7XHJcbiAgfSwgZnVuY3Rpb24ocmVzcG9uc2Usc3RhdHVzKXtcclxuICAgIC8vIGNvbnNvbGUubG9nKHJlc3BvbnNlKVxyXG4gICAgdXNlcnMgPSBKU09OLnBhcnNlKHJlc3BvbnNlKVxyXG5cclxuICAgIGZvcih2YXIgaSA9IDA7IGkgPCAyOyBpKyspe1xyXG4gICAgICAvLyBjb25zb2xlLmxvZyhpKVxyXG4gICAgICB1c2Vycy5tYXAoZnVuY3Rpb24oY3Asail7XHJcbiAgICAgICAgY3AuaW5kZXggPSBjcC5pZDtcclxuICAgICAgICAvLyBjb25zb2xlLmxvZyhpKVxyXG4gICAgICAgIGlmKGNwLnVzZXJsZXZlbCA9PSAyKXtcclxuICAgICAgICAgIGNwLmxldmVsID0gXCJEb2NlbnRcIlxyXG4gICAgICAgIH1lbHNlIGlmKGNwLnVzZXJsZXZlbCA9PSAzKXtcclxuICAgICAgICAgIGNwLmxldmVsID0gXCJTdHVkZW50XCJcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYoaSA9PSAwKXtcclxuICAgICAgICAgIGNwLmNsYXNzID0gXCJlZGl0XCJcclxuICAgICAgICAgIGNwLmNsYXNzVGV4dCA9IFwiYWFucGFzc2VuXCJcclxuICAgICAgICB9ZWxzZSBpZihpID09IDEpe1xyXG4gICAgICAgICAgY3AuY2xhc3MgPSBcImRlbGV0ZVwiXHJcbiAgICAgICAgICBjcC5jbGFzc1RleHQgPSBcInZlcndpamRlcmVuXCJcclxuICAgICAgICB9XHJcbiAgICAgIH0pXHJcblxyXG4gICAgICBmb3IodmFyIGogPSAwOyBqIDwgdXNlcnMubGVuZ3RoOyBqKyspe1xyXG4gICAgICAgIGlmKHVzZXJzW2pdLnVzZXJsZXZlbCA9PSAxKXtcclxuICAgICAgICAgIHVzZXJzLnNwbGljZShqLDEpXHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcblxyXG4gICAgICAkKFwiLm5ldy11c2VyLW5hbWVcIikudmFsKFwiXCIpO1xyXG4gICAgICAkKFwiLm5ldy11c2VyLXBhc3N3b3JkXCIpLnZhbChcIlwiKTtcclxuICAgICAgJChcIi5uZXctdXNlci1vcHRpb25zXCIpLnJlbW92ZUF0dHIoXCJzZWxlY3RlZFwiKTtcclxuICAgICAgJChcIi5uZXctdXNlci1vcHRpb24xXCIpLmF0dHIoXCJzZWxlY3RlZFwiLFwic2VsZWN0ZWRcIik7XHJcblxyXG4gICAgICAvLyBjb25zb2xlLmxvZyh1c2VycylcclxuXHJcbiAgICAgIHZhciB0ZW1wbGF0ZSA9ICQoXCIubGV2ZWwxLXVzZXItdGVtcGxhdGVcIikuaHRtbCgpO1xyXG4gICAgICB2YXIgcmVuZGVyVGVtcGxhdGUgPSBNdXN0YWNoZS5yZW5kZXIodGVtcGxhdGUsIHVzZXJzKTtcclxuXHJcbiAgICAgIGlmKGkgPT0gMCl7XHJcbiAgICAgICAgJChcIi51c2VyLWxldmVsMS1lZGl0XCIpLmh0bWwocmVuZGVyVGVtcGxhdGUpO1xyXG4gICAgICB9ZWxzZSBpZihpID09IDEpe1xyXG4gICAgICAgICQoXCIudXNlci1sZXZlbDEtZGVsZXRlXCIpLmh0bWwocmVuZGVyVGVtcGxhdGUpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfSlcclxufVxyXG5cclxuZnVuY3Rpb24gdXBkYXRlTGV2ZWwyVGVtcGxhdGVzKCl7XHJcbiAgJC5wb3N0KFwiaW5jbHVkZS9nZXRTY2VuYXJpb3MucGhwXCIse1xyXG4gIH0sIGZ1bmN0aW9uKHJlc3BvbnNlLHN0YXR1cyl7XHJcbiAgICBzY2VuYXJpb3MgPSBKU09OLnBhcnNlKHJlc3BvbnNlKVxyXG4gICAgLy8gY29uc29sZS5sb2coc2NlbmFyaW9zKVxyXG5cclxuICAgICQoJy5zY2VuYXJpby1zZWxlY3RvcicpLmh0bWwoXCJcIilcclxuICAgIGZvcih2YXIgaSA9IDAgOyBpIDwgc2NlbmFyaW9zLmxlbmd0aDsgaSsrKXtcclxuICAgICAgJCgnLnNjZW5hcmlvLXNlbGVjdG9yJykuYXBwZW5kKCc8b3B0aW9uIGRhdGEtaWQ9XCInICsgc2NlbmFyaW9zW2ldLmlkICArICdcIj4nICsgc2NlbmFyaW9zW2ldLm5hbWUgKyBcIjwvb3B0aW9uPlwiKVxyXG4gICAgfVxyXG5cclxuICAgIC8vIGZvcih2YXIgaSA9IDA7IGkgPCAyOyBpKyspe1xyXG5cclxuICAgICAgdmFyIHRlbXBsYXRlID0gJChcIi5sZXZlbDItc2NlbmFyaW8tdGVtcGxhdGVcIikuaHRtbCgpO1xyXG4gICAgICB2YXIgcmVuZGVyVGVtcGxhdGUgPSBNdXN0YWNoZS5yZW5kZXIodGVtcGxhdGUsIHNjZW5hcmlvcyk7XHJcblxyXG4gICAgICAkKFwiLmpzLXNjZW5hcmlvLWNvbnRhaW5lclwiKS5odG1sKHJlbmRlclRlbXBsYXRlKTtcclxuICAgIC8vIH1cclxuICB9KVxyXG59XHJcblxyXG48PDw8PDw8IEhFQURcclxudmFyIGNvbmZpcm1DbGFzc09sZCA9IFwiXCI7XHJcbnZhciBkZWxldGVDbGFzc09sZCA9IFwiXCI7XHJcbmZ1bmN0aW9uIGNvbmZpcm1Nb2RhbCh0aXRsZSwgYm9keSwgY29uZmlybUNsYXNzLCBkZWxldGVDbGFzcyl7XHJcbiAgaWYoZGVsZXRlQ2xhc3MgPT0gdW5kZWZpbmVkKXtcclxuICAgIGRlbGV0ZUNsYXNzID0gXCJjbG9zZS1jb25maXJtXCJcclxuICB9XHJcbiAgaWYoY29uZmlybUNsYXNzICE9IFwiXCIgJiYgZGVsZXRlQ2xhc3NPbGQgIT0gXCJcIil7XHJcbiAgICAkKCcuY29uZmlybS1zYXZlLWNoYW5nZScpLnJlbW92ZUNsYXNzKGNvbmZpcm1DbGFzc09sZClcclxuICAgICQoJy5jb25maXJtLWRlbGV0ZS1jaGFuZ2UnKS5yZW1vdmVDbGFzcyhkZWxldGVDbGFzc09sZClcclxuICB9XHJcbiAgJCgnLmNvbmZpcm0tc2F2ZS1jaGFuZ2UnKS5hZGRDbGFzcyhjb25maXJtQ2xhc3MpXHJcbiAgJCgnLmNvbmZpcm0tZGVsZXRlLWNoYW5nZScpLmFkZENsYXNzKGRlbGV0ZUNsYXNzKVxyXG5cclxuICBjb25maXJtQ2xhc3NPbGQgPSBjb25maXJtQ2xhc3M7XHJcbiAgZGVsZXRlQ2xhc3NPbGQgPSBkZWxldGVDbGFzcztcclxuXHJcbiAgJCgnLmNvbmZpcm0tdGl0bGUnKS50ZXh0KHRpdGxlKVxyXG4gICQoJy5jb25maXJtLXRleHQnKS50ZXh0KGJvZHkpXHJcblxyXG4gICQoJy5qcy1jb25maXJtJykubW9kYWwoXCJzaG93XCIpXHJcbj09PT09PT1cclxuZnVuY3Rpb24gcmFuZG9tU3RyaW5nMihsZW4sIGJlZm9yZXN0ciA9ICcnLCBhcnJheXRvY2hlY2sgPSBudWxsKSB7XHJcbiAgICAvLyBDaGFyc2V0LCBldmVyeSBjaGFyYWN0ZXIgaW4gdGhpcyBzdHJpbmcgaXMgYW4gb3B0aW9uYWwgb25lIGl0IGNhbiB1c2UgYXMgYSByYW5kb20gY2hhcmFjdGVyLlxyXG4gICAgdmFyIGNoYXJTZXQgPSAnQUJDREVGR0hJSktMTU5PUFFSU1RVVldYWVphYmNkZWZnaGlqa2xtbm9wcXJzdHV2d3h5eic7XHJcbiAgICB2YXIgcmFuZG9tU3RyaW5nID0gJyc7XHJcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbjsgaSsrKSB7XHJcbiAgICAgICAgLy8gY3JlYXRlcyBhIHJhbmRvbSBudW1iZXIgYmV0d2VlbiAwIGFuZCB0aGUgY2hhclNldCBsZW5ndGguIFJvdW5kcyBpdCBkb3duIHRvIGEgd2hvbGUgbnVtYmVyXHJcbiAgICAgICAgdmFyIHJhbmRvbVBveiA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIGNoYXJTZXQubGVuZ3RoKTtcclxuICAgICAgICByYW5kb21TdHJpbmcgKz0gY2hhclNldC5zdWJzdHJpbmcocmFuZG9tUG96LCByYW5kb21Qb3ogKyAxKTtcclxuICAgIH1cclxuICAgIC8vIElmIGFuIGFycmF5IGlzIGdpdmVuIGl0IHdpbGwgY2hlY2sgdGhlIGFycmF5LCBhbmQgaWYgdGhlIGdlbmVyYXRlZCBzdHJpbmcgZXhpc3RzIGluIGl0IGl0IHdpbGwgY3JlYXRlIGEgbmV3IG9uZSB1bnRpbCBhIHVuaXF1ZSBvbmUgaXMgZm91bmQgKldBVENIIE9VVC4gSWYgYWxsIGF2YWlsYWJsZSBvcHRpb25zIGFyZSB1c2VkIGl0IHdpbGwgY2F1c2UgYSBsb29wIGl0IGNhbm5vdCBicmVhayBvdXQqXHJcbiAgICBpZiAoYXJyYXl0b2NoZWNrID09IG51bGwpIHtcclxuICAgICAgICByZXR1cm4gYmVmb3Jlc3RyICsgcmFuZG9tU3RyaW5nO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgICB2YXIgaXNJbiA9ICQuaW5BcnJheShiZWZvcmVzdHIgKyByYW5kb21TdHJpbmcsIGFycmF5dG9jaGVjayk7IC8vIGNoZWNrcyBpZiB0aGUgc3RyaW5nIGlzIGluIHRoZSBhcnJheSwgcmV0dXJucyBhIHBvc2l0aW9uXHJcbiAgICAgICAgaWYgKGlzSW4gPiAtMSkge1xyXG4gICAgICAgICAgICAvLyBpZiB0aGUgcG9zaXRpb24gaXMgbm90IC0xIChtZWFuaW5nLCBpdCBpcyBub3QgaW4gdGhlIGFycmF5KSBpdCB3aWxsIHN0YXJ0IGRvaW5nIGEgbG9vcFxyXG4gICAgICAgICAgICB2YXIgY291bnQgPSAwO1xyXG4gICAgICAgICAgICBkbyB7XHJcbiAgICAgICAgICAgICAgICByYW5kb21TdHJpbmcgPSAnJztcclxuICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuOyBpKyspIHtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgcmFuZG9tUG96ID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogY2hhclNldC5sZW5ndGgpO1xyXG4gICAgICAgICAgICAgICAgICAgIHJhbmRvbVN0cmluZyArPSBjaGFyU2V0LnN1YnN0cmluZyhyYW5kb21Qb3osIHJhbmRvbVBveiArIDEpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgaXNJbiA9ICQuaW5BcnJheShiZWZvcmVzdHIgKyByYW5kb21TdHJpbmcsIGFycmF5dG9jaGVjayk7XHJcbiAgICAgICAgICAgICAgICBjb3VudCsrO1xyXG4gICAgICAgICAgICB9IHdoaWxlIChpc0luID4gLTEpO1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZygnaXQgdG9vayAnICsgY291bnQgKyAnIHRyaWVzJyk7XHJcbiAgICAgICAgICAgIHJldHVybiBiZWZvcmVzdHIgKyByYW5kb21TdHJpbmc7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgcmV0dXJuIGJlZm9yZXN0ciArIHJhbmRvbVN0cmluZztcclxuICAgICAgICB9XHJcbiAgICB9XHJcbj4+Pj4+Pj4gbmV3bm90aWZpY2F0aW9uXHJcbn1cclxuIiwidmFyIGxvZ2dlZEluID0gZmFsc2U7XHJcbnZhciB1c2VyTGV2ZWwgPSAwO1xyXG52YXIgbG9nZ2VkSW5Vc2VyID0gW107XHJcbnZhciB1c2VycyA9IFtdO1xyXG52YXIgc2NlbmFyaW9zID0gW107XHJcbnZhciBhbGVydEFjdGl2ZSA9IGZhbHNlO1xyXG5cclxuJChkb2N1bWVudCkucmVhZHkoZnVuY3Rpb24oKXtcclxuICAgIGNvbnNvbGUubG9nKFwiaG9tZS5qcyBsb2FkZWRcIilcclxuICAgICQoJ2JvZHknKS5vbignY2xpY2snLCAnLm1lbnUtaXRlbScsIGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgdmFyIGlkID0gJCh0aGlzKS5hdHRyKFwiY2xhc3NcIikuc3BsaXQoJ18nKVsxXTtcclxuICAgICAgICBjb25zb2xlLmxvZyhpZClcclxuXHJcbiAgICAgICAgJCgnLnZlcmRpZXBpbmcnKS5hZGRDbGFzcyhcImhpZGRlblwiKVxyXG4gICAgICAgICQoJy52ZXJkaWVwaW5nX18nK2lkKS5yZW1vdmVDbGFzcyhcImhpZGRlblwiKVxyXG4gICAgfSlcclxuXHJcbiAgICAkKCdib2R5Jykub24oJ2NsaWNrJywgJy5sb2dpbicsIGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgY29uc29sZS5sb2coJCgnLnVzZXJuYW1lJykudmFsKCkudG9Mb3dlckNhc2UoKSlcclxuICAgICAgICBjb25zb2xlLmxvZygkKCcucGFzc3dvcmQnKS52YWwoKS50b0xvd2VyQ2FzZSgpKVxyXG4gICAgICAgICQucG9zdChcImluY2x1ZGUvbG9naW4ucGhwXCIgLHtcclxuICAgICAgICAgICAgbG9naW5TdWI6IFwiXCIsXHJcbiAgICAgICAgICAgIHVzZXJuYW1lOiAkKCcudXNlcm5hbWUnKS52YWwoKS50b0xvd2VyQ2FzZSgpLFxyXG4gICAgICAgICAgICBwYXNzd29yZDogJCgnLnBhc3N3b3JkJykudmFsKClcclxuICAgICAgICB9LCBmdW5jdGlvbihyZXNwb25zZSxzdGF0dXMpe1xyXG4gICAgICAgICAgICB2YXIgZGF0YSA9IEpTT04ucGFyc2UocmVzcG9uc2UpO1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhkYXRhKTtcclxuICAgICAgICAgICAgbG9nZ2VkSW5Vc2VyID0gZGF0YTtcclxuICAgICAgICAgICAgaWYgKGRhdGEubG9nZ2VkSW4gPT0gMSkge1xyXG4gICAgICAgICAgICAgICAgbG9naW4oZGF0YS5sZXZlbCk7XHJcbiAgICAgICAgICAgICAgICBzaG93Rmxhc2hNZXNzYWdlKCdVIGJlbnQgc3VjY2Vzdm9sIGluZ2Vsb2dkJywgJ3N1Y2Nlc3MnKVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgc2hvd0ZsYXNoTWVzc2FnZSgnVXcgZ2VicnVpa2Vyc25hYW0gb2Ygd2FjaHR3b29yZCBpcyBpbmNvcnJlY3QnLCAnZGFuZ2VyJylcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pXHJcbiAgICB9KVxyXG5cclxuICAgICQoJ2JvZHknKS5vbignY2xpY2snLCAnLmxvZ291dCcsIGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgbG9nb3V0KCk7XHJcbiAgICB9KVxyXG5cclxuICAgICQoJ2JvZHknKS5vbignY2xpY2snLCAnLmxva2FhbCcsIGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgY29uc29sZS5sb2cobG9nZ2VkSW4pXHJcbiAgICAgICAgaWYobG9nZ2VkSW4gPT0gdHJ1ZSl7XHJcbiAgICAgICAgICAgIHZhciBsb2thYWxuciA9ICQodGhpcykuYXR0cihcImNsYXNzXCIpLnNwbGl0KFwiIFwiKVswXTtcclxuICAgICAgICAgICAgJCgnLmpzLWxva2FhbCcpLmh0bWwobG9rYWFsbnIpO1xyXG4gICAgICAgIH1cclxuICAgIH0pXHJcblxyXG4gICAgJChkb2N1bWVudCkua2V5cHJlc3MoZnVuY3Rpb24oZSkge1xyXG4gICAgICAgIGlmKGUud2hpY2ggPT0gMTMpIHtcclxuICAgICAgICAgICAgaWYgKCFsb2dnZWRJbikge1xyXG4gICAgICAgICAgICAgICAgJCgnLmxvZ2luJykudHJpZ2dlcignY2xpY2snKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH0pO1xyXG59KVxyXG4iLCIkKCdib2R5Jykub24oJ2NsaWNrJywgJy5sb2thYWwnLCBmdW5jdGlvbigpe1xyXG4gICAgaWYobG9nZ2VkSW4pe1xyXG4gICAgICAgIHZhciBsb2thYWxuciA9ICQodGhpcykuYXR0cihcImNsYXNzXCIpLnNwbGl0KFwiIFwiKVswXTtcclxuICAgICAgICAkKCcuanMtbG9rYWFsJykuaHRtbChsb2thYWxucik7XHJcbiAgICB9XHJcbn0pXHJcbiQoJ2JvZHknKS5vbignY2xpY2snLCAnLmpzLXN0YXJ0LXNjZW5hcmlvJywgZnVuY3Rpb24oKXtcclxuICAgIGlmIChsb2dnZWRJbikge1xyXG4gICAgICAgIHZhciBsb2thYWxuciA9ICQoJy5qcy1sb2thYWwnKS5odG1sKCk7XHJcbiAgICAgICAgdmFyIHNjZW5hcmlvSWQgPSAkKCcuanMtc2NlbmFyaW9zZWxlY3QnKS5maW5kKFwiOnNlbGVjdGVkXCIpLmRhdGEoJ2lkJyk7XHJcbiAgICAgICAgdmFyIHRvb2xzID0gMDtcclxuICAgICAgICBpZiAoJCgnLmpzLXN3aXRjaCcpLmlzKCc6Y2hlY2tlZCcpKSB7XHJcbiAgICAgICAgICAgIHRvb2xzID0gMTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKGxva2FhbG5yICE9IFwiXCIpIHtcclxuICAgICAgICAgICAgaWYgKHNjZW5hcmlvSWQgPj0gMSkge1xyXG4gICAgICAgICAgICAgICAgJC5wb3N0KFwiaW5jbHVkZS9tYWtlQWN0aXZlU2NlbmFyaW8ucGhwXCIse1xyXG4gICAgICAgICAgICAgICAgICAgIGxva2FhbG5yOiBsb2thYWxucixcclxuICAgICAgICAgICAgICAgICAgICBzY2VuYXJpb0lkOiBzY2VuYXJpb0lkLFxyXG4gICAgICAgICAgICAgICAgICAgIHRvb2xzOiB0b29sc1xyXG4gICAgICAgICAgICAgICAgICAgIH0sIGZ1bmN0aW9uKHJlc3BvbnNlLHN0YXR1cyl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChyZXNwb25zZSA9PSAnc3VjY2VzcycpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNob3dGbGFzaE1lc3NhZ2UoJ1NjZW5hcmlvIGlzIHN1Y2Nlc3ZvbCBhYW5nZW1hYWt0JywgJ3N1Y2Nlc3MnKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBlbHNle1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2hvd0ZsYXNoTWVzc2FnZSgnSGV0IG1ha2VuIHZhbiBlZW4gc2NlbmFyaW8gaXMgbWlzbHVrdCcsICdkYW5nZXInKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2V7XHJcbiAgICAgICAgICAgICAgICBzaG93Rmxhc2hNZXNzYWdlKCdFciBpcyBnZWVuIHNjZW5hcmlvIGdla296ZW4nLCAnZGFuZ2VyJyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIHNob3dGbGFzaE1lc3NhZ2UoJ0tpZXMgZWVuIGxva2FhbCcsICdkYW5nZXInKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn0pXHJcbiIsIiQoXCJib2R5XCIpLm9uKFwiY2xpY2tcIiwgXCIubmV3LXVzZXJcIixmdW5jdGlvbigpe1xyXG4gIGlmKCQoXCIubmV3LXVzZXItbmFtZVwiKS52YWwoKSA9PSBcIlwiIHx8ICQoXCIubmV3LXVzZXItcGFzc3dvcmRcIikudmFsKCkgPT0gXCJcIiB8fCAkKFwiLm5ldy11c2VyLWxldmVsXCIpLnZhbCgpID09IG51bGwpe1xyXG4gICAgaWYoJChcIi5uZXctdXNlci1uYW1lXCIpLnZhbCgpID09IFwiXCIpe1xyXG4gICAgICBzaG93Rmxhc2hNZXNzYWdlKCdVIGhlZWZ0IG5vZyBnZWVuIGdlYnJ1aWtlcnNuYWFtIGluZ2V2dWxkJywgJ2RhbmdlcicpO1xyXG4gICAgfWVsc2UgaWYoJChcIi5uZXctdXNlci1wYXNzd29yZFwiKS52YWwoKSA9PSBcIlwiKXtcclxuICAgICAgc2hvd0ZsYXNoTWVzc2FnZSgnVSBoZWVmdCBub2cgZ2VlbiBwYXNzd29vcmQgaW5nZXZ1bGQnLCAnZGFuZ2VyJyk7XHJcbiAgICB9ZWxzZSBpZigkKFwiLm5ldy11c2VyLWxldmVsXCIpLnZhbCgpID09IG51bGwpe1xyXG4gICAgICBzaG93Rmxhc2hNZXNzYWdlKCdVIGhlZWZ0IG5vZyBnZWVuIGxldmVsIGdlc2VsZWN0ZWVyZCcsICdkYW5nZXInKTtcclxuICAgIH1cclxuICB9ZWxzZXtcclxuICAgIGNvbnNvbGUubG9nKCQoXCIubmV3LXVzZXItbGV2ZWxcIikudmFsKCkpXHJcbiAgICAkLnBvc3QoXCJpbmNsdWRlL2FkZFVzZXIucGhwXCIse1xyXG4gICAgICB1c2VybmFtZTogJChcIi5uZXctdXNlci1uYW1lXCIpLnZhbCgpLFxyXG4gICAgICB1c2VycGFzc3dvcmQ6ICQoXCIubmV3LXVzZXItcGFzc3dvcmRcIikudmFsKCksXHJcbiAgICAgIHVzZXJsZXZlbDogJChcIi5uZXctdXNlci1sZXZlbFwiKS52YWwoKVxyXG4gICAgfSwgZnVuY3Rpb24ocmVzcG9uc2Usc3RhdHVzKXtcclxuICAgICAgY29uc29sZS5sb2cocmVzcG9uc2UpXHJcbiAgICAgIGlmKHJlc3BvbnNlID09IFwic3VjY2Vzc1wiKXtcclxuICAgICAgICBzaG93Rmxhc2hNZXNzYWdlKCdFciBpcyBlZW4gbmlldXdlIGdlYnJ1aWtlciBhYW5nZW1hYWt0JywgJ3N1Y2Nlc3MnKTtcclxuICAgICAgICAkKFwiLm5ldy11c2VyLW5hbWVcIikudmFsKFwiXCIpO1xyXG4gICAgICAgICQoXCIubmV3LXVzZXItcGFzc3dvcmRcIikudmFsKFwiXCIpO1xyXG4gICAgICAgICQoXCIubmV3LXVzZXItb3B0aW9uc1wiKS5yZW1vdmVBdHRyKFwic2VsZWN0ZWRcIik7XHJcbiAgICAgICAgJChcIi5uZXctdXNlci1vcHRpb24xXCIpLmF0dHIoXCJzZWxlY3RlZFwiLFwic2VsZWN0ZWRcIik7XHJcbiAgICAgIH1cclxuICAgIH0pXHJcbiAgfVxyXG59KVxyXG4iLCJ2YXIgZmxhc2hNZXNzYWdlcyA9IFtdO1xyXG5mdW5jdGlvbiBzaG93Rmxhc2hNZXNzYWdlKG1lcywgdHlwZSwgZGlzbWlzc2FibGUgPSBmYWxzZSwgc2VjcyA9IDIwMDApe1xyXG4gICAgdmFyIHJhbmRTdHIgPSByYW5kb21TdHJpbmcyKDIwKTtcclxuICAgICQoJy5qcy1mbC1jb250JykuYXBwZW5kKCc8ZGl2IGlkPVwiJyArIHJhbmRTdHIgKyAnXCIgY2xhc3M9XCJqcy1mbGFzaCBhbGVydC0nICsgdHlwZSArICcgZmxhc2gtbWVzc2FnZVwiPicrIG1lcyArICc8L2Rpdj4nKTtcclxuICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICQoJyMnICsgcmFuZFN0cikuYWRkQ2xhc3MoJ2ZsYXNoLW1lc3NhZ2UtLXNob3cnKTtcclxuICAgIH0sIDEpO1xyXG4gICAgaWYgKCFkaXNtaXNzYWJsZSkge1xyXG4gICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICBkZWxldGVGbGFzaE1lc3NhZ2UocmFuZFN0cik7XHJcbiAgICAgICAgfSwgc2Vjcyk7XHJcbiAgICB9XHJcbiAgICBlbHNle1xyXG4gICAgICAgICQoJyMnICsgcmFuZFN0cikuYXBwZW5kKCc8YnV0dG9uIGRhdGEtaWQ9XCInICsgcmFuZFN0ciArICdcIiBjbGFzcz1cImpzLWRpc21pc3MgYnRuXCI+T2s8L2J1dHRvbj4nKTtcclxuICAgIH1cclxufVxyXG4kKCdib2R5Jykub24oJ2NsaWNrJywgJy5qcy1kaXNtaXNzJywgZnVuY3Rpb24oKXtcclxuICAgIHZhciBkZWxzdHIgPSAkKHRoaXMpLmRhdGEoJ2lkJyk7XHJcbiAgICBkZWxldGVGbGFzaE1lc3NhZ2UoZGVsc3RyKTtcclxufSk7XHJcblxyXG5mdW5jdGlvbiBkZWxldGVGbGFzaE1lc3NhZ2UoaWQpe1xyXG4gICAgJCgnIycgKyBpZCkucmVtb3ZlQ2xhc3MoJ2ZsYXNoLW1lc3NhZ2UtLXNob3cnKTtcclxuICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICQoJyMnICsgaWQpLnJlbW92ZSgpO1xyXG4gICAgfSwgMjAwKTtcclxufVxyXG5jb3VudCA9IDA7XHJcbi8vIHRlc3RmbGFzaCgpO1xyXG5mdW5jdGlvbiB0ZXN0Zmxhc2goKXtcclxuICAgIHNob3dGbGFzaE1lc3NhZ2UoJ3Rlc3QgbWVzc2FnZTogJyArIGNvdW50LCBcInN1Y2Nlc3NcIiwgaXNFdmVuKGNvdW50KSwgY291bnQgKiAxMDAwKVxyXG4gICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdGVzdGZsYXNoKCk7XHJcbiAgICB9LCAyMDAwKTtcclxuICAgIGNvdW50ICsrO1xyXG59XHJcbmZ1bmN0aW9uIGlzRXZlbih2YWwpe1xyXG4gICAgIHJldHVybiAodmFsJTIgPT0gMCk7XHJcbn1cclxuIiwiJChcImJvZHlcIikub24oXCJjbGlja1wiLCBcIi5vcHRpb25zXCIsIGZ1bmN0aW9uKCl7XHJcbiAgdmFyIGxldmVsID0gJCh0aGlzKS5hdHRyKFwiY2xhc3NcIikuc3BsaXQoXCIgXCIpWzFdLnNwbGl0KFwiX1wiKVsxXTtcclxuICB2YXIgb3B0aW9uID0gJCh0aGlzKS5hdHRyKFwiY2xhc3NcIikuc3BsaXQoXCIgXCIpWzJdLnNwbGl0KFwiX1wiKVsxXTtcclxuICBjb25zb2xlLmxvZyhsZXZlbClcclxuXHJcbiAgJChcIi52aWV3XCIpLmFkZENsYXNzKFwiaGlkZGVuXCIpXHJcbiAgJChcIi52aWV3X1wiK2xldmVsK1wiLVwiK29wdGlvbikucmVtb3ZlQ2xhc3MoXCJoaWRkZW5cIilcclxuICAkKCcub3B0aW9ucycpLnJlbW92ZUNsYXNzKCdvcHRpb25zLS1hY3RpdmUnKTtcclxuICAkKHRoaXMpLmFkZENsYXNzKCdvcHRpb25zLS1hY3RpdmUnKTtcclxuICBzd2l0Y2ggKGxldmVsKSB7XHJcbiAgICBjYXNlIFwiMVwiOlxyXG4gICAgICB1cGRhdGVMZXZlbDFUZW1wbGF0ZXMoKTtcclxuICAgICAgYnJlYWs7XHJcbiAgICBjYXNlIFwiMlwiOlxyXG4gICAgICB1cGRhdGVMZXZlbDJUZW1wbGF0ZXMoKTtcclxuICAgICAgYnJlYWs7XHJcbiAgfVxyXG59KVxyXG4iLCIkKGRvY3VtZW50KS5yZWFkeShmdW5jdGlvbigpe1xyXG4gICAgJC5wb3N0KFwiaW5jbHVkZS9yZXR1cm5TZXNzaW9uLnBocFwiLHtcclxuICAgIH0sIGZ1bmN0aW9uKHJlc3BvbnNlLHN0YXR1cyl7XHJcbiAgICAgICAgdmFyIGRhdGEgPSBKU09OLnBhcnNlKHJlc3BvbnNlKTtcclxuICAgICAgICBpZiAoZGF0YS5sb2dnZWRJbikge1xyXG4gICAgICAgICAgICBsb2dnZWRJblVzZXIgPSBkYXRhO1xyXG4gICAgICAgICAgICBsb2dpbihkYXRhLmxldmVsKTtcclxuICAgICAgICB9XHJcbiAgICB9KVxyXG59KTtcclxuIiwiJChcIi5zZXR0aW5ncy1pbnB1dHNcIikua2V5cHJlc3MoZnVuY3Rpb24oZSkge1xyXG4gIGNvbnNvbGUubG9nKFwiZW50ZXJcIilcclxuICAgIGlmKGUud2hpY2ggPT0gMTMpIHtcclxuICAgICAgJCgnLnNldHRpbmdzLXVwZGF0ZScpLnRyaWdnZXIoJ2NsaWNrJyk7XHJcbiAgICB9XHJcbn0pO1xyXG5cclxuJCgnYm9keScpLm9uKCdjbGljaycsICcuc2V0dGluZ3MnLCBmdW5jdGlvbigpe1xyXG4gIGNvbnNvbGUubG9nKFwic2V0dGluZ3NcIilcclxuICAkKCcuc2V0dGluZ3MtdXNlcm5hbWUnKS52YWwobG9nZ2VkSW5Vc2VyLnVzZXJuYW1lKVxyXG4gICQoJy51c2VyLXNldHRpbmdzJykubW9kYWwoJ3Nob3cnKTtcclxuICBjb25zb2xlLmxvZyhsb2dnZWRJblVzZXIudXNlcm5hbWUpXHJcbn0pXHJcblxyXG4kKCdib2R5Jykub24oJ2NsaWNrJywgJy5zZXR0aW5ncy11cGRhdGUnLCBmdW5jdGlvbigpe1xyXG4gIGNvbnNvbGUubG9nKFwidXBkYXRlXCIpXHJcbiAgY29uc29sZS5sb2coJCgnLnNldHRpbmdzLXVzZXJuYW1lJykudmFsKCkpXHJcbiAgY29uc29sZS5sb2coJCgnLnNldHRpbmdzLXBhc3N3b3JkJykudmFsKCkpXHJcbiAgY29uc29sZS5sb2coJCgnLnNldHRpbmdzLXJlcGVhdC1wYXNzd29yZCcpLnZhbCgpKVxyXG5cclxuICBpZigkKCcuc2V0dGluZ3MtdXNlcm5hbWUnKS52YWwoKSA9PSBcIlwiICYmICQoJy5zZXR0aW5ncy1wYXNzd29yZCcpLnZhbCgpID09IFwiXCIgJiYgJCgnLnNldHRpbmdzLXJlcGVhdC1wYXNzd29yZCcpLnZhbCgpID09IFwiXCIpe1xyXG4gICAgY29uc29sZS5sb2coXCJnZWJydWlrZXJzbmFhbSBlbiB3YWNodHdvb3JkIG1vZ2VuIG5pZXQgbGVlZyB6aWpuXCIpO1xyXG4gIH1lbHNle1xyXG4gICAgaWYoJCgnLnNldHRpbmdzLXBhc3N3b3JkJykudmFsKCkgIT0gJCgnLnNldHRpbmdzLXJlcGVhdC1wYXNzd29yZCcpLnZhbCgpKXtcclxuICAgICAgY29uc29sZS5sb2coXCJ3YWNodHdvb3JkZW4gemlqbiBuaWV0IGdlbGlqayBhYW4gZWxrYWFyXCIpXHJcbiAgICB9ZWxzZXtcclxuICAgICAgY29uc29sZS5sb2cobG9nZ2VkSW5Vc2VyKVxyXG4gICAgICAkLnBvc3QoXCJpbmNsdWRlL3VwZGF0ZVVzZXIucGhwXCIgLHtcclxuICAgICAgICBpZDogbG9nZ2VkSW5Vc2VyLnVzZXJJRCxcclxuICAgICAgICBuYW1lOiAkKCcuc2V0dGluZ3MtdXNlcm5hbWUnKS52YWwoKSxcclxuICAgICAgICBwYXNzOiAkKCcuc2V0dGluZ3MtcGFzc3dvcmQnKS52YWwoKVxyXG4gICAgICB9LCBmdW5jdGlvbihyZXNwb25zZSxzdGF0dXMpe1xyXG4gICAgICAgICAgY29uc29sZS5sb2cocmVzcG9uc2UpO1xyXG4gICAgICAgIGlmKHJlc3BvbnNlID09IFwic3VjY2VzXCIpe1xyXG4gICAgICAgICQoJy51c2VyLXNldHRpbmdzJykubW9kYWwoJ2hpZGUnKTtcclxuICAgICAgICB9XHJcbiAgICAgIH0pXHJcbiAgICB9XHJcbiAgfVxyXG59KVxyXG4iXX0=
>>>>>>> 7ff4830c12496c114b2b55e5e8d102d2c7cd7622
