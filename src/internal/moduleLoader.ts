import { readdirSync } from "fs";
import { Client } from "discord.js";
import { ModuleMetadata } from "@/typings";

export default class ModuleLoader
{
    public loadModules(client: Client)
    {
        // Find all the modules inside the "/modules" folder
        const folder = __dirname + "/../modules";

        const modules: string[] = readdirSync(folder)
            .filter((file: string) => file.endsWith(".js"));

        for (const _module of modules) {

            try {
                // Import the command module
                let command: any = require(folder + "/" + _module);

                // If found, instantiate it's class
                if (command) {
                    command = new command.default();
                }

                // Fetch metadata form the module's prototype
                // If it's undefined it means it's not a module, so we ignore it and continue
                const moduleMetadata: ModuleMetadata | undefined = command.constructor.prototype["_moduleMetadata"];

                // Set a new item in the Collection
                // with the key as the command name and the value as the exported module
                if (moduleMetadata) {
                    client.modules.push(Object.assign(command, moduleMetadata));
                }

            } catch (exception) {
                console.error(exception);
            }
        }
    }
}
