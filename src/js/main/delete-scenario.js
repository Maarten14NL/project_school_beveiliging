var rowClass;
var row;
$('body').on('click', '.level2-btn-delete',function(){
  confirmModal("Senario Verwijderen","Weet u zeker dat u dit scenario wilt verwijderen","confirm-scenario-delete");
  rowClass = $(this).parent().parent().attr("class");
  row = $(this).parent().parent().attr("class").split("index")[1];
})

$('body').on('click','.confirm-scenario-delete',function(){
  for(var i = 0; i < scenarios.length; i++){
    if(scenarios[i].id == row){
      $.post("include/deleteScenarios.php" ,{
        id: scenarios[i].id
      }, function(response,status){
        console.log(response)
        if(response == "successuccessucces"){
          console.log(rowClass)
          scenarios.splice(i,1)
          $("."+rowClass).remove();
          updateLevel2Templates();
        }
      })
    }
  }
})
