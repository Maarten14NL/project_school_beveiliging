var rowSelected = 0;
var index = 0;
var descriptions = [];
$('body').on('click', '.level2-btn-edit', function(){
    rowSelected = $(this).data('id');
    for (var i = 0; i < scenarios.length; i++){
        if(scenarios[i].id == rowSelected){
            index = i
        }
    }
    $('#scenario-editsound').val(scenarios[index].sound)
    $.post("include/getScenerioDesc.php" ,{
        id: scenarios[index].id
    }, function(response,status){
        descriptions = JSON.parse(response)

        descriptions.map(function(cp,i){
            cp.index = i+1;
        })

        var template = $(".level2-scenario-edit-template").html();
        var renderTemplate = Mustache.render(template, descriptions);

        $(".scenario-edit-options-container").html(renderTemplate);

        $('.update-scenarios-name').val(scenarios[index].name)
        $('#scenario-editcategory').val(scenarios[index].category)

        $('.scenario-edit').modal('show');
    })
})

$('body').on('click', '.update-scenarios-update', function(){
    descriptionNames = [];
    descriptionDescription = [];
    for(var i = 1 ; i < (descriptions.length+1); i++){
        if($('.js-scenario-edit-'+i).val() != ""){
          console.log($('.js-scenario-edit-'+i).val())
            descriptionNames.push($('.js-scenario-edit-'+i).val())
            descriptionDescription.push($('.js-scenario-edit-detail-'+i).val())
        }
    }
    var sound = $('#scenario-editsound').val();
    var category = $('#scenario-editcategory').val();
    $.post("include/updateScenario.php" ,{
        scenarioID: scenarios[index].id,
        name: $('.update-scenarios-name').val(),
        descriptions: descriptionNames,
        sound: sound,
        category: category,
        details: descriptionDescription
    }, function(response,status){
      console.log(response)
        $('.scenario-edit').modal('hide');
        updateLevel2Templates();
    })
})

$('body').on('click', '.js-scenario-edit-delete',function(){
    var parent = $(this).closest('.js-scenario-edit-step');
    if (!$(parent).is(':first-child')) {
        $(parent).remove();
        updateSteps();
    }
    else {
        showFlashMessage('Je kunt niet de eerste stap verwijderen', 'danger');
    }
});
