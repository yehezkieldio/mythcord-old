import { BaseListener } from "../../structures/client/BaseListener";

class ReadyListener extends BaseListener {

    constructor() {
        super("ready", {
            emitter: "client",
            event: "ready"
        });
    }

    async exec(): Promise<void> {
        this.client.slashHandler.loadAll();

        this.client.logger.event(`Logged in as ${this.client.user.tag}`);
        this.client.user.setPresence({
            activities: [
                {
                    name: `the void`,
                    type: "COMPETING"
                }
            ],
            status: "idle"
        });

        if (process.env.CI_TEST) {
            this.client.logger.warn(`Compile Test sucess! Terminating process...`);
            setTimeout(() => {
                process.exit(0);
            }, 5000)
        }
    }

}

export = ReadyListener;
