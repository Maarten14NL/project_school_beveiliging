$("body").on("click", ".options", function(){
  var level = $(this).attr("class").split(" ")[1].split("_")[1];
  var option = $(this).attr("class").split(" ")[2].split("_")[1];

  $(".view").addClass("hidden")
  $(".view_"+level+"-"+option).removeClass("hidden")

  switch (level) {
    case "1":
      $.post("include/getUsers.php",{
      }, function(response,status){
        // console.log(response)
        users = JSON.parse(response)

        for(var i = 0; i < 2; i++){
          console.log(i)
          users.map(function(cp,j){
            cp.index = j;
            // console.log(i)
            if(i == 0){
              cp.class = "edit"
              cp.classText = "aanpassen"
            }else if(i == 1){
              cp.class = "delete"
              cp.classText = "verwijderen"
            }
          })

          for(var j = 0; j < users.length; j++){
            if(users[j].userlevel == 1){
              users.splice(j,1)
            }
          }

          console.log(users)

          var template = $(".level1-user-template").html();
          var renderTemplate = Mustache.render(template, users);

          if(i == 0){
            $(".user-level1-edit").html(renderTemplate);
          }else if(i == 1){
            $(".user-level1-delete").html(renderTemplate);
          }
        }
      })
      break;
  }
})
