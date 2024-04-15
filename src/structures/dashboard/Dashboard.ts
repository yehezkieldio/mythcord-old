import express, { Application, Request, Response } from "express";
import { NextServer } from "next/dist/server/next";
import { Logger } from "../../libraries/utils/Logger";
import { parse } from "url";
import next from "next";

interface DashboardOptions {
    port: string | number;
    debug: boolean;
}

export class Dashboard {

    private express: Application;
    private next: NextServer;
    private logger: Logger;
    public port: string | number;

    /**
     * @param {DashboardOptions} options 
     */
    constructor(options: DashboardOptions) {
        this.express = express();
        this.next = next({ 
            dev: options.debug, 
            quiet: true,
        });
        this.logger = new Logger();
        this.port= options.port;
    }

    /**
     * @returns void
     */
    __init(): void {
        const handle = this.next.getRequestHandler();
        this.next.prepare().then(() => {
            this.express.get("*", (req: Request, res: Response) => {
                return handle(req, res, parse(req.url, true));
            });
            this.express.post("*", (req: Request, res: Response) => {
                return handle(req, res, parse(req.url, true));
            });
        });
    }

    /**
     * @returns void
     */
    listen(): void {
        this.__init();
        this.express.listen(this.port, () => {
            this.logger.info(`Dashboard is now running on PORT: ${this.port}`);
        });
    }

}

