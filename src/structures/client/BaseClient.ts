import { AkairoClient, ListenerHandler } from "@lichking112/discord-akairo";
import { Intents } from "discord.js";
import { existsSync } from "fs";
import { join } from "path";
import { CommandHandler } from "../handlers/CommandHandler";
import { SlashCommandHandler } from "../handlers/SlashCommandHandler";
import { Dashboard } from "../dashboard/Dashboard";
import { Database } from "../../libraries/database/Database";
import { Logger } from "../../libraries/utils/Logger";

interface BaseClientOptions {
    owners?: string | string[];
    superUsers?: string | string[];
    intents?: Intents[];
}

export class BaseClient extends AkairoClient {

    commandHandler: CommandHandler = new CommandHandler(this, {
        directory: join(__dirname, "../../", "commands"),
        prefix: "m/",

        aliasReplacement: /-/g,
        allowMention: true,
        commandUtil: true,
    });

    listenerHandler: ListenerHandler = new ListenerHandler(this, {
        directory: join(__dirname, "../../", "listeners")
    });

    slashHandler: SlashCommandHandler = new SlashCommandHandler(this);

    dashboard: Dashboard = new Dashboard({
        port: 3000,
        debug: process.env.DEBUG_MODE ? true : false,
    });

    config: BaseClientOptions;
    database: Database;
    logger: Logger;

    /**
     * @param  {BaseClientOptions} options
     */
    constructor(options: BaseClientOptions) {
        super({
            ownerID: options.owners,
            superUserID: options.superUsers,
            intents: [
                "GUILDS",
                "GUILD_INTEGRATIONS",
                "GUILD_MEMBERS",
                "GUILD_MESSAGES",
                "GUILD_PRESENCES"
            ]
        });

        this.config = options;
        this.database = new Database(this);
        this.logger = new Logger();
    }

    /**
     * Loads both the command handler and listener handler as of now.
     * @returns void
     */
    __init(): void {
        if (existsSync(this.commandHandler.directory)) {
            this.commandHandler.useListenerHandler(this.listenerHandler);
            this.commandHandler.loadAll();
        }

        if (existsSync(this.listenerHandler.directory)) {
            this.listenerHandler.setEmitters({
                commandHandler: this.commandHandler,
                listenerHandler: this.listenerHandler
            });
            this.listenerHandler.loadAll();
        }

        this.on("ready", () => {
            this.database.__init();
            this.dashboard.listen();
        });
    }
    
    /**
     * Creates the client.
     * @param  {string} token The bot token. Will default to process.env.DISCORD_TOKEN if not specified.
     * @returns Promise<unknown>
     */
    async buildClient(token?: string): Promise<unknown> {
        this.__init();
        return this.login(token ?? process.env.DISCORD_TOKEN);
    }

}