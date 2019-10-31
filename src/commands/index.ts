import { CommandResult, CommandMetadata, CommandRequest } from "@/typings";
import { Client } from "discord.js";

export class SuccessResult implements CommandResult
{
    public isSuccess: boolean;
    public error?: Error;
    public message?: string;

    public constructor(message?: string)
    {
        this.isSuccess = true;
        this.error = null;
        this.message = message;
    }
}

export class ErrorResult implements CommandResult
{
    public isSuccess: boolean;
    public error?: Error;
    public message?: string;

    public constructor(error: Error | string, message?: string)
    {
        this.isSuccess = false;

        if (typeof error === "string") {
            error = new Error(error);
        }

        this.error = error;
        this.message = message;
    }
}

export default class CommandHandler
{
    private _client: Client;

    public setClient(client: Client)
    {
        this._client = client;
    }

    public async handle(options: CommandRequest): Promise<CommandResult>
    {
        // Check if command exists
        if (!this._client.modules.has(options.commandName)) {
            return;
        }

        const _module: any = this._client.modules.get(options.commandName);

        // Find the CommandMetadata from the module
        // module with have "_moduleMetadata" defined, it's added when registering all modules
        // "commands" is an array of CommandMetadata types
        const moduleCommand: CommandMetadata | undefined = _module["_moduleMetadata"]["commands"]
            .find((command: CommandMetadata) => command.name === options.commandName);

        // Module doesn't have the specified command
        if (!moduleCommand) {
            return;
        }

        // Try to execute the command
        try {
            if (moduleCommand.isAsync) {
                return await _module[moduleCommand.methodName](options.message);
            } else {
                return Promise.resolve(_module[moduleCommand.methodName](options.message));
            }
        } catch (error) {
            console.error(error);

            if (null !== options.message.reply) {
                options.message.reply('There was an error trying to execute that command!');
            }

            return Promise.resolve(new ErrorResult(error));
        }
    }
}
