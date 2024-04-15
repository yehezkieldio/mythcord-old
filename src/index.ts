import { BaseClient } from "./structures/client/BaseClient";
import config from "./config";
import "dotenv/config";

new BaseClient({
    owners: config.owners,
    superUsers: config.superusers,
})
    .buildClient(config.token);