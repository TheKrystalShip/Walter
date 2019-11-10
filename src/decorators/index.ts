import { ModuleMetadata, CommandMetadata } from "@/typings";

// Class decorator
export function Module(options?: ModuleMetadata): Function
{
    return function (constructor: Function): void
    {
        if (!options) {
            options = {};
        }

        // --- Add properties indicating the class is a module
        options.name = options.name || "default";
        options.isGrouped = options.isGrouped || false;
        options.isModule = options.isModule || true;

        // --- Add some convenient methods to use later
        // Added as indexes to avoid TS complaining about breaking the contract with the
        // ModuleMetadata interface
        options["getCommand"] = (name: string): CommandMetadata | undefined =>
        {
            // Commands are not case sensitive
            name = name.toLowerCase();

            // Try and find either a command or an alias of a command with the given name
            return options?.commands?.find(
                (command: CommandMetadata) => command.name.toLowerCase() === name ||
                    command.aliases?.find((alias: string) => alias.toLowerCase() === name)
            );
        }

        // If the metadata property already exists, mix it with the options object
        if (constructor.prototype["_moduleMetadata"]) {
            options = Object.assign(options, constructor.prototype["_moduleMetadata"]);
        }

        constructor.prototype["_moduleMetadata"] = options;
    }
}

// Method decorator
export function Command(options?: CommandMetadata): Function
{
    /**
     * TODO: handle non-grouped commands
     * TODO: Treat the module name as the command name if no command name is given
     *
     * @param {Object} target Object.prototype
     * @param {string} propertyKey Function name
     * @param {TypedPropertyDescriptor<any>} descriptor Function being called
     */
    return function (target: Object, propertyKey: string, descriptor: TypedPropertyDescriptor<any>): void
    {
        if (!options) {
            options = {
                name: "",
                methodName: propertyKey
            };
        }

        // Save method name to be used later as a k-v pair with the command name
        options.methodName = propertyKey;
        options.aliases = options.aliases || [];

        // Check if the function is async
        if (descriptor.value.constructor.name === "AsyncFunction") {
            options.isAsync = true;
        }

        // Check if the function expects arguments
        if (descriptor.value.length > 0) {
            options.hasArgs = true;
        }

        // target["_moduleMetadata"] is usually not present when loading the commands,
        // but it's safer to check to avoid overriding in case it does exist
        // Assign the metadata to the object
        if (!target["_moduleMetadata"]) {
            target["_moduleMetadata"] = {};
        }

        if (!target["_moduleMetadata"]["commands"]) {
            target["_moduleMetadata"]["commands"] = [];
        }

        target["_moduleMetadata"]["commands"].push(options);
    };
}
