function checkAlert() {
    if(loggedInUser.level == 3 && !alertActive && loggedIn == true){
        $.post("include/getScenariosActive.php" ,{
            finished: 0,
            alerted: 0
        }, function(response,status){
            response = JSON.parse(response);
            if(response.length > 0){
                $('.scenario').modal('show');
                $('.scenario.modal').find('.modal-title').html(response[0].name + ' in lokaal: ' + response[0].location);
                alertActive = true;
                $('.scenario.modal').find('.js-close-scenario-modal').attr('data-activeid', response[0].active_id);
                if (!response[0].tools ) {
                    $('.scenario.modal').find('.modal-body').html('De docent heeft toegang tot deze hulpmiddelen uitgeschakeld');
                }
                else {
                    var steps = response[0].steps;
                    $('.scenario.modal').find('.modal-body').html('');
                    for (var i = 0; i < steps.length; i++) {
                        var step = i + 1;
                        $('.scenario.modal').find('.modal-body').append('Stap ' + step + ": " + steps[i].description + "<br>");
                    }
                }
            }
        })
    }
    if(loggedInUser.level == 2 && loggedIn == true){
        $.post("include/getScenariosActive.php",{
            alerted: 0,
            finished: 1
        }, function(response,status){
            var data = JSON.parse(response);
            // console.log(data);
            for (var i = 0; i < data.length; i++) {
                showFlashMessage(data[i].name + " in lokaal: " + data[i].location + " is afgerond", "success", true);
                $.post("include/finishActiveScenario.php",{
                    alerted: 1,
                    finished: 1,
                    activeid: data[i].active_id
                }, function(response,status){

                });
            }

        });
    }
    setTimeout(checkAlert, 1000);
}
setTimeout(checkAlert, 1000);
$('body').on('click', '.js-close-scenario-modal', function(){
    var activeid = $(this).attr('data-activeid');
    // console.log(activeid);
    $.post("include/finishActiveScenario.php",{
        activeid : activeid,
        finished: 1,
        alerted: 0
        }, function(response,status){
            console.log(response);
            if (response == 'success') {

            }
        });
});
$('.scenario').on('hidden.bs.modal', function () {
    // console.log("close")
    if(loggedInUser.level == 3 && loggedIn == true){
        alertActive = false;
    }
})
