function startBotListener() {
    var commands = {
        'bot_time': function () {
            return (new Date()).toString();
        }
    };
    var inputDiv = $('.vE.dQ.editable');
    var keydownEvent = new KeyboardEvent('keydown', { key: 'A' });
    var keypressEvent = new KeyboardEvent('keypress', { key: 'A' });
    var keyupEvent = new KeyboardEvent('keyup', { key: 'A' });

    var commandRegEx = /^#\!(\w+)/
    var chatContainerNode = $('.hN.so.Ij').children(':nth-child(2)');
    var chatContainerObserver = new MutationObserver(function (mutations) {
        mutations.forEach(function (mutationRecord) {
            for (var i = 0; i < mutationRecord.addedNodes.length; i++) {
                var addedNode = $(mutationRecord.addedNodes[i]);
                if (addedNode.hasClass('tk Sn')) {
                    var chatBlock = addedNode.find('.JL');
                    if (chatBlock.length === 1) {
                        console.error('New chatter: ' + addedNode.find('Up.pC').find('img').attr('title'));
                        var response = parseTextForCommand(chatBlock.children().children(':last-child').text());
                        if (response) {
                            emitResponse(response);
                        }
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
                if (addedNode.hasClass('Mu SP')) {
                    var response = parseTextForCommand(addedNode.children(':last-child').text());
                    if (response) {
                        emitResponse(response);
                    }
                }
            }
        });
    });
    var observerConfig = {
        childList: true
    };

    chatContainerObserver.observe(chatContainerNode.get(0), observerConfig);
    chatBlockObserver.observe(chatContainerNode.children(':last-child').find('.JL').get(0), observerConfig);

    function parseTextForCommand (text) {
        var response;
        if (text.search(commandRegEx) !== -1) {
            var command = commandRegEx.exec(text)[1];
            if (commands.hasOwnProperty(command)) {
                response = commands[command]();
            }
        }
        return response;
    }

    function emitResponse (response) {
        var selection;
        var range;
        inputDiv.focus();
        /*selection = window.getSelection();
        range = selection.getRangeAt(0);
        range.deleteContents();
        range.insertNode(document.createTextNode(response));*/
        selection = inputDiv.get(0);
        selection.dispatchEvent(keydownEvent);
        selection.dispatchEvent(keypressEvent);
        selection.dispatchEvent(keyupEvent);
    }
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
