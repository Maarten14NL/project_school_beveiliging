function getfiles() {
    $.post('include/getSounds.php', {}, function(response, status) {
        if (status == 'success') {
            // alert(response);
            var decoded = JSON.parse(response);
            files = decoded;
            files.map(function(elem, index) {
                $('#scenario-newsound').append('<option value="' + elem + '">'+elem+'</option>');
            })
        }
    });
}
var files;
getfiles();
