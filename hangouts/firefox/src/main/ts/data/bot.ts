/// <reference path="../../typings/tsd.d.ts" />
/// <reference path="commands.ts" />
interface Window {
    options: any;
}

interface KeyboardEventInit {
    keyCode: number;
}

namespace KappaBot {
    export class Relay {
        private _chatContainer = $('.hN.so.Ij').children(':nth-child(2)');
        private _inputDiv = $('.vE.dQ.editable');
        private _commandRegEx = /^\!(\w+)(?:\((.*)\))?/;
        private _commands = new Common.Commands(self.options.version);
        private _currentChatObserver: MutationObserver;
        private _newChatObserver: MutationObserver;
        private _observerConfig: MutationObserverInit = {
            childList: true
        };

        constructor (private _cid: string) {
            var _this = this;
            var _doneCallback = _this.emitResponse.bind(_this);
            var _failCallback = console.debug;

            this._currentChatObserver = new MutationObserver(function (mutations) {
                mutations.forEach(function (mutation) {
                    for (var i = 0; i < mutation.addedNodes.length; i++) {
                        var addedNode = $(mutation.addedNodes[i]);
                        if (addedNode.hasClass('Mu SP')) {
                            var message = addedNode.children(':last-child').text();
                            _this.processMessage(message)
                                .done(_doneCallback)
                                .fail(_failCallback);
                        }
                    }
                });
            });

            this._newChatObserver = new MutationObserver(function (mutations) {
                mutations.forEach(function (mutation) {
                    for (var i = 0; i < mutation.addedNodes.length; i++) {
                        var addedNode = $(mutation.addedNodes[i]);
                        if (addedNode.hasClass('tk Sn') && addedNode.is(':last-child')) {
                            var chatBlock = addedNode.find('.JL');
                            var message = chatBlock.children().children(':last-child').text();

                            _this._currentChatObserver.disconnect();
                            _this._currentChatObserver.observe(chatBlock.get(0), _this._observerConfig);

                            _this.processMessage(message)
                                .done(_doneCallback)
                                .fail(_failCallback);
                        }
                    }
                });
            });

            this._newChatObserver.observe(this._chatContainer.get(0), this._observerConfig);
            this._currentChatObserver.observe(this._chatContainer.children(':last-child').find('.JL').get(0), this._observerConfig);

            console.debug(`New relay started for ${this._cid}`);
        }

        close () {
            this._newChatObserver.disconnect();
            this._currentChatObserver.disconnect();
            console.debug(`Relay closing for ${this._cid}`);
        }

        processMessage (message: string): JQueryPromise<string> {
            var regexResults = this._commandRegEx.exec(message);
            if (regexResults !== null) {
                var args = (regexResults[2] || '').split(',');
                return this._commands.execute(regexResults[1], args);
            }
            return $.Deferred<string>().reject('No command found').promise();
        }

        emitResponse (response: string) {
            var inputElement = this._inputDiv.get(0);
            inputElement.dispatchEvent(
                new FocusEvent('focus', {bubbles: true, cancelable: true})
            );
            var lines = response.split('\n');
            lines.forEach((line, idx, arr) => {
                this._inputDiv.append(document.createTextNode(line));
                if (idx !== (arr.length - 1)) {
                    this._inputDiv.append(document.createElement('br'));
                }
            });
            inputElement.dispatchEvent(
                new KeyboardEvent('keypress', {key: 'Enter', keyCode: 13, bubbles: true, cancelable: true})
            );
        }
    }
}

window.setTimeout(function () {
    if (document.body.getAttribute('class') === 'nN') {
        var cidObserverConfig: MutationObserverInit = {
            attributes: true,
            attributeFilter: ['cid']
        };
        var cidObserver = new MutationObserver(function (mutations) {
            mutations.forEach(function (mutation) {
                if (mutation.target instanceof Element) {
                    var chatBot = new KappaBot.Relay((<Element>mutation.target).getAttribute('cid'));
                    cidObserver.disconnect();
                }
            });
        });

        cidObserver.observe(document.body, cidObserverConfig);
    }
}, 1000);
