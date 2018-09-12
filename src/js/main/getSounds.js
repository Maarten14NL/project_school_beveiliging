function getfiles() {
    $.post('include/getSounds.php', {}, function(response, status) {
        if (status == 'success') {
            // alert(response);
            var decoded = JSON.parse(response);
            console.log(response);
            files = decoded;
        }
    });
}
var files;
getfiles();
