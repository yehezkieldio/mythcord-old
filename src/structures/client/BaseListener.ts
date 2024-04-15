import { Listener, ListenerOptions } from "@lichking112/discord-akairo";
import { BaseClient } from "./BaseClient";

export class BaseListener extends Listener {

    client: BaseClient;

    constructor(id: string, options: ListenerOptions) {
        super(id, options);
    }

}