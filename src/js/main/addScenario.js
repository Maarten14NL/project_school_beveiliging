// When "scenario maken" tab is active, it checks when a textbox is filled in
$('body').on('propertychange input', '.js-newstep',function(e){
    // It gets the parent element,
    var parent = $(this).closest('.js-step');
    // Checks if the parent (row), is the last row in the table
    if ($(parent).is(':last-child')) {
        // Clones the new step into the container and unhides it
        copyStep();
    }
});

// function loops through every step and gives them the right number
function updateSteps(){
    var count = 0;
    $('.js-stepnr').each(function () {
        $(this).html(count);
        count++;
    });
}

// When the "extra stap" button is pressed, a new step is copied in
$('body').on('click', '.js-addstep',function(){
    copyStep()
});

// Saves the scenario with it's name and steps into the database, and clears all inputs
$('body').on('click', '.js-save-new-scenario',function(){
    // Gets the name from the input
    var name = $('.js-new-scenario-name').val();
    var steps = [];
    var sound = $('#scenario-newsound').val();
    console.log(sound);
    // If the name is empty it gives a flash message
    if (name == '') {
        showFlashMessage('Vul eerst een naam in', 'danger');
    }
    else{
        // Gets the description of every step input, and places them into steps array
        $('.js-newstep').each(function () {
            var tempval = $(this).val();
            if (tempval != "") {
                steps.push(tempval);
            }
        });

        if (steps.length == 0) {
            showFlashMessage('Vul minstens 1 stap in', 'danger');
        }
        else{
            $.post("include/saveNewScenario.php" ,{
                name: name,
                steps: steps,
                sound: sound
            }, function(response,status){
                console.log(response);
                if(response == "succes"){
                    showFlashMessage('Scenario succesvol toegevoegd', 'success');
                    $('.js-steps-container .steps__step').not('.js-copystep').remove();
                    $('.js-new-scenario-name').val('');
                    copyStep()
                    updateLevel2Templates();
                }
            })
        }
    }
});
function copyStep(){
    $('.js-copystep').clone().appendTo('.js-steps-container')
    .removeClass('js-copystep').removeClass('hidden')
    .addClass('js-step');
    updateSteps();
}
$('body').on('click', '.js-delete-step',function(){
    var parent = $(this).closest('.js-step');
    if (!$(parent).is(':first-child')) {
        $(parent).remove();
        updateSteps();
    }
    else {
        showFlashMessage('Je kunt niet de eerste stap verwijderen', 'danger');
    }
});
