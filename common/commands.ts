namespace Common {
    interface CommandDictionary {
        [command: string]: CommandFunction;
    }

    export interface CommandFunction {
        (deferred: JQueryDeferred<string>, args: string[]): void;
    }

    export class Commands {
        private _commands: CommandDictionary = {
            bot_time: function (deferred) {
                deferred.resolve(new Date().toString());
            },
            commands: (deferred) => {
                deferred.resolve(Object.keys(this._commands).join(', '));
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
                // TODO call back to localhost if a server is present.
                deferred.reject('Command not found.');
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
