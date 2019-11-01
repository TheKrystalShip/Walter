import { ModuleDescriptor, CommandMetadata, ModuleMetadata } from "@/typings";

export default class ModuleInspector
{
    private readonly _metadata: ModuleMetadata;

    public constructor(_module: ModuleDescriptor)
    {
        this._metadata = _module._moduleMetadata;
    }

    public getGroup(): string | null
    {
        if (this._metadata.isGrouped) {
            return this._metadata.name;
        }

        return null;
    }

    public getCommands(): Array<CommandMetadata>
    {
        return this._metadata.commands;
    }

    public getCommand(name: string): CommandMetadata | undefined
    {
        return this._metadata["getCommand"](name);
    }
}
