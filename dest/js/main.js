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

$(document).ready(function() {
    $('#panel-623188').hide();
    $('#panel-338653').hide();
    $('#panel-445566').hide();
    $('#panel-556234').hide();
});

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImhvbWUuanMiLCJ0ZXN0LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2xNQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJtYWluLmpzIiwic291cmNlc0NvbnRlbnQiOlsiJChkb2N1bWVudCkucmVhZHkoZnVuY3Rpb24oKXtcclxuICBjb25zb2xlLmxvZyhcImhvbWUuanMgbG9hZGVkXCIpXHJcblxyXG4gIHZhciBsb2dnZWRJbiA9IGZhbHNlO1xyXG4gIHZhciB1c2VyTGV2ZWwgPSAwO1xyXG4gIHZhciBsb2dnZWRJblVzZXIgPSBbXTtcclxuXHJcbiAgdmFyIHVzZXJzID0gW107XHJcblxyXG4gICQoJ2JvZHknKS5vbignY2xpY2snLCAnLm1lbnUtaXRlbScsIGZ1bmN0aW9uKCl7XHJcbiAgICB2YXIgaWQgPSAkKHRoaXMpLmF0dHIoXCJjbGFzc1wiKS5zcGxpdCgnXycpWzFdO1xyXG4gICAgY29uc29sZS5sb2coaWQpXHJcblxyXG4gICAgJCgnLnZlcmRpZXBpbmcnKS5hZGRDbGFzcyhcImhpZGRlblwiKVxyXG4gICAgJCgnLnZlcmRpZXBpbmdfXycraWQpLnJlbW92ZUNsYXNzKFwiaGlkZGVuXCIpXHJcbiAgfSlcclxuXHJcbiAgJCgnYm9keScpLm9uKCdjbGljaycsICcubG9naW4nLCBmdW5jdGlvbigpe1xyXG4gICAgY29uc29sZS5sb2coJCgnLnVzZXJuYW1lJykudmFsKCkudG9Mb3dlckNhc2UoKSlcclxuICAgIGNvbnNvbGUubG9nKCQoJy5wYXNzd29yZCcpLnZhbCgpLnRvTG93ZXJDYXNlKCkpXHJcblxyXG4gICAgJC5wb3N0KFwiaW5jbHVkZS9sb2dpbi5waHBcIiAse1xyXG4gICAgICBsb2dpblN1YjogXCJcIixcclxuICAgICAgdXNlcm5hbWU6ICQoJy51c2VybmFtZScpLnZhbCgpLnRvTG93ZXJDYXNlKCksXHJcbiAgICAgIHBhc3N3b3JkOiAkKCcucGFzc3dvcmQnKS52YWwoKVxyXG4gICAgfSwgZnVuY3Rpb24ocmVzcG9uc2Usc3RhdHVzKXtcclxuICAgICAgdmFyIGRhdGEgPSBKU09OLnBhcnNlKHJlc3BvbnNlKTtcclxuICAgICAgY29uc29sZS5sb2coZGF0YSk7XHJcbiAgICAgIGxvZ2dlZEluVXNlciA9IGRhdGE7XHJcbiAgICAgIGlmIChkYXRhLmxvZ2dlZEluID09IDEpIHtcclxuICAgICAgICAgIGxvZ2luKGRhdGEubGV2ZWwpO1xyXG4gICAgICB9XHJcbiAgICB9KVxyXG4gIH0pXHJcblxyXG4gICQoJ2JvZHknKS5vbignY2xpY2snLCAnLmxvZ291dCcsIGZ1bmN0aW9uKCl7XHJcbiAgICBsb2dvdXQoKTtcclxuICB9KVxyXG5cclxuICAkKCdib2R5Jykub24oJ2NsaWNrJywgJy5sb2thYWwnLCBmdW5jdGlvbigpe1xyXG4gICAgY29uc29sZS5sb2cobG9nZ2VkSW4pXHJcbiAgICBpZihsb2dnZWRJbiA9PSB0cnVlKXtcclxuICAgICAgY29uc29sZS5sb2coJCh0aGlzKS5hdHRyKFwiY2xhc3NcIikuc3BsaXQoXCIgXCIpWzBdKVxyXG4gICAgfVxyXG4gIH0pXHJcblxyXG4gICQoJ2JvZHknKS5vbignY2xpY2snLCAnLnNldHRpbmdzJywgZnVuY3Rpb24oKXtcclxuICAgIGNvbnNvbGUubG9nKFwic2V0dGluZ3NcIilcclxuICAgICQoJy5zZXR0aW5ncy11c2VybmFtZScpLnZhbChsb2dnZWRJblVzZXIudXNlcm5hbWUpXHJcbiAgICAkKCcudXNlci1zZXR0aW5ncycpLm1vZGFsKCdzaG93Jyk7XHJcbiAgICBjb25zb2xlLmxvZyhsb2dnZWRJblVzZXIudXNlcm5hbWUpXHJcbiAgfSlcclxuXHJcbiAgJCgnYm9keScpLm9uKCdjbGljaycsICcuc2V0dGluZ3MtdXBkYXRlJywgZnVuY3Rpb24oKXtcclxuICAgIGNvbnNvbGUubG9nKFwidXBkYXRlXCIpXHJcbiAgICBjb25zb2xlLmxvZygkKCcuc2V0dGluZ3MtdXNlcm5hbWUnKS52YWwoKSlcclxuICAgIGNvbnNvbGUubG9nKCQoJy5zZXR0aW5ncy1wYXNzd29yZCcpLnZhbCgpKVxyXG4gICAgY29uc29sZS5sb2coJCgnLnNldHRpbmdzLXJlcGVhdC1wYXNzd29yZCcpLnZhbCgpKVxyXG5cclxuICAgIGlmKCQoJy5zZXR0aW5ncy11c2VybmFtZScpLnZhbCgpID09IFwiXCIgJiYgJCgnLnNldHRpbmdzLXBhc3N3b3JkJykudmFsKCkgPT0gXCJcIiAmJiAkKCcuc2V0dGluZ3MtcmVwZWF0LXBhc3N3b3JkJykudmFsKCkgPT0gXCJcIil7XHJcbiAgICAgIGNvbnNvbGUubG9nKFwiZ2VicnVpa2Vyc25hYW0gZW4gd2FjaHR3b29yZCBtb2dlbiBuaWV0IGxlZWcgemlqblwiKTtcclxuICAgIH1lbHNle1xyXG4gICAgICBpZigkKCcuc2V0dGluZ3MtcGFzc3dvcmQnKS52YWwoKSAhPSAkKCcuc2V0dGluZ3MtcmVwZWF0LXBhc3N3b3JkJykudmFsKCkpe1xyXG4gICAgICAgIGNvbnNvbGUubG9nKFwid2FjaHR3b29yZGVuIHppam4gbmlldCBnZWxpamsgYWFuIGVsa2FhclwiKVxyXG4gICAgICB9ZWxzZXtcclxuICAgICAgICAkLnBvc3QoXCJpbmNsdWRlL3VwZGF0ZVVzZXIucGhwXCIgLHtcclxuICAgICAgICAgIGlkOiBsb2dnZWRJblVzZXIuaWRcclxuICAgICAgICB9LCBmdW5jdGlvbihyZXNwb25zZSxzdGF0dXMpe1xyXG5cclxuICAgICAgICB9KVxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfSlcclxuXHJcbiAgJCgnYm9keScpLm9uKCdjbGljaycsICcubGV2ZWwxLWJ0bi1kZWxldGUnLGZ1bmN0aW9uKCl7XHJcbiAgICB2YXIgcm93Q2xhc3MgPSAkKHRoaXMpLnBhcmVudCgpLnBhcmVudCgpLmF0dHIoXCJjbGFzc1wiKTtcclxuICAgIHZhciByb3cgPSAkKHRoaXMpLnBhcmVudCgpLnBhcmVudCgpLmF0dHIoXCJjbGFzc1wiKS5zcGxpdChcImluZGV4XCIpWzFdO1xyXG4gICAgY29uc29sZS5sb2codXNlcnMpXHJcbiAgICBmb3IodmFyIGkgPSAwOyBpIDwgdXNlcnMubGVuZ3RoOyBpKyspe1xyXG4gICAgICBpZih1c2Vyc1tpXS5pbmRleCA9PSByb3cpe1xyXG4gICAgICAgICQucG9zdChcImluY2x1ZGUvZGVsZXRlVXNlci5waHBcIiAse1xyXG4gICAgICAgICAgaWQ6IHVzZXJzW2ldLmlkXHJcbiAgICAgICAgfSwgZnVuY3Rpb24ocmVzcG9uc2Usc3RhdHVzKXtcclxuICAgICAgICAgIC8vIGNvbnNvbGUubG9nKHJlc3BvbnNlKTtcclxuICAgICAgICAgIGlmKHJlc3BvbnNlID09IFwic3VjY2VzXCIpe1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhyb3dDbGFzcylcclxuICAgICAgICAgICAgJChcIi5cIityb3dDbGFzcykucmVtb3ZlKCk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSlcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH0pXHJcblxyXG4gICQoXCJib2R5XCIpLm9uKFwiY2xpY2tcIiwgXCIub3B0aW9uc1wiLCBmdW5jdGlvbigpe1xyXG4gICAgdmFyIGxldmVsID0gJCh0aGlzKS5hdHRyKFwiY2xhc3NcIikuc3BsaXQoXCIgXCIpWzFdLnNwbGl0KFwiX1wiKVsxXTtcclxuICAgIHZhciBvcHRpb24gPSAkKHRoaXMpLmF0dHIoXCJjbGFzc1wiKS5zcGxpdChcIiBcIilbMl0uc3BsaXQoXCJfXCIpWzFdO1xyXG5cclxuICAgICQoXCIudmlld1wiKS5hZGRDbGFzcyhcImhpZGRlblwiKVxyXG4gICAgJChcIi52aWV3X1wiK2xldmVsK1wiLVwiK29wdGlvbikucmVtb3ZlQ2xhc3MoXCJoaWRkZW5cIilcclxuXHJcbiAgICBzd2l0Y2ggKGxldmVsKSB7XHJcbiAgICAgIGNhc2UgXCIxXCI6XHJcbiAgICAgICAgJC5wb3N0KFwiaW5jbHVkZS9nZXRVc2Vycy5waHBcIix7XHJcbiAgICAgICAgfSwgZnVuY3Rpb24ocmVzcG9uc2Usc3RhdHVzKXtcclxuICAgICAgICAgIC8vIGNvbnNvbGUubG9nKHJlc3BvbnNlKVxyXG4gICAgICAgICAgdXNlcnMgPSBKU09OLnBhcnNlKHJlc3BvbnNlKVxyXG5cclxuICAgICAgICAgIGZvcih2YXIgaSA9IDA7IGkgPCAyOyBpKyspe1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhpKVxyXG4gICAgICAgICAgICB1c2Vycy5tYXAoZnVuY3Rpb24oY3Asail7XHJcbiAgICAgICAgICAgICAgY3AuaW5kZXggPSBqO1xyXG4gICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKGkpXHJcbiAgICAgICAgICAgICAgaWYoaSA9PSAwKXtcclxuICAgICAgICAgICAgICAgIGNwLmNsYXNzID0gXCJlZGl0XCJcclxuICAgICAgICAgICAgICAgIGNwLmNsYXNzVGV4dCA9IFwiYWFucGFzc2VuXCJcclxuICAgICAgICAgICAgICB9ZWxzZSBpZihpID09IDEpe1xyXG4gICAgICAgICAgICAgICAgY3AuY2xhc3MgPSBcImRlbGV0ZVwiXHJcbiAgICAgICAgICAgICAgICBjcC5jbGFzc1RleHQgPSBcInZlcndpamRlcmVuXCJcclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pXHJcblxyXG4gICAgICAgICAgICBmb3IodmFyIGogPSAwOyBqIDwgdXNlcnMubGVuZ3RoOyBqKyspe1xyXG4gICAgICAgICAgICAgIGlmKHVzZXJzW2pdLnVzZXJsZXZlbCA9PSAxKXtcclxuICAgICAgICAgICAgICAgIHVzZXJzLnNwbGljZShqLDEpXHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyh1c2VycylcclxuXHJcbiAgICAgICAgICAgIHZhciB0ZW1wbGF0ZSA9ICQoXCIubGV2ZWwxLXVzZXItdGVtcGxhdGVcIikuaHRtbCgpO1xyXG4gICAgICAgICAgICB2YXIgcmVuZGVyVGVtcGxhdGUgPSBNdXN0YWNoZS5yZW5kZXIodGVtcGxhdGUsIHVzZXJzKTtcclxuXHJcbiAgICAgICAgICAgIGlmKGkgPT0gMCl7XHJcbiAgICAgICAgICAgICAgJChcIi51c2VyLWxldmVsMS1lZGl0XCIpLmh0bWwocmVuZGVyVGVtcGxhdGUpO1xyXG4gICAgICAgICAgICB9ZWxzZSBpZihpID09IDEpe1xyXG4gICAgICAgICAgICAgICQoXCIudXNlci1sZXZlbDEtZGVsZXRlXCIpLmh0bWwocmVuZGVyVGVtcGxhdGUpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSlcclxuICAgICAgICBicmVhaztcclxuICAgIH1cclxuICB9KVxyXG5cclxuICAkKFwiYm9keVwiKS5vbihcImNsaWNrXCIsIFwiLm5ldy11c2VyXCIsZnVuY3Rpb24oKXtcclxuICAgIGlmKCQoXCIubmV3LXVzZXItbmFtZVwiKS52YWwoKSA9PSBcIlwiIHx8ICQoXCIubmV3LXVzZXItcGFzc3dvcmRcIikudmFsKCkgPT0gXCJcIiB8fCAkKFwiLm5ldy11c2VyLWxldmVsXCIpLnZhbCgpID09IG51bGwpe1xyXG4gICAgICBjb25zb2xlLmxvZyhcImdlZW4gZ2VicnVpa2Vyc25hYW0sIHdhY2h0d29vcmQgb2YgbGV2ZWwgZ2VzZWxlY3RlZXJkXCIpXHJcbiAgICB9ZWxzZXtcclxuICAgICAgY29uc29sZS5sb2coJChcIi5uZXctdXNlci1sZXZlbFwiKS52YWwoKSlcclxuICAgICAgJC5wb3N0KFwiaW5jbHVkZS9hZGRVc2VyLnBocFwiLHtcclxuICAgICAgICB1c2VybmFtZTogJChcIi5uZXctdXNlci1uYW1lXCIpLnZhbCgpLFxyXG4gICAgICAgIHVzZXJwYXNzd29yZDogJChcIi5uZXctdXNlci1wYXNzd29yZFwiKS52YWwoKSxcclxuICAgICAgICB1c2VybGV2ZWw6ICQoXCIubmV3LXVzZXItbGV2ZWxcIikudmFsKClcclxuICAgICAgfSwgZnVuY3Rpb24ocmVzcG9uc2Usc3RhdHVzKXtcclxuICAgICAgICBjb25zb2xlLmxvZyhyZXNwb25zZSlcclxuICAgICAgfSlcclxuICAgIH1cclxuICB9KVxyXG5cclxuICBmdW5jdGlvbiBsb2dpbihhX3VzZXJMZXZlbCl7XHJcbiAgICAkKCcubG9naW4tY29udGFpbmVyJykuYWRkQ2xhc3MoXCJoaWRkZW5cIik7XHJcbiAgICAkKCcubG9naW4tc3RhdHVzJykudGV4dChcIldlbGNvbTogdXNlclwiKVxyXG4gICAgJCgnLmxvZ291dCcpLnJlbW92ZUNsYXNzKFwiaGlkZGVuXCIpXHJcbiAgICAkKCcuc2V0dGluZ3MnKS5yZW1vdmVDbGFzcyhcImhpZGRlblwiKVxyXG4gICAgbG9nZ2VkSW4gPSB0cnVlO1xyXG4gICAgdXNlckxldmVsID0gYV91c2VyTGV2ZWw7XHJcblxyXG4gICAgJChcIi51c2VyLWxldmVsXCIpLmFkZENsYXNzKFwiaGlkZGVuXCIpXHJcbiAgICAkKFwiLnZpZXdcIikuYWRkQ2xhc3MoXCJoaWRkZW5cIilcclxuXHJcbiAgICBzd2l0Y2ggKHVzZXJMZXZlbCkge1xyXG4gICAgICBjYXNlIDE6XHJcbiAgICAgICAgJChcIi51c2VyLWxldmVsXzFcIikucmVtb3ZlQ2xhc3MoXCJoaWRkZW5cIilcclxuICAgICAgICAkKFwiLnZpZXdfMS0xXCIpLnJlbW92ZUNsYXNzKFwiaGlkZGVuXCIpXHJcbiAgICAgICAgYnJlYWs7XHJcbiAgICAgIGNhc2UgMjpcclxuICAgICAgICAkKFwiLnVzZXItbGV2ZWxfMlwiKS5yZW1vdmVDbGFzcyhcImhpZGRlblwiKVxyXG4gICAgICAgICQoXCIudmlld18yLTFcIikucmVtb3ZlQ2xhc3MoXCJoaWRkZW5cIilcclxuICAgICAgICBicmVhaztcclxuICAgICAgY2FzZSAzOlxyXG4gICAgICAgICQoXCIudXNlci1sZXZlbF8zXCIpLnJlbW92ZUNsYXNzKFwiaGlkZGVuXCIpXHJcbiAgICAgICAgYnJlYWs7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBsb2dvdXQoKXtcclxuICAgICQoJy5sb2dpbi1jb250YWluZXInKS5yZW1vdmVDbGFzcyhcImhpZGRlblwiKTtcclxuICAgICQoJy5sb2dpbi1zdGF0dXMnKS50ZXh0KFwiVSBiZW50IG5vZyBuaWV0IGluZ2Vsb2dkXCIpXHJcbiAgICAkKCcubG9nb3V0JykuYWRkQ2xhc3MoXCJoaWRkZW5cIilcclxuICAgICQoXCIudXNlci1sZXZlbFwiKS5hZGRDbGFzcyhcImhpZGRlblwiKVxyXG4gICAgJCgnLnNldHRpbmdzJykuYWRkQ2xhc3MoXCJoaWRkZW5cIilcclxuICAgIGxvZ2dlZEluID0gZmFsc2U7XHJcbiAgICB1c2VyTGV2ZWwgPSAwO1xyXG4gIH1cclxufSlcclxuIiwiJChkb2N1bWVudCkucmVhZHkoZnVuY3Rpb24oKSB7XHJcbiAgICAkKCcjcGFuZWwtNjIzMTg4JykuaGlkZSgpO1xyXG4gICAgJCgnI3BhbmVsLTMzODY1MycpLmhpZGUoKTtcclxuICAgICQoJyNwYW5lbC00NDU1NjYnKS5oaWRlKCk7XHJcbiAgICAkKCcjcGFuZWwtNTU2MjM0JykuaGlkZSgpO1xyXG59KTtcclxuIl19
