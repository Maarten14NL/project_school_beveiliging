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
