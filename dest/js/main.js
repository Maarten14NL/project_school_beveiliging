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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFkZFNjZW5hcmlvLmpzIiwiY2hlY2tBbGVydC5qcyIsImNsb3NlLWNvbmZpcm0uanMiLCJkZWxldGUtc2NlbmFyaW8uanMiLCJkZWxldGUtdXNlci5qcyIsImVkaXQtc2NlbmFyaW8uanMiLCJlZGl0LXVzZXIuanMiLCJmbGFzaC1tZXNzYWdlLmpzIiwiZnVuY3Rpb25zLmpzIiwiaG9tZS5qcyIsIm1ha2VBY3RpdmVTY2VuYXJpby5qcyIsIm5ldy11c2VyLmpzIiwib3B0aW9ucy5qcyIsInNlc3Npb25DaGVjay5qcyIsInNldHRpbmdzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN6Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ1BBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNuQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN4QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDOURBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3hEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzNCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUM3S0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzFEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN0Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMzQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNsQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ1ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZXNDb250ZW50IjpbIiQoJ2JvZHknKS5vbigncHJvcGVydHljaGFuZ2UgaW5wdXQnLCAnLmpzLW5ld3N0ZXAnLGZ1bmN0aW9uKGUpe1xyXG4gICAgdmFyIHBhcmVudCA9ICQodGhpcykuY2xvc2VzdCgnLmpzLXN0ZXAnKVxyXG4gICAgaWYgKCQocGFyZW50KS5pcygnOmxhc3QtY2hpbGQnKSkge1xyXG4gICAgICAgIHZhciBucnN0ciA9ICQoJy5qcy1sYXN0bnInKS5odG1sKCk7XHJcbiAgICAgICAgdmFyIG5ld25yID0gcGFyc2VJbnQobnJzdHIpICsgMTtcclxuICAgICAgICAkKCcuanMtbGFzdG5yJykucmVtb3ZlQ2xhc3MoJ2pzLWxhc3RucicpO1xyXG4gICAgICAgICQoJy5qcy1jb3B5c3RlcCcpLmNsb25lKCkuYXBwZW5kVG8oJy5qcy1zdGVwcy1jb250YWluZXInKVxyXG4gICAgICAgIC5yZW1vdmVDbGFzcygnanMtY29weXN0ZXAnKS5yZW1vdmVDbGFzcygnaGlkZGVuJykuYWRkQ2xhc3MoJ2pzLXN0ZXAnKVxyXG4gICAgICAgIC5maW5kKCcuanMtbmV3bnInKS5yZW1vdmVDbGFzcygnanMtbmV3bnInKS5hZGRDbGFzcygnanMtbGFzdG5yJykuaHRtbChuZXducik7XHJcbiAgICAgICAgdXBkYXRlU3RlcHMoKTtcclxuICAgIH1cclxufSk7XHJcbmZ1bmN0aW9uIHVwZGF0ZVN0ZXBzKCl7XHJcbiAgICB2YXIgY291bnQgPSAxO1xyXG4gICAgJCgnLmpzLXN0ZXBucicpLmVhY2goZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICQodGhpcykuaHRtbChjb3VudCk7XHJcbiAgICAgICAgY291bnQrKztcclxuICAgIH0pO1xyXG59XHJcbiQoJ2JvZHknKS5vbignY2xpY2snLCAnLmpzLWFkZHN0ZXAnLGZ1bmN0aW9uKCl7XHJcbiAgICB2YXIgbnJzdHIgPSAkKCcuanMtbGFzdG5yJykuaHRtbCgpO1xyXG4gICAgdmFyIG5ld25yID0gcGFyc2VJbnQobnJzdHIpICsgMTtcclxuICAgICQoJy5qcy1sYXN0bnInKS5yZW1vdmVDbGFzcygnanMtbGFzdG5yJyk7XHJcbiAgICAkKCcuanMtY29weXN0ZXAnKS5jbG9uZSgpLmFwcGVuZFRvKCcuanMtc3RlcHMtY29udGFpbmVyJylcclxuICAgIC5yZW1vdmVDbGFzcygnanMtY29weXN0ZXAnKS5yZW1vdmVDbGFzcygnaGlkZGVuJykuYWRkQ2xhc3MoJ2pzLXN0ZXAnKVxyXG4gICAgLmZpbmQoJy5qcy1uZXducicpLnJlbW92ZUNsYXNzKCdqcy1uZXducicpLmFkZENsYXNzKCdqcy1sYXN0bnInKS5odG1sKG5ld25yKTtcclxuICAgIHVwZGF0ZVN0ZXBzKCk7XHJcbn0pO1xyXG4kKCdib2R5Jykub24oJ2NsaWNrJywgJy5qcy1zYXZlLW5ldy1zY2VuYXJpbycsZnVuY3Rpb24oKXtcclxuICAgIHZhciBuYW1lID0gJCgnLmpzLW5ldy1zY2VuYXJpby1uYW1lJykudmFsKCk7XHJcbiAgICB2YXIgc3RlcHMgPSBbXTtcclxuICAgIGlmIChuYW1lID09ICcnKSB7XHJcbiAgICAgICAgc2hvd0ZsYXNoTWVzc2FnZSgnVnVsIGVlcnN0IGVlbiBuYWFtIGluJywgJ2RhbmdlcicpO1xyXG4gICAgfVxyXG4gICAgZWxzZXtcclxuICAgICAgICAkKCcuanMtbmV3c3RlcCcpLmVhY2goZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICB2YXIgdGVtcHZhbCA9ICQodGhpcykudmFsKCk7XHJcbiAgICAgICAgICAgIGlmICh0ZW1wdmFsICE9IFwiXCIpIHtcclxuICAgICAgICAgICAgICAgIHN0ZXBzLnB1c2godGVtcHZhbCk7XHJcblxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgaWYgKHN0ZXBzLmxlbmd0aCA9PSAwKSB7XHJcbiAgICAgICAgICAgIHNob3dGbGFzaE1lc3NhZ2UoJ1Z1bCBtaW5zdGVucyAxIHN0YXAgaW4nLCAnZGFuZ2VyJyk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2V7XHJcbiAgICAgICAgICAgICQucG9zdChcImluY2x1ZGUvc2F2ZU5ld1NjZW5hcmlvLnBocFwiICx7XHJcbiAgICAgICAgICAgICAgICBuYW1lOiBuYW1lLFxyXG4gICAgICAgICAgICAgICAgc3RlcHM6IHN0ZXBzXHJcbiAgICAgICAgICAgIH0sIGZ1bmN0aW9uKHJlc3BvbnNlLHN0YXR1cyl7XHJcbiAgICAgICAgICAgICAgICBpZihyZXNwb25zZSA9PSBcInN1Y2Nlc1wiKXtcclxuICAgICAgICAgICAgICAgICAgICBzaG93Rmxhc2hNZXNzYWdlKCdTY2VuYXJpbyBzdWNjZXN2b2wgdG9lZ2V2b2VnZCcsICdzdWNjZXNzJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgJCgnLmpzLXN0ZXBzLWNvbnRhaW5lcicpLmh0bWwoJycpO1xyXG4gICAgICAgICAgICAgICAgICAgICQoJy5qcy1uZXctc2NlbmFyaW8tbmFtZScpLnZhbCgnJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgJCgnLmpzLWNvcHlzdGVwJykuY2xvbmUoKS5hcHBlbmRUbygnLmpzLXN0ZXBzLWNvbnRhaW5lcicpXHJcbiAgICAgICAgICAgICAgICAgICAgLnJlbW92ZUNsYXNzKCdqcy1jb3B5c3RlcCcpLnJlbW92ZUNsYXNzKCdoaWRkZW4nKVxyXG4gICAgICAgICAgICAgICAgICAgIC5hZGRDbGFzcygnanMtc3RlcCcpLmFkZENsYXNzKCdVbmlxdWV0ZW1wJylcclxuICAgICAgICAgICAgICAgICAgICAuZmluZCgnLmpzLW5ld25yJykucmVtb3ZlQ2xhc3MoJ2pzLW5ld25yJykuYWRkQ2xhc3MoJ2pzLWxhc3RucicpLmh0bWwoJzEnKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSlcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn0pO1xyXG5cclxuJCgnYm9keScpLm9uKCdjbGljaycsICcuanMtZGVsZXRlLXN0ZXAnLGZ1bmN0aW9uKCl7XHJcbiAgICB2YXIgcGFyZW50ID0gJCh0aGlzKS5jbG9zZXN0KCcuanMtc3RlcCcpO1xyXG4gICAgaWYgKCEkKHBhcmVudCkuaXMoJzpmaXJzdC1jaGlsZCcpKSB7XHJcbiAgICAgICAgJChwYXJlbnQpLnJlbW92ZSgpO1xyXG4gICAgICAgIHVwZGF0ZVN0ZXBzKCk7XHJcbiAgICB9XHJcbiAgICBlbHNlIHtcclxuICAgICAgICBzaG93Rmxhc2hNZXNzYWdlKCdKZSBrdW50IG5pZXQgZGUgZWVyc3RlIHN0YXAgdmVyd2lqZGVyZW4nLCAnZGFuZ2VyJyk7XHJcbiAgICB9XHJcbn0pO1xyXG4iLCJmdW5jdGlvbiBjaGVja0FsZXJ0KCkge1xyXG4gICAgaWYobG9nZ2VkSW5Vc2VyLmxldmVsID09IDMgJiYgIWFsZXJ0QWN0aXZlICYmIGxvZ2dlZEluID09IHRydWUpe1xyXG4gICAgICAgICQucG9zdChcImluY2x1ZGUvZ2V0U2NlbmFyaW9zQWN0aXZlLnBocFwiICx7XHJcbiAgICAgICAgfSwgZnVuY3Rpb24ocmVzcG9uc2Usc3RhdHVzKXtcclxuICAgICAgICAgICAgcmVzcG9uc2UgPSBKU09OLnBhcnNlKHJlc3BvbnNlKTtcclxuICAgICAgICAgICAgaWYocmVzcG9uc2UubGVuZ3RoID4gMCl7XHJcbiAgICAgICAgICAgICAgICAkKCcuc2NlbmFyaW8nKS5tb2RhbCgnc2hvdycpO1xyXG4gICAgICAgICAgICAgICAgJCgnLnNjZW5hcmlvLm1vZGFsJykuZmluZCgnLm1vZGFsLXRpdGxlJykuaHRtbChyZXNwb25zZVswXS5uYW1lICsgJyBpbiBsb2thYWw6ICcgKyByZXNwb25zZVswXS5sb2NhdGlvbik7XHJcbiAgICAgICAgICAgICAgICBhbGVydEFjdGl2ZSA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAkKCcuc2NlbmFyaW8ubW9kYWwnKS5maW5kKCcuanMtY2xvc2Utc2NlbmFyaW8tbW9kYWwnKS5hdHRyKCdkYXRhLWFjdGl2ZWlkJywgcmVzcG9uc2VbMF0uYWN0aXZlX2lkKTtcclxuICAgICAgICAgICAgICAgIGlmICghcmVzcG9uc2VbMF0udG9vbHMgKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgJCgnLnNjZW5hcmlvLm1vZGFsJykuZmluZCgnLm1vZGFsLWJvZHknKS5odG1sKCdEZSBkb2NlbnQgaGVlZnQgdG9lZ2FuZyB0b3QgZGV6ZSBodWxwbWlkZGVsZW4gdWl0Z2VzY2hha2VsZCcpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIHN0ZXBzID0gcmVzcG9uc2VbMF0uc3RlcHM7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coc3RlcHMpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSlcclxuICAgIH1cclxuICAgIHNldFRpbWVvdXQoY2hlY2tBbGVydCwgMTAwMCk7XHJcbn1cclxuc2V0VGltZW91dChjaGVja0FsZXJ0LCAxMDAwKTtcclxuJCgnYm9keScpLm9uKCdjbGljaycsICcuanMtY2xvc2Utc2NlbmFyaW8tbW9kYWwnLCBmdW5jdGlvbigpe1xyXG4gICAgdmFyIGFjdGl2ZWlkID0gJCh0aGlzKS5hdHRyKCdkYXRhLWFjdGl2ZWlkJyk7XHJcbiAgICBjb25zb2xlLmxvZyhhY3RpdmVpZCk7XHJcbiAgICAkLnBvc3QoXCJpbmNsdWRlL2ZpbmlzaEFjdGl2ZVNjZW5hcmlvXCIse1xyXG4gICAgICAgIGFjdGl2ZWlkIDogYWN0aXZlaWRcclxuICAgICAgICB9LCBmdW5jdGlvbihyZXNwb25zZSxzdGF0dXMpe1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhyZXNwb25zZSk7XHJcbiAgICAgICAgICAgIGlmIChyZXNwb25zZSA9PSAnc3VjY2VzcycpIHtcclxuXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxufSk7XHJcbiQoJy5zY2VuYXJpbycpLm9uKCdoaWRkZW4uYnMubW9kYWwnLCBmdW5jdGlvbiAoKSB7XHJcbiAgICBjb25zb2xlLmxvZyhcImNsb3NlXCIpXHJcbiAgICBpZihsb2dnZWRJblVzZXIubGV2ZWwgPT0gMyAmJiBsb2dnZWRJbiA9PSB0cnVlKXtcclxuICAgICAgICBhbGVydEFjdGl2ZSA9IGZhbHNlO1xyXG4gICAgfVxyXG59KVxyXG4iLCIkKFwiYm9keVwiKS5vbignY2xpY2snLCcuY2xvc2UtY29uZmlybScsZnVuY3Rpb24oKXtcclxuICAkKCcuanMtY29uZmlybScpLm1vZGFsKFwiaGlkZVwiKVxyXG59KVxyXG5cclxuJChcImJvZHlcIikub24oJ2NsaWNrJywnLmNvbmZpcm0tc2F2ZS1jaGFuZ2UnLGZ1bmN0aW9uKCl7XHJcbiAgJCgnLmpzLWNvbmZpcm0nKS5tb2RhbChcImhpZGVcIilcclxufSlcclxuIiwiJCgnYm9keScpLm9uKCdjbGljaycsICcubGV2ZWwyLWJ0bi1kZWxldGUnLGZ1bmN0aW9uKCl7XHJcbiAgdmFyIHJvd0NsYXNzID0gJCh0aGlzKS5wYXJlbnQoKS5wYXJlbnQoKS5hdHRyKFwiY2xhc3NcIik7XHJcbiAgdmFyIHJvdyA9ICQodGhpcykucGFyZW50KCkucGFyZW50KCkuYXR0cihcImNsYXNzXCIpLnNwbGl0KFwiaW5kZXhcIilbMV07XHJcbiAgZm9yKHZhciBpID0gMDsgaSA8IHNjZW5hcmlvcy5sZW5ndGg7IGkrKyl7XHJcbiAgICBpZihzY2VuYXJpb3NbaV0uaWQgPT0gcm93KXtcclxuICAgICAgJC5wb3N0KFwiaW5jbHVkZS9kZWxldGVTY2VuYXJpb3MucGhwXCIgLHtcclxuICAgICAgICBpZDogc2NlbmFyaW9zW2ldLmlkXHJcbiAgICAgIH0sIGZ1bmN0aW9uKHJlc3BvbnNlLHN0YXR1cyl7XHJcbiAgICAgICAgY29uc29sZS5sb2cocmVzcG9uc2UpXHJcbiAgICAgICAgaWYocmVzcG9uc2UgPT0gXCJzdWNjZXNzdWNjZXNzdWNjZXNcIil7XHJcbiAgICAgICAgICBjb25zb2xlLmxvZyhyb3dDbGFzcylcclxuICAgICAgICAgIHNjZW5hcmlvcy5zcGxpY2UoaSwxKVxyXG4gICAgICAgICAgJChcIi5cIityb3dDbGFzcykucmVtb3ZlKCk7XHJcbiAgICAgICAgICB1cGRhdGVMZXZlbDJUZW1wbGF0ZXMoKTtcclxuICAgICAgICB9XHJcbiAgICAgIH0pXHJcbiAgICB9XHJcbiAgfVxyXG59KVxyXG4iLCJ2YXIgcm93Q2xhc3MgPSBcIlwiO1xyXG52YXIgcm93ID0gXCJcIjtcclxuJCgnYm9keScpLm9uKCdjbGljaycsICcubGV2ZWwxLWJ0bi1kZWxldGUnLGZ1bmN0aW9uKCl7XHJcbiAgY29uZmlybU1vZGFsKFwiR2VicnVpa2VyIFZlcndpamRlcmVuXCIsXCJXZWV0IHUgemVrZXIgZGF0IHUgZGV6ZSBnZWJydWlrZXIgd2lsdCB2ZXJ3aWpkZXJlblwiLFwiY29uZmlybS11c2VyLWRlbGV0ZVwiKTtcclxuICByb3dDbGFzcyA9ICQodGhpcykucGFyZW50KCkucGFyZW50KCkuYXR0cihcImNsYXNzXCIpO1xyXG4gIHJvdyA9ICQodGhpcykucGFyZW50KCkucGFyZW50KCkuYXR0cihcImNsYXNzXCIpLnNwbGl0KFwiaW5kZXhcIilbMV07XHJcbiAgY29uc29sZS5sb2codXNlcnMpXHJcbn0pXHJcblxyXG4kKFwiYm9keVwiKS5vbignY2xpY2snLCcuY29uZmlybS11c2VyLWRlbGV0ZScsZnVuY3Rpb24oKXtcclxuICBjb25zb2xlLmxvZyhcInVzZXItZGVsZXRlXCIpXHJcbiAgZm9yKHZhciBpID0gMDsgaSA8IHVzZXJzLmxlbmd0aDsgaSsrKXtcclxuICAgIGlmKHVzZXJzW2ldLmlkID09IHJvdyl7XHJcbiAgICAgICQucG9zdChcImluY2x1ZGUvZGVsZXRlVXNlci5waHBcIiAse1xyXG4gICAgICAgIGlkOiB1c2Vyc1tpXS5pZFxyXG4gICAgICB9LCBmdW5jdGlvbihyZXNwb25zZSxzdGF0dXMpe1xyXG4gICAgICAgIGlmKHJlc3BvbnNlID09IFwic3VjY2VzXCIpe1xyXG4gICAgICAgICAgc2hvd0ZsYXNoTWVzc2FnZSgnVSBoZWVmdCBkZSBnZWJydWlrZXIgc3VjY2Vzdm9sIHZlcndpamRlcmQnLCAnc3VjY2VzcycpO1xyXG4gICAgICAgICAgJChcIi5cIityb3dDbGFzcykucmVtb3ZlKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9KVxyXG4gICAgfVxyXG4gIH1cclxufSlcclxuIiwidmFyIHJvd1NlbGVjdGVkID0gMDtcclxudmFyIGluZGV4ID0gMDtcclxudmFyIGRlc2NyaXB0aW9ucyA9IFtdO1xyXG4kKCdib2R5Jykub24oJ2NsaWNrJywgJy5sZXZlbDItYnRuLWVkaXQnLCBmdW5jdGlvbigpe1xyXG4gIHJvd1NlbGVjdGVkID0gJCh0aGlzKS5wYXJlbnQoKS5wYXJlbnQoKS5hdHRyKFwiY2xhc3NcIik7XHJcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBzY2VuYXJpb3MubGVuZ3RoOyBpKyspe1xyXG4gICAgaWYoc2NlbmFyaW9zW2ldLmlkID09IHJvd1NlbGVjdGVkLnNwbGl0KFwiaW5kZXhcIilbMV0pe1xyXG4gICAgICBpbmRleCA9IGlcclxuICAgIH1cclxuICB9XHJcblxyXG4gICQucG9zdChcImluY2x1ZGUvZ2V0U2NlbmVyaW9EZXNjLnBocFwiICx7XHJcbiAgICBpZDogc2NlbmFyaW9zW2luZGV4XS5pZFxyXG4gIH0sIGZ1bmN0aW9uKHJlc3BvbnNlLHN0YXR1cyl7XHJcbiAgICBkZXNjcmlwdGlvbnMgPSBKU09OLnBhcnNlKHJlc3BvbnNlKVxyXG5cclxuICAgIGRlc2NyaXB0aW9ucy5tYXAoZnVuY3Rpb24oY3AsaSl7XHJcbiAgICAgIGNwLmluZGV4ID0gaSsxO1xyXG4gICAgfSlcclxuICAgIGNvbnNvbGUubG9nKGRlc2NyaXB0aW9ucylcclxuXHJcbiAgICB2YXIgdGVtcGxhdGUgPSAkKFwiLmxldmVsMi1zY2VuYXJpby1lZGl0LXRlbXBsYXRlXCIpLmh0bWwoKTtcclxuICAgIHZhciByZW5kZXJUZW1wbGF0ZSA9IE11c3RhY2hlLnJlbmRlcih0ZW1wbGF0ZSwgZGVzY3JpcHRpb25zKTtcclxuXHJcbiAgICAkKFwiLnNjZW5hcmlvLWVkaXQtb3B0aW9ucy1jb250YWluZXJcIikuaHRtbChyZW5kZXJUZW1wbGF0ZSk7XHJcblxyXG4gICAgJCgnLnNjZW5hcmlvLWVkaXQnKS5tb2RhbCgnc2hvdycpO1xyXG4gICAgJCgnLnVwZGF0ZS1zY2VuYXJpb3MtbmFtZScpLnZhbChzY2VuYXJpb3NbaW5kZXhdLm5hbWUpXHJcbiAgfSlcclxufSlcclxuXHJcbiQoJ2JvZHknKS5vbignY2xpY2snLCAnLnVwZGF0ZS1zY2VuYXJpb3MtdXBkYXRlJywgZnVuY3Rpb24oKXtcclxuICBkZXNjcmlwdGlvbk5hbWVzID0gW107XHJcbiAgY29uc29sZS5sb2coc2NlbmFyaW9zW2luZGV4XSlcclxuICBmb3IodmFyIGkgPSAxIDsgaSA8IChkZXNjcmlwdGlvbnMubGVuZ3RoKzEpOyBpKyspe1xyXG4gICAgaWYoJCgnLmpzLXNjZW5hcmlvLWVkaXQtJytpKS52YWwoKSAhPSBcIlwiKXtcclxuICAgICAgZGVzY3JpcHRpb25OYW1lcy5wdXNoKCQoJy5qcy1zY2VuYXJpby1lZGl0LScraSkudmFsKCkpXHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBjb25zb2xlLmxvZyhkZXNjcmlwdGlvbk5hbWVzKVxyXG5cclxuICAkLnBvc3QoXCJpbmNsdWRlL3VwZGF0ZVNjZW5hcmlvLnBocFwiICx7XHJcbiAgICBzY2VuYXJpb0lEOiBzY2VuYXJpb3NbaW5kZXhdLmlkLFxyXG4gICAgbmFtZTogJCgnLnVwZGF0ZS1zY2VuYXJpb3MtbmFtZScpLnZhbCgpLFxyXG4gICAgZGVzY3JpcHRpb25zOiBkZXNjcmlwdGlvbnNcclxuICB9LCBmdW5jdGlvbihyZXNwb25zZSxzdGF0dXMpe1xyXG4gICAgY29uc29sZS5sb2cocmVzcG9uc2UpXHJcbiAgICAkKCcuc2NlbmFyaW8tZWRpdCcpLm1vZGFsKCdoaWRlJyk7XHJcbiAgfSlcclxufSlcclxuXHJcbiQoJ2JvZHknKS5vbignY2xpY2snLCAnLmpzLXNjZW5hcmlvLWVkaXQtZGVsZXRlJyxmdW5jdGlvbigpe1xyXG4gICAgdmFyIHBhcmVudCA9ICQodGhpcykuY2xvc2VzdCgnLmpzLXNjZW5hcmlvLWVkaXQtc3RlcCcpO1xyXG4gICAgaWYgKCEkKHBhcmVudCkuaXMoJzpmaXJzdC1jaGlsZCcpKSB7XHJcbiAgICAgICAgJChwYXJlbnQpLnJlbW92ZSgpO1xyXG4gICAgICAgIHVwZGF0ZVN0ZXBzKCk7XHJcbiAgICB9XHJcbiAgICBlbHNlIHtcclxuICAgICAgICBzaG93Rmxhc2hNZXNzYWdlKCdKZSBrdW50IG5pZXQgZGUgZWVyc3RlIHN0YXAgdmVyd2lqZGVyZW4nLCAnZGFuZ2VyJyk7XHJcbiAgICB9XHJcbn0pO1xyXG4iLCJ2YXIgcm93U2VsZWN0ZWQgPSAwO1xyXG52YXIgaW5kZXggPSAwO1xyXG4kKCdib2R5Jykub24oJ2NsaWNrJywgJy5sZXZlbDEtYnRuLWVkaXQnLCBmdW5jdGlvbigpe1xyXG4gIHJvd1NlbGVjdGVkID0gJCh0aGlzKS5wYXJlbnQoKS5wYXJlbnQoKS5hdHRyKFwiY2xhc3NcIik7XHJcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCB1c2Vycy5sZW5ndGg7IGkrKyl7XHJcbiAgICBpZih1c2Vyc1tpXS5pZCA9PSByb3dTZWxlY3RlZC5zcGxpdChcImluZGV4XCIpWzFdKXtcclxuICAgICAgaW5kZXggPSBpXHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICAkKCcudXBkYXRlLXVzZXJzJykubW9kYWwoJ3Nob3cnKTtcclxuICAkKCcudXBkYXRlLXVzZXJzLXVzZXJuYW1lJykudmFsKHVzZXJzW2luZGV4XS51c2VybmFtZSlcclxuICAkKCcudXBkYXRlLXVzZXItb3B0aW9ucycpLnJlbW92ZUF0dHIoXCJzZWxlY3RlZFwiKVxyXG5cclxuICBpZih1c2Vyc1tpbmRleF0udXNlcmxldmVsID09IDIpe1xyXG4gICAgJCgnLnVwZGF0ZS11c2VyLW9wdGlvbjInKS5hdHRyKFwic2VsZWN0ZWRcIixcInNlbGVjdGVkXCIpXHJcbiAgfWVsc2V7XHJcbiAgICAkKCcudXBkYXRlLXVzZXItb3B0aW9uMScpLmF0dHIoXCJzZWxlY3RlZFwiLFwic2VsZWN0ZWRcIilcclxuICB9XHJcbn0pXHJcblxyXG4kKCdib2R5Jykub24oJ2NsaWNrJywgJy51cGRhdGUtdXNlcnMtdXBkYXRlJywgZnVuY3Rpb24oKXtcclxuICAvLyBjb25zb2xlLmxvZyhcInVwZGF0ZVwiKVxyXG4gIC8vIGNvbnNvbGUubG9nKCQoJy51cGRhdGUtdXNlcnMtdXNlcm5hbWUnKS52YWwoKSlcclxuICAvLyBjb25zb2xlLmxvZygkKCcudXBkYXRlLXVzZXJzLXBhc3N3b3JkJykudmFsKCkpXHJcbiAgLy8gY29uc29sZS5sb2coJCgnLnVwZGF0ZS11c2Vycy1yZXBlYXQtcGFzc3dvcmQnKS52YWwoKSlcclxuXHJcbiAgaWYoJCgnLnVwZGF0ZS11c2Vycy11c2VybmFtZScpLnZhbCgpID09IFwiXCIgJiYgJCgnLnVwZGF0ZS11c2Vycy1wYXNzd29yZCcpLnZhbCgpID09IFwiXCIgJiYgJCgnLnVwZGF0ZS11c2Vycy1yZXBlYXQtcGFzc3dvcmQnKS52YWwoKSA9PSBcIlwiKXtcclxuICAgIGNvbnNvbGUubG9nKFwiZ2VicnVpa2Vyc25hYW0gZW4gd2FjaHR3b29yZCBtb2dlbiBuaWV0IGxlZWcgemlqblwiKTtcclxuICAgIHNob3dGbGFzaE1lc3NhZ2UoJ0dlYnJ1aWtlcnMgbmFhbSBtYWcgbmlldCBsZWVnIHppam4nLCAnZGFuZ2VyJyk7XHJcbiAgfWVsc2V7XHJcbiAgICBpZigkKCcudXBkYXRlLXVzZXJzLXVzZXJuYW1lJykudmFsKCkgPT0gXCJcIil7XHJcbiAgICAgIHNob3dGbGFzaE1lc3NhZ2UoJ1V3IGdlYnJ1aWtlcnNuYWFtIG1hZyBuaWV0IGxlZWcgemlqbicsICdkYW5nZXInKTtcclxuICAgIH1lbHNlIGlmKCQoJy51cGRhdGUtdXNlcnMtcGFzc3dvcmQnKS52YWwoKSAhPSAkKCcudXBkYXRlLXVzZXJzLXJlcGVhdC1wYXNzd29yZCcpLnZhbCgpKXtcclxuICAgICAgc2hvd0ZsYXNoTWVzc2FnZSgnVXcgd2FjaHR3b29yZGVuIHppam4gbmlldCBnZWxpamsgYWFuIGVsa2FhcicsICdkYW5nZXInKTtcclxuICAgIH1lbHNle1xyXG4gICAgICAvLyBjb25zb2xlLmxvZyh1c2Vyc1tyb3dTZWxlY3RlZC5zcGxpdChcImluZGV4XCIpWzFdXSlcclxuICAgICAgJC5wb3N0KFwiaW5jbHVkZS91cGRhdGVVc2VyLnBocFwiICx7XHJcbiAgICAgICAgaWQ6IHVzZXJzW2luZGV4XS5pZCxcclxuICAgICAgICBuYW1lOiAkKCcudXBkYXRlLXVzZXJzLXVzZXJuYW1lJykudmFsKCksXHJcbiAgICAgICAgcGFzczogJCgnLnVwZGF0ZS11c2Vycy1wYXNzd29yZCcpLnZhbCgpLFxyXG4gICAgICAgIGxldmVsOiAkKCcudXBkYXRlLXVzZXItbGV2ZWwnKS52YWwoKVxyXG4gICAgICB9LCBmdW5jdGlvbihyZXNwb25zZSxzdGF0dXMpe1xyXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKHJlc3BvbnNlKVxyXG4gICAgICAgIGlmKHJlc3BvbnNlID09IFwic3VjY2VzXCIpe1xyXG4gICAgICAgICAgJCgnLnVwZGF0ZS11c2VycycpLm1vZGFsKCdoaWRlJyk7XHJcbiAgICAgICAgICB1c2Vyc1tpbmRleF0udXNlcm5hbWUgPSAkKCcudXBkYXRlLXVzZXJzLXVzZXJuYW1lJykudmFsKCk7XHJcbiAgICAgICAgICAvLyBjb25zb2xlLmxvZygkKFwiLlwiK3Jvd1NlbGVjdGVkKS5maW5kKFwiLnVzZXJuYW1lXCIpKVxyXG4gICAgICAgICAgLy8gJCgnLm9wdGlvbnMnKS50cmlnZ2VyKCdjbGljaycpO1xyXG4gICAgICAgICAgdXBkYXRlTGV2ZWwxVGVtcGxhdGVzKCk7XHJcbiAgICAgICAgICAvLyBvcHRpb25zXHJcbiAgICAgICAgfVxyXG4gICAgICB9KVxyXG4gICAgfVxyXG4gIH1cclxufSlcclxuIiwidmFyIGZsYXNoTWVzc2FnZXMgPSBbXTtcclxuZnVuY3Rpb24gc2hvd0ZsYXNoTWVzc2FnZShtZXMsIHR5cGUsIGRpc21pc3NhYmxlID0gZmFsc2UsIHNlY3MgPSAyMDAwKXtcclxuICAgIHZhciByYW5kU3RyID0gcmFuZG9tU3RyaW5nMigyMCk7XHJcbiAgICAkKCcuanMtZmwtY29udCcpLmFwcGVuZCgnPGRpdiBpZD1cIicgKyByYW5kU3RyICsgJ1wiIGNsYXNzPVwianMtZmxhc2ggYWxlcnQtJyArIHR5cGUgKyAnIGZsYXNoLW1lc3NhZ2VcIj4nKyBtZXMgKyAnPC9kaXY+Jyk7XHJcbiAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAkKCcjJyArIHJhbmRTdHIpLmFkZENsYXNzKCdmbGFzaC1tZXNzYWdlLS1zaG93Jyk7XHJcbiAgICB9LCAxKTtcclxuICAgIGlmICghZGlzbWlzc2FibGUpIHtcclxuICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgZGVsZXRlRmxhc2hNZXNzYWdlKHJhbmRTdHIpO1xyXG4gICAgICAgIH0sIHNlY3MpO1xyXG4gICAgfVxyXG4gICAgZWxzZXtcclxuICAgICAgICAkKCcjJyArIHJhbmRTdHIpLmFwcGVuZCgnPGJ1dHRvbiBkYXRhLWlkPVwiJyArIHJhbmRTdHIgKyAnXCIgY2xhc3M9XCJqcy1kaXNtaXNzIGJ0blwiPk9rPC9idXR0b24+Jyk7XHJcbiAgICB9XHJcbn1cclxuJCgnYm9keScpLm9uKCdjbGljaycsICcuanMtZGlzbWlzcycsIGZ1bmN0aW9uKCl7XHJcbiAgICB2YXIgZGVsc3RyID0gJCh0aGlzKS5kYXRhKCdpZCcpO1xyXG4gICAgZGVsZXRlRmxhc2hNZXNzYWdlKGRlbHN0cik7XHJcbn0pO1xyXG5cclxuZnVuY3Rpb24gZGVsZXRlRmxhc2hNZXNzYWdlKGlkKXtcclxuICAgICQoJyMnICsgaWQpLnJlbW92ZUNsYXNzKCdmbGFzaC1tZXNzYWdlLS1zaG93Jyk7XHJcbiAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAkKCcjJyArIGlkKS5yZW1vdmUoKTtcclxuICAgIH0sIDIwMCk7XHJcbn1cclxuIiwiZnVuY3Rpb24gbG9naW4oYV91c2VyTGV2ZWwpe1xyXG4gICAgJCgnLmxvZ2luLWNvbnRhaW5lcicpLmFkZENsYXNzKFwiaGlkZGVuXCIpO1xyXG4gICAgJCgnLmxvZ2luLXN0YXR1cycpLnRleHQoXCJXZWxrb206IFwiK2xvZ2dlZEluVXNlci51c2VybmFtZSArIFwiICAgIFwiKVxyXG4gICAgJCgnLmxvZ291dCcpLnJlbW92ZUNsYXNzKFwiaGlkZGVuXCIpXHJcbiAgICBsb2dnZWRJbiA9IHRydWU7XHJcbiAgICB1c2VyTGV2ZWwgPSBhX3VzZXJMZXZlbDtcclxuXHJcbiAgICAkKFwiLnVzZXItbGV2ZWxcIikuYWRkQ2xhc3MoXCJoaWRkZW5cIilcclxuICAgICQoXCIudmlld1wiKS5hZGRDbGFzcyhcImhpZGRlblwiKVxyXG5cclxuICAgIHN3aXRjaCAodXNlckxldmVsKSB7XHJcbiAgICAgICAgY2FzZSAxOlxyXG4gICAgICAgICQoXCIudXNlci1sZXZlbF8xXCIpLnJlbW92ZUNsYXNzKFwiaGlkZGVuXCIpXHJcbiAgICAgICAgJChcIi52aWV3XzEtMVwiKS5yZW1vdmVDbGFzcyhcImhpZGRlblwiKVxyXG4gICAgICAgICQoXCIub3B0aW9uXzFcIikuYWRkQ2xhc3MoXCJvcHRpb25zLS1hY3RpdmVcIilcclxuICAgICAgICAkKCcuc2V0dGluZ3MnKS5yZW1vdmVDbGFzcyhcImhpZGRlblwiKVxyXG4gICAgICAgIHVwZGF0ZUxldmVsMVRlbXBsYXRlcygpO1xyXG4gICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgMjpcclxuICAgICAgICAkKFwiLnVzZXItbGV2ZWxfMlwiKS5yZW1vdmVDbGFzcyhcImhpZGRlblwiKVxyXG4gICAgICAgICQoXCIudmlld18yLTFcIikucmVtb3ZlQ2xhc3MoXCJoaWRkZW5cIilcclxuICAgICAgICAkKFwiLm9wdGlvbl8xXCIpLmFkZENsYXNzKFwib3B0aW9ucy0tYWN0aXZlXCIpXHJcbiAgICAgICAgJCgnLnNldHRpbmdzJykucmVtb3ZlQ2xhc3MoXCJoaWRkZW5cIilcclxuICAgICAgICB1cGRhdGVMZXZlbDJUZW1wbGF0ZXMoKTtcclxuICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlIDM6XHJcbiAgICAgICAgJChcIi51c2VyLWxldmVsXzNcIikucmVtb3ZlQ2xhc3MoXCJoaWRkZW5cIilcclxuICAgICAgICBicmVhaztcclxuICAgIH1cclxufVxyXG5cclxuZnVuY3Rpb24gbG9nb3V0KCl7XHJcbiAgICAkKCcubG9naW4tY29udGFpbmVyJykucmVtb3ZlQ2xhc3MoXCJoaWRkZW5cIik7XHJcbiAgICAkKCcubG9naW4tc3RhdHVzJykudGV4dChcIlUgYmVudCBub2cgbmlldCBpbmdlbG9nZFwiKVxyXG4gICAgJCgnLmxvZ291dCcpLmFkZENsYXNzKFwiaGlkZGVuXCIpXHJcbiAgICAkKFwiLnVzZXItbGV2ZWxcIikuYWRkQ2xhc3MoXCJoaWRkZW5cIilcclxuICAgICQoJy5zZXR0aW5ncycpLmFkZENsYXNzKFwiaGlkZGVuXCIpXHJcbiAgICBsb2dnZWRJbiA9IGZhbHNlO1xyXG4gICAgdXNlckxldmVsID0gMDtcclxuICAgIC8vIGNvbnNvbGUubG9nKFwibG9nb3V0XCIpXHJcblxyXG4gICAgJC5wb3N0KFwiaW5jbHVkZS9sb2dpbi5waHBcIix7XHJcbiAgICAgICAgbG9nb3V0U3ViOiAnJ1xyXG4gICAgfSwgZnVuY3Rpb24ocmVzcG9uc2Usc3RhdHVzKXtcclxuICAgICAgICBzaG93Rmxhc2hNZXNzYWdlKCdKZSBiZW50IHVpdGdlbG9nZCcsICdzdWNjZXNzJyk7XHJcbiAgICB9KVxyXG59XHJcblxyXG5mdW5jdGlvbiB1cGRhdGVMZXZlbDFUZW1wbGF0ZXMoKXtcclxuICAgICQucG9zdChcImluY2x1ZGUvZ2V0VXNlcnMucGhwXCIse1xyXG4gICAgfSwgZnVuY3Rpb24ocmVzcG9uc2Usc3RhdHVzKXtcclxuICAgICAgICAvLyBjb25zb2xlLmxvZyhyZXNwb25zZSlcclxuICAgICAgICB1c2VycyA9IEpTT04ucGFyc2UocmVzcG9uc2UpXHJcblxyXG4gICAgICAgIGZvcih2YXIgaSA9IDA7IGkgPCAyOyBpKyspe1xyXG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhpKVxyXG4gICAgICAgICAgICB1c2Vycy5tYXAoZnVuY3Rpb24oY3Asail7XHJcbiAgICAgICAgICAgICAgICBjcC5pbmRleCA9IGNwLmlkO1xyXG4gICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coaSlcclxuICAgICAgICAgICAgICAgIGlmKGNwLnVzZXJsZXZlbCA9PSAyKXtcclxuICAgICAgICAgICAgICAgICAgICBjcC5sZXZlbCA9IFwiRG9jZW50XCJcclxuICAgICAgICAgICAgICAgIH1lbHNlIGlmKGNwLnVzZXJsZXZlbCA9PSAzKXtcclxuICAgICAgICAgICAgICAgICAgICBjcC5sZXZlbCA9IFwiU3R1ZGVudFwiXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBpZihpID09IDApe1xyXG4gICAgICAgICAgICAgICAgICAgIGNwLmNsYXNzID0gXCJlZGl0XCJcclxuICAgICAgICAgICAgICAgICAgICBjcC5jbGFzc1RleHQgPSBcImFhbnBhc3NlblwiXHJcbiAgICAgICAgICAgICAgICB9ZWxzZSBpZihpID09IDEpe1xyXG4gICAgICAgICAgICAgICAgICAgIGNwLmNsYXNzID0gXCJkZWxldGVcIlxyXG4gICAgICAgICAgICAgICAgICAgIGNwLmNsYXNzVGV4dCA9IFwidmVyd2lqZGVyZW5cIlxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KVxyXG5cclxuICAgICAgICAgICAgZm9yKHZhciBqID0gMDsgaiA8IHVzZXJzLmxlbmd0aDsgaisrKXtcclxuICAgICAgICAgICAgICAgIGlmKHVzZXJzW2pdLnVzZXJsZXZlbCA9PSAxKXtcclxuICAgICAgICAgICAgICAgICAgICB1c2Vycy5zcGxpY2UoaiwxKVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAkKFwiLm5ldy11c2VyLW5hbWVcIikudmFsKFwiXCIpO1xyXG4gICAgICAgICAgICAkKFwiLm5ldy11c2VyLXBhc3N3b3JkXCIpLnZhbChcIlwiKTtcclxuICAgICAgICAgICAgJChcIi5uZXctdXNlci1vcHRpb25zXCIpLnJlbW92ZUF0dHIoXCJzZWxlY3RlZFwiKTtcclxuICAgICAgICAgICAgJChcIi5uZXctdXNlci1vcHRpb24xXCIpLmF0dHIoXCJzZWxlY3RlZFwiLFwic2VsZWN0ZWRcIik7XHJcblxyXG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZyh1c2VycylcclxuXHJcbiAgICAgICAgICAgIHZhciB0ZW1wbGF0ZSA9ICQoXCIubGV2ZWwxLXVzZXItdGVtcGxhdGVcIikuaHRtbCgpO1xyXG4gICAgICAgICAgICB2YXIgcmVuZGVyVGVtcGxhdGUgPSBNdXN0YWNoZS5yZW5kZXIodGVtcGxhdGUsIHVzZXJzKTtcclxuXHJcbiAgICAgICAgICAgIGlmKGkgPT0gMCl7XHJcbiAgICAgICAgICAgICAgICAkKFwiLnVzZXItbGV2ZWwxLWVkaXRcIikuaHRtbChyZW5kZXJUZW1wbGF0ZSk7XHJcbiAgICAgICAgICAgIH1lbHNlIGlmKGkgPT0gMSl7XHJcbiAgICAgICAgICAgICAgICAkKFwiLnVzZXItbGV2ZWwxLWRlbGV0ZVwiKS5odG1sKHJlbmRlclRlbXBsYXRlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH0pXHJcbn1cclxuXHJcbmZ1bmN0aW9uIHVwZGF0ZUxldmVsMlRlbXBsYXRlcygpe1xyXG4gICAgJC5wb3N0KFwiaW5jbHVkZS9nZXRTY2VuYXJpb3MucGhwXCIse1xyXG4gICAgfSwgZnVuY3Rpb24ocmVzcG9uc2Usc3RhdHVzKXtcclxuICAgICAgICBzY2VuYXJpb3MgPSBKU09OLnBhcnNlKHJlc3BvbnNlKVxyXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKHNjZW5hcmlvcylcclxuXHJcbiAgICAgICAgJCgnLnNjZW5hcmlvLXNlbGVjdG9yJykuaHRtbChcIlwiKVxyXG4gICAgICAgIGZvcih2YXIgaSA9IDAgOyBpIDwgc2NlbmFyaW9zLmxlbmd0aDsgaSsrKXtcclxuICAgICAgICAgICAgJCgnLnNjZW5hcmlvLXNlbGVjdG9yJykuYXBwZW5kKCc8b3B0aW9uIGRhdGEtaWQ9XCInICsgc2NlbmFyaW9zW2ldLmlkICArICdcIj4nICsgc2NlbmFyaW9zW2ldLm5hbWUgKyBcIjwvb3B0aW9uPlwiKVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gZm9yKHZhciBpID0gMDsgaSA8IDI7IGkrKyl7XHJcblxyXG4gICAgICAgIHZhciB0ZW1wbGF0ZSA9ICQoXCIubGV2ZWwyLXNjZW5hcmlvLXRlbXBsYXRlXCIpLmh0bWwoKTtcclxuICAgICAgICB2YXIgcmVuZGVyVGVtcGxhdGUgPSBNdXN0YWNoZS5yZW5kZXIodGVtcGxhdGUsIHNjZW5hcmlvcyk7XHJcblxyXG4gICAgICAgICQoXCIuanMtc2NlbmFyaW8tY29udGFpbmVyXCIpLmh0bWwocmVuZGVyVGVtcGxhdGUpO1xyXG4gICAgICAgIC8vIH1cclxuICAgIH0pXHJcbn1cclxuXHJcbnZhciBjb25maXJtQ2xhc3NPbGQgPSBcIlwiO1xyXG52YXIgZGVsZXRlQ2xhc3NPbGQgPSBcIlwiO1xyXG5mdW5jdGlvbiBjb25maXJtTW9kYWwodGl0bGUsIGJvZHksIGNvbmZpcm1DbGFzcywgZGVsZXRlQ2xhc3Mpe1xyXG4gICAgaWYoZGVsZXRlQ2xhc3MgPT0gdW5kZWZpbmVkKXtcclxuICAgICAgICBkZWxldGVDbGFzcyA9IFwiY2xvc2UtY29uZmlybVwiXHJcbiAgICB9XHJcbiAgICBpZihjb25maXJtQ2xhc3MgIT0gXCJcIiAmJiBkZWxldGVDbGFzc09sZCAhPSBcIlwiKXtcclxuICAgICAgICAkKCcuY29uZmlybS1zYXZlLWNoYW5nZScpLnJlbW92ZUNsYXNzKGNvbmZpcm1DbGFzc09sZClcclxuICAgICAgICAkKCcuY29uZmlybS1kZWxldGUtY2hhbmdlJykucmVtb3ZlQ2xhc3MoZGVsZXRlQ2xhc3NPbGQpXHJcbiAgICB9XHJcbiAgICAkKCcuY29uZmlybS1zYXZlLWNoYW5nZScpLmFkZENsYXNzKGNvbmZpcm1DbGFzcylcclxuICAgICQoJy5jb25maXJtLWRlbGV0ZS1jaGFuZ2UnKS5hZGRDbGFzcyhkZWxldGVDbGFzcylcclxuXHJcbiAgICBjb25maXJtQ2xhc3NPbGQgPSBjb25maXJtQ2xhc3M7XHJcbiAgICBkZWxldGVDbGFzc09sZCA9IGRlbGV0ZUNsYXNzO1xyXG5cclxuICAgICQoJy5jb25maXJtLXRpdGxlJykudGV4dCh0aXRsZSlcclxuICAgICQoJy5jb25maXJtLXRleHQnKS50ZXh0KGJvZHkpXHJcblxyXG4gICAgJCgnLmpzLWNvbmZpcm0nKS5tb2RhbChcInNob3dcIilcclxuICAgIGZ1bmN0aW9uIHJhbmRvbVN0cmluZzIobGVuLCBiZWZvcmVzdHIgPSAnJywgYXJyYXl0b2NoZWNrID0gbnVsbCkge1xyXG4gICAgICAgIC8vIENoYXJzZXQsIGV2ZXJ5IGNoYXJhY3RlciBpbiB0aGlzIHN0cmluZyBpcyBhbiBvcHRpb25hbCBvbmUgaXQgY2FuIHVzZSBhcyBhIHJhbmRvbSBjaGFyYWN0ZXIuXHJcbiAgICAgICAgdmFyIGNoYXJTZXQgPSAnQUJDREVGR0hJSktMTU5PUFFSU1RVVldYWVphYmNkZWZnaGlqa2xtbm9wcXJzdHV2d3h5eic7XHJcbiAgICAgICAgdmFyIHJhbmRvbVN0cmluZyA9ICcnO1xyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuOyBpKyspIHtcclxuICAgICAgICAgICAgLy8gY3JlYXRlcyBhIHJhbmRvbSBudW1iZXIgYmV0d2VlbiAwIGFuZCB0aGUgY2hhclNldCBsZW5ndGguIFJvdW5kcyBpdCBkb3duIHRvIGEgd2hvbGUgbnVtYmVyXHJcbiAgICAgICAgICAgIHZhciByYW5kb21Qb3ogPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiBjaGFyU2V0Lmxlbmd0aCk7XHJcbiAgICAgICAgICAgIHJhbmRvbVN0cmluZyArPSBjaGFyU2V0LnN1YnN0cmluZyhyYW5kb21Qb3osIHJhbmRvbVBveiArIDEpO1xyXG4gICAgICAgIH1cclxuICAgICAgICAvLyBJZiBhbiBhcnJheSBpcyBnaXZlbiBpdCB3aWxsIGNoZWNrIHRoZSBhcnJheSwgYW5kIGlmIHRoZSBnZW5lcmF0ZWQgc3RyaW5nIGV4aXN0cyBpbiBpdCBpdCB3aWxsIGNyZWF0ZSBhIG5ldyBvbmUgdW50aWwgYSB1bmlxdWUgb25lIGlzIGZvdW5kICpXQVRDSCBPVVQuIElmIGFsbCBhdmFpbGFibGUgb3B0aW9ucyBhcmUgdXNlZCBpdCB3aWxsIGNhdXNlIGEgbG9vcCBpdCBjYW5ub3QgYnJlYWsgb3V0KlxyXG4gICAgICAgIGlmIChhcnJheXRvY2hlY2sgPT0gbnVsbCkge1xyXG4gICAgICAgICAgICByZXR1cm4gYmVmb3Jlc3RyICsgcmFuZG9tU3RyaW5nO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHZhciBpc0luID0gJC5pbkFycmF5KGJlZm9yZXN0ciArIHJhbmRvbVN0cmluZywgYXJyYXl0b2NoZWNrKTsgLy8gY2hlY2tzIGlmIHRoZSBzdHJpbmcgaXMgaW4gdGhlIGFycmF5LCByZXR1cm5zIGEgcG9zaXRpb25cclxuICAgICAgICAgICAgaWYgKGlzSW4gPiAtMSkge1xyXG4gICAgICAgICAgICAgICAgLy8gaWYgdGhlIHBvc2l0aW9uIGlzIG5vdCAtMSAobWVhbmluZywgaXQgaXMgbm90IGluIHRoZSBhcnJheSkgaXQgd2lsbCBzdGFydCBkb2luZyBhIGxvb3BcclxuICAgICAgICAgICAgICAgIHZhciBjb3VudCA9IDA7XHJcbiAgICAgICAgICAgICAgICBkbyB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmFuZG9tU3RyaW5nID0gJyc7XHJcbiAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW47IGkrKykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgcmFuZG9tUG96ID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogY2hhclNldC5sZW5ndGgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByYW5kb21TdHJpbmcgKz0gY2hhclNldC5zdWJzdHJpbmcocmFuZG9tUG96LCByYW5kb21Qb3ogKyAxKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgaXNJbiA9ICQuaW5BcnJheShiZWZvcmVzdHIgKyByYW5kb21TdHJpbmcsIGFycmF5dG9jaGVjayk7XHJcbiAgICAgICAgICAgICAgICAgICAgY291bnQrKztcclxuICAgICAgICAgICAgICAgIH0gd2hpbGUgKGlzSW4gPiAtMSk7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnaXQgdG9vayAnICsgY291bnQgKyAnIHRyaWVzJyk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gYmVmb3Jlc3RyICsgcmFuZG9tU3RyaW5nO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGJlZm9yZXN0ciArIHJhbmRvbVN0cmluZztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG4iLCJ2YXIgbG9nZ2VkSW4gPSBmYWxzZTtcclxudmFyIHVzZXJMZXZlbCA9IDA7XHJcbnZhciBsb2dnZWRJblVzZXIgPSBbXTtcclxudmFyIHVzZXJzID0gW107XHJcbnZhciBzY2VuYXJpb3MgPSBbXTtcclxudmFyIGFsZXJ0QWN0aXZlID0gZmFsc2U7XHJcblxyXG4kKGRvY3VtZW50KS5yZWFkeShmdW5jdGlvbigpe1xyXG4gICAgY29uc29sZS5sb2coXCJob21lLmpzIGxvYWRlZFwiKVxyXG4gICAgJCgnYm9keScpLm9uKCdjbGljaycsICcubWVudS1pdGVtJywgZnVuY3Rpb24oKXtcclxuICAgICAgICB2YXIgaWQgPSAkKHRoaXMpLmF0dHIoXCJjbGFzc1wiKS5zcGxpdCgnXycpWzFdO1xyXG4gICAgICAgIGNvbnNvbGUubG9nKGlkKVxyXG5cclxuICAgICAgICAkKCcudmVyZGllcGluZycpLmFkZENsYXNzKFwiaGlkZGVuXCIpXHJcbiAgICAgICAgJCgnLnZlcmRpZXBpbmdfXycraWQpLnJlbW92ZUNsYXNzKFwiaGlkZGVuXCIpXHJcbiAgICB9KVxyXG5cclxuICAgICQoJ2JvZHknKS5vbignY2xpY2snLCAnLmxvZ2luJywgZnVuY3Rpb24oKXtcclxuICAgICAgICBjb25zb2xlLmxvZygkKCcudXNlcm5hbWUnKS52YWwoKS50b0xvd2VyQ2FzZSgpKVxyXG4gICAgICAgIGNvbnNvbGUubG9nKCQoJy5wYXNzd29yZCcpLnZhbCgpLnRvTG93ZXJDYXNlKCkpXHJcbiAgICAgICAgJC5wb3N0KFwiaW5jbHVkZS9sb2dpbi5waHBcIiAse1xyXG4gICAgICAgICAgICBsb2dpblN1YjogXCJcIixcclxuICAgICAgICAgICAgdXNlcm5hbWU6ICQoJy51c2VybmFtZScpLnZhbCgpLnRvTG93ZXJDYXNlKCksXHJcbiAgICAgICAgICAgIHBhc3N3b3JkOiAkKCcucGFzc3dvcmQnKS52YWwoKVxyXG4gICAgICAgIH0sIGZ1bmN0aW9uKHJlc3BvbnNlLHN0YXR1cyl7XHJcbiAgICAgICAgICAgIHZhciBkYXRhID0gSlNPTi5wYXJzZShyZXNwb25zZSk7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGRhdGEpO1xyXG4gICAgICAgICAgICBsb2dnZWRJblVzZXIgPSBkYXRhO1xyXG4gICAgICAgICAgICBpZiAoZGF0YS5sb2dnZWRJbiA9PSAxKSB7XHJcbiAgICAgICAgICAgICAgICBsb2dpbihkYXRhLmxldmVsKTtcclxuICAgICAgICAgICAgICAgIHNob3dGbGFzaE1lc3NhZ2UoJ1UgYmVudCBzdWNjZXN2b2wgaW5nZWxvZ2QnLCAnc3VjY2VzcycpXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBzaG93Rmxhc2hNZXNzYWdlKCdVdyBnZWJydWlrZXJzbmFhbSBvZiB3YWNodHdvb3JkIGlzIGluY29ycmVjdCcsICdkYW5nZXInKVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSlcclxuICAgIH0pXHJcblxyXG4gICAgJCgnYm9keScpLm9uKCdjbGljaycsICcubG9nb3V0JywgZnVuY3Rpb24oKXtcclxuICAgICAgICBsb2dvdXQoKTtcclxuICAgIH0pXHJcblxyXG4gICAgJCgnYm9keScpLm9uKCdjbGljaycsICcubG9rYWFsJywgZnVuY3Rpb24oKXtcclxuICAgICAgICBjb25zb2xlLmxvZyhsb2dnZWRJbilcclxuICAgICAgICBpZihsb2dnZWRJbiA9PSB0cnVlKXtcclxuICAgICAgICAgICAgdmFyIGxva2FhbG5yID0gJCh0aGlzKS5hdHRyKFwiY2xhc3NcIikuc3BsaXQoXCIgXCIpWzBdO1xyXG4gICAgICAgICAgICAkKCcuanMtbG9rYWFsJykuaHRtbChsb2thYWxucik7XHJcbiAgICAgICAgfVxyXG4gICAgfSlcclxuXHJcbiAgICAkKGRvY3VtZW50KS5rZXlwcmVzcyhmdW5jdGlvbihlKSB7XHJcbiAgICAgICAgaWYoZS53aGljaCA9PSAxMykge1xyXG4gICAgICAgICAgICBpZiAoIWxvZ2dlZEluKSB7XHJcbiAgICAgICAgICAgICAgICAkKCcubG9naW4nKS50cmlnZ2VyKCdjbGljaycpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfSk7XHJcbn0pXHJcbiIsIiQoJ2JvZHknKS5vbignY2xpY2snLCAnLmxva2FhbCcsIGZ1bmN0aW9uKCl7XHJcbiAgICBpZihsb2dnZWRJbil7XHJcbiAgICAgICAgdmFyIGxva2FhbG5yID0gJCh0aGlzKS5hdHRyKFwiY2xhc3NcIikuc3BsaXQoXCIgXCIpWzBdO1xyXG4gICAgICAgICQoJy5qcy1sb2thYWwnKS5odG1sKGxva2FhbG5yKTtcclxuICAgIH1cclxufSlcclxuJCgnYm9keScpLm9uKCdjbGljaycsICcuanMtc3RhcnQtc2NlbmFyaW8nLCBmdW5jdGlvbigpe1xyXG4gICAgaWYgKGxvZ2dlZEluKSB7XHJcbiAgICAgICAgdmFyIGxva2FhbG5yID0gJCgnLmpzLWxva2FhbCcpLmh0bWwoKTtcclxuICAgICAgICB2YXIgc2NlbmFyaW9JZCA9ICQoJy5qcy1zY2VuYXJpb3NlbGVjdCcpLmZpbmQoXCI6c2VsZWN0ZWRcIikuZGF0YSgnaWQnKTtcclxuICAgICAgICB2YXIgdG9vbHMgPSAwO1xyXG4gICAgICAgIGlmICgkKCcuanMtc3dpdGNoJykuaXMoJzpjaGVja2VkJykpIHtcclxuICAgICAgICAgICAgdG9vbHMgPSAxO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAobG9rYWFsbnIgIT0gXCJcIikge1xyXG4gICAgICAgICAgICBpZiAoc2NlbmFyaW9JZCA+PSAxKSB7XHJcbiAgICAgICAgICAgICAgICAkLnBvc3QoXCJpbmNsdWRlL21ha2VBY3RpdmVTY2VuYXJpby5waHBcIix7XHJcbiAgICAgICAgICAgICAgICAgICAgbG9rYWFsbnI6IGxva2FhbG5yLFxyXG4gICAgICAgICAgICAgICAgICAgIHNjZW5hcmlvSWQ6IHNjZW5hcmlvSWQsXHJcbiAgICAgICAgICAgICAgICAgICAgdG9vbHM6IHRvb2xzXHJcbiAgICAgICAgICAgICAgICAgICAgfSwgZnVuY3Rpb24ocmVzcG9uc2Usc3RhdHVzKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHJlc3BvbnNlID09ICdzdWNjZXNzJykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2hvd0ZsYXNoTWVzc2FnZSgnU2NlbmFyaW8gaXMgc3VjY2Vzdm9sIGFhbmdlbWFha3QnLCAnc3VjY2VzcycpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGVsc2V7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzaG93Rmxhc2hNZXNzYWdlKCdIZXQgbWFrZW4gdmFuIGVlbiBzY2VuYXJpbyBpcyBtaXNsdWt0JywgJ2RhbmdlcicpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZXtcclxuICAgICAgICAgICAgICAgIHNob3dGbGFzaE1lc3NhZ2UoJ0VyIGlzIGdlZW4gc2NlbmFyaW8gZ2Vrb3plbicsICdkYW5nZXInKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgc2hvd0ZsYXNoTWVzc2FnZSgnS2llcyBlZW4gbG9rYWFsJywgJ2RhbmdlcicpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufSlcclxuIiwiJChcImJvZHlcIikub24oXCJjbGlja1wiLCBcIi5uZXctdXNlclwiLGZ1bmN0aW9uKCl7XHJcbiAgaWYoJChcIi5uZXctdXNlci1uYW1lXCIpLnZhbCgpID09IFwiXCIgfHwgJChcIi5uZXctdXNlci1wYXNzd29yZFwiKS52YWwoKSA9PSBcIlwiIHx8ICQoXCIubmV3LXVzZXItbGV2ZWxcIikudmFsKCkgPT0gbnVsbCl7XHJcbiAgICBpZigkKFwiLm5ldy11c2VyLW5hbWVcIikudmFsKCkgPT0gXCJcIil7XHJcbiAgICAgIHNob3dGbGFzaE1lc3NhZ2UoJ1UgaGVlZnQgbm9nIGdlZW4gZ2VicnVpa2Vyc25hYW0gaW5nZXZ1bGQnLCAnZGFuZ2VyJyk7XHJcbiAgICB9ZWxzZSBpZigkKFwiLm5ldy11c2VyLXBhc3N3b3JkXCIpLnZhbCgpID09IFwiXCIpe1xyXG4gICAgICBzaG93Rmxhc2hNZXNzYWdlKCdVIGhlZWZ0IG5vZyBnZWVuIHBhc3N3b29yZCBpbmdldnVsZCcsICdkYW5nZXInKTtcclxuICAgIH1lbHNlIGlmKCQoXCIubmV3LXVzZXItbGV2ZWxcIikudmFsKCkgPT0gbnVsbCl7XHJcbiAgICAgIHNob3dGbGFzaE1lc3NhZ2UoJ1UgaGVlZnQgbm9nIGdlZW4gbGV2ZWwgZ2VzZWxlY3RlZXJkJywgJ2RhbmdlcicpO1xyXG4gICAgfVxyXG4gIH1lbHNle1xyXG4gICAgY29uc29sZS5sb2coJChcIi5uZXctdXNlci1sZXZlbFwiKS52YWwoKSlcclxuICAgICQucG9zdChcImluY2x1ZGUvYWRkVXNlci5waHBcIix7XHJcbiAgICAgIHVzZXJuYW1lOiAkKFwiLm5ldy11c2VyLW5hbWVcIikudmFsKCksXHJcbiAgICAgIHVzZXJwYXNzd29yZDogJChcIi5uZXctdXNlci1wYXNzd29yZFwiKS52YWwoKSxcclxuICAgICAgdXNlcmxldmVsOiAkKFwiLm5ldy11c2VyLWxldmVsXCIpLnZhbCgpXHJcbiAgICB9LCBmdW5jdGlvbihyZXNwb25zZSxzdGF0dXMpe1xyXG4gICAgICBjb25zb2xlLmxvZyhyZXNwb25zZSlcclxuICAgICAgaWYocmVzcG9uc2UgPT0gXCJzdWNjZXNzXCIpe1xyXG4gICAgICAgIHNob3dGbGFzaE1lc3NhZ2UoJ0VyIGlzIGVlbiBuaWV1d2UgZ2VicnVpa2VyIGFhbmdlbWFha3QnLCAnc3VjY2VzcycpO1xyXG4gICAgICAgICQoXCIubmV3LXVzZXItbmFtZVwiKS52YWwoXCJcIik7XHJcbiAgICAgICAgJChcIi5uZXctdXNlci1wYXNzd29yZFwiKS52YWwoXCJcIik7XHJcbiAgICAgICAgJChcIi5uZXctdXNlci1vcHRpb25zXCIpLnJlbW92ZUF0dHIoXCJzZWxlY3RlZFwiKTtcclxuICAgICAgICAkKFwiLm5ldy11c2VyLW9wdGlvbjFcIikuYXR0cihcInNlbGVjdGVkXCIsXCJzZWxlY3RlZFwiKTtcclxuICAgICAgfVxyXG4gICAgfSlcclxuICB9XHJcbn0pXHJcbiIsIiQoXCJib2R5XCIpLm9uKFwiY2xpY2tcIiwgXCIub3B0aW9uc1wiLCBmdW5jdGlvbigpe1xyXG4gIHZhciBsZXZlbCA9ICQodGhpcykuYXR0cihcImNsYXNzXCIpLnNwbGl0KFwiIFwiKVsxXS5zcGxpdChcIl9cIilbMV07XHJcbiAgdmFyIG9wdGlvbiA9ICQodGhpcykuYXR0cihcImNsYXNzXCIpLnNwbGl0KFwiIFwiKVsyXS5zcGxpdChcIl9cIilbMV07XHJcbiAgY29uc29sZS5sb2cobGV2ZWwpXHJcblxyXG4gICQoXCIudmlld1wiKS5hZGRDbGFzcyhcImhpZGRlblwiKVxyXG4gICQoXCIudmlld19cIitsZXZlbCtcIi1cIitvcHRpb24pLnJlbW92ZUNsYXNzKFwiaGlkZGVuXCIpXHJcbiAgJCgnLm9wdGlvbnMnKS5yZW1vdmVDbGFzcygnb3B0aW9ucy0tYWN0aXZlJyk7XHJcbiAgJCh0aGlzKS5hZGRDbGFzcygnb3B0aW9ucy0tYWN0aXZlJyk7XHJcbiAgc3dpdGNoIChsZXZlbCkge1xyXG4gICAgY2FzZSBcIjFcIjpcclxuICAgICAgdXBkYXRlTGV2ZWwxVGVtcGxhdGVzKCk7XHJcbiAgICAgIGJyZWFrO1xyXG4gICAgY2FzZSBcIjJcIjpcclxuICAgICAgdXBkYXRlTGV2ZWwyVGVtcGxhdGVzKCk7XHJcbiAgICAgIGJyZWFrO1xyXG4gIH1cclxufSlcclxuIiwiJChkb2N1bWVudCkucmVhZHkoZnVuY3Rpb24oKXtcclxuICAgICQucG9zdChcImluY2x1ZGUvcmV0dXJuU2Vzc2lvbi5waHBcIix7XHJcbiAgICB9LCBmdW5jdGlvbihyZXNwb25zZSxzdGF0dXMpe1xyXG4gICAgICAgIHZhciBkYXRhID0gSlNPTi5wYXJzZShyZXNwb25zZSk7XHJcbiAgICAgICAgaWYgKGRhdGEubG9nZ2VkSW4pIHtcclxuICAgICAgICAgICAgbG9nZ2VkSW5Vc2VyID0gZGF0YTtcclxuICAgICAgICAgICAgbG9naW4oZGF0YS5sZXZlbCk7XHJcbiAgICAgICAgfVxyXG4gICAgfSlcclxufSk7XHJcbiIsIiQoXCIuc2V0dGluZ3MtaW5wdXRzXCIpLmtleXByZXNzKGZ1bmN0aW9uKGUpIHtcclxuICAgIGNvbnNvbGUubG9nKFwiZW50ZXJcIilcclxuICAgIGlmKGUud2hpY2ggPT0gMTMpIHtcclxuICAgICAgICAkKCcuc2V0dGluZ3MtdXBkYXRlJykudHJpZ2dlcignY2xpY2snKTtcclxuICAgIH1cclxufSk7XHJcblxyXG4kKCdib2R5Jykub24oJ2NsaWNrJywgJy5zZXR0aW5ncycsIGZ1bmN0aW9uKCl7XHJcbiAgICBjb25zb2xlLmxvZyhcInNldHRpbmdzXCIpXHJcbiAgICAkKCcuc2V0dGluZ3MtdXNlcm5hbWUnKS52YWwobG9nZ2VkSW5Vc2VyLnVzZXJuYW1lKVxyXG4gICAgJCgnLnVzZXItc2V0dGluZ3MnKS5tb2RhbCgnc2hvdycpO1xyXG4gICAgY29uc29sZS5sb2cobG9nZ2VkSW5Vc2VyLnVzZXJuYW1lKVxyXG59KVxyXG5cclxuJCgnYm9keScpLm9uKCdjbGljaycsICcuc2V0dGluZ3MtdXBkYXRlJywgZnVuY3Rpb24oKXtcclxuICAgIGNvbnNvbGUubG9nKFwidXBkYXRlXCIpXHJcbiAgICBjb25zb2xlLmxvZygkKCcuc2V0dGluZ3MtdXNlcm5hbWUnKS52YWwoKSlcclxuICAgIGNvbnNvbGUubG9nKCQoJy5zZXR0aW5ncy1wYXNzd29yZCcpLnZhbCgpKVxyXG4gICAgY29uc29sZS5sb2coJCgnLnNldHRpbmdzLXJlcGVhdC1wYXNzd29yZCcpLnZhbCgpKVxyXG5cclxuICAgIGlmKCQoJy5zZXR0aW5ncy11c2VybmFtZScpLnZhbCgpID09IFwiXCIgJiYgJCgnLnNldHRpbmdzLXBhc3N3b3JkJykudmFsKCkgPT0gXCJcIiAmJiAkKCcuc2V0dGluZ3MtcmVwZWF0LXBhc3N3b3JkJykudmFsKCkgPT0gXCJcIil7XHJcbiAgICAgICAgY29uc29sZS5sb2coXCJnZWJydWlrZXJzbmFhbSBlbiB3YWNodHdvb3JkIG1vZ2VuIG5pZXQgbGVlZyB6aWpuXCIpO1xyXG4gICAgfWVsc2V7XHJcbiAgICAgICAgaWYoJCgnLnNldHRpbmdzLXBhc3N3b3JkJykudmFsKCkgIT0gJCgnLnNldHRpbmdzLXJlcGVhdC1wYXNzd29yZCcpLnZhbCgpKXtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJ3YWNodHdvb3JkZW4gemlqbiBuaWV0IGdlbGlqayBhYW4gZWxrYWFyXCIpXHJcbiAgICAgICAgfWVsc2V7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGxvZ2dlZEluVXNlcilcclxuICAgICAgICAgICAgJC5wb3N0KFwiaW5jbHVkZS91cGRhdGVVc2VyLnBocFwiICx7XHJcbiAgICAgICAgICAgICAgICBpZDogbG9nZ2VkSW5Vc2VyLnVzZXJJRCxcclxuICAgICAgICAgICAgICAgIG5hbWU6ICQoJy5zZXR0aW5ncy11c2VybmFtZScpLnZhbCgpLFxyXG4gICAgICAgICAgICAgICAgcGFzczogJCgnLnNldHRpbmdzLXBhc3N3b3JkJykudmFsKClcclxuICAgICAgICAgICAgfSwgZnVuY3Rpb24ocmVzcG9uc2Usc3RhdHVzKXtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKHJlc3BvbnNlKTtcclxuICAgICAgICAgICAgICAgIGlmKHJlc3BvbnNlID09IFwic3VjY2VzXCIpe1xyXG4gICAgICAgICAgICAgICAgICAgICQoJy51c2VyLXNldHRpbmdzJykubW9kYWwoJ2hpZGUnKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59KTtcclxuIl19
