import { Schema, model } from "mongoose";

interface IBaseGuild {
    guildInfo?: {
        guildID: string;
        guildName: string;
        guildOwnerTag: string;
    }
    configuration?: {
        prefix?: string;
    }
}

const schema = new Schema({
    guildInfo: {
        guildID: String,
        guildName: String,
        guildOwnerTag: String
    },
    configuration: {
        prefix: String
    },
});

const BaseGuild = model("BaseGuild", schema);
export type { IBaseGuild };
export { 
    BaseGuild
};