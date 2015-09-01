function startBotListener() {
    var inputDiv = $('.vE.dQ.editable');
    var chatContainerNode = $('.hN.so.Fj.Ij').children(':nth-child(2)');
    var chatContainerObserver = new MutationObserver(function (mutations) {
        mutations.forEach(function (mutationRecord) {
            for (var i = 0; i < mutationRecord.addedNodes.length; i++) {
                var addedNode = $(mutationRecord.addedNodes[i]);
                if (addedNode.hasClass('.tk.Sn')) {
                    var chatBlock = addedNode.find('.JL');
                    if (chatBlock.length === 1) {
                        console.error('New chatter: ' + addedNode.find('Up.pC').find('img').attr('title'));
                        console.error('New chat: ' + chatBlock.children().children(':last-child').text());
                        chatBlockObserver.disconnect();
                        chatBlockObserver.observe(chatBlock.get(0), observerConfig);
                    }
                }
            }
        });
    });
    var chatBlockObserver = new MutationObserver(function (mutations) {
        mutations.forEach(function (mutationRecord) {
            for (var i = 0; i < mutationRecord.addedNodes.length; i++) {
                var addedNode = $(mutationRecord.addedNodes[i]);
                if (addedNode.hasClass('.Mu.SP')) {
                    console.error('New chat: ' + addedNode.children(':last-child').text());
                }
            }
        });
    });
    var observerConfig = {
        childList: true
    };

    chatContainerObserver.observe(chatContainerNode.get(0), observerConfig);
    chatBlockObserver.observe(chatContainerNode.children(':last-child').get(0), observerConfig);
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
