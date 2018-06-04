$(document).ready(function(){
  console.log("home.js loaded")

  var loggedIn = false;
  var userLevel = 0;

  $('body').on('click', '.menu-item', function(){
    var id = $(this).attr("class").split('_')[1];
    console.log(id)

    $('.verdieping').addClass("hidden")
    $('.verdieping__'+id).removeClass("hidden")
  })

  $('body').on('click', '.login', function(){
    console.log($('.username').val().toLowerCase())
    console.log($('.password').val().toLowerCase())

    $.post("include/login.php",{
      loginSub: "",
      username: $('.username').val().toLowerCase(),
      password: ""
    }, function(response,status){
      var data = JSON.parse(response);
      console.log(data);
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

  $('body').on('click', '.level1-btn-edit',function(){
    var row = $(this).parent().parent().attr("class").split("index")[1];


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
          response = JSON.parse(response)

          for(var i = 0; i < 2; i++){
            // console.log(i)
            response.map(function(cp,j){
              cp.index = j;
              console.log(i)
              if(i == 0){
                cp.class = "edit"
                cp.classText = "aanpassen"
              }else if(i == 1){
                cp.class = "delete"
                cp.classText = "verwijderen"
              }
            })

            for(var j = 0; j < response.length; j++){
              if(response[j].userlevel == 1){
                response.splice(j,1)
              }
            }

            var template = $(".level1-user-template").html();
            var renderTemplate = Mustache.render(template, response);

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
    loggedIn = false;
    userLevel = 0;
  }
})
