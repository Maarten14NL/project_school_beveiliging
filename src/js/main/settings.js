$(".settings-inputs").keypress(function(e) {
    if(e.which == 13) {
        $('.settings-update').trigger('click');
    }
});

$('body').on('click', '.settings', function(){
    $('.settings-username').val(loggedInUser.username)
    $('.user-settings').modal('show');
})

$('body').on('click', '.settings-update', function(){

    if($('.settings-username').val() == "" || $('.settings-password').val() == ""){
        if($('.settings-username').val() == ""){
          showFlashMessage('U heeft geen gebruikersnaam ingevuld', 'danger');
        }else if($('.settings-password').val() == ""){
          showFlashMessage('U heeft geen wachtwoord ingevuld', 'danger');
        }
    }else{
        if($('.settings-password').val() != $('.settings-repeat-password').val()){
          showFlashMessage('Uw wachtwoorden zijn niet gelijk aan elkaar', 'danger');
        }else{
            $.post("include/updateUser.php" ,{
                id: loggedInUser.userID,
                level:loggedInUser.level,
                name: $('.settings-username').val(),
                pass: $('.settings-password').val()
            }, function(response,status){
                if(response == "succes"){
                    $('.user-settings').modal('hide');
                    $('.settings-inputs').val('');
                    showFlashMessage('Opties opgeslagen', 'success');
                }
            });
        }
    }
});

$("body").on('click','.settings-cancel',function(){
  $('.user-settings').modal('hide');
})
