import mongoose, { Document } from "mongoose";
import { Guild } from "discord.js";
import { BaseClient } from "../../structures/client/BaseClient";
import { IBaseGuild, BaseGuild } from "./models/BaseGuild";

interface DatabaseOptions {
    user: string;
    key: string;
}

type ManagementOptions = {
    delete?: boolean;
}

export class Database {

    public client: BaseClient;
    protected uri: string;
    protected user: string;
    protected key: string;

    constructor(client: BaseClient ,options?: DatabaseOptions) {
        this.client = client;
        this.key = process.env.MONGODB_PASSWORD ?? options.key;
        this.user = process.env.MONGODB_USER ?? options.user;
        this.uri = `mongodb+srv://${this.user}:${this.key}@mythcorddb.5dktt.mongodb.net/MythcordDB`;
    }

    /**
     * @returns void
     */
    __init(): void {
        try {
            mongoose.connect(this.uri);
            this.client.logger.event(`Connected to MongoDB!`);
        } catch (error) {
            console.error(error);
        }

    }

    /**
     * Creates an default guild configuration.
     * Must be fired on the guildCreate event.
     * @param {IGuild} settings
     * @returns Promise
     */
    async createGuild(settings: IBaseGuild): Promise<Document> {
        const defaultConf = Object.assign({}, { configuration: { prefix: this.client.commandHandler.prefix } }),
            serverConf = Object.assign(defaultConf, settings);

        const guild = new BaseGuild(serverConf);
        return guild.save();
    }

    /**
     * Placeholder for the manageGuild function.
     * This is deprecated but will not be removed.
     * @deprecated
     * @param {Guild|string} guild
     * @returns Promise
     */
    async getGuild(guild: Guild | string): Promise<any> {
        return await this.manageGuild(guild);
    }

    /**
     * Manages the server configuration.
     * Will return the guild data if options is not specified.
     * @param {Guild|string} guild
     * @param {ManagementOptions} options
     * @returns Promise
     */
    async manageGuild(guild: Guild | string, options?: ManagementOptions): Promise<any> {
        if (typeof guild === "string")
            guild = this.client.guilds.cache.get(guild);

        let guildData = await BaseGuild.findOne({ id: guild.id });
        if (guildData) {
            if (options) {
                if (options.delete)
                    await BaseGuild.deleteOne({ id: guild.id });
            }
            return guildData;
        } else {
            guildData = this.createGuild({
                guildInfo: {
                    guildID: guild.id,
                    guildName: guild.name,
                    guildOwnerTag: await guild.fetchOwner().then(owner => owner.user.tag),
                }
            });
            return guildData;
        }
    }

}