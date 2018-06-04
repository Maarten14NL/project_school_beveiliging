$(document).ready(function(){
  console.log("home.js loaded")

  var loggedIn = false;
  var userLevel = 0;
  var loggedInUser = [];

  var users = [];

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
        $.post("include/updateUser.php" ,{
          id: loggedInUser.id
        }, function(response,status){

        })
      }
    }
  })

  $('body').on('click', '.level1-btn-delete',function(){
    var rowClass = $(this).parent().parent().attr("class");
    var row = $(this).parent().parent().attr("class").split("index")[1];
    console.log(users)
    for(var i = 0; i < users.length; i++){
      if(users[i].index == row){
        $.post("include/deleteUser.php" ,{
          id: users[i].id
        }, function(response,status){
          // console.log(response);
          if(response == "succes"){
            console.log(rowClass)
            $("."+rowClass).remove();
          }
        })
      }
    }
  })

  $("body").on("click", ".options", function(){
    var level = $(this).attr("class").split(" ")[1].split("_")[1];
    var option = $(this).attr("class").split(" ")[2].split("_")[1];

    $(".view").addClass("hidden")
    $(".view_"+level+"-"+option).removeClass("hidden")

    switch (level) {
      case "1":
        $.post("include/getUsers.php",{
        }, function(response,status){
          // console.log(response)
          users = JSON.parse(response)

          for(var i = 0; i < 2; i++){
            console.log(i)
            users.map(function(cp,j){
              cp.index = j;
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

            console.log(users)

            var template = $(".level1-user-template").html();
            var renderTemplate = Mustache.render(template, users);

            if(i == 0){
              $(".user-level1-edit").html(renderTemplate);
            }else if(i == 1){
              $(".user-level1-delete").html(renderTemplate);
            }
          }
        })
        break;
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
        $(".view_2-1").removeClass("hidden")
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
  }
})
