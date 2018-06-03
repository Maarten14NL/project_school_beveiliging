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
      console.log(response)

      login(1);
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

  $("body").on("click", ".options", function(){
    var level = $(this).attr("class").split(" ")[1].split("_")[1];
    var option = $(this).attr("class").split(" ")[2].split("_")[1];

    $(".view").addClass("hidden")
    $(".view_"+level+"-"+option).removeClass("hidden")
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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImhvbWUuanMiLCJ0ZXN0LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNqR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZXNDb250ZW50IjpbIiQoZG9jdW1lbnQpLnJlYWR5KGZ1bmN0aW9uKCl7XHJcbiAgY29uc29sZS5sb2coXCJob21lLmpzIGxvYWRlZFwiKVxyXG5cclxuICB2YXIgbG9nZ2VkSW4gPSBmYWxzZTtcclxuICB2YXIgdXNlckxldmVsID0gMDtcclxuXHJcbiAgJCgnYm9keScpLm9uKCdjbGljaycsICcubWVudS1pdGVtJywgZnVuY3Rpb24oKXtcclxuICAgIHZhciBpZCA9ICQodGhpcykuYXR0cihcImNsYXNzXCIpLnNwbGl0KCdfJylbMV07XHJcbiAgICBjb25zb2xlLmxvZyhpZClcclxuXHJcbiAgICAkKCcudmVyZGllcGluZycpLmFkZENsYXNzKFwiaGlkZGVuXCIpXHJcbiAgICAkKCcudmVyZGllcGluZ19fJytpZCkucmVtb3ZlQ2xhc3MoXCJoaWRkZW5cIilcclxuICB9KVxyXG5cclxuICAkKCdib2R5Jykub24oJ2NsaWNrJywgJy5sb2dpbicsIGZ1bmN0aW9uKCl7XHJcbiAgICBjb25zb2xlLmxvZygkKCcudXNlcm5hbWUnKS52YWwoKS50b0xvd2VyQ2FzZSgpKVxyXG4gICAgY29uc29sZS5sb2coJCgnLnBhc3N3b3JkJykudmFsKCkudG9Mb3dlckNhc2UoKSlcclxuXHJcbiAgICAkLnBvc3QoXCJpbmNsdWRlL2xvZ2luLnBocFwiLHtcclxuICAgICAgbG9naW5TdWI6IFwiXCIsXHJcbiAgICAgIHVzZXJuYW1lOiAkKCcudXNlcm5hbWUnKS52YWwoKS50b0xvd2VyQ2FzZSgpLFxyXG4gICAgICBwYXNzd29yZDogXCJcIlxyXG4gICAgfSwgZnVuY3Rpb24ocmVzcG9uc2Usc3RhdHVzKXtcclxuICAgICAgY29uc29sZS5sb2cocmVzcG9uc2UpXHJcblxyXG4gICAgICBsb2dpbigxKTtcclxuICAgIH0pXHJcbiAgfSlcclxuXHJcbiAgJCgnYm9keScpLm9uKCdjbGljaycsICcubG9nb3V0JywgZnVuY3Rpb24oKXtcclxuICAgIGxvZ291dCgpO1xyXG4gIH0pXHJcblxyXG4gICQoJ2JvZHknKS5vbignY2xpY2snLCAnLmxva2FhbCcsIGZ1bmN0aW9uKCl7XHJcbiAgICBjb25zb2xlLmxvZyhsb2dnZWRJbilcclxuICAgIGlmKGxvZ2dlZEluID09IHRydWUpe1xyXG4gICAgICBjb25zb2xlLmxvZygkKHRoaXMpLmF0dHIoXCJjbGFzc1wiKS5zcGxpdChcIiBcIilbMF0pXHJcbiAgICB9XHJcbiAgfSlcclxuXHJcbiAgJChcImJvZHlcIikub24oXCJjbGlja1wiLCBcIi5vcHRpb25zXCIsIGZ1bmN0aW9uKCl7XHJcbiAgICB2YXIgbGV2ZWwgPSAkKHRoaXMpLmF0dHIoXCJjbGFzc1wiKS5zcGxpdChcIiBcIilbMV0uc3BsaXQoXCJfXCIpWzFdO1xyXG4gICAgdmFyIG9wdGlvbiA9ICQodGhpcykuYXR0cihcImNsYXNzXCIpLnNwbGl0KFwiIFwiKVsyXS5zcGxpdChcIl9cIilbMV07XHJcblxyXG4gICAgJChcIi52aWV3XCIpLmFkZENsYXNzKFwiaGlkZGVuXCIpXHJcbiAgICAkKFwiLnZpZXdfXCIrbGV2ZWwrXCItXCIrb3B0aW9uKS5yZW1vdmVDbGFzcyhcImhpZGRlblwiKVxyXG4gIH0pXHJcblxyXG4gICQoXCJib2R5XCIpLm9uKFwiY2xpY2tcIiwgXCIubmV3LXVzZXJcIixmdW5jdGlvbigpe1xyXG4gICAgaWYoJChcIi5uZXctdXNlci1uYW1lXCIpLnZhbCgpID09IFwiXCIgfHwgJChcIi5uZXctdXNlci1wYXNzd29yZFwiKS52YWwoKSA9PSBcIlwiIHx8ICQoXCIubmV3LXVzZXItbGV2ZWxcIikudmFsKCkgPT0gbnVsbCl7XHJcbiAgICAgIGNvbnNvbGUubG9nKFwiZ2VlbiBnZWJydWlrZXJzbmFhbSwgd2FjaHR3b29yZCBvZiBsZXZlbCBnZXNlbGVjdGVlcmRcIilcclxuICAgIH1lbHNle1xyXG4gICAgICBjb25zb2xlLmxvZygkKFwiLm5ldy11c2VyLWxldmVsXCIpLnZhbCgpKVxyXG4gICAgICAkLnBvc3QoXCJpbmNsdWRlL2FkZFVzZXIucGhwXCIse1xyXG4gICAgICAgIHVzZXJuYW1lOiAkKFwiLm5ldy11c2VyLW5hbWVcIikudmFsKCksXHJcbiAgICAgICAgdXNlcnBhc3N3b3JkOiAkKFwiLm5ldy11c2VyLXBhc3N3b3JkXCIpLnZhbCgpLFxyXG4gICAgICAgIHVzZXJsZXZlbDogJChcIi5uZXctdXNlci1sZXZlbFwiKS52YWwoKVxyXG4gICAgICB9LCBmdW5jdGlvbihyZXNwb25zZSxzdGF0dXMpe1xyXG4gICAgICAgIGNvbnNvbGUubG9nKHJlc3BvbnNlKVxyXG4gICAgICB9KVxyXG4gICAgfVxyXG4gIH0pXHJcblxyXG4gIGZ1bmN0aW9uIGxvZ2luKGFfdXNlckxldmVsKXtcclxuICAgICQoJy5sb2dpbi1jb250YWluZXInKS5hZGRDbGFzcyhcImhpZGRlblwiKTtcclxuICAgICQoJy5sb2dpbi1zdGF0dXMnKS50ZXh0KFwiV2VsY29tOiB1c2VyXCIpXHJcbiAgICAkKCcubG9nb3V0JykucmVtb3ZlQ2xhc3MoXCJoaWRkZW5cIilcclxuICAgIGxvZ2dlZEluID0gdHJ1ZTtcclxuICAgIHVzZXJMZXZlbCA9IGFfdXNlckxldmVsO1xyXG5cclxuICAgICQoXCIudXNlci1sZXZlbFwiKS5hZGRDbGFzcyhcImhpZGRlblwiKVxyXG4gICAgJChcIi52aWV3XCIpLmFkZENsYXNzKFwiaGlkZGVuXCIpXHJcblxyXG4gICAgc3dpdGNoICh1c2VyTGV2ZWwpIHtcclxuICAgICAgY2FzZSAxOlxyXG4gICAgICAgICQoXCIudXNlci1sZXZlbF8xXCIpLnJlbW92ZUNsYXNzKFwiaGlkZGVuXCIpXHJcbiAgICAgICAgJChcIi52aWV3XzEtMVwiKS5yZW1vdmVDbGFzcyhcImhpZGRlblwiKVxyXG4gICAgICAgIGJyZWFrO1xyXG4gICAgICBjYXNlIDI6XHJcbiAgICAgICAgJChcIi51c2VyLWxldmVsXzJcIikucmVtb3ZlQ2xhc3MoXCJoaWRkZW5cIilcclxuICAgICAgICAkKFwiLnZpZXdfMi0xXCIpLnJlbW92ZUNsYXNzKFwiaGlkZGVuXCIpXHJcbiAgICAgICAgYnJlYWs7XHJcbiAgICAgIGNhc2UgMzpcclxuICAgICAgICAkKFwiLnVzZXItbGV2ZWxfM1wiKS5yZW1vdmVDbGFzcyhcImhpZGRlblwiKVxyXG4gICAgICAgIGJyZWFrO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gbG9nb3V0KCl7XHJcbiAgICAkKCcubG9naW4tY29udGFpbmVyJykucmVtb3ZlQ2xhc3MoXCJoaWRkZW5cIik7XHJcbiAgICAkKCcubG9naW4tc3RhdHVzJykudGV4dChcIlUgYmVudCBub2cgbmlldCBpbmdlbG9nZFwiKVxyXG4gICAgJCgnLmxvZ291dCcpLmFkZENsYXNzKFwiaGlkZGVuXCIpXHJcbiAgICAkKFwiLnVzZXItbGV2ZWxcIikuYWRkQ2xhc3MoXCJoaWRkZW5cIilcclxuICAgIGxvZ2dlZEluID0gZmFsc2U7XHJcbiAgICB1c2VyTGV2ZWwgPSAwO1xyXG4gIH1cclxufSlcclxuIiwiJChkb2N1bWVudCkucmVhZHkoZnVuY3Rpb24oKSB7XHJcbiAgICAkKCcjcGFuZWwtNjIzMTg4JykuaGlkZSgpO1xyXG4gICAgJCgnI3BhbmVsLTMzODY1MycpLmhpZGUoKTtcclxuICAgICQoJyNwYW5lbC00NDU1NjYnKS5oaWRlKCk7XHJcbiAgICAkKCcjcGFuZWwtNTU2MjM0JykuaGlkZSgpO1xyXG59KTtcclxuIl19
