function startBotListener() {
    var chatContainerNode = $('.hN.so.Fj.Ij').children(':nth-child(2)')[0];
    var chatObserver = new MutationObserver(function (mutations) {


}

window.setTimeout(function () {
    if (document.body.getAttribute('class') === 'nN') {
        var cid;
        var cidObserver = new MutationObserver(function (mutations) {
            mutations.forEach(function (mutation) {
                startBotListener();
                cid = mutation.target.getAttribute('cid');
                cidObserver.disconnect();
            })
        });

        var cidConfig = {
            attributes: true,
            attributeFilter: ['cid']
        };

        cidObserver.observe(document.body, cidConfig);
    }
}, 1000);
