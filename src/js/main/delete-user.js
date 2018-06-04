$('body').on('click', '.level1-btn-delete',function(){
  var rowClass = $(this).parent().parent().attr("class");
  var row = $(this).parent().parent().attr("class").split("index")[1];
  console.log(users)
  for(var i = 0; i < users.length; i++){
    if(users[i].index == row){
      $.post("include/deleteUser.php" ,{
        id: users[i].id
      }, function(response,status){
        // console.log(response);
        if(response == "succes"){
          console.log(rowClass)
          $("."+rowClass).remove();
        }
      })
    }
  }
})
