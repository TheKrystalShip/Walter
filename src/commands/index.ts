import { CommandResult, CommandMetadata, CommandRequest, ModuleMetadata, ModuleDescriptor } from "@/typings";
import { Client } from "discord.js";

export class SuccessResult implements CommandResult
{
    public isSuccess: boolean;
    public error?: Error;
    public message?: string;

    public constructor(message?: string)
    {
        this.isSuccess = true;
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
        let _module: ModuleDescriptor | undefined;
        let command: CommandMetadata | undefined;

        // Try and find the given command in one of the modules
        for (let i = 0; i < this._client.modules.length; i++) {
            const moduleDescriptor: ModuleDescriptor = this._client.modules[i];

            // Use the built in function to try and find the command
            // `getCommand` is added in the @Module decorator
            command = moduleDescriptor["_moduleMetadata"]["getCommand"](options.commandName);

            // If found, assign it and stop iterating
            if (command) {
                _module = moduleDescriptor;
                break;
            }
        }

        // Check if command was found
        if (!command || !command.methodName || !_module) {
            return new ErrorResult("Failed to find command module");
        }

        // Try to execute the command
        try {
            if (command.isAsync) {
                return await _module[command.methodName](options.message);
            } else {
                return Promise.resolve(_module[command.methodName](options.message));
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
