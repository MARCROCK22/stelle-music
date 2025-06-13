import type { StelleConfiguration } from "#stelle/types";
import { ms } from "#stelle/utils/functions/time.js";
import { Sessions } from "#stelle/utils/manager/sessions.js";

export default {
    defaultLocale: "en-US",
    defaultPrefix: "stelle",
    prefixes: ["st!"],
    fileName: "./cache/commands.json",
    cacheSize: 5,
    defaultSearchPlatform: "spotify",
    defaultVolume: 100,
    lyricsLines: 10,
    disconnectTime: ms("30s"),
    inviteLink:
        "https://discord.com/oauth2/authorize?client_id={id}&permissions={permissions}&integration_type=0&scope=bot+applications.commands",
    githubLink: "https://github.com/Ganyu-Studios/stelle-music",
    nodes: Sessions.resolve(
        {
            id: "SN #1", // <--- AKA Stelle Node
            host: "localhost",
            port: 2333,
            authorization: "youshallnotpass",
            secure: false,
            retryAmount: 25,
            retryDelay: ms("30s"),
        },
        {
            id: "SN #2",
            host: "localhost",
            port: 2334,
            authorization: "youshallnotpass",
            secure: false,
            retryAmount: 25,
            retryDelay: ms("30s"),
        },
        // <--- Add more nodes here if you want...
    ),
    developerIds: [],
    guildIds: [],
    color: {
        success: 0x8d86a8,
        extra: 0xece8f1,
    },
    channels: {
        guildsId: "", // <-- Guild logs channel,
        errorsId: "", // <-- Errors logs channel.
    },
    permissions: {
        stagePermissions: ["MuteMembers"],
        voicePermissions: ["ViewChannel", "Connect", "Speak"],
    },
    sessions: {
        enabled: true,
        resumeTime: ms("1min"),
        resumePlayers: true,
    },
} satisfies StelleConfiguration;
