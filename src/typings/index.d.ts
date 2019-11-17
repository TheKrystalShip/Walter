import { Client, Message, PartialMessage } from "discord.js";

declare module "discord.js" {
    interface Client
    {
        modules: Array<ModuleDescriptor>;
    }
}

export interface ModuleMetadata
{
    name?: string;
    isGrouped?: boolean;
    isModule?: boolean;
    commands?: Array<CommandMetadata>;

    // TS: Allow for property/function calls using index access
    [key: string]: any;
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
    args: Array<string>;
}

export interface ModuleDescriptor
{
    _moduleMetadata: ModuleMetadata;

    // TS: Allow for property/function calls using index access
    [key: string]: any;
}
