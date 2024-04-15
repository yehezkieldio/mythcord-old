import { BaseClient } from "../client/BaseClient";

export class SlashCommandHandler {

    client: BaseClient;

    constructor(client: BaseClient) {
        this.client = client;
    }

    /**
     * Only an alias for registerGlobal().
     */
    loadAll() {
        this.registerGlobal();
    }

    /**
     * @param  {string} guild This should be the guild id
     */
    registerToGuild(guild?: string) {
        const commands = [];

        for (const [, data] of this.client.commandHandler.modules) {
            if (data.slash) {
                commands.push({
                    name: data.id.toLowerCase() || data.aliases[0],
                    description: data.description.content || data.slashOptions[0].description,
                    options: data.slashOptions || null,
                });
            }
        }

        if (guild) {
            const g = this.client.guilds.cache.get(guild);
            return g.commands.set(commands);
        }

        return this.client.application.commands.set(commands);
    }

    registerGlobal() {
        for (const [, guilds] of this.client.guilds.cache) {
            try {
                this.registerToGuild(guilds.id);
            } catch (error) {
                console.error(error);
            }
        }
    }

}