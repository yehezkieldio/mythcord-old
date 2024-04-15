import { Message, MessageActionRow, MessageButton } from "discord.js";
import { BaseMessageEmbed } from "../../structures/client/message/BaseMessageEmbed";
import { BaseCommand } from "../../structures/client/BaseCommand";

class AboutCommand extends BaseCommand {

    constructor() {
        super("about", {
            category: "core",
            description: {
                content: "Displays some information about Mythcord"
            },
            aliases: ["about", "info", "botinfo", "bi"],
            channel: "guild",
            clientPermissions: ["EMBED_LINKS"],
            slash: true
        });
    }

    async exec(message: Message): Promise<Message> {
        const embed = new BaseMessageEmbed()
            .setDescription(
                "Thank you for using **Mythcord**!\n\n" +
                "Mythcord is yet another multipurpose bot for Discord designed to suit your needs."
            )
            .addField("— Commands",
                "We use **slash commands**!\n" + 
                "Type `/` and click Mythcord's avatar to view all commands."
            )

        const interactionRow = new MessageActionRow()
            .addComponents(
                new MessageButton()
                    .setLabel("Invite Mythcord")
                    .setURL("https://www.youtube.com/watch?v=dQw4w9WgXcQ")
                    .setStyle("LINK"),
                
                new MessageButton()
                    .setLabel("Support Server")
                    .setURL("https://www.youtube.com/watch?v=dQw4w9WgXcQ")
                    .setStyle("LINK")
            );

        return message.util.send({ embeds: [ embed ], components: [ interactionRow ] });
    }

}

export = AboutCommand;