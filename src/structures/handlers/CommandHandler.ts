import { Collection } from "@discordjs/collection";
import { CommandHandler as AkairoCommandHandler } from "@lichking112/discord-akairo";
import { Guild } from "discord.js";
import { IBaseGuild } from "../../libraries/database/models/BaseGuild";
import { BaseClient } from "../client/BaseClient";
import { BaseCommand } from "../client/BaseCommand";

export class CommandHandler extends AkairoCommandHandler {

    /**
	 * Commands loaded, mapped by ID to Command.
	 */
	public declare modules: Collection<string, BaseCommand>;

    /**
     * Custom client.
     */
    public declare client: BaseClient;

    public async getPrefix(guild?: Guild | string): Promise<string> {
        if (typeof guild === "string")
            guild = this.client.guilds.cache.get(guild);

        const guildData: IBaseGuild = await this.client.database.manageGuild(guild);
        if (guildData)
            return guildData.configuration?.prefix;
        else
            return this.prefix.toString();
    }

    /**
	 * Finds a command by alias.
	 * @param name - Alias to find with.
	 */
	public findCommand(name: string): BaseCommand {
		return this.modules.get(this.aliases.get(name.toLowerCase()));
	}

    /**
     * An alias for the function findCommand()
     * @param {string} name Alias to find with.
     */
    public getCommand(name: string) {
        return this.findCommand(name);
    }

}