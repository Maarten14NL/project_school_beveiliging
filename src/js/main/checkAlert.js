// myAudio = new Audio('sounds/PanicAlarm.mp3');
var myAudio;
var floorShown = false;
var lokaalLocation = '';
$(document).ready(function() {
    $.post("include/changeScenarioAlerted.php",{}, function(response,status){
        console.log(response);
    });
});
function checkAlert() {
    if (loggedInUser.level == 3 && !alertActive && loggedIn == true) {
        getCurrentScenario(loggedInUser.level);
    }
    if (loggedInUser.level == 2 && loggedIn == true) {
      getCurrentScenario(loggedInUser.level);
      $.post("include/getScenariosActive.php", {
          alerted: 0,
          finished: 1
      }, function (response, status) {
          var data = JSON.parse(response);
          for (var i = 0; i < data.length; i++) {
              showFlashMessage(data[i].name + " in lokaal: " + data[i].location + " is afgerond", "success", true, 2000, "js-delete-active-scenario", data[i].active_id);
              $.post("include/finishActiveScenario.php", {
                  alerted: 1,
                  finished: 1,
                  activeid: data[i].active_id
              }, function (response, status) {
                  console.log(response);
              });
          }
      });
    }
    setTimeout(checkAlert, 1000);
}

function getCurrentScenario(userLevel){
  $.post("include/getScenariosActive.php", {
      finished: 0,
      alerted: 0
  }, function (response, status) {
      response = JSON.parse(response);
      if (response.length > 0) {
          if(userLevel == 2 && !alertActive){
            $(".level_2.option_2 ").trigger("click");
          }
          myAudio = new Audio("sounds/" + response[0].sound);
          if(response[0].soundActive == 1 && userLevel == 3){
            myAudio.addEventListener('ended', function () {
                this.currentTime = 0;
                this.play();
            }, false); 
            setTimeout(function () {
                myAudio.play();
            }, 100);
          }
          $('.js-close-scenario-modal').html('Afronden');
          lokaalLocation = response[0].location;
          $('.js-alert-title').html(response[0].name + ' in lokaal: ' + lokaalLocation);
          var floornr = lokaalLocation[1];
          if(userLevel == 3){
            $('.' + lokaalLocation).addClass('lokaal--blink');
          }
          setTimeout(function () {
              console.log(floornr);
              console.log(alertActive);
              if(floorShown == false && userLevel == 3){
                $('.floor_' + floornr).trigger('click');
                floorShown = true;
              }
          }, 250);
          alertActive = true;
          $('.js-close-scenario-modal').attr('data-activeid', response[0].active_id);
          if(userLevel == 2){
            var steps = response[0].steps;
            $('.js-alert-body').html('');
            for (var i = 0; i < steps.length; i++) {
                var step = i + 1;
                $('.js-alert-body').append('Stap ' + step + ": " + steps[i].description + "<br>");
            }
          }else{
            if (!response[0].tools) {
                $('.js-alert-body').html('De docent heeft toegang tot deze hulpmiddelen uitgeschakeld');
            } else {
                var steps = response[0].steps;
                $('.js-alert-body').html('');
                for (var i = 0; i < steps.length; i++) {
                    var step = i + 1;
                    $('.js-alert-body').append('Stap ' + step + ": " + steps[i].description + "<br>");
                }
            }
          }
      }else if(userLevel == 2){
        $(".modal-header").text("Meldingen");
        $('.modal-body').text("Er zijn geen meldingen op dit moment");

      }
  })
}
setTimeout(checkAlert, 1000);
$('body').on('click', '.js-delete-active-scenario', function(){
    var todel = $(this).data('todo');
    console.log(todel);
    $.post("include/finishActiveScenario.php", {
        del: 1,
        activeid: todel
    }, function (response, status) {
        console.log(response);
    });
});
$('body').on('click', '.js-close-scenario-modal', function () {
    var activeid = $(this).attr('data-activeid');
    myAudio.pause();
    alertActive = false;
    floorShown = false;
    $('.' + lokaalLocation).removeClass('lokaal--blink');
    $('.js-alert-title').html('meldingen');
    $('.js-alert-body').html('Er zijn geen meldingen op dit moment');
    $('.js-close-scenario-modal').html('');
    $.post("include/finishActiveScenario.php", {
        activeid: activeid,
        finished: 1,
        alerted: 0
    }, function (response, status) {
        console.log(response);
        if (response == 'success') {

        }
    });
});
$('.scenario').on('hidden.bs.modal', function () {
    // console.log("close")
    if (loggedInUser.level == 3 && loggedIn == true) {
        alertActive = false;
        floorShown = false;
    }
})
