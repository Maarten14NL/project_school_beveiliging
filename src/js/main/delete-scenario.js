var row;
$('body').on('click', '.level2-btn-delete',function(){
  confirmModal("Senario Verwijderen","Weet u zeker dat u dit scenario wilt verwijderen","confirm-scenario-delete");
  row = $(this).data('id');
})

$('body').on('click','.confirm-scenario-delete',function(){
  for(var i = 0; i < scenarios.length; i++){
    if(scenarios[i].id == row){
      $.post("include/deleteScenarios.php" ,{
        id: scenarios[i].id
      }, function(response,status){
        if(response == "successuccessucces"){
          scenarios.splice(i,1)
          showFlashMessage('Scenario is succesvol verwijderd', "success");
          updateLevel2Templates();
        }
      })
    }
  }
})
