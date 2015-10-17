/// <reference path='../../typings/tsd.d.ts' />
namespace Common {
    interface CommandDictionary {
        [command: string]: CommandFunction;
    }

    export interface CommandFunction {
        (args: string[]): JQueryPromise<string>;
    }

    export class Commands {
        private _url: string = 'http://localhost:8089';
        private _commands: CommandDictionary = {
            bot_time: function () {
                return $.when(new Date().toString());
            },
            commands: () => {
                return $.get(`${this._url}/commands`).then((data: string) => {
                    return `${Object.keys(this._commands).join(',')},${data}`;
                });
            },
            echo: function (args) {
                return $.when(`You said ${args.join('')}`);
            },
            issue_link: function () {
                return $.when('https://github.com/mcw8d/KappaBotRelays/issues/new');
            },
            version: () => {
                return $.when(this.version);
            }
        }

        constructor (private version: string) {}

        execute(command: string, args: string[]): JQueryPromise<string> {
            if (this.has(command)) {
                console.debug(`Local command ${command} being executed.`);
                return this.get(command)(args);
            } else {
                console.debug(`No local command for ${command}, trying the server.`);
                return $.get(`${this._url}/execute/${command}`);
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
