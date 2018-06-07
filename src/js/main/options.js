$("body").on("click", ".options", function(){
  var level = $(this).attr("class").split(" ")[1].split("_")[1];
  var option = $(this).attr("class").split(" ")[2].split("_")[1];
  console.log(level)

  $(".view").addClass("hidden")
  $(".view_"+level+"-"+option).removeClass("hidden")
  // console.log()
  $('.options').removeClass('active');

  $(this).addClass('active');
  switch (level) {
    case "1":
      updateLevel1Templates();
      break;
    case "2":
      updateLevel2Templates();
      break;
  }
})
