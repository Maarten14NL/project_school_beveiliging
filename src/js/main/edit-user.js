var index = 0;
$('body').on('click', '.level1-btn-edit', function(){
    var id = $(this).data('id');
    for (var i = 0; i < users.length; i++){
        if(users[i].id == id){
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

    if($('.update-users-username').val() == ""){
        showFlashMessage('Gebruikers naam mag niet leeg zijn', 'danger');
    }else{
        if($('.update-users-username').val() == ""){
            showFlashMessage('Uw gebruikersnaam mag niet leeg zijn', 'danger');
        }else if($('.update-users-password').val() != $('.update-users-repeat-password').val()){
            showFlashMessage('Uw wachtwoorden zijn niet gelijk aan elkaar', 'danger');
        }else{
            console.log($('.update-user-level').val());
            $.post("include/updateUser.php" ,{
                id: users[index].id,
                name: $('.update-users-username').val(),
                pass: $('.update-users-password').val(),
                level: $('.update-user-level').val()
            }, function(response,status){
                console.log(response);
                if(response == "succes"){
                    $('.update-users').modal('hide');
                    users[index].username = $('.update-users-username').val();
                    updateLevel1Templates();
                }
            })
        }
    }
})

$('body').on('click','.update-users-cancel',function(){
    $('.update-users').modal('hide');
})
