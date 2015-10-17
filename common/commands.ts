/// <reference path='../../typings/tsd.d.ts' />
namespace Common {
    interface CommandDictionary {
        [command: string]: CommandFunction;
    }

    export interface CommandFunction {
        (deferred: JQueryDeferred<string>, args: string[]): void;
    }

    export class Commands {
        private _url: string = 'http://localhost:8089';
        private _commands: CommandDictionary = {
            bot_time: function (deferred) {
                deferred.resolve(new Date().toString());
            },
            commands: (deferred) => {
                $.get(`${this._url}/commands`, (data: string) => {
                    deferred.resolve(`${Object.keys(this._commands).join(',')},${data}`);
                });
            },
            echo: function (deferred, args) {
                deferred.resolve(`You said ${args.join('')}`);
            },
            report_issue: function (deferred) {
                deferred.resolve('https://github.com/mcw8d/KappaBotRelays/issues/new');
            },
            version: (deferred) => {
                deferred.resolve(this.version);
            }
        }

        constructor (private version: string) {}

        execute(command: string, args: string[], deferred: JQueryDeferred<string>) {
            if (this.has(command)) {
                this.get(command)(deferred, args);
            } else {
                $.get(`${this._url}/commands`, (data: string) => {
                    var serverCommands = data.split(',');
                    if (serverCommands.indexOf(command) !== -1) {
                        $.get(`${this._url}/execute/${command}`, function (data: string) {
                            deferred.resolve(data);
                        });
                    } else {
                        deferred.reject('Command not found.');
                    }
                });
            }
        }

        get(command: string): CommandFunction {
            return this._commands[command];
        }

        has(command: string): boolean {
            return this._commands.hasOwnProperty(command);
        }
    }
}
