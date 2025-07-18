import type { LavalinkNodeOptions, SearchPlatform } from "lavalink-client";
import type { PermissionStrings } from "seyfert";
import type { LocaleString } from "seyfert/lib/types/index.js";

/**
 * The colors configuration interface.
 */
interface Colors {
    /**
     * The primary color of the bot.
     * @default 0x8d86a8
     * @type {number}
     */
    success: number;
    /**
     * The secondary color of the bot.
     * @default 0xece8f1
     * @type {number}
     */
    extra: number;
}

/**
 * The channels configuration interface.
 */
interface Channels {
    /**
     * The channel id where the bot will send the guilds log.
     * @type {string}
     */
    guildsId: string;
    /**
     * The channel id where the bot will send the errors log.
     * @type {string}
     */
    errorsId: string;
}

/**
 * The permissions configuration interface.
 */
interface Permissions {
    /**
     * The voice channel permissions.
     * @default ["ViewChannel", "Connect", "Speak"]
     */
    voicePermissions: PermissionStrings;
    /**
     * The stage channel permissions.
     * @default ["MuteMembers"]
     */
    stagePermissions: PermissionStrings;
}

/**
 * The sessions configuration interface.
 */
interface Sessions {
    /**
     * Enable the node resume session.
     * @type {boolean}
     * @default true
     */
    enabled: boolean;
    /**
     * The node session resume time.
     * @type {number}
     * @default ms("1min")
     */
    resumeTime: number;
    /**
     * Force the players to resume.
     * @type {boolean}
     * @default true
     */
    resumePlayers: boolean;
}

/**
 * The cache interface.
 */
interface Cache {
    /**
     * The maximum size of the cache.
     * @type {number}
     * @default 5
     */
    size: number;
}

/**
 * The configuration interface.
 */
export interface StelleConfiguration {
    /**
     * The default locale.
     * @default "en-US"
     * @type {LocaleString}
     */
    defaultLocale: LocaleString;
    /**
     * The default prefix used to use text commands.
     * @type {string}
     * @default "stelle"
     */
    defaultPrefix: string;
    /**
     * The prefixes used to use text commands.
     * @type {string[]}
     * @default ["st!"]
     */
    prefixes: string[];
    /**
     * The guild ids to push commands to.
     * @type {string[]}
     */
    guildIds: string[];
    /**
     * The developer ids.
     * @type {string[]}
     */
    developerIds: string[];
    /**
     * The lavalink nodes list.
     * @type {LavalinkNodeOptions[]}
     */
    nodes: LavalinkNodeOptions[];
    /**
     * The bot invite link.
     * @type {string}
     */
    inviteLink: string;
    /**
     * The bot repository link.
     * @type {string}
     */
    githubLink: string;
    /**
     * The default player lyrics enabled.
     * @type {number}
     * @default 10
     */
    lyricsLines: number;
    /**
     * The default player volume.
     * @type {number}
     * @default 60
     */
    defaultVolume: number;
    /**
     * The default player search engine.
     * @type {SearchPlatform}
     * @default "spotify"
     */
    defaultSearchPlatform: SearchPlatform;
    /**
     * The disconnect time in milliseconds. (Use the time formatter)
     * @type {number}
     * @default ms("30s")
     */
    disconnectTime: number;
    /**
     * The colors configuration.
     * @type {Colors}
     */
    color: Colors;
    /**
     * The channels configuration.
     * @type {Channels}
     */
    channels: Channels;
    /**
     * The permissions configuration.
     * @type {Permissions}
     */
    permissions: Permissions;
    /**
     * The sessions configuration.
     * @type {Sessions}
     */
    sessions: Sessions;
    /**
     * The cache configuration.
     * @type {Cache}
     */
    cache: Cache;
}

/**
 * The loadable configuration interface.
 */
export interface LoadableStelleConfiguration extends StelleConfiguration {
    /**
     * Loads the configuration.
     * @returns {Promise<void>} A promise that resolves when the configuration is loaded.
     */
    load(): Promise<void>;
}

/**
 * The environment variables interface.
 */
export interface StelleEnvironment {
    /**
     * The bot token.
     * @type {string}
     */
    Token?: string;
    /**
     * The database URL.
     * @type {string}
     */
    DatabaseUrl?: string;
    /**
     * The errors webhook URL.
     * @type {string}
     */
    ErrorsWebhook?: string;
    /**
     * The Redis host.
     * @type {string}
     */
    RedisHost?: string;
    /**
     * The Redis port.
     * @type {number}
     */
    RedisPort?: number;
    /**
     * The Redis password.
     * @type {string}
     */
    RedisPassword?: string;
    /**
     * The Redis username.
     * @type {string}
     */
    RedisUsername?: string;
}
