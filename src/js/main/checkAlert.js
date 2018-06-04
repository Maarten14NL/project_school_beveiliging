function checkAlert() {
  if(loggedInUser.level == 3 && !alertActive){
    $.post("include/getScenariosActive.php" ,{
    }, function(response,status){
      response = JSON.parse(response);
      if(response.length > 0){
        $('.scenario').modal('show');
        alertActive = true;
      }
    })
  }
  setTimeout(checkAlert, 1000);
}
setTimeout(checkAlert, 1000);

$('.scenario').on('hidden.bs.modal', function () {
  alertActive = false;
})
