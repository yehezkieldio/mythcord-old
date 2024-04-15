import { Guild } from "discord.js";
import { BaseListener } from "../../structures/client/BaseListener";

class GuildCreateListener extends BaseListener {

    constructor() {
        super("guildCreate", {
            emitter: "client",
            event: "guildCreate"
        });
    }

    async exec(guild: Guild) {
        this.client.logger.event(`Joined guild ${guild.name}! Creating default configuration...`);
        this.client.database.createGuild({
            guildInfo: {
                guildID: guild.id,
                guildName: guild.name,
                guildOwnerTag: await guild.fetchOwner().then(owner => owner.user.tag),
            }
        });
    }

}

export = GuildCreateListener;