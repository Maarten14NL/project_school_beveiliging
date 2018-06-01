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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImhvbWUuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6Im1haW4uanMiLCJzb3VyY2VzQ29udGVudCI6WyIkKGRvY3VtZW50KS5yZWFkeShmdW5jdGlvbigpe1xyXG4gIGNvbnNvbGUubG9nKFwibG9hZGVkXCIpXHJcbiAgJCgnYm9keScpLm9uKCdjbGljaycsICcubWVudS1pdGVtJywgZnVuY3Rpb24oKXtcclxuICAgIHZhciBpZCA9ICQodGhpcykuYXR0cihcImNsYXNzXCIpLnNwbGl0KCdfJylbMV07XHJcbiAgICBjb25zb2xlLmxvZyhpZClcclxuICAgIGZvcih2YXIgaSA9IDA7IGkgPCA0OyBpKyspe1xyXG4gICAgICAkKCcudmVyZGllcGluZ19fJytpKS5hZGRDbGFzcyhcImhpZGRlblwiKVxyXG4gICAgfVxyXG4gICAgJCgnLnZlcmRpZXBpbmdfXycraWQpLnJlbW92ZUNsYXNzKFwiaGlkZGVuXCIpXHJcbiAgfSlcclxufSlcclxuIl19
