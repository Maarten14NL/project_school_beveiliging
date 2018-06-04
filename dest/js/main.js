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
      password: $('.password').val()
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

$(document).ready(function() {
    $('#panel-623188').hide();
    $('#panel-338653').hide();
    $('#panel-445566').hide();
    $('#panel-556234').hide();
});

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImhvbWUuanMiLCJ0ZXN0LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNqSkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZXNDb250ZW50IjpbIiQoZG9jdW1lbnQpLnJlYWR5KGZ1bmN0aW9uKCl7XHJcbiAgY29uc29sZS5sb2coXCJob21lLmpzIGxvYWRlZFwiKVxyXG5cclxuICB2YXIgbG9nZ2VkSW4gPSBmYWxzZTtcclxuICB2YXIgdXNlckxldmVsID0gMDtcclxuXHJcbiAgJCgnYm9keScpLm9uKCdjbGljaycsICcubWVudS1pdGVtJywgZnVuY3Rpb24oKXtcclxuICAgIHZhciBpZCA9ICQodGhpcykuYXR0cihcImNsYXNzXCIpLnNwbGl0KCdfJylbMV07XHJcbiAgICBjb25zb2xlLmxvZyhpZClcclxuXHJcbiAgICAkKCcudmVyZGllcGluZycpLmFkZENsYXNzKFwiaGlkZGVuXCIpXHJcbiAgICAkKCcudmVyZGllcGluZ19fJytpZCkucmVtb3ZlQ2xhc3MoXCJoaWRkZW5cIilcclxuICB9KVxyXG5cclxuICAkKCdib2R5Jykub24oJ2NsaWNrJywgJy5sb2dpbicsIGZ1bmN0aW9uKCl7XHJcbiAgICBjb25zb2xlLmxvZygkKCcudXNlcm5hbWUnKS52YWwoKS50b0xvd2VyQ2FzZSgpKVxyXG4gICAgY29uc29sZS5sb2coJCgnLnBhc3N3b3JkJykudmFsKCkudG9Mb3dlckNhc2UoKSlcclxuXHJcbiAgICAkLnBvc3QoXCJpbmNsdWRlL2xvZ2luLnBocFwiLHtcclxuICAgICAgbG9naW5TdWI6IFwiXCIsXHJcbiAgICAgIHVzZXJuYW1lOiAkKCcudXNlcm5hbWUnKS52YWwoKS50b0xvd2VyQ2FzZSgpLFxyXG4gICAgICBwYXNzd29yZDogJCgnLnBhc3N3b3JkJykudmFsKClcclxuICAgIH0sIGZ1bmN0aW9uKHJlc3BvbnNlLHN0YXR1cyl7XHJcbiAgICAgIHZhciBkYXRhID0gSlNPTi5wYXJzZShyZXNwb25zZSk7XHJcbiAgICAgIGNvbnNvbGUubG9nKGRhdGEpO1xyXG4gICAgICBpZiAoZGF0YS5sb2dnZWRJbiA9PSAxKSB7XHJcbiAgICAgICAgICBsb2dpbihkYXRhLmxldmVsKTtcclxuICAgICAgfVxyXG4gICAgfSlcclxuICB9KVxyXG5cclxuICAkKCdib2R5Jykub24oJ2NsaWNrJywgJy5sb2dvdXQnLCBmdW5jdGlvbigpe1xyXG4gICAgbG9nb3V0KCk7XHJcbiAgfSlcclxuXHJcbiAgJCgnYm9keScpLm9uKCdjbGljaycsICcubG9rYWFsJywgZnVuY3Rpb24oKXtcclxuICAgIGNvbnNvbGUubG9nKGxvZ2dlZEluKVxyXG4gICAgaWYobG9nZ2VkSW4gPT0gdHJ1ZSl7XHJcbiAgICAgIGNvbnNvbGUubG9nKCQodGhpcykuYXR0cihcImNsYXNzXCIpLnNwbGl0KFwiIFwiKVswXSlcclxuICAgIH1cclxuICB9KVxyXG5cclxuICAkKCdib2R5Jykub24oJ2NsaWNrJywgJy5sZXZlbDEtYnRuLWVkaXQnLGZ1bmN0aW9uKCl7XHJcbiAgICB2YXIgcm93ID0gJCh0aGlzKS5wYXJlbnQoKS5wYXJlbnQoKS5hdHRyKFwiY2xhc3NcIikuc3BsaXQoXCJpbmRleFwiKVsxXTtcclxuXHJcblxyXG4gIH0pXHJcblxyXG4gICQoXCJib2R5XCIpLm9uKFwiY2xpY2tcIiwgXCIub3B0aW9uc1wiLCBmdW5jdGlvbigpe1xyXG4gICAgdmFyIGxldmVsID0gJCh0aGlzKS5hdHRyKFwiY2xhc3NcIikuc3BsaXQoXCIgXCIpWzFdLnNwbGl0KFwiX1wiKVsxXTtcclxuICAgIHZhciBvcHRpb24gPSAkKHRoaXMpLmF0dHIoXCJjbGFzc1wiKS5zcGxpdChcIiBcIilbMl0uc3BsaXQoXCJfXCIpWzFdO1xyXG5cclxuICAgICQoXCIudmlld1wiKS5hZGRDbGFzcyhcImhpZGRlblwiKVxyXG4gICAgJChcIi52aWV3X1wiK2xldmVsK1wiLVwiK29wdGlvbikucmVtb3ZlQ2xhc3MoXCJoaWRkZW5cIilcclxuXHJcbiAgICBzd2l0Y2ggKGxldmVsKSB7XHJcbiAgICAgIGNhc2UgXCIxXCI6XHJcbiAgICAgICAgJC5wb3N0KFwiaW5jbHVkZS9nZXRVc2Vycy5waHBcIix7XHJcbiAgICAgICAgfSwgZnVuY3Rpb24ocmVzcG9uc2Usc3RhdHVzKXtcclxuICAgICAgICAgIC8vIGNvbnNvbGUubG9nKHJlc3BvbnNlKVxyXG4gICAgICAgICAgcmVzcG9uc2UgPSBKU09OLnBhcnNlKHJlc3BvbnNlKVxyXG5cclxuICAgICAgICAgIGZvcih2YXIgaSA9IDA7IGkgPCAyOyBpKyspe1xyXG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhpKVxyXG4gICAgICAgICAgICByZXNwb25zZS5tYXAoZnVuY3Rpb24oY3Asail7XHJcbiAgICAgICAgICAgICAgY3AuaW5kZXggPSBqO1xyXG4gICAgICAgICAgICAgIGNvbnNvbGUubG9nKGkpXHJcbiAgICAgICAgICAgICAgaWYoaSA9PSAwKXtcclxuICAgICAgICAgICAgICAgIGNwLmNsYXNzID0gXCJlZGl0XCJcclxuICAgICAgICAgICAgICAgIGNwLmNsYXNzVGV4dCA9IFwiYWFucGFzc2VuXCJcclxuICAgICAgICAgICAgICB9ZWxzZSBpZihpID09IDEpe1xyXG4gICAgICAgICAgICAgICAgY3AuY2xhc3MgPSBcImRlbGV0ZVwiXHJcbiAgICAgICAgICAgICAgICBjcC5jbGFzc1RleHQgPSBcInZlcndpamRlcmVuXCJcclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pXHJcblxyXG4gICAgICAgICAgICBmb3IodmFyIGogPSAwOyBqIDwgcmVzcG9uc2UubGVuZ3RoOyBqKyspe1xyXG4gICAgICAgICAgICAgIGlmKHJlc3BvbnNlW2pdLnVzZXJsZXZlbCA9PSAxKXtcclxuICAgICAgICAgICAgICAgIHJlc3BvbnNlLnNwbGljZShqLDEpXHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB2YXIgdGVtcGxhdGUgPSAkKFwiLmxldmVsMS11c2VyLXRlbXBsYXRlXCIpLmh0bWwoKTtcclxuICAgICAgICAgICAgdmFyIHJlbmRlclRlbXBsYXRlID0gTXVzdGFjaGUucmVuZGVyKHRlbXBsYXRlLCByZXNwb25zZSk7XHJcblxyXG4gICAgICAgICAgICBpZihpID09IDApe1xyXG4gICAgICAgICAgICAgICQoXCIudXNlci1sZXZlbDEtZWRpdFwiKS5odG1sKHJlbmRlclRlbXBsYXRlKTtcclxuICAgICAgICAgICAgfWVsc2UgaWYoaSA9PSAxKXtcclxuICAgICAgICAgICAgICAkKFwiLnVzZXItbGV2ZWwxLWRlbGV0ZVwiKS5odG1sKHJlbmRlclRlbXBsYXRlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0pXHJcbiAgICAgICAgYnJlYWs7XHJcbiAgICB9XHJcbiAgfSlcclxuXHJcbiAgJChcImJvZHlcIikub24oXCJjbGlja1wiLCBcIi5uZXctdXNlclwiLGZ1bmN0aW9uKCl7XHJcbiAgICBpZigkKFwiLm5ldy11c2VyLW5hbWVcIikudmFsKCkgPT0gXCJcIiB8fCAkKFwiLm5ldy11c2VyLXBhc3N3b3JkXCIpLnZhbCgpID09IFwiXCIgfHwgJChcIi5uZXctdXNlci1sZXZlbFwiKS52YWwoKSA9PSBudWxsKXtcclxuICAgICAgY29uc29sZS5sb2coXCJnZWVuIGdlYnJ1aWtlcnNuYWFtLCB3YWNodHdvb3JkIG9mIGxldmVsIGdlc2VsZWN0ZWVyZFwiKVxyXG4gICAgfWVsc2V7XHJcbiAgICAgIGNvbnNvbGUubG9nKCQoXCIubmV3LXVzZXItbGV2ZWxcIikudmFsKCkpXHJcbiAgICAgICQucG9zdChcImluY2x1ZGUvYWRkVXNlci5waHBcIix7XHJcbiAgICAgICAgdXNlcm5hbWU6ICQoXCIubmV3LXVzZXItbmFtZVwiKS52YWwoKSxcclxuICAgICAgICB1c2VycGFzc3dvcmQ6ICQoXCIubmV3LXVzZXItcGFzc3dvcmRcIikudmFsKCksXHJcbiAgICAgICAgdXNlcmxldmVsOiAkKFwiLm5ldy11c2VyLWxldmVsXCIpLnZhbCgpXHJcbiAgICAgIH0sIGZ1bmN0aW9uKHJlc3BvbnNlLHN0YXR1cyl7XHJcbiAgICAgICAgY29uc29sZS5sb2cocmVzcG9uc2UpXHJcbiAgICAgIH0pXHJcbiAgICB9XHJcbiAgfSlcclxuXHJcbiAgZnVuY3Rpb24gbG9naW4oYV91c2VyTGV2ZWwpe1xyXG4gICAgJCgnLmxvZ2luLWNvbnRhaW5lcicpLmFkZENsYXNzKFwiaGlkZGVuXCIpO1xyXG4gICAgJCgnLmxvZ2luLXN0YXR1cycpLnRleHQoXCJXZWxjb206IHVzZXJcIilcclxuICAgICQoJy5sb2dvdXQnKS5yZW1vdmVDbGFzcyhcImhpZGRlblwiKVxyXG4gICAgbG9nZ2VkSW4gPSB0cnVlO1xyXG4gICAgdXNlckxldmVsID0gYV91c2VyTGV2ZWw7XHJcblxyXG4gICAgJChcIi51c2VyLWxldmVsXCIpLmFkZENsYXNzKFwiaGlkZGVuXCIpXHJcbiAgICAkKFwiLnZpZXdcIikuYWRkQ2xhc3MoXCJoaWRkZW5cIilcclxuXHJcbiAgICBzd2l0Y2ggKHVzZXJMZXZlbCkge1xyXG4gICAgICBjYXNlIDE6XHJcbiAgICAgICAgJChcIi51c2VyLWxldmVsXzFcIikucmVtb3ZlQ2xhc3MoXCJoaWRkZW5cIilcclxuICAgICAgICAkKFwiLnZpZXdfMS0xXCIpLnJlbW92ZUNsYXNzKFwiaGlkZGVuXCIpXHJcbiAgICAgICAgYnJlYWs7XHJcbiAgICAgIGNhc2UgMjpcclxuICAgICAgICAkKFwiLnVzZXItbGV2ZWxfMlwiKS5yZW1vdmVDbGFzcyhcImhpZGRlblwiKVxyXG4gICAgICAgICQoXCIudmlld18yLTFcIikucmVtb3ZlQ2xhc3MoXCJoaWRkZW5cIilcclxuICAgICAgICBicmVhaztcclxuICAgICAgY2FzZSAzOlxyXG4gICAgICAgICQoXCIudXNlci1sZXZlbF8zXCIpLnJlbW92ZUNsYXNzKFwiaGlkZGVuXCIpXHJcbiAgICAgICAgYnJlYWs7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBsb2dvdXQoKXtcclxuICAgICQoJy5sb2dpbi1jb250YWluZXInKS5yZW1vdmVDbGFzcyhcImhpZGRlblwiKTtcclxuICAgICQoJy5sb2dpbi1zdGF0dXMnKS50ZXh0KFwiVSBiZW50IG5vZyBuaWV0IGluZ2Vsb2dkXCIpXHJcbiAgICAkKCcubG9nb3V0JykuYWRkQ2xhc3MoXCJoaWRkZW5cIilcclxuICAgICQoXCIudXNlci1sZXZlbFwiKS5hZGRDbGFzcyhcImhpZGRlblwiKVxyXG4gICAgbG9nZ2VkSW4gPSBmYWxzZTtcclxuICAgIHVzZXJMZXZlbCA9IDA7XHJcbiAgfVxyXG59KVxyXG4iLCIkKGRvY3VtZW50KS5yZWFkeShmdW5jdGlvbigpIHtcclxuICAgICQoJyNwYW5lbC02MjMxODgnKS5oaWRlKCk7XHJcbiAgICAkKCcjcGFuZWwtMzM4NjUzJykuaGlkZSgpO1xyXG4gICAgJCgnI3BhbmVsLTQ0NTU2NicpLmhpZGUoKTtcclxuICAgICQoJyNwYW5lbC01NTYyMzQnKS5oaWRlKCk7XHJcbn0pO1xyXG4iXX0=
