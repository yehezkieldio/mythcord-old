import { MessageEmbed } from "discord.js";

export class BaseMessageEmbed extends MessageEmbed {

    public errorEmbed = false;

    constructor() {
        super();

        this.setColor("#7ed491");
    }

    /**
     * Sets the color to red.
     * @param  {boolean} value
     */
    isErrorEmbed(value: boolean) {
        if (value === true) {
            this.errorEmbed = value;
            this.setColor("#ff8888")
            return this;
        }
    }

}