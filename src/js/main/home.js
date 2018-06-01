$(document).ready(function(){
  console.log("loaded")
  $('body').on('click', '.menu-item', function(){
    var id = $(this).attr("class").split('_')[1];
    console.log(id)
    for(var i = 0; i < 4; i++){
      $('.verdieping__'+i).addClass("hidden")
    }
    $('.verdieping__'+id).removeClass("hidden")
  })
})
