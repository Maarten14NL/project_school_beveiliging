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
