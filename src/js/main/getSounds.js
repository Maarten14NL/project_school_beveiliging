function getfiles() {
    $.post('include/getSounds.php', {}, function(response, status) {
        if (status == 'success') {
            // alert(response);
            var decoded = JSON.parse(response);
            files = decoded;
            $('.js-new-scenario-sound').append('<option value="#">Geen Geluid</option>');
            files.map(function(elem, index) {
                $('.js-new-scenario-sound').append('<option value="' + elem + '">'+elem+'</option>');
            })
        }
    });
}
var files;
getfiles();
