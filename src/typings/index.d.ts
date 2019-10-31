import { Client, Message, PartialMessage } from "discord.js";

declare module "discord.js" {
    interface Client
    {
        modules: Map<string, any>
    }
}

export interface ModuleMetadata
{
    name?: string;
    isGrouped?: boolean;
    isModule?: boolean;
    commands?: Array<CommandMetadata>;
}

export interface CommandMetadata
{
    name: string;
    aliases?: Array<string>;
    isAsync?: boolean;
    methodName?: string;
    hasArgs?: boolean;
}

export interface CommandResult
{
    isSuccess: boolean;
    error?: Error;
    message?: string;
}

export interface CommandRequest
{
    message: Message | PartialMessage;
    commandName: string;
    args?: Array<string>;
}
