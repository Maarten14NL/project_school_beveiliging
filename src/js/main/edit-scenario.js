var rowSelected = 0;
var index = 0;
var descriptions = [];
var senId = "";
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

        console.log("description"+descriptions);

        var template = $(".level2-scenario-edit-template").html();
        var renderTemplate = Mustache.render(template, descriptions);

        $(".scenario-edit-options-container").html(renderTemplate);

        $('.update-scenarios-name').val(scenarios[index].name)
        $('#scenario-editcategory').val(scenarios[index].category)

        $('.scenario-edit').modal('show');
    })
})

$('body').on('click', '.update-scenarios-add', function(){
  var container = $(this).closest(".modal-body");
  var item = container.find(".js-scenario-edit-step").clone().removeClass("hidden");
  var lastItem = "";
  var num = -1;

  container.find(".scenario-edit-options-container").append($(item)[0]);

  item = container.find(".js-scenario-edit-step");
  lastItem = item[item.length-1];

  console.log(item.length);

  if(item.length <= 2){
    $(lastItem).find("span").html("1");
  }
  else {
    num = $(item).find("span")[item.length -2];
    num = parseInt($(num).text())+1;
    $(lastItem).find("span").html(num);
  }

  console.log("num" + num);
  if(num == -1 || num =="-1"){
    num = 1;
  }

  $(lastItem).find(".js-scenario-edit-edit")
          .removeClass()
          .addClass("js-scenario-edit-edit")
          .addClass("form-control")
          .addClass("js-scenario-edit-"+num)
          .val("");
  $(lastItem).find(".js-scenario-edit-detail").removeClass()
                                              .addClass("js-scenario-edit-detail")
                                              .addClass("form-control")
                                              .addClass("js-scenario-edit-detail-"+num)
                                              .val("");
  var scenarios_id = "";
  if(descriptions.length > 1){
    scenarios_id = descriptions[0].scenarios_id;
  }else{
    scenarios_id = rowSelected;
  }

  descriptions.push({description:"",detail:"",id:-1,index:num,scenarios_id:scenarios_id});
})

$('body').on('click', '.update-scenarios-update', function(){
    descriptionNames = [];
    descriptionDescription = [];
    console.log(descriptions);
    for(var i = 1 ; i < (descriptions.length+1); i++){
      console.log($('.js-scenario-edit-'+i).val() + " " + i)
        if($('.js-scenario-edit-'+i).val() != ""){
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
      // console.log(JSON.parse(response));
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
