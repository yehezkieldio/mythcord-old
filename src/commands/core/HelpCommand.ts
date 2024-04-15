import { Message } from "discord.js";
import { BaseCommand } from "../../structures/client/BaseCommand";
import { BaseMessageEmbed } from "../../structures/client/message/BaseMessageEmbed";

class HelpCommand extends BaseCommand {

    constructor() {
        super("help", {
            category: "core",
            description: {
                content: "Shows a list of available commands, or specific information for a command",
                usage: "(alias | id)",
                examples: [
                    {
                        description: "Fetch information for the command with ID 'ping'",
                        usage: "help ping"
                    },
                    {
                        description: "test",
                        usage: "test"
                    }
                ]
            },
            aliases: ["help", "commands"],
            channel: "guild",
            clientPermissions: ["EMBED_LINKS"],
            args: [
                {
                    id: "command",
                    type: "commandAlias"
                }
            ],
            slash: true,
            slashOptions: [
                {
                    name: "command",
                    description: "The command name, alias, or ID",
                    type: "STRING",
                    required: false
                }
            ]
        });
    }

    async exec(message: Message, { command }: { command: string | BaseCommand }) {
        const prefix = await this.client.commandHandler.getPrefix(message.guild);
        if (command) {
            if (typeof command === "string")
                command = this.client.commandHandler.findCommand(command);
            
            return this.getCommandInfo(message, command);
        } else {
            const embed = new BaseMessageEmbed()
                .setTitle("・Available Commands")
                .addField("— **CORE**", `** **` + this.mapCommands("core"))
                .addField("— **MISCELLANEOUS**", `** **` + this.mapCommands("miscellaneous"))
                .setFooter(`Do ${prefix}help [command] for more info!`);

            return message.util.send({ embeds: [ embed ]});
        }
    }

    async getCommandInfo(message: Message, command: BaseCommand) {
        const prefix = this.client.commandHandler.prefix;
        const aliases = command.aliases.length > 1 ? command.aliases.join(", ") : "None";

        const embed = new BaseMessageEmbed()
            .setTitle(`・${this.capitalizeFirstLetter(command.id)} Command`)
            .setDescription(
                "```\n" +
                `${command.description.content}\n` +
                "```"
            )
            .addField("— Aliases", `\`${aliases}\``, true)
            .addField("— Usage", `\`${prefix}${command.id}${command.description.usage ?' ' + command.description.usage : ''}\``, true)
            .addField("— Examples",
                this.mapCommandExamples(command, prefix.toString())
            )
            .setFooter("Syntax: [] = required | () = optional")

        return message.util.send({ embeds: [ embed ]})
    }

    capitalizeFirstLetter(string: string): string {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    mapCommands(category: string): string {
        const commands = this.handler.modules;
        return commands.filter(cmd => cmd.categoryID === category).map(cmd => `\`${cmd.id}\``).join(", ");
    }

    mapCommandExamples(command: BaseCommand, prefix: string) {
        if (command.description.examples) {
            return command.description.examples.map(example => {
                return `${example.description}\n` +
                `\`${prefix}${example.usage}\``;
            }).join("\n\n");
        } else {
            return "No examples available."
        }
    }

}

export = HelpCommand;