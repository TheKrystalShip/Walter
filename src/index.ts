import { Client, Message, PartialMessage } from "discord.js";
import { prefix, token } from "./config.json";
import ModuleLoader from "@/internal/moduleLoader";
import CommandHandler from "@/commands";
import { CommandRequest, CommandResult, ModuleDescriptor } from "@/typings";

const client: Client = new Client();
client.modules = new Array<ModuleDescriptor>();

const moduleLoader: ModuleLoader = new ModuleLoader();
moduleLoader.loadModules(client);

const commandHandler: CommandHandler = new CommandHandler();
commandHandler.setClient(client);

client.on("ready", () =>
{
    console.log(`Logged in as ${ client.user?.tag }!`);
});

client.on("message", async (message: Message | PartialMessage) =>
{
    // Check for message prefix
    if (!message.content?.startsWith(prefix) || message.author?.bot) {
        return;
    }

    // Separate prefix from the message
    const args: Array<string> = message.content.slice(prefix.length).split(/ +/) || [];
    let commandName: string | undefined = args.shift();

    // Can't find a command name in the message
    if (!commandName) {
        return;
    }

    // Commands are not case sensitive, so we cast everything to lowercase
    commandName = commandName.toLowerCase();

    const commandRequest: CommandRequest = {
        commandName,
        message,
        args
    }

    const result: CommandResult = await commandHandler.handle(commandRequest);
    console.log(result);

    if (result.message) {
        message.reply?.(result.message);
    }
});

client.login(token);
