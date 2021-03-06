function login(a_userLevel){
    $('.login-container').addClass("hidden");
    $('.login-status').text("Welkom: "+loggedInUser.username + "    ")
    $('.logout').removeClass("hidden")
    loggedIn = true;
    userLevel = a_userLevel;

    $(".user-level").addClass("hidden")
    $(".view").addClass("hidden")
    $(".options").removeClass("active")
    $('.option1').addClass("active")
    updateLevel1Templates();
    switch (userLevel) {
        case 1:
          $(".user-level_1").removeClass("hidden")
          $(".view_1-1").removeClass("hidden")
          $(".option_1").addClass("active")
          $('.settings').removeClass("hidden")
          updateLevel2Templates();
        break;
        case 2:
          $(".user-level_2").removeClass("hidden")
          $(".view_2-1").removeClass("hidden")
          $(".option_1").addClass("active")
          $('.settings').removeClass("hidden")
          updateLevel2Templates(1);
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
    if (typeof myAudio !== 'undefined') {
        myAudio.pause();
    }
    alertActive = false;
    if (lokaalLocation != '') {
      $('.' + lokaalLocation).removeClass('lokaal--blink');
    }
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
        users = JSON.parse(response)

        for(var i = 0; i < 2; i++){
            users.map(function(cp,j){
                cp.index = cp.id;
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

function updateLevel2Templates(cat = 0){
  if (cat) {
    var category = $('#scenario-choosecategory').val();
    $.post("include/getScenarios.php",{
      category: category
    }, function(response,status){
      console.log(response);
      scenarios = JSON.parse(response)

      $('.scenario-selector').html("")
      for(var i = 0 ; i < scenarios.length; i++){
        $('.scenario-selector').append('<option data-id="' + scenarios[i].id  + '">' + scenarios[i].name + "</option>")
      }

      var template = $(".level2-scenario-template").html();
      var renderTemplate = Mustache.render(template, scenarios);

      $(".js-scenario-container").html(renderTemplate);
    })
  }
  else{
    $.post("include/getScenarios.php",{
    }, function(response,status){
      console.log(response);
      scenarios = JSON.parse(response)

      $('.scenario-selector').html("")
      for(var i = 0 ; i < scenarios.length; i++){
        $('.scenario-selector').append('<option data-id="' + scenarios[i].id  + '">' + scenarios[i].name + "</option>")
      }

      var template = $(".level2-scenario-template").html();
      var renderTemplate = Mustache.render(template, scenarios);

      $(".js-scenario-container").html(renderTemplate);
    })
  }
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
            return beforestr + randomString;
        } else {
            return beforestr + randomString;
        }
    }
}
