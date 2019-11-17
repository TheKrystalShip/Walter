import { Message, PartialMessage } from "discord.js";
import { Module, Command } from "@/decorators";
import { CommandResult } from "@/typings";
import { ErrorResult, SuccessResult } from "@/commands";
import { VoiceConnection } from "discord.js";
import { StreamDispatcher } from "discord.js";

@Module()
export default class Audio
{
    private _voiceConnection?: VoiceConnection;
    private _playlist: Array<string> = [];
    private _isPlaying: boolean = false;

    @Command({ name: "join" })
    public async joinAsync(message: Message | PartialMessage, args?: Array<string>): Promise<CommandResult>
    {
        try {
            this._voiceConnection = await message.member?.voice?.channel?.join?.();
            return new SuccessResult();
        } catch (error) {
            console.log(error);
            return new ErrorResult(error);
        }
    }

    @Command({ name: "leave", aliases: ["fuck off"]})
    public async leaveAsync(message: Message | PartialMessage, args?: Array<string>): Promise<void>
    {
        this._voiceConnection?.disconnect();
    }

    @Command({ name: "play" })
    public async playAsync(message: Message | PartialMessage, args?: Array<string>): Promise<CommandResult>
    {
        // If no song is passed
        if (!args || args?.length === 0) {
            return new ErrorResult("You didn't specify anything to play");
        }

        // Connect to voice channel if not already connected
        if (!this._voiceConnection) {
            await this.joinAsync(message, args);
        }

        // Consider the rest of the arguments as a single string
        const song = args.join(" ");

        this._playlist.push(song);

        if (!this._isPlaying) {
            this.playbackAsync();
        }

        return new SuccessResult();
    }

    @Command({ name: "queue", aliases: ["list"] })
    public async queueAsync(message: Message | PartialMessage, args?: Array<string>): Promise<CommandResult>
    {
        if (!this._voiceConnection) {
            return new ErrorResult("Not connected to a voice channel");
        }

        if (this._playlist.length === 0) {
            return new SuccessResult("Playlist is empty");
        }

        let response: string = "Song list: \n";

        this._playlist.forEach((song: string, index: number) => {
            response += `${index + 1}: ${song} \n`;
        });

        return new SuccessResult(response);
    }

    private async playbackAsync()
    {
        if (!this._voiceConnection) {
            return;
        }

        while (this._playlist.length > 0) {
            const song: string | undefined = this._playlist.shift();

            // Try next song?
            if (!song) {
                continue;
            }

            console.log(`Playing: "${song}"`);
            this._isPlaying = true;
            const dispatcher: StreamDispatcher = this._voiceConnection?.play(song);

            dispatcher.on("end", () => {
                console.log("Finished streaming audio");
            })
        }
    }

    @Command({ name: "stop" })
    private stopPlayback(): void
    {
        this._isPlaying = false;
        this._voiceConnection?.disconnect();
    }
}
