import { Message } from "discord.js";
import { BaseCommand } from "../../structures/client/BaseCommand";

class PingCommand extends BaseCommand {

    constructor() {
        super("ping", {
            category: "miscellaneous",
            description: {
                content: "Checks whether if I'm still alive or not."
            },
            aliases: ["ping", "pong"],
            channel: "guild",
            clientPermissions: ["EMBED_LINKS"],
            slash: true,
        });
    }

    async exec(message: Message): Promise<Message> {
        return message.util.reply({ content: `Pong! Ping is \`${this.client.ws.ping}\`ms.` });
    }

}

export = PingCommand;