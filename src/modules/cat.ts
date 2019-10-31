import { Message, PartialMessage } from "discord.js";
import { Module, Command } from "@/decorators";
import { CommandResult } from "@/typings";
import { SuccessResult } from "@/commands";
import fetch from "node-fetch";

@Module({ name: "cat" })
export default class Cat
{
    @Command({ name: "cat" })
    public async catAsync(message: Message | PartialMessage, args?: Array<string>): Promise<CommandResult>
    {
        const { file } = await fetch('https://aws.random.cat/meow').then((response: any) => response.json());
        await message.channel.send(file);

        return new SuccessResult();
    }

    @Command({ name: "test", aliases: ["test1"], hasArgs: false })
    public async testAsync(message: Message | PartialMessage, args?: Array<string>): Promise<CommandResult>
    {
        console.log(message);
        await message.reply("test");
        return new SuccessResult();
    }
}
