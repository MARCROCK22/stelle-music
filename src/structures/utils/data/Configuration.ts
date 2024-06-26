import type { StelleConfiguration } from "#stelle/types";

import ms from "ms";

export const Configuration: StelleConfiguration = {
    defaultPrefix: "stelle",
    prefixes: ["st!"],
    defaultLocale: "en-US",
    disconnectTime: ms("30s"),
    developerIds: [
        "391283181665517568", // <-- JustEvil
    ],
    guildIds: [
        "1075885077529120798", // <-- Return Emojis
        "970508955363188736", // <-- Ganyu Studios
    ],
    nodes: [
        {
            name: "SN #1", // <--- AKA Stelle Node
            url: "localhost:2333",
            auth: "ganyuontopuwu",
            secure: false,
        },
    ],
    spotify: {
        clientId: process.env.SPOTIFY_ID,
        clientSecret: process.env.SPOTIFY_SECRET,
        searchMarket: "US",
        albumPageLimit: 1,
        playlistPageLimit: 1,
        searchLimit: 10,
    },
    color: {
        success: 0x8d86a8,
        extra: 0xece8f1,
    },
};
