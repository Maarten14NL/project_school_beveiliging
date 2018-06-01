$(document).ready(function(){
  console.log("home.js loaded")
  $('body').on('click', '.menu-item', function(){
    var id = $(this).attr("class").split('_')[1];
    console.log(id)
    for(var i = 0; i < 4; i++){
      $('.verdieping__'+i).addClass("hidden")
    }
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
      $('.login-container').addClass("hidden");
      $('.login-status').text("Welcom: user")
      $('.logout').removeClass("hidden")
    })
  })

  $('body').on('click', '.logout', function(){
    $('.login-container').removeClass("hidden");
    $('.login-status').text("U bent nog niet ingelogd")
    $('.logout').addClass("hidden")
  })


})
