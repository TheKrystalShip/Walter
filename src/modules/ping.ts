import { Message, PartialMessage } from "discord.js";
import { Module, Command } from "@/decorators";
import { CommandResult } from "@/typings";
import { SuccessResult } from "@/commands";

@Module({ name: "ping" })
export default class Ping
{
    @Command({ name: "ping" })
    public async pongAsync(message: Message | PartialMessage, args?: Array<string>): Promise<CommandResult>
    {
        await message.channel.send("Pong.");
        return new SuccessResult();
    }
}
