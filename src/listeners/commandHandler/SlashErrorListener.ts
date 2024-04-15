import { AkairoMessage } from "@lichking112/discord-akairo";
import { Message } from "discord.js";
import { BaseCommand } from "../../structures/client/BaseCommand";
import { BaseListener } from "../../structures/client/BaseListener";

class SlashErrorListener extends BaseListener {

    constructor() {
        super("slashError", {
            emitter: "commandHandler",
            event: "slashError"
        });
    }

    async exec(error: Error, message: AkairoMessage, command: BaseCommand): Promise<Message> {
        this.client.logger.error(`An error occured on command ${command.id}: ${error.message}`);
        return message.util.reply("An error occured during the interaction.");
    }

}

export = SlashErrorListener;