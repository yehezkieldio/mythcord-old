import { Command, CommandOptions } from "@lichking112/discord-akairo";
import { BaseClient } from "./BaseClient";

interface ExampleOptions {
    description: string;
    usage: string;
}

interface BaseCommandOptions extends CommandOptions {
    description: {
        content?: string;
        usage?: string;
        examples?: ExampleOptions[];
    };
}

export class BaseCommand extends Command {
    
    client: BaseClient;
    
    constructor(id: string, options: BaseCommandOptions) {
        super(id, options);
    }

}