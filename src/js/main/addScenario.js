$('.js-newstep').on('propertychange input', function (e) {
    var elem = $(this);
    console.log(elem);
    var parent = $(elem).closest('.js-new-scenario-steps');
    var checkElem = $(parent).find('.js-newstep:last-child');
    console.log(checkElem);
    if (elem == checkElem) {
        console.log('yes');
    }
});
