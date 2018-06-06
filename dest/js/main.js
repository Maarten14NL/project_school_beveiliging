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
        $('#' + randStr).append('<button data-id="' + randStr + '" class="js-dismiss btn btn-block">Ok</button>');
    }
}
showFlashMessage('halloasdkjasdkjdhaskasdhkjasdhkasdjhsadkjhsdkjhd','success', true);
showFlashMessage('halloasdkjasdkjdhaskasdhkjasdhkasdjhsadkjhsdkjhd','danger', true);
showFlashMessage('halloasdkjasdkjdhaskasdhkjasdhkasdjhsadkjhsdkjhd','warning', true);
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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFkZFNjZW5hcmlvLmpzIiwiY2hlY2tBbGVydC5qcyIsImNsb3NlLWNvbmZpcm0uanMiLCJkZWxldGUtc2NlbmFyaW8uanMiLCJkZWxldGUtdXNlci5qcyIsImVkaXQtc2NlbmFyaW8uanMiLCJlZGl0LXVzZXIuanMiLCJmbGFzaC1tZXNzYWdlLmpzIiwiZnVuY3Rpb25zLmpzIiwiaG9tZS5qcyIsIm1ha2VBY3RpdmVTY2VuYXJpby5qcyIsIm5ldy11c2VyLmpzIiwib3B0aW9ucy5qcyIsInNlc3Npb25DaGVjay5qcyIsInNldHRpbmdzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3JFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDUEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3hCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUM5REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDeERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNoRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDN0tBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMxREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDdENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDM0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDbEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNWQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6Im1haW4uanMiLCJzb3VyY2VzQ29udGVudCI6WyIkKCdib2R5Jykub24oJ3Byb3BlcnR5Y2hhbmdlIGlucHV0JywgJy5qcy1uZXdzdGVwJyxmdW5jdGlvbihlKXtcclxuICAgIHZhciBwYXJlbnQgPSAkKHRoaXMpLmNsb3Nlc3QoJy5qcy1zdGVwJylcclxuICAgIGlmICgkKHBhcmVudCkuaXMoJzpsYXN0LWNoaWxkJykpIHtcclxuICAgICAgICB2YXIgbnJzdHIgPSAkKCcuanMtbGFzdG5yJykuaHRtbCgpO1xyXG4gICAgICAgIHZhciBuZXduciA9IHBhcnNlSW50KG5yc3RyKSArIDE7XHJcbiAgICAgICAgJCgnLmpzLWxhc3RucicpLnJlbW92ZUNsYXNzKCdqcy1sYXN0bnInKTtcclxuICAgICAgICAkKCcuanMtY29weXN0ZXAnKS5jbG9uZSgpLmFwcGVuZFRvKCcuanMtc3RlcHMtY29udGFpbmVyJylcclxuICAgICAgICAucmVtb3ZlQ2xhc3MoJ2pzLWNvcHlzdGVwJykucmVtb3ZlQ2xhc3MoJ2hpZGRlbicpLmFkZENsYXNzKCdqcy1zdGVwJylcclxuICAgICAgICAuZmluZCgnLmpzLW5ld25yJykucmVtb3ZlQ2xhc3MoJ2pzLW5ld25yJykuYWRkQ2xhc3MoJ2pzLWxhc3RucicpLmh0bWwobmV3bnIpO1xyXG4gICAgICAgIHVwZGF0ZVN0ZXBzKCk7XHJcbiAgICB9XHJcbn0pO1xyXG5mdW5jdGlvbiB1cGRhdGVTdGVwcygpe1xyXG4gICAgdmFyIGNvdW50ID0gMTtcclxuICAgICQoJy5qcy1zdGVwbnInKS5lYWNoKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAkKHRoaXMpLmh0bWwoY291bnQpO1xyXG4gICAgICAgIGNvdW50Kys7XHJcbiAgICB9KTtcclxufVxyXG4kKCdib2R5Jykub24oJ2NsaWNrJywgJy5qcy1hZGRzdGVwJyxmdW5jdGlvbigpe1xyXG4gICAgdmFyIG5yc3RyID0gJCgnLmpzLWxhc3RucicpLmh0bWwoKTtcclxuICAgIHZhciBuZXduciA9IHBhcnNlSW50KG5yc3RyKSArIDE7XHJcbiAgICAkKCcuanMtbGFzdG5yJykucmVtb3ZlQ2xhc3MoJ2pzLWxhc3RucicpO1xyXG4gICAgJCgnLmpzLWNvcHlzdGVwJykuY2xvbmUoKS5hcHBlbmRUbygnLmpzLXN0ZXBzLWNvbnRhaW5lcicpXHJcbiAgICAucmVtb3ZlQ2xhc3MoJ2pzLWNvcHlzdGVwJykucmVtb3ZlQ2xhc3MoJ2hpZGRlbicpLmFkZENsYXNzKCdqcy1zdGVwJylcclxuICAgIC5maW5kKCcuanMtbmV3bnInKS5yZW1vdmVDbGFzcygnanMtbmV3bnInKS5hZGRDbGFzcygnanMtbGFzdG5yJykuaHRtbChuZXducik7XHJcbiAgICB1cGRhdGVTdGVwcygpO1xyXG59KTtcclxuJCgnYm9keScpLm9uKCdjbGljaycsICcuanMtc2F2ZS1uZXctc2NlbmFyaW8nLGZ1bmN0aW9uKCl7XHJcbiAgICB2YXIgbmFtZSA9ICQoJy5qcy1uZXctc2NlbmFyaW8tbmFtZScpLnZhbCgpO1xyXG4gICAgdmFyIHN0ZXBzID0gW107XHJcbiAgICBpZiAobmFtZSA9PSAnJykge1xyXG4gICAgICAgIHNob3dGbGFzaE1lc3NhZ2UoJ1Z1bCBlZXJzdCBlZW4gbmFhbSBpbicsICdkYW5nZXInKTtcclxuICAgIH1cclxuICAgIGVsc2V7XHJcbiAgICAgICAgJCgnLmpzLW5ld3N0ZXAnKS5lYWNoKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgdmFyIHRlbXB2YWwgPSAkKHRoaXMpLnZhbCgpO1xyXG4gICAgICAgICAgICBpZiAodGVtcHZhbCAhPSBcIlwiKSB7XHJcbiAgICAgICAgICAgICAgICBzdGVwcy5wdXNoKHRlbXB2YWwpO1xyXG5cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIGlmIChzdGVwcy5sZW5ndGggPT0gMCkge1xyXG4gICAgICAgICAgICBzaG93Rmxhc2hNZXNzYWdlKCdWdWwgbWluc3RlbnMgMSBzdGFwIGluJywgJ2RhbmdlcicpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNle1xyXG4gICAgICAgICAgICAkLnBvc3QoXCJpbmNsdWRlL3NhdmVOZXdTY2VuYXJpby5waHBcIiAse1xyXG4gICAgICAgICAgICAgICAgbmFtZTogbmFtZSxcclxuICAgICAgICAgICAgICAgIHN0ZXBzOiBzdGVwc1xyXG4gICAgICAgICAgICB9LCBmdW5jdGlvbihyZXNwb25zZSxzdGF0dXMpe1xyXG4gICAgICAgICAgICAgICAgaWYocmVzcG9uc2UgPT0gXCJzdWNjZXNcIil7XHJcbiAgICAgICAgICAgICAgICAgICAgc2hvd0ZsYXNoTWVzc2FnZSgnU2NlbmFyaW8gc3VjY2Vzdm9sIHRvZWdldm9lZ2QnLCAnc3VjY2VzcycpO1xyXG4gICAgICAgICAgICAgICAgICAgICQoJy5qcy1zdGVwcy1jb250YWluZXInKS5odG1sKCcnKTtcclxuICAgICAgICAgICAgICAgICAgICAkKCcuanMtbmV3LXNjZW5hcmlvLW5hbWUnKS52YWwoJycpO1xyXG4gICAgICAgICAgICAgICAgICAgICQoJy5qcy1jb3B5c3RlcCcpLmNsb25lKCkuYXBwZW5kVG8oJy5qcy1zdGVwcy1jb250YWluZXInKVxyXG4gICAgICAgICAgICAgICAgICAgIC5yZW1vdmVDbGFzcygnanMtY29weXN0ZXAnKS5yZW1vdmVDbGFzcygnaGlkZGVuJylcclxuICAgICAgICAgICAgICAgICAgICAuYWRkQ2xhc3MoJ2pzLXN0ZXAnKS5hZGRDbGFzcygnVW5pcXVldGVtcCcpXHJcbiAgICAgICAgICAgICAgICAgICAgLmZpbmQoJy5qcy1uZXducicpLnJlbW92ZUNsYXNzKCdqcy1uZXducicpLmFkZENsYXNzKCdqcy1sYXN0bnInKS5odG1sKCcxJyk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59KTtcclxuXHJcbiQoJ2JvZHknKS5vbignY2xpY2snLCAnLmpzLWRlbGV0ZS1zdGVwJyxmdW5jdGlvbigpe1xyXG4gICAgdmFyIHBhcmVudCA9ICQodGhpcykuY2xvc2VzdCgnLmpzLXN0ZXAnKTtcclxuICAgIGlmICghJChwYXJlbnQpLmlzKCc6Zmlyc3QtY2hpbGQnKSkge1xyXG4gICAgICAgICQocGFyZW50KS5yZW1vdmUoKTtcclxuICAgICAgICB1cGRhdGVTdGVwcygpO1xyXG4gICAgfVxyXG4gICAgZWxzZSB7XHJcbiAgICAgICAgc2hvd0ZsYXNoTWVzc2FnZSgnSmUga3VudCBuaWV0IGRlIGVlcnN0ZSBzdGFwIHZlcndpamRlcmVuJywgJ2RhbmdlcicpO1xyXG4gICAgfVxyXG59KTtcclxuIiwiZnVuY3Rpb24gY2hlY2tBbGVydCgpIHtcclxuICAgIGlmKGxvZ2dlZEluVXNlci5sZXZlbCA9PSAzICYmICFhbGVydEFjdGl2ZSAmJiBsb2dnZWRJbiA9PSB0cnVlKXtcclxuICAgICAgICAkLnBvc3QoXCJpbmNsdWRlL2dldFNjZW5hcmlvc0FjdGl2ZS5waHBcIiAse1xyXG4gICAgICAgICAgICBmaW5pc2hlZDogMCxcclxuICAgICAgICAgICAgYWxlcnRlZDogMFxyXG4gICAgICAgIH0sIGZ1bmN0aW9uKHJlc3BvbnNlLHN0YXR1cyl7XHJcbiAgICAgICAgICAgIHJlc3BvbnNlID0gSlNPTi5wYXJzZShyZXNwb25zZSk7XHJcbiAgICAgICAgICAgIGlmKHJlc3BvbnNlLmxlbmd0aCA+IDApe1xyXG4gICAgICAgICAgICAgICAgJCgnLnNjZW5hcmlvJykubW9kYWwoJ3Nob3cnKTtcclxuICAgICAgICAgICAgICAgICQoJy5zY2VuYXJpby5tb2RhbCcpLmZpbmQoJy5tb2RhbC10aXRsZScpLmh0bWwocmVzcG9uc2VbMF0ubmFtZSArICcgaW4gbG9rYWFsOiAnICsgcmVzcG9uc2VbMF0ubG9jYXRpb24pO1xyXG4gICAgICAgICAgICAgICAgYWxlcnRBY3RpdmUgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgJCgnLnNjZW5hcmlvLm1vZGFsJykuZmluZCgnLmpzLWNsb3NlLXNjZW5hcmlvLW1vZGFsJykuYXR0cignZGF0YS1hY3RpdmVpZCcsIHJlc3BvbnNlWzBdLmFjdGl2ZV9pZCk7XHJcbiAgICAgICAgICAgICAgICBpZiAoIXJlc3BvbnNlWzBdLnRvb2xzICkge1xyXG4gICAgICAgICAgICAgICAgICAgICQoJy5zY2VuYXJpby5tb2RhbCcpLmZpbmQoJy5tb2RhbC1ib2R5JykuaHRtbCgnRGUgZG9jZW50IGhlZWZ0IHRvZWdhbmcgdG90IGRlemUgaHVscG1pZGRlbGVuIHVpdGdlc2NoYWtlbGQnKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBzdGVwcyA9IHJlc3BvbnNlWzBdLnN0ZXBzO1xyXG4gICAgICAgICAgICAgICAgICAgICQoJy5zY2VuYXJpby5tb2RhbCcpLmZpbmQoJy5tb2RhbC1ib2R5JykuaHRtbCgnJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBzdGVwcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgc3RlcCA9IGkgKyAxO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAkKCcuc2NlbmFyaW8ubW9kYWwnKS5maW5kKCcubW9kYWwtYm9keScpLmFwcGVuZCgnU3RhcCAnICsgc3RlcCArIFwiOiBcIiArIHN0ZXBzW2ldLmRlc2NyaXB0aW9uICsgXCI8YnI+XCIpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pXHJcbiAgICB9XHJcbiAgICBpZihsb2dnZWRJblVzZXIubGV2ZWwgPT0gMiAmJiBsb2dnZWRJbiA9PSB0cnVlKXtcclxuICAgICAgICAkLnBvc3QoXCJpbmNsdWRlL2dldFNjZW5hcmlvc0FjdGl2ZS5waHBcIix7XHJcbiAgICAgICAgICAgIGFsZXJ0ZWQ6IDAsXHJcbiAgICAgICAgICAgIGZpbmlzaGVkOiAxXHJcbiAgICAgICAgfSwgZnVuY3Rpb24ocmVzcG9uc2Usc3RhdHVzKXtcclxuICAgICAgICAgICAgdmFyIGRhdGEgPSBKU09OLnBhcnNlKHJlc3BvbnNlKTtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coZGF0YSk7XHJcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgZGF0YS5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgc2hvd0ZsYXNoTWVzc2FnZShkYXRhW2ldLm5hbWUgKyBcIiBpbiBsb2thYWw6IFwiICsgZGF0YVtpXS5sb2NhdGlvbiArIFwiIGlzIGFmZ2Vyb25kXCIsIFwic3VjY2Vzc1wiLCB0cnVlKTtcclxuICAgICAgICAgICAgICAgICQucG9zdChcImluY2x1ZGUvZmluaXNoQWN0aXZlU2NlbmFyaW8ucGhwXCIse1xyXG4gICAgICAgICAgICAgICAgICAgIGFsZXJ0ZWQ6IDEsXHJcbiAgICAgICAgICAgICAgICAgICAgZmluaXNoZWQ6IDEsXHJcbiAgICAgICAgICAgICAgICAgICAgYWN0aXZlaWQ6IGRhdGFbaV0uYWN0aXZlX2lkXHJcbiAgICAgICAgICAgICAgICB9LCBmdW5jdGlvbihyZXNwb25zZSxzdGF0dXMpe1xyXG4gICAgICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbiAgICBzZXRUaW1lb3V0KGNoZWNrQWxlcnQsIDEwMDApO1xyXG59XHJcbnNldFRpbWVvdXQoY2hlY2tBbGVydCwgMTAwMCk7XHJcbiQoJ2JvZHknKS5vbignY2xpY2snLCAnLmpzLWNsb3NlLXNjZW5hcmlvLW1vZGFsJywgZnVuY3Rpb24oKXtcclxuICAgIHZhciBhY3RpdmVpZCA9ICQodGhpcykuYXR0cignZGF0YS1hY3RpdmVpZCcpO1xyXG4gICAgY29uc29sZS5sb2coYWN0aXZlaWQpO1xyXG4gICAgJC5wb3N0KFwiaW5jbHVkZS9maW5pc2hBY3RpdmVTY2VuYXJpby5waHBcIix7XHJcbiAgICAgICAgYWN0aXZlaWQgOiBhY3RpdmVpZCxcclxuICAgICAgICBmaW5pc2hlZDogMSxcclxuICAgICAgICBhbGVydGVkOiAwXHJcbiAgICAgICAgfSwgZnVuY3Rpb24ocmVzcG9uc2Usc3RhdHVzKXtcclxuICAgICAgICAgICAgY29uc29sZS5sb2cocmVzcG9uc2UpO1xyXG4gICAgICAgICAgICBpZiAocmVzcG9uc2UgPT0gJ3N1Y2Nlc3MnKSB7XHJcblxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbn0pO1xyXG4kKCcuc2NlbmFyaW8nKS5vbignaGlkZGVuLmJzLm1vZGFsJywgZnVuY3Rpb24gKCkge1xyXG4gICAgY29uc29sZS5sb2coXCJjbG9zZVwiKVxyXG4gICAgaWYobG9nZ2VkSW5Vc2VyLmxldmVsID09IDMgJiYgbG9nZ2VkSW4gPT0gdHJ1ZSl7XHJcbiAgICAgICAgYWxlcnRBY3RpdmUgPSBmYWxzZTtcclxuICAgIH1cclxufSlcclxuIiwiJChcImJvZHlcIikub24oJ2NsaWNrJywnLmNsb3NlLWNvbmZpcm0nLGZ1bmN0aW9uKCl7XHJcbiAgJCgnLmpzLWNvbmZpcm0nKS5tb2RhbChcImhpZGVcIilcclxufSlcclxuXHJcbiQoXCJib2R5XCIpLm9uKCdjbGljaycsJy5jb25maXJtLXNhdmUtY2hhbmdlJyxmdW5jdGlvbigpe1xyXG4gICQoJy5qcy1jb25maXJtJykubW9kYWwoXCJoaWRlXCIpXHJcbn0pXHJcbiIsInZhciByb3dDbGFzcztcclxudmFyIHJvdztcclxuJCgnYm9keScpLm9uKCdjbGljaycsICcubGV2ZWwyLWJ0bi1kZWxldGUnLGZ1bmN0aW9uKCl7XHJcbiAgY29uZmlybU1vZGFsKFwiU2VuYXJpbyBWZXJ3aWpkZXJlblwiLFwiV2VldCB1IHpla2VyIGRhdCB1IGRpdCBzY2VuYXJpbyB3aWx0IHZlcndpamRlcmVuXCIsXCJjb25maXJtLXNjZW5hcmlvLWRlbGV0ZVwiKTtcclxuICByb3dDbGFzcyA9ICQodGhpcykucGFyZW50KCkucGFyZW50KCkuYXR0cihcImNsYXNzXCIpO1xyXG4gIHJvdyA9ICQodGhpcykucGFyZW50KCkucGFyZW50KCkuYXR0cihcImNsYXNzXCIpLnNwbGl0KFwiaW5kZXhcIilbMV07XHJcbn0pXHJcblxyXG4kKCdib2R5Jykub24oJ2NsaWNrJywnLmNvbmZpcm0tc2NlbmFyaW8tZGVsZXRlJyxmdW5jdGlvbigpe1xyXG4gIGZvcih2YXIgaSA9IDA7IGkgPCBzY2VuYXJpb3MubGVuZ3RoOyBpKyspe1xyXG4gICAgaWYoc2NlbmFyaW9zW2ldLmlkID09IHJvdyl7XHJcbiAgICAgICQucG9zdChcImluY2x1ZGUvZGVsZXRlU2NlbmFyaW9zLnBocFwiICx7XHJcbiAgICAgICAgaWQ6IHNjZW5hcmlvc1tpXS5pZFxyXG4gICAgICB9LCBmdW5jdGlvbihyZXNwb25zZSxzdGF0dXMpe1xyXG4gICAgICAgIGNvbnNvbGUubG9nKHJlc3BvbnNlKVxyXG4gICAgICAgIGlmKHJlc3BvbnNlID09IFwic3VjY2Vzc3VjY2Vzc3VjY2VzXCIpe1xyXG4gICAgICAgICAgY29uc29sZS5sb2cocm93Q2xhc3MpXHJcbiAgICAgICAgICBzY2VuYXJpb3Muc3BsaWNlKGksMSlcclxuICAgICAgICAgICQoXCIuXCIrcm93Q2xhc3MpLnJlbW92ZSgpO1xyXG4gICAgICAgICAgdXBkYXRlTGV2ZWwyVGVtcGxhdGVzKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9KVxyXG4gICAgfVxyXG4gIH1cclxufSlcclxuIiwidmFyIHJvd0NsYXNzID0gXCJcIjtcclxudmFyIHJvdyA9IFwiXCI7XHJcbiQoJ2JvZHknKS5vbignY2xpY2snLCAnLmxldmVsMS1idG4tZGVsZXRlJyxmdW5jdGlvbigpe1xyXG4gIGNvbmZpcm1Nb2RhbChcIkdlYnJ1aWtlciBWZXJ3aWpkZXJlblwiLFwiV2VldCB1IHpla2VyIGRhdCB1IGRlemUgZ2VicnVpa2VyIHdpbHQgdmVyd2lqZGVyZW5cIixcImNvbmZpcm0tdXNlci1kZWxldGVcIik7XHJcbiAgcm93Q2xhc3MgPSAkKHRoaXMpLnBhcmVudCgpLnBhcmVudCgpLmF0dHIoXCJjbGFzc1wiKTtcclxuICByb3cgPSAkKHRoaXMpLnBhcmVudCgpLnBhcmVudCgpLmF0dHIoXCJjbGFzc1wiKS5zcGxpdChcImluZGV4XCIpWzFdO1xyXG4gIGNvbnNvbGUubG9nKHVzZXJzKVxyXG59KVxyXG5cclxuJChcImJvZHlcIikub24oJ2NsaWNrJywnLmNvbmZpcm0tdXNlci1kZWxldGUnLGZ1bmN0aW9uKCl7XHJcbiAgY29uc29sZS5sb2coXCJ1c2VyLWRlbGV0ZVwiKVxyXG4gIGZvcih2YXIgaSA9IDA7IGkgPCB1c2Vycy5sZW5ndGg7IGkrKyl7XHJcbiAgICBpZih1c2Vyc1tpXS5pZCA9PSByb3cpe1xyXG4gICAgICAkLnBvc3QoXCJpbmNsdWRlL2RlbGV0ZVVzZXIucGhwXCIgLHtcclxuICAgICAgICBpZDogdXNlcnNbaV0uaWRcclxuICAgICAgfSwgZnVuY3Rpb24ocmVzcG9uc2Usc3RhdHVzKXtcclxuICAgICAgICBpZihyZXNwb25zZSA9PSBcInN1Y2Nlc1wiKXtcclxuICAgICAgICAgIHNob3dGbGFzaE1lc3NhZ2UoJ1UgaGVlZnQgZGUgZ2VicnVpa2VyIHN1Y2Nlc3ZvbCB2ZXJ3aWpkZXJkJywgJ3N1Y2Nlc3MnKTtcclxuICAgICAgICAgICQoXCIuXCIrcm93Q2xhc3MpLnJlbW92ZSgpO1xyXG4gICAgICAgIH1cclxuICAgICAgfSlcclxuICAgIH1cclxuICB9XHJcbn0pXHJcbiIsInZhciByb3dTZWxlY3RlZCA9IDA7XHJcbnZhciBpbmRleCA9IDA7XHJcbnZhciBkZXNjcmlwdGlvbnMgPSBbXTtcclxuJCgnYm9keScpLm9uKCdjbGljaycsICcubGV2ZWwyLWJ0bi1lZGl0JywgZnVuY3Rpb24oKXtcclxuICByb3dTZWxlY3RlZCA9ICQodGhpcykucGFyZW50KCkucGFyZW50KCkuYXR0cihcImNsYXNzXCIpO1xyXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgc2NlbmFyaW9zLmxlbmd0aDsgaSsrKXtcclxuICAgIGlmKHNjZW5hcmlvc1tpXS5pZCA9PSByb3dTZWxlY3RlZC5zcGxpdChcImluZGV4XCIpWzFdKXtcclxuICAgICAgaW5kZXggPSBpXHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICAkLnBvc3QoXCJpbmNsdWRlL2dldFNjZW5lcmlvRGVzYy5waHBcIiAse1xyXG4gICAgaWQ6IHNjZW5hcmlvc1tpbmRleF0uaWRcclxuICB9LCBmdW5jdGlvbihyZXNwb25zZSxzdGF0dXMpe1xyXG4gICAgZGVzY3JpcHRpb25zID0gSlNPTi5wYXJzZShyZXNwb25zZSlcclxuXHJcbiAgICBkZXNjcmlwdGlvbnMubWFwKGZ1bmN0aW9uKGNwLGkpe1xyXG4gICAgICBjcC5pbmRleCA9IGkrMTtcclxuICAgIH0pXHJcbiAgICBjb25zb2xlLmxvZyhkZXNjcmlwdGlvbnMpXHJcblxyXG4gICAgdmFyIHRlbXBsYXRlID0gJChcIi5sZXZlbDItc2NlbmFyaW8tZWRpdC10ZW1wbGF0ZVwiKS5odG1sKCk7XHJcbiAgICB2YXIgcmVuZGVyVGVtcGxhdGUgPSBNdXN0YWNoZS5yZW5kZXIodGVtcGxhdGUsIGRlc2NyaXB0aW9ucyk7XHJcblxyXG4gICAgJChcIi5zY2VuYXJpby1lZGl0LW9wdGlvbnMtY29udGFpbmVyXCIpLmh0bWwocmVuZGVyVGVtcGxhdGUpO1xyXG5cclxuICAgICQoJy5zY2VuYXJpby1lZGl0JykubW9kYWwoJ3Nob3cnKTtcclxuICAgICQoJy51cGRhdGUtc2NlbmFyaW9zLW5hbWUnKS52YWwoc2NlbmFyaW9zW2luZGV4XS5uYW1lKVxyXG4gIH0pXHJcbn0pXHJcblxyXG4kKCdib2R5Jykub24oJ2NsaWNrJywgJy51cGRhdGUtc2NlbmFyaW9zLXVwZGF0ZScsIGZ1bmN0aW9uKCl7XHJcbiAgZGVzY3JpcHRpb25OYW1lcyA9IFtdO1xyXG4gIGNvbnNvbGUubG9nKHNjZW5hcmlvc1tpbmRleF0pXHJcbiAgZm9yKHZhciBpID0gMSA7IGkgPCAoZGVzY3JpcHRpb25zLmxlbmd0aCsxKTsgaSsrKXtcclxuICAgIGlmKCQoJy5qcy1zY2VuYXJpby1lZGl0LScraSkudmFsKCkgIT0gXCJcIil7XHJcbiAgICAgIGRlc2NyaXB0aW9uTmFtZXMucHVzaCgkKCcuanMtc2NlbmFyaW8tZWRpdC0nK2kpLnZhbCgpKVxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgY29uc29sZS5sb2coZGVzY3JpcHRpb25OYW1lcylcclxuXHJcbiAgJC5wb3N0KFwiaW5jbHVkZS91cGRhdGVTY2VuYXJpby5waHBcIiAse1xyXG4gICAgc2NlbmFyaW9JRDogc2NlbmFyaW9zW2luZGV4XS5pZCxcclxuICAgIG5hbWU6ICQoJy51cGRhdGUtc2NlbmFyaW9zLW5hbWUnKS52YWwoKSxcclxuICAgIGRlc2NyaXB0aW9uczogZGVzY3JpcHRpb25zXHJcbiAgfSwgZnVuY3Rpb24ocmVzcG9uc2Usc3RhdHVzKXtcclxuICAgIGNvbnNvbGUubG9nKHJlc3BvbnNlKVxyXG4gICAgJCgnLnNjZW5hcmlvLWVkaXQnKS5tb2RhbCgnaGlkZScpO1xyXG4gIH0pXHJcbn0pXHJcblxyXG4kKCdib2R5Jykub24oJ2NsaWNrJywgJy5qcy1zY2VuYXJpby1lZGl0LWRlbGV0ZScsZnVuY3Rpb24oKXtcclxuICAgIHZhciBwYXJlbnQgPSAkKHRoaXMpLmNsb3Nlc3QoJy5qcy1zY2VuYXJpby1lZGl0LXN0ZXAnKTtcclxuICAgIGlmICghJChwYXJlbnQpLmlzKCc6Zmlyc3QtY2hpbGQnKSkge1xyXG4gICAgICAgICQocGFyZW50KS5yZW1vdmUoKTtcclxuICAgICAgICB1cGRhdGVTdGVwcygpO1xyXG4gICAgfVxyXG4gICAgZWxzZSB7XHJcbiAgICAgICAgc2hvd0ZsYXNoTWVzc2FnZSgnSmUga3VudCBuaWV0IGRlIGVlcnN0ZSBzdGFwIHZlcndpamRlcmVuJywgJ2RhbmdlcicpO1xyXG4gICAgfVxyXG59KTtcclxuIiwidmFyIHJvd1NlbGVjdGVkID0gMDtcclxudmFyIGluZGV4ID0gMDtcclxuJCgnYm9keScpLm9uKCdjbGljaycsICcubGV2ZWwxLWJ0bi1lZGl0JywgZnVuY3Rpb24oKXtcclxuICByb3dTZWxlY3RlZCA9ICQodGhpcykucGFyZW50KCkucGFyZW50KCkuYXR0cihcImNsYXNzXCIpO1xyXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgdXNlcnMubGVuZ3RoOyBpKyspe1xyXG4gICAgaWYodXNlcnNbaV0uaWQgPT0gcm93U2VsZWN0ZWQuc3BsaXQoXCJpbmRleFwiKVsxXSl7XHJcbiAgICAgIGluZGV4ID0gaVxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgJCgnLnVwZGF0ZS11c2VycycpLm1vZGFsKCdzaG93Jyk7XHJcbiAgJCgnLnVwZGF0ZS11c2Vycy11c2VybmFtZScpLnZhbCh1c2Vyc1tpbmRleF0udXNlcm5hbWUpXHJcbiAgJCgnLnVwZGF0ZS11c2VyLW9wdGlvbnMnKS5yZW1vdmVBdHRyKFwic2VsZWN0ZWRcIilcclxuXHJcbiAgaWYodXNlcnNbaW5kZXhdLnVzZXJsZXZlbCA9PSAyKXtcclxuICAgICQoJy51cGRhdGUtdXNlci1vcHRpb24yJykuYXR0cihcInNlbGVjdGVkXCIsXCJzZWxlY3RlZFwiKVxyXG4gIH1lbHNle1xyXG4gICAgJCgnLnVwZGF0ZS11c2VyLW9wdGlvbjEnKS5hdHRyKFwic2VsZWN0ZWRcIixcInNlbGVjdGVkXCIpXHJcbiAgfVxyXG59KVxyXG5cclxuJCgnYm9keScpLm9uKCdjbGljaycsICcudXBkYXRlLXVzZXJzLXVwZGF0ZScsIGZ1bmN0aW9uKCl7XHJcbiAgLy8gY29uc29sZS5sb2coXCJ1cGRhdGVcIilcclxuICAvLyBjb25zb2xlLmxvZygkKCcudXBkYXRlLXVzZXJzLXVzZXJuYW1lJykudmFsKCkpXHJcbiAgLy8gY29uc29sZS5sb2coJCgnLnVwZGF0ZS11c2Vycy1wYXNzd29yZCcpLnZhbCgpKVxyXG4gIC8vIGNvbnNvbGUubG9nKCQoJy51cGRhdGUtdXNlcnMtcmVwZWF0LXBhc3N3b3JkJykudmFsKCkpXHJcblxyXG4gIGlmKCQoJy51cGRhdGUtdXNlcnMtdXNlcm5hbWUnKS52YWwoKSA9PSBcIlwiICYmICQoJy51cGRhdGUtdXNlcnMtcGFzc3dvcmQnKS52YWwoKSA9PSBcIlwiICYmICQoJy51cGRhdGUtdXNlcnMtcmVwZWF0LXBhc3N3b3JkJykudmFsKCkgPT0gXCJcIil7XHJcbiAgICBjb25zb2xlLmxvZyhcImdlYnJ1aWtlcnNuYWFtIGVuIHdhY2h0d29vcmQgbW9nZW4gbmlldCBsZWVnIHppam5cIik7XHJcbiAgICBzaG93Rmxhc2hNZXNzYWdlKCdHZWJydWlrZXJzIG5hYW0gbWFnIG5pZXQgbGVlZyB6aWpuJywgJ2RhbmdlcicpO1xyXG4gIH1lbHNle1xyXG4gICAgaWYoJCgnLnVwZGF0ZS11c2Vycy11c2VybmFtZScpLnZhbCgpID09IFwiXCIpe1xyXG4gICAgICBzaG93Rmxhc2hNZXNzYWdlKCdVdyBnZWJydWlrZXJzbmFhbSBtYWcgbmlldCBsZWVnIHppam4nLCAnZGFuZ2VyJyk7XHJcbiAgICB9ZWxzZSBpZigkKCcudXBkYXRlLXVzZXJzLXBhc3N3b3JkJykudmFsKCkgIT0gJCgnLnVwZGF0ZS11c2Vycy1yZXBlYXQtcGFzc3dvcmQnKS52YWwoKSl7XHJcbiAgICAgIHNob3dGbGFzaE1lc3NhZ2UoJ1V3IHdhY2h0d29vcmRlbiB6aWpuIG5pZXQgZ2VsaWprIGFhbiBlbGthYXInLCAnZGFuZ2VyJyk7XHJcbiAgICB9ZWxzZXtcclxuICAgICAgLy8gY29uc29sZS5sb2codXNlcnNbcm93U2VsZWN0ZWQuc3BsaXQoXCJpbmRleFwiKVsxXV0pXHJcbiAgICAgICQucG9zdChcImluY2x1ZGUvdXBkYXRlVXNlci5waHBcIiAse1xyXG4gICAgICAgIGlkOiB1c2Vyc1tpbmRleF0uaWQsXHJcbiAgICAgICAgbmFtZTogJCgnLnVwZGF0ZS11c2Vycy11c2VybmFtZScpLnZhbCgpLFxyXG4gICAgICAgIHBhc3M6ICQoJy51cGRhdGUtdXNlcnMtcGFzc3dvcmQnKS52YWwoKSxcclxuICAgICAgICBsZXZlbDogJCgnLnVwZGF0ZS11c2VyLWxldmVsJykudmFsKClcclxuICAgICAgfSwgZnVuY3Rpb24ocmVzcG9uc2Usc3RhdHVzKXtcclxuICAgICAgICAvLyBjb25zb2xlLmxvZyhyZXNwb25zZSlcclxuICAgICAgICBpZihyZXNwb25zZSA9PSBcInN1Y2Nlc1wiKXtcclxuICAgICAgICAgICQoJy51cGRhdGUtdXNlcnMnKS5tb2RhbCgnaGlkZScpO1xyXG4gICAgICAgICAgdXNlcnNbaW5kZXhdLnVzZXJuYW1lID0gJCgnLnVwZGF0ZS11c2Vycy11c2VybmFtZScpLnZhbCgpO1xyXG4gICAgICAgICAgLy8gY29uc29sZS5sb2coJChcIi5cIityb3dTZWxlY3RlZCkuZmluZChcIi51c2VybmFtZVwiKSlcclxuICAgICAgICAgIC8vICQoJy5vcHRpb25zJykudHJpZ2dlcignY2xpY2snKTtcclxuICAgICAgICAgIHVwZGF0ZUxldmVsMVRlbXBsYXRlcygpO1xyXG4gICAgICAgICAgLy8gb3B0aW9uc1xyXG4gICAgICAgIH1cclxuICAgICAgfSlcclxuICAgIH1cclxuICB9XHJcbn0pXHJcbiIsInZhciBmbGFzaE1lc3NhZ2VzID0gW107XHJcbmZ1bmN0aW9uIHNob3dGbGFzaE1lc3NhZ2UobWVzLCB0eXBlLCBkaXNtaXNzYWJsZSA9IGZhbHNlLCBzZWNzID0gMjAwMCl7XHJcbiAgICB2YXIgcmFuZFN0ciA9IHJhbmRvbVN0cmluZzIoMjApO1xyXG4gICAgJCgnLmpzLWZsLWNvbnQnKS5hcHBlbmQoJzxkaXYgaWQ9XCInICsgcmFuZFN0ciArICdcIiBjbGFzcz1cImpzLWZsYXNoIGFsZXJ0LScgKyB0eXBlICsgJyBmbGFzaC1tZXNzYWdlXCI+JysgbWVzICsgJzwvZGl2PicpO1xyXG4gICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgJCgnIycgKyByYW5kU3RyKS5hZGRDbGFzcygnZmxhc2gtbWVzc2FnZS0tc2hvdycpO1xyXG4gICAgfSwgMSk7XHJcbiAgICBpZiAoIWRpc21pc3NhYmxlKSB7XHJcbiAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIGRlbGV0ZUZsYXNoTWVzc2FnZShyYW5kU3RyKTtcclxuICAgICAgICB9LCBzZWNzKTtcclxuICAgIH1cclxuICAgIGVsc2V7XHJcbiAgICAgICAgJCgnIycgKyByYW5kU3RyKS5hcHBlbmQoJzxidXR0b24gZGF0YS1pZD1cIicgKyByYW5kU3RyICsgJ1wiIGNsYXNzPVwianMtZGlzbWlzcyBidG4gYnRuLWJsb2NrXCI+T2s8L2J1dHRvbj4nKTtcclxuICAgIH1cclxufVxyXG5zaG93Rmxhc2hNZXNzYWdlKCdoYWxsb2FzZGtqYXNka2pkaGFza2FzZGhramFzZGhrYXNkamhzYWRramhzZGtqaGQnLCdzdWNjZXNzJywgdHJ1ZSk7XHJcbnNob3dGbGFzaE1lc3NhZ2UoJ2hhbGxvYXNka2phc2RramRoYXNrYXNkaGtqYXNkaGthc2RqaHNhZGtqaHNka2poZCcsJ2RhbmdlcicsIHRydWUpO1xyXG5zaG93Rmxhc2hNZXNzYWdlKCdoYWxsb2FzZGtqYXNka2pkaGFza2FzZGhramFzZGhrYXNkamhzYWRramhzZGtqaGQnLCd3YXJuaW5nJywgdHJ1ZSk7XHJcbiQoJ2JvZHknKS5vbignY2xpY2snLCAnLmpzLWRpc21pc3MnLCBmdW5jdGlvbigpe1xyXG4gICAgdmFyIGRlbHN0ciA9ICQodGhpcykuZGF0YSgnaWQnKTtcclxuICAgIGRlbGV0ZUZsYXNoTWVzc2FnZShkZWxzdHIpO1xyXG59KTtcclxuXHJcbmZ1bmN0aW9uIGRlbGV0ZUZsYXNoTWVzc2FnZShpZCl7XHJcbiAgICAkKCcjJyArIGlkKS5yZW1vdmVDbGFzcygnZmxhc2gtbWVzc2FnZS0tc2hvdycpO1xyXG4gICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgJCgnIycgKyBpZCkucmVtb3ZlKCk7XHJcbiAgICB9LCAyMDApO1xyXG59XHJcblxyXG5mdW5jdGlvbiByYW5kb21TdHJpbmcyKGxlbiwgYmVmb3Jlc3RyID0gJycsIGFycmF5dG9jaGVjayA9IG51bGwpIHtcclxuICAgIC8vIENoYXJzZXQsIGV2ZXJ5IGNoYXJhY3RlciBpbiB0aGlzIHN0cmluZyBpcyBhbiBvcHRpb25hbCBvbmUgaXQgY2FuIHVzZSBhcyBhIHJhbmRvbSBjaGFyYWN0ZXIuXHJcbiAgICB2YXIgY2hhclNldCA9ICdBQkNERUZHSElKS0xNTk9QUVJTVFVWV1hZWmFiY2RlZmdoaWprbG1ub3BxcnN0dXZ3eHl6JztcclxuICAgIHZhciByYW5kb21TdHJpbmcgPSAnJztcclxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuOyBpKyspIHtcclxuICAgICAgICAvLyBjcmVhdGVzIGEgcmFuZG9tIG51bWJlciBiZXR3ZWVuIDAgYW5kIHRoZSBjaGFyU2V0IGxlbmd0aC4gUm91bmRzIGl0IGRvd24gdG8gYSB3aG9sZSBudW1iZXJcclxuICAgICAgICB2YXIgcmFuZG9tUG96ID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogY2hhclNldC5sZW5ndGgpO1xyXG4gICAgICAgIHJhbmRvbVN0cmluZyArPSBjaGFyU2V0LnN1YnN0cmluZyhyYW5kb21Qb3osIHJhbmRvbVBveiArIDEpO1xyXG4gICAgfVxyXG4gICAgLy8gSWYgYW4gYXJyYXkgaXMgZ2l2ZW4gaXQgd2lsbCBjaGVjayB0aGUgYXJyYXksIGFuZCBpZiB0aGUgZ2VuZXJhdGVkIHN0cmluZyBleGlzdHMgaW4gaXQgaXQgd2lsbCBjcmVhdGUgYSBuZXcgb25lIHVudGlsIGEgdW5pcXVlIG9uZSBpcyBmb3VuZCAqV0FUQ0ggT1VULiBJZiBhbGwgYXZhaWxhYmxlIG9wdGlvbnMgYXJlIHVzZWQgaXQgd2lsbCBjYXVzZSBhIGxvb3AgaXQgY2Fubm90IGJyZWFrIG91dCpcclxuICAgIGlmIChhcnJheXRvY2hlY2sgPT0gbnVsbCkge1xyXG4gICAgICAgIHJldHVybiBiZWZvcmVzdHIgKyByYW5kb21TdHJpbmc7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAgIHZhciBpc0luID0gJC5pbkFycmF5KGJlZm9yZXN0ciArIHJhbmRvbVN0cmluZywgYXJyYXl0b2NoZWNrKTsgLy8gY2hlY2tzIGlmIHRoZSBzdHJpbmcgaXMgaW4gdGhlIGFycmF5LCByZXR1cm5zIGEgcG9zaXRpb25cclxuICAgICAgICBpZiAoaXNJbiA+IC0xKSB7XHJcbiAgICAgICAgICAgIC8vIGlmIHRoZSBwb3NpdGlvbiBpcyBub3QgLTEgKG1lYW5pbmcsIGl0IGlzIG5vdCBpbiB0aGUgYXJyYXkpIGl0IHdpbGwgc3RhcnQgZG9pbmcgYSBsb29wXHJcbiAgICAgICAgICAgIHZhciBjb3VudCA9IDA7XHJcbiAgICAgICAgICAgIGRvIHtcclxuICAgICAgICAgICAgICAgIHJhbmRvbVN0cmluZyA9ICcnO1xyXG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW47IGkrKykge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciByYW5kb21Qb3ogPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiBjaGFyU2V0Lmxlbmd0aCk7XHJcbiAgICAgICAgICAgICAgICAgICAgcmFuZG9tU3RyaW5nICs9IGNoYXJTZXQuc3Vic3RyaW5nKHJhbmRvbVBveiwgcmFuZG9tUG96ICsgMSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBpc0luID0gJC5pbkFycmF5KGJlZm9yZXN0ciArIHJhbmRvbVN0cmluZywgYXJyYXl0b2NoZWNrKTtcclxuICAgICAgICAgICAgICAgIGNvdW50Kys7XHJcbiAgICAgICAgICAgIH0gd2hpbGUgKGlzSW4gPiAtMSk7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdpdCB0b29rICcgKyBjb3VudCArICcgdHJpZXMnKTtcclxuICAgICAgICAgICAgcmV0dXJuIGJlZm9yZXN0ciArIHJhbmRvbVN0cmluZztcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICByZXR1cm4gYmVmb3Jlc3RyICsgcmFuZG9tU3RyaW5nO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG4iLCJmdW5jdGlvbiBsb2dpbihhX3VzZXJMZXZlbCl7XHJcbiAgICAkKCcubG9naW4tY29udGFpbmVyJykuYWRkQ2xhc3MoXCJoaWRkZW5cIik7XHJcbiAgICAkKCcubG9naW4tc3RhdHVzJykudGV4dChcIldlbGtvbTogXCIrbG9nZ2VkSW5Vc2VyLnVzZXJuYW1lICsgXCIgICAgXCIpXHJcbiAgICAkKCcubG9nb3V0JykucmVtb3ZlQ2xhc3MoXCJoaWRkZW5cIilcclxuICAgIGxvZ2dlZEluID0gdHJ1ZTtcclxuICAgIHVzZXJMZXZlbCA9IGFfdXNlckxldmVsO1xyXG5cclxuICAgICQoXCIudXNlci1sZXZlbFwiKS5hZGRDbGFzcyhcImhpZGRlblwiKVxyXG4gICAgJChcIi52aWV3XCIpLmFkZENsYXNzKFwiaGlkZGVuXCIpXHJcblxyXG4gICAgc3dpdGNoICh1c2VyTGV2ZWwpIHtcclxuICAgICAgICBjYXNlIDE6XHJcbiAgICAgICAgJChcIi51c2VyLWxldmVsXzFcIikucmVtb3ZlQ2xhc3MoXCJoaWRkZW5cIilcclxuICAgICAgICAkKFwiLnZpZXdfMS0xXCIpLnJlbW92ZUNsYXNzKFwiaGlkZGVuXCIpXHJcbiAgICAgICAgJChcIi5vcHRpb25fMVwiKS5hZGRDbGFzcyhcIm9wdGlvbnMtLWFjdGl2ZVwiKVxyXG4gICAgICAgICQoJy5zZXR0aW5ncycpLnJlbW92ZUNsYXNzKFwiaGlkZGVuXCIpXHJcbiAgICAgICAgdXBkYXRlTGV2ZWwxVGVtcGxhdGVzKCk7XHJcbiAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSAyOlxyXG4gICAgICAgICQoXCIudXNlci1sZXZlbF8yXCIpLnJlbW92ZUNsYXNzKFwiaGlkZGVuXCIpXHJcbiAgICAgICAgJChcIi52aWV3XzItMVwiKS5yZW1vdmVDbGFzcyhcImhpZGRlblwiKVxyXG4gICAgICAgICQoXCIub3B0aW9uXzFcIikuYWRkQ2xhc3MoXCJvcHRpb25zLS1hY3RpdmVcIilcclxuICAgICAgICAkKCcuc2V0dGluZ3MnKS5yZW1vdmVDbGFzcyhcImhpZGRlblwiKVxyXG4gICAgICAgIHVwZGF0ZUxldmVsMlRlbXBsYXRlcygpO1xyXG4gICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgMzpcclxuICAgICAgICAkKFwiLnVzZXItbGV2ZWxfM1wiKS5yZW1vdmVDbGFzcyhcImhpZGRlblwiKVxyXG4gICAgICAgIGJyZWFrO1xyXG4gICAgfVxyXG59XHJcblxyXG5mdW5jdGlvbiBsb2dvdXQoKXtcclxuICAgICQoJy5sb2dpbi1jb250YWluZXInKS5yZW1vdmVDbGFzcyhcImhpZGRlblwiKTtcclxuICAgICQoJy5sb2dpbi1zdGF0dXMnKS50ZXh0KFwiVSBiZW50IG5vZyBuaWV0IGluZ2Vsb2dkXCIpXHJcbiAgICAkKCcubG9nb3V0JykuYWRkQ2xhc3MoXCJoaWRkZW5cIilcclxuICAgICQoXCIudXNlci1sZXZlbFwiKS5hZGRDbGFzcyhcImhpZGRlblwiKVxyXG4gICAgJCgnLnNldHRpbmdzJykuYWRkQ2xhc3MoXCJoaWRkZW5cIilcclxuICAgIGxvZ2dlZEluID0gZmFsc2U7XHJcbiAgICB1c2VyTGV2ZWwgPSAwO1xyXG4gICAgLy8gY29uc29sZS5sb2coXCJsb2dvdXRcIilcclxuXHJcbiAgICAkLnBvc3QoXCJpbmNsdWRlL2xvZ2luLnBocFwiLHtcclxuICAgICAgICBsb2dvdXRTdWI6ICcnXHJcbiAgICB9LCBmdW5jdGlvbihyZXNwb25zZSxzdGF0dXMpe1xyXG4gICAgICAgIHNob3dGbGFzaE1lc3NhZ2UoJ0plIGJlbnQgdWl0Z2Vsb2dkJywgJ3N1Y2Nlc3MnKTtcclxuICAgIH0pXHJcbn1cclxuXHJcbmZ1bmN0aW9uIHVwZGF0ZUxldmVsMVRlbXBsYXRlcygpe1xyXG4gICAgJC5wb3N0KFwiaW5jbHVkZS9nZXRVc2Vycy5waHBcIix7XHJcbiAgICB9LCBmdW5jdGlvbihyZXNwb25zZSxzdGF0dXMpe1xyXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKHJlc3BvbnNlKVxyXG4gICAgICAgIHVzZXJzID0gSlNPTi5wYXJzZShyZXNwb25zZSlcclxuXHJcbiAgICAgICAgZm9yKHZhciBpID0gMDsgaSA8IDI7IGkrKyl7XHJcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKGkpXHJcbiAgICAgICAgICAgIHVzZXJzLm1hcChmdW5jdGlvbihjcCxqKXtcclxuICAgICAgICAgICAgICAgIGNwLmluZGV4ID0gY3AuaWQ7XHJcbiAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhpKVxyXG4gICAgICAgICAgICAgICAgaWYoY3AudXNlcmxldmVsID09IDIpe1xyXG4gICAgICAgICAgICAgICAgICAgIGNwLmxldmVsID0gXCJEb2NlbnRcIlxyXG4gICAgICAgICAgICAgICAgfWVsc2UgaWYoY3AudXNlcmxldmVsID09IDMpe1xyXG4gICAgICAgICAgICAgICAgICAgIGNwLmxldmVsID0gXCJTdHVkZW50XCJcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGlmKGkgPT0gMCl7XHJcbiAgICAgICAgICAgICAgICAgICAgY3AuY2xhc3MgPSBcImVkaXRcIlxyXG4gICAgICAgICAgICAgICAgICAgIGNwLmNsYXNzVGV4dCA9IFwiYWFucGFzc2VuXCJcclxuICAgICAgICAgICAgICAgIH1lbHNlIGlmKGkgPT0gMSl7XHJcbiAgICAgICAgICAgICAgICAgICAgY3AuY2xhc3MgPSBcImRlbGV0ZVwiXHJcbiAgICAgICAgICAgICAgICAgICAgY3AuY2xhc3NUZXh0ID0gXCJ2ZXJ3aWpkZXJlblwiXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pXHJcblxyXG4gICAgICAgICAgICBmb3IodmFyIGogPSAwOyBqIDwgdXNlcnMubGVuZ3RoOyBqKyspe1xyXG4gICAgICAgICAgICAgICAgaWYodXNlcnNbal0udXNlcmxldmVsID09IDEpe1xyXG4gICAgICAgICAgICAgICAgICAgIHVzZXJzLnNwbGljZShqLDEpXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICQoXCIubmV3LXVzZXItbmFtZVwiKS52YWwoXCJcIik7XHJcbiAgICAgICAgICAgICQoXCIubmV3LXVzZXItcGFzc3dvcmRcIikudmFsKFwiXCIpO1xyXG4gICAgICAgICAgICAkKFwiLm5ldy11c2VyLW9wdGlvbnNcIikucmVtb3ZlQXR0cihcInNlbGVjdGVkXCIpO1xyXG4gICAgICAgICAgICAkKFwiLm5ldy11c2VyLW9wdGlvbjFcIikuYXR0cihcInNlbGVjdGVkXCIsXCJzZWxlY3RlZFwiKTtcclxuXHJcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKHVzZXJzKVxyXG5cclxuICAgICAgICAgICAgdmFyIHRlbXBsYXRlID0gJChcIi5sZXZlbDEtdXNlci10ZW1wbGF0ZVwiKS5odG1sKCk7XHJcbiAgICAgICAgICAgIHZhciByZW5kZXJUZW1wbGF0ZSA9IE11c3RhY2hlLnJlbmRlcih0ZW1wbGF0ZSwgdXNlcnMpO1xyXG5cclxuICAgICAgICAgICAgaWYoaSA9PSAwKXtcclxuICAgICAgICAgICAgICAgICQoXCIudXNlci1sZXZlbDEtZWRpdFwiKS5odG1sKHJlbmRlclRlbXBsYXRlKTtcclxuICAgICAgICAgICAgfWVsc2UgaWYoaSA9PSAxKXtcclxuICAgICAgICAgICAgICAgICQoXCIudXNlci1sZXZlbDEtZGVsZXRlXCIpLmh0bWwocmVuZGVyVGVtcGxhdGUpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfSlcclxufVxyXG5cclxuZnVuY3Rpb24gdXBkYXRlTGV2ZWwyVGVtcGxhdGVzKCl7XHJcbiAgICAkLnBvc3QoXCJpbmNsdWRlL2dldFNjZW5hcmlvcy5waHBcIix7XHJcbiAgICB9LCBmdW5jdGlvbihyZXNwb25zZSxzdGF0dXMpe1xyXG4gICAgICAgIHNjZW5hcmlvcyA9IEpTT04ucGFyc2UocmVzcG9uc2UpXHJcbiAgICAgICAgLy8gY29uc29sZS5sb2coc2NlbmFyaW9zKVxyXG5cclxuICAgICAgICAkKCcuc2NlbmFyaW8tc2VsZWN0b3InKS5odG1sKFwiXCIpXHJcbiAgICAgICAgZm9yKHZhciBpID0gMCA7IGkgPCBzY2VuYXJpb3MubGVuZ3RoOyBpKyspe1xyXG4gICAgICAgICAgICAkKCcuc2NlbmFyaW8tc2VsZWN0b3InKS5hcHBlbmQoJzxvcHRpb24gZGF0YS1pZD1cIicgKyBzY2VuYXJpb3NbaV0uaWQgICsgJ1wiPicgKyBzY2VuYXJpb3NbaV0ubmFtZSArIFwiPC9vcHRpb24+XCIpXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyBmb3IodmFyIGkgPSAwOyBpIDwgMjsgaSsrKXtcclxuXHJcbiAgICAgICAgdmFyIHRlbXBsYXRlID0gJChcIi5sZXZlbDItc2NlbmFyaW8tdGVtcGxhdGVcIikuaHRtbCgpO1xyXG4gICAgICAgIHZhciByZW5kZXJUZW1wbGF0ZSA9IE11c3RhY2hlLnJlbmRlcih0ZW1wbGF0ZSwgc2NlbmFyaW9zKTtcclxuXHJcbiAgICAgICAgJChcIi5qcy1zY2VuYXJpby1jb250YWluZXJcIikuaHRtbChyZW5kZXJUZW1wbGF0ZSk7XHJcbiAgICAgICAgLy8gfVxyXG4gICAgfSlcclxufVxyXG5cclxudmFyIGNvbmZpcm1DbGFzc09sZCA9IFwiXCI7XHJcbnZhciBkZWxldGVDbGFzc09sZCA9IFwiXCI7XHJcbmZ1bmN0aW9uIGNvbmZpcm1Nb2RhbCh0aXRsZSwgYm9keSwgY29uZmlybUNsYXNzLCBkZWxldGVDbGFzcyl7XHJcbiAgICBpZihkZWxldGVDbGFzcyA9PSB1bmRlZmluZWQpe1xyXG4gICAgICAgIGRlbGV0ZUNsYXNzID0gXCJjbG9zZS1jb25maXJtXCJcclxuICAgIH1cclxuICAgIGlmKGNvbmZpcm1DbGFzcyAhPSBcIlwiICYmIGRlbGV0ZUNsYXNzT2xkICE9IFwiXCIpe1xyXG4gICAgICAgICQoJy5jb25maXJtLXNhdmUtY2hhbmdlJykucmVtb3ZlQ2xhc3MoY29uZmlybUNsYXNzT2xkKVxyXG4gICAgICAgICQoJy5jb25maXJtLWRlbGV0ZS1jaGFuZ2UnKS5yZW1vdmVDbGFzcyhkZWxldGVDbGFzc09sZClcclxuICAgIH1cclxuICAgICQoJy5jb25maXJtLXNhdmUtY2hhbmdlJykuYWRkQ2xhc3MoY29uZmlybUNsYXNzKVxyXG4gICAgJCgnLmNvbmZpcm0tZGVsZXRlLWNoYW5nZScpLmFkZENsYXNzKGRlbGV0ZUNsYXNzKVxyXG5cclxuICAgIGNvbmZpcm1DbGFzc09sZCA9IGNvbmZpcm1DbGFzcztcclxuICAgIGRlbGV0ZUNsYXNzT2xkID0gZGVsZXRlQ2xhc3M7XHJcblxyXG4gICAgJCgnLmNvbmZpcm0tdGl0bGUnKS50ZXh0KHRpdGxlKVxyXG4gICAgJCgnLmNvbmZpcm0tdGV4dCcpLnRleHQoYm9keSlcclxuXHJcbiAgICAkKCcuanMtY29uZmlybScpLm1vZGFsKFwic2hvd1wiKVxyXG4gICAgZnVuY3Rpb24gcmFuZG9tU3RyaW5nMihsZW4sIGJlZm9yZXN0ciA9ICcnLCBhcnJheXRvY2hlY2sgPSBudWxsKSB7XHJcbiAgICAgICAgLy8gQ2hhcnNldCwgZXZlcnkgY2hhcmFjdGVyIGluIHRoaXMgc3RyaW5nIGlzIGFuIG9wdGlvbmFsIG9uZSBpdCBjYW4gdXNlIGFzIGEgcmFuZG9tIGNoYXJhY3Rlci5cclxuICAgICAgICB2YXIgY2hhclNldCA9ICdBQkNERUZHSElKS0xNTk9QUVJTVFVWV1hZWmFiY2RlZmdoaWprbG1ub3BxcnN0dXZ3eHl6JztcclxuICAgICAgICB2YXIgcmFuZG9tU3RyaW5nID0gJyc7XHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW47IGkrKykge1xyXG4gICAgICAgICAgICAvLyBjcmVhdGVzIGEgcmFuZG9tIG51bWJlciBiZXR3ZWVuIDAgYW5kIHRoZSBjaGFyU2V0IGxlbmd0aC4gUm91bmRzIGl0IGRvd24gdG8gYSB3aG9sZSBudW1iZXJcclxuICAgICAgICAgICAgdmFyIHJhbmRvbVBveiA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIGNoYXJTZXQubGVuZ3RoKTtcclxuICAgICAgICAgICAgcmFuZG9tU3RyaW5nICs9IGNoYXJTZXQuc3Vic3RyaW5nKHJhbmRvbVBveiwgcmFuZG9tUG96ICsgMSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vIElmIGFuIGFycmF5IGlzIGdpdmVuIGl0IHdpbGwgY2hlY2sgdGhlIGFycmF5LCBhbmQgaWYgdGhlIGdlbmVyYXRlZCBzdHJpbmcgZXhpc3RzIGluIGl0IGl0IHdpbGwgY3JlYXRlIGEgbmV3IG9uZSB1bnRpbCBhIHVuaXF1ZSBvbmUgaXMgZm91bmQgKldBVENIIE9VVC4gSWYgYWxsIGF2YWlsYWJsZSBvcHRpb25zIGFyZSB1c2VkIGl0IHdpbGwgY2F1c2UgYSBsb29wIGl0IGNhbm5vdCBicmVhayBvdXQqXHJcbiAgICAgICAgaWYgKGFycmF5dG9jaGVjayA9PSBudWxsKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBiZWZvcmVzdHIgKyByYW5kb21TdHJpbmc7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdmFyIGlzSW4gPSAkLmluQXJyYXkoYmVmb3Jlc3RyICsgcmFuZG9tU3RyaW5nLCBhcnJheXRvY2hlY2spOyAvLyBjaGVja3MgaWYgdGhlIHN0cmluZyBpcyBpbiB0aGUgYXJyYXksIHJldHVybnMgYSBwb3NpdGlvblxyXG4gICAgICAgICAgICBpZiAoaXNJbiA+IC0xKSB7XHJcbiAgICAgICAgICAgICAgICAvLyBpZiB0aGUgcG9zaXRpb24gaXMgbm90IC0xIChtZWFuaW5nLCBpdCBpcyBub3QgaW4gdGhlIGFycmF5KSBpdCB3aWxsIHN0YXJ0IGRvaW5nIGEgbG9vcFxyXG4gICAgICAgICAgICAgICAgdmFyIGNvdW50ID0gMDtcclxuICAgICAgICAgICAgICAgIGRvIHtcclxuICAgICAgICAgICAgICAgICAgICByYW5kb21TdHJpbmcgPSAnJztcclxuICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbjsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciByYW5kb21Qb3ogPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiBjaGFyU2V0Lmxlbmd0aCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJhbmRvbVN0cmluZyArPSBjaGFyU2V0LnN1YnN0cmluZyhyYW5kb21Qb3osIHJhbmRvbVBveiArIDEpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBpc0luID0gJC5pbkFycmF5KGJlZm9yZXN0ciArIHJhbmRvbVN0cmluZywgYXJyYXl0b2NoZWNrKTtcclxuICAgICAgICAgICAgICAgICAgICBjb3VudCsrO1xyXG4gICAgICAgICAgICAgICAgfSB3aGlsZSAoaXNJbiA+IC0xKTtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdpdCB0b29rICcgKyBjb3VudCArICcgdHJpZXMnKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiBiZWZvcmVzdHIgKyByYW5kb21TdHJpbmc7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gYmVmb3Jlc3RyICsgcmFuZG9tU3RyaW5nO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcbiIsInZhciBsb2dnZWRJbiA9IGZhbHNlO1xyXG52YXIgdXNlckxldmVsID0gMDtcclxudmFyIGxvZ2dlZEluVXNlciA9IFtdO1xyXG52YXIgdXNlcnMgPSBbXTtcclxudmFyIHNjZW5hcmlvcyA9IFtdO1xyXG52YXIgYWxlcnRBY3RpdmUgPSBmYWxzZTtcclxuXHJcbiQoZG9jdW1lbnQpLnJlYWR5KGZ1bmN0aW9uKCl7XHJcbiAgICBjb25zb2xlLmxvZyhcImhvbWUuanMgbG9hZGVkXCIpXHJcbiAgICAkKCdib2R5Jykub24oJ2NsaWNrJywgJy5tZW51LWl0ZW0nLCBmdW5jdGlvbigpe1xyXG4gICAgICAgIHZhciBpZCA9ICQodGhpcykuYXR0cihcImNsYXNzXCIpLnNwbGl0KCdfJylbMV07XHJcbiAgICAgICAgY29uc29sZS5sb2coaWQpXHJcblxyXG4gICAgICAgICQoJy52ZXJkaWVwaW5nJykuYWRkQ2xhc3MoXCJoaWRkZW5cIilcclxuICAgICAgICAkKCcudmVyZGllcGluZ19fJytpZCkucmVtb3ZlQ2xhc3MoXCJoaWRkZW5cIilcclxuICAgIH0pXHJcblxyXG4gICAgJCgnYm9keScpLm9uKCdjbGljaycsICcubG9naW4nLCBmdW5jdGlvbigpe1xyXG4gICAgICAgIGNvbnNvbGUubG9nKCQoJy51c2VybmFtZScpLnZhbCgpLnRvTG93ZXJDYXNlKCkpXHJcbiAgICAgICAgY29uc29sZS5sb2coJCgnLnBhc3N3b3JkJykudmFsKCkudG9Mb3dlckNhc2UoKSlcclxuICAgICAgICAkLnBvc3QoXCJpbmNsdWRlL2xvZ2luLnBocFwiICx7XHJcbiAgICAgICAgICAgIGxvZ2luU3ViOiBcIlwiLFxyXG4gICAgICAgICAgICB1c2VybmFtZTogJCgnLnVzZXJuYW1lJykudmFsKCkudG9Mb3dlckNhc2UoKSxcclxuICAgICAgICAgICAgcGFzc3dvcmQ6ICQoJy5wYXNzd29yZCcpLnZhbCgpXHJcbiAgICAgICAgfSwgZnVuY3Rpb24ocmVzcG9uc2Usc3RhdHVzKXtcclxuICAgICAgICAgICAgdmFyIGRhdGEgPSBKU09OLnBhcnNlKHJlc3BvbnNlKTtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coZGF0YSk7XHJcbiAgICAgICAgICAgIGxvZ2dlZEluVXNlciA9IGRhdGE7XHJcbiAgICAgICAgICAgIGlmIChkYXRhLmxvZ2dlZEluID09IDEpIHtcclxuICAgICAgICAgICAgICAgIGxvZ2luKGRhdGEubGV2ZWwpO1xyXG4gICAgICAgICAgICAgICAgc2hvd0ZsYXNoTWVzc2FnZSgnVSBiZW50IHN1Y2Nlc3ZvbCBpbmdlbG9nZCcsICdzdWNjZXNzJylcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHNob3dGbGFzaE1lc3NhZ2UoJ1V3IGdlYnJ1aWtlcnNuYWFtIG9mIHdhY2h0d29vcmQgaXMgaW5jb3JyZWN0JywgJ2RhbmdlcicpXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KVxyXG4gICAgfSlcclxuXHJcbiAgICAkKCdib2R5Jykub24oJ2NsaWNrJywgJy5sb2dvdXQnLCBmdW5jdGlvbigpe1xyXG4gICAgICAgIGxvZ291dCgpO1xyXG4gICAgfSlcclxuXHJcbiAgICAkKCdib2R5Jykub24oJ2NsaWNrJywgJy5sb2thYWwnLCBmdW5jdGlvbigpe1xyXG4gICAgICAgIGNvbnNvbGUubG9nKGxvZ2dlZEluKVxyXG4gICAgICAgIGlmKGxvZ2dlZEluID09IHRydWUpe1xyXG4gICAgICAgICAgICB2YXIgbG9rYWFsbnIgPSAkKHRoaXMpLmF0dHIoXCJjbGFzc1wiKS5zcGxpdChcIiBcIilbMF07XHJcbiAgICAgICAgICAgICQoJy5qcy1sb2thYWwnKS5odG1sKGxva2FhbG5yKTtcclxuICAgICAgICB9XHJcbiAgICB9KVxyXG5cclxuICAgICQoZG9jdW1lbnQpLmtleXByZXNzKGZ1bmN0aW9uKGUpIHtcclxuICAgICAgICBpZihlLndoaWNoID09IDEzKSB7XHJcbiAgICAgICAgICAgIGlmICghbG9nZ2VkSW4pIHtcclxuICAgICAgICAgICAgICAgICQoJy5sb2dpbicpLnRyaWdnZXIoJ2NsaWNrJyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9KTtcclxufSlcclxuIiwiJCgnYm9keScpLm9uKCdjbGljaycsICcubG9rYWFsJywgZnVuY3Rpb24oKXtcclxuICAgIGlmKGxvZ2dlZEluKXtcclxuICAgICAgICB2YXIgbG9rYWFsbnIgPSAkKHRoaXMpLmF0dHIoXCJjbGFzc1wiKS5zcGxpdChcIiBcIilbMF07XHJcbiAgICAgICAgJCgnLmpzLWxva2FhbCcpLmh0bWwobG9rYWFsbnIpO1xyXG4gICAgfVxyXG59KVxyXG4kKCdib2R5Jykub24oJ2NsaWNrJywgJy5qcy1zdGFydC1zY2VuYXJpbycsIGZ1bmN0aW9uKCl7XHJcbiAgICBpZiAobG9nZ2VkSW4pIHtcclxuICAgICAgICB2YXIgbG9rYWFsbnIgPSAkKCcuanMtbG9rYWFsJykuaHRtbCgpO1xyXG4gICAgICAgIHZhciBzY2VuYXJpb0lkID0gJCgnLmpzLXNjZW5hcmlvc2VsZWN0JykuZmluZChcIjpzZWxlY3RlZFwiKS5kYXRhKCdpZCcpO1xyXG4gICAgICAgIHZhciB0b29scyA9IDA7XHJcbiAgICAgICAgaWYgKCQoJy5qcy1zd2l0Y2gnKS5pcygnOmNoZWNrZWQnKSkge1xyXG4gICAgICAgICAgICB0b29scyA9IDE7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChsb2thYWxuciAhPSBcIlwiKSB7XHJcbiAgICAgICAgICAgIGlmIChzY2VuYXJpb0lkID49IDEpIHtcclxuICAgICAgICAgICAgICAgICQucG9zdChcImluY2x1ZGUvbWFrZUFjdGl2ZVNjZW5hcmlvLnBocFwiLHtcclxuICAgICAgICAgICAgICAgICAgICBsb2thYWxucjogbG9rYWFsbnIsXHJcbiAgICAgICAgICAgICAgICAgICAgc2NlbmFyaW9JZDogc2NlbmFyaW9JZCxcclxuICAgICAgICAgICAgICAgICAgICB0b29sczogdG9vbHNcclxuICAgICAgICAgICAgICAgICAgICB9LCBmdW5jdGlvbihyZXNwb25zZSxzdGF0dXMpe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAocmVzcG9uc2UgPT0gJ3N1Y2Nlc3MnKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzaG93Rmxhc2hNZXNzYWdlKCdTY2VuYXJpbyBpcyBzdWNjZXN2b2wgYWFuZ2VtYWFrdCcsICdzdWNjZXNzJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgZWxzZXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNob3dGbGFzaE1lc3NhZ2UoJ0hldCBtYWtlbiB2YW4gZWVuIHNjZW5hcmlvIGlzIG1pc2x1a3QnLCAnZGFuZ2VyJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNle1xyXG4gICAgICAgICAgICAgICAgc2hvd0ZsYXNoTWVzc2FnZSgnRXIgaXMgZ2VlbiBzY2VuYXJpbyBnZWtvemVuJywgJ2RhbmdlcicpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICBzaG93Rmxhc2hNZXNzYWdlKCdLaWVzIGVlbiBsb2thYWwnLCAnZGFuZ2VyJyk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59KVxyXG4iLCIkKFwiYm9keVwiKS5vbihcImNsaWNrXCIsIFwiLm5ldy11c2VyXCIsZnVuY3Rpb24oKXtcclxuICBpZigkKFwiLm5ldy11c2VyLW5hbWVcIikudmFsKCkgPT0gXCJcIiB8fCAkKFwiLm5ldy11c2VyLXBhc3N3b3JkXCIpLnZhbCgpID09IFwiXCIgfHwgJChcIi5uZXctdXNlci1sZXZlbFwiKS52YWwoKSA9PSBudWxsKXtcclxuICAgIGlmKCQoXCIubmV3LXVzZXItbmFtZVwiKS52YWwoKSA9PSBcIlwiKXtcclxuICAgICAgc2hvd0ZsYXNoTWVzc2FnZSgnVSBoZWVmdCBub2cgZ2VlbiBnZWJydWlrZXJzbmFhbSBpbmdldnVsZCcsICdkYW5nZXInKTtcclxuICAgIH1lbHNlIGlmKCQoXCIubmV3LXVzZXItcGFzc3dvcmRcIikudmFsKCkgPT0gXCJcIil7XHJcbiAgICAgIHNob3dGbGFzaE1lc3NhZ2UoJ1UgaGVlZnQgbm9nIGdlZW4gcGFzc3dvb3JkIGluZ2V2dWxkJywgJ2RhbmdlcicpO1xyXG4gICAgfWVsc2UgaWYoJChcIi5uZXctdXNlci1sZXZlbFwiKS52YWwoKSA9PSBudWxsKXtcclxuICAgICAgc2hvd0ZsYXNoTWVzc2FnZSgnVSBoZWVmdCBub2cgZ2VlbiBsZXZlbCBnZXNlbGVjdGVlcmQnLCAnZGFuZ2VyJyk7XHJcbiAgICB9XHJcbiAgfWVsc2V7XHJcbiAgICBjb25zb2xlLmxvZygkKFwiLm5ldy11c2VyLWxldmVsXCIpLnZhbCgpKVxyXG4gICAgJC5wb3N0KFwiaW5jbHVkZS9hZGRVc2VyLnBocFwiLHtcclxuICAgICAgdXNlcm5hbWU6ICQoXCIubmV3LXVzZXItbmFtZVwiKS52YWwoKSxcclxuICAgICAgdXNlcnBhc3N3b3JkOiAkKFwiLm5ldy11c2VyLXBhc3N3b3JkXCIpLnZhbCgpLFxyXG4gICAgICB1c2VybGV2ZWw6ICQoXCIubmV3LXVzZXItbGV2ZWxcIikudmFsKClcclxuICAgIH0sIGZ1bmN0aW9uKHJlc3BvbnNlLHN0YXR1cyl7XHJcbiAgICAgIGNvbnNvbGUubG9nKHJlc3BvbnNlKVxyXG4gICAgICBpZihyZXNwb25zZSA9PSBcInN1Y2Nlc3NcIil7XHJcbiAgICAgICAgc2hvd0ZsYXNoTWVzc2FnZSgnRXIgaXMgZWVuIG5pZXV3ZSBnZWJydWlrZXIgYWFuZ2VtYWFrdCcsICdzdWNjZXNzJyk7XHJcbiAgICAgICAgJChcIi5uZXctdXNlci1uYW1lXCIpLnZhbChcIlwiKTtcclxuICAgICAgICAkKFwiLm5ldy11c2VyLXBhc3N3b3JkXCIpLnZhbChcIlwiKTtcclxuICAgICAgICAkKFwiLm5ldy11c2VyLW9wdGlvbnNcIikucmVtb3ZlQXR0cihcInNlbGVjdGVkXCIpO1xyXG4gICAgICAgICQoXCIubmV3LXVzZXItb3B0aW9uMVwiKS5hdHRyKFwic2VsZWN0ZWRcIixcInNlbGVjdGVkXCIpO1xyXG4gICAgICB9XHJcbiAgICB9KVxyXG4gIH1cclxufSlcclxuIiwiJChcImJvZHlcIikub24oXCJjbGlja1wiLCBcIi5vcHRpb25zXCIsIGZ1bmN0aW9uKCl7XHJcbiAgdmFyIGxldmVsID0gJCh0aGlzKS5hdHRyKFwiY2xhc3NcIikuc3BsaXQoXCIgXCIpWzFdLnNwbGl0KFwiX1wiKVsxXTtcclxuICB2YXIgb3B0aW9uID0gJCh0aGlzKS5hdHRyKFwiY2xhc3NcIikuc3BsaXQoXCIgXCIpWzJdLnNwbGl0KFwiX1wiKVsxXTtcclxuICBjb25zb2xlLmxvZyhsZXZlbClcclxuXHJcbiAgJChcIi52aWV3XCIpLmFkZENsYXNzKFwiaGlkZGVuXCIpXHJcbiAgJChcIi52aWV3X1wiK2xldmVsK1wiLVwiK29wdGlvbikucmVtb3ZlQ2xhc3MoXCJoaWRkZW5cIilcclxuICAkKCcub3B0aW9ucycpLnJlbW92ZUNsYXNzKCdvcHRpb25zLS1hY3RpdmUnKTtcclxuICAkKHRoaXMpLmFkZENsYXNzKCdvcHRpb25zLS1hY3RpdmUnKTtcclxuICBzd2l0Y2ggKGxldmVsKSB7XHJcbiAgICBjYXNlIFwiMVwiOlxyXG4gICAgICB1cGRhdGVMZXZlbDFUZW1wbGF0ZXMoKTtcclxuICAgICAgYnJlYWs7XHJcbiAgICBjYXNlIFwiMlwiOlxyXG4gICAgICB1cGRhdGVMZXZlbDJUZW1wbGF0ZXMoKTtcclxuICAgICAgYnJlYWs7XHJcbiAgfVxyXG59KVxyXG4iLCIkKGRvY3VtZW50KS5yZWFkeShmdW5jdGlvbigpe1xyXG4gICAgJC5wb3N0KFwiaW5jbHVkZS9yZXR1cm5TZXNzaW9uLnBocFwiLHtcclxuICAgIH0sIGZ1bmN0aW9uKHJlc3BvbnNlLHN0YXR1cyl7XHJcbiAgICAgICAgdmFyIGRhdGEgPSBKU09OLnBhcnNlKHJlc3BvbnNlKTtcclxuICAgICAgICBpZiAoZGF0YS5sb2dnZWRJbikge1xyXG4gICAgICAgICAgICBsb2dnZWRJblVzZXIgPSBkYXRhO1xyXG4gICAgICAgICAgICBsb2dpbihkYXRhLmxldmVsKTtcclxuICAgICAgICB9XHJcbiAgICB9KVxyXG59KTtcclxuIiwiJChcIi5zZXR0aW5ncy1pbnB1dHNcIikua2V5cHJlc3MoZnVuY3Rpb24oZSkge1xyXG4gICAgY29uc29sZS5sb2coXCJlbnRlclwiKVxyXG4gICAgaWYoZS53aGljaCA9PSAxMykge1xyXG4gICAgICAgICQoJy5zZXR0aW5ncy11cGRhdGUnKS50cmlnZ2VyKCdjbGljaycpO1xyXG4gICAgfVxyXG59KTtcclxuXHJcbiQoJ2JvZHknKS5vbignY2xpY2snLCAnLnNldHRpbmdzJywgZnVuY3Rpb24oKXtcclxuICAgIGNvbnNvbGUubG9nKFwic2V0dGluZ3NcIilcclxuICAgICQoJy5zZXR0aW5ncy11c2VybmFtZScpLnZhbChsb2dnZWRJblVzZXIudXNlcm5hbWUpXHJcbiAgICAkKCcudXNlci1zZXR0aW5ncycpLm1vZGFsKCdzaG93Jyk7XHJcbiAgICBjb25zb2xlLmxvZyhsb2dnZWRJblVzZXIudXNlcm5hbWUpXHJcbn0pXHJcblxyXG4kKCdib2R5Jykub24oJ2NsaWNrJywgJy5zZXR0aW5ncy11cGRhdGUnLCBmdW5jdGlvbigpe1xyXG4gICAgY29uc29sZS5sb2coXCJ1cGRhdGVcIilcclxuICAgIGNvbnNvbGUubG9nKCQoJy5zZXR0aW5ncy11c2VybmFtZScpLnZhbCgpKVxyXG4gICAgY29uc29sZS5sb2coJCgnLnNldHRpbmdzLXBhc3N3b3JkJykudmFsKCkpXHJcbiAgICBjb25zb2xlLmxvZygkKCcuc2V0dGluZ3MtcmVwZWF0LXBhc3N3b3JkJykudmFsKCkpXHJcblxyXG4gICAgaWYoJCgnLnNldHRpbmdzLXVzZXJuYW1lJykudmFsKCkgPT0gXCJcIiAmJiAkKCcuc2V0dGluZ3MtcGFzc3dvcmQnKS52YWwoKSA9PSBcIlwiICYmICQoJy5zZXR0aW5ncy1yZXBlYXQtcGFzc3dvcmQnKS52YWwoKSA9PSBcIlwiKXtcclxuICAgICAgICBjb25zb2xlLmxvZyhcImdlYnJ1aWtlcnNuYWFtIGVuIHdhY2h0d29vcmQgbW9nZW4gbmlldCBsZWVnIHppam5cIik7XHJcbiAgICB9ZWxzZXtcclxuICAgICAgICBpZigkKCcuc2V0dGluZ3MtcGFzc3dvcmQnKS52YWwoKSAhPSAkKCcuc2V0dGluZ3MtcmVwZWF0LXBhc3N3b3JkJykudmFsKCkpe1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIndhY2h0d29vcmRlbiB6aWpuIG5pZXQgZ2VsaWprIGFhbiBlbGthYXJcIilcclxuICAgICAgICB9ZWxzZXtcclxuICAgICAgICAgICAgY29uc29sZS5sb2cobG9nZ2VkSW5Vc2VyKVxyXG4gICAgICAgICAgICAkLnBvc3QoXCJpbmNsdWRlL3VwZGF0ZVVzZXIucGhwXCIgLHtcclxuICAgICAgICAgICAgICAgIGlkOiBsb2dnZWRJblVzZXIudXNlcklELFxyXG4gICAgICAgICAgICAgICAgbmFtZTogJCgnLnNldHRpbmdzLXVzZXJuYW1lJykudmFsKCksXHJcbiAgICAgICAgICAgICAgICBwYXNzOiAkKCcuc2V0dGluZ3MtcGFzc3dvcmQnKS52YWwoKVxyXG4gICAgICAgICAgICB9LCBmdW5jdGlvbihyZXNwb25zZSxzdGF0dXMpe1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2cocmVzcG9uc2UpO1xyXG4gICAgICAgICAgICAgICAgaWYocmVzcG9uc2UgPT0gXCJzdWNjZXNcIil7XHJcbiAgICAgICAgICAgICAgICAgICAgJCgnLnVzZXItc2V0dGluZ3MnKS5tb2RhbCgnaGlkZScpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn0pO1xyXG4iXX0=
