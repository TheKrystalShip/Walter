import { ModuleMetadata, CommandMetadata } from "@/typings";

// Class decorator
export function Module(options?: ModuleMetadata): Function
{
    return function (constructor: Function): void
    {
        // Add properties indicating the class is a module
        options.name = options.name || "default";
        options.isGrouped = options.isGrouped || false;
        options.isModule = options.isModule || false;

        // If the metadata property already exists, mix it with the options object
        if (constructor.prototype["_moduleMetadata"]) {
            options = Object.assign(options, constructor.prototype["_moduleMetadata"]);
        }

        constructor.prototype._moduleMetadata = options;
    }
}

// Method decorator
export function Command(options?: CommandMetadata): Function
{
    // TODO: handle non-grouped commands
    // TODO: Treat the module name as the command name if no command name is given
    return function (target: Object, propertyKey: string, descriptor: TypedPropertyDescriptor<any>): void
    {
        // Save method name to be used later as a k-v pair with the command name
        options.methodName = propertyKey;

        // Check if async function
        if (descriptor.value.constructor.name === "AsyncFunction") {
            options.isAsync = true;
        }

        // Check if the function expects arguments
        if (descriptor.value.length > 0) {
            options.hasArgs = true;
        }

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
