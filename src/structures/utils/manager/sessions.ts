import type { LavalinkNodeOptions } from "lavalink-client";
import MeowDB from "meowdb";
import type { MakeRequired, RestOrArray } from "seyfert/lib/common/index.js";
import type { StellePlayerJson } from "#stelle/types";
import { Constants } from "#stelle/utils/data/constants.js";
import { InvalidNodeSession } from "#stelle/utils/errors.js";
import { ms } from "#stelle/utils/functions/time.js";
import { createDirectory } from "#stelle/utils/functions/utils.js";

/**
 * Lavalink node options without the `sessionId`.
 */
//i don't know how to name this type, so i just called like this
type NonResumableNodeOptions = Omit<LavalinkNodeOptions, "sessionId">;

/**
 * The player json with the required properties.
 */
type RequiredPlayerJson = MakeRequired<StellePlayerJson, "nodeId" | "nodeSessionId">;

/**
 * The directory where the cache is stored.
 * @type {string}
 */
const dir: string = await createDirectory(Constants.CachePath);

/**
 * The name of the sessions file without the `.json` extension.
 * @type {string}
 */
const name = Constants.SessionsFile.replace(/\.json$/, "").trim();

/**
 * The storage for player sessions.
 * @type {MeowDB}
 */
const storage: MeowDB = new MeowDB({ dir, name });

/**
 * The session ids of the nodes.
 * @type {Map<string, string>}
 */
const ids: Map<string, string> = new Map<string, string>(
    Object.values<StellePlayerJson>(storage.all())
        .filter((session): session is RequiredPlayerJson => typeof session.nodeId === "string" && typeof session.nodeSessionId === "string")
        .map((session) => [session.nodeId, session.nodeSessionId]),
);

/**
 * Utility to manage Lavalink node sessions.
 */
export const Sessions = {
    /**
     *
     * Set the session of the player.
     * @param {string} id The id of the session
     * @param {string} value The value of the session.
     * @returns {void} Did you know, this saves the session into a json file? No way!
     */
    set<T>(id: string, value: T): void {
        storage.set<T>(id, value);
        return;
    },
    /**
     * Get the session of the player.
     * @param {string} id The id of the session.
     * @return {T | undefined} The value of the session.
     */
    get<T>(id: string): T | undefined {
        return storage.get<T>(id);
    },
    /**
     * Delete the session of the player.
     * @param {string} id The id of the session.
     * @return {boolean} Whether the session was deleted or not.
     */
    delete(id: string): boolean {
        // this throws an error if there's no session with the id.
        return storage.exists(id) && storage.delete(id);
    },
    /**
     * Resolves the  node options to include the session id.
     * @param {RestOrArray<NonResumableNodeOptions>} nodes The nodes to resolve.
     * @returns {LavalinkNodeOptions[]} The resolved nodes.
     */
    resolve(...nodes: RestOrArray<NonResumableNodeOptions>): LavalinkNodeOptions[] {
        nodes = nodes.flat();

        if (nodes.some((node) => "sessionId" in node && typeof node.sessionId === "string"))
            throw new InvalidNodeSession("The 'sessionId' property is not allowed in the node options.");

        return nodes.map((node) => {
            // default settings, if not set by the user.
            node.id ??= `${node.host}:${node.port}`;
            node.retryAmount ??= 25;
            node.retryDelay ??= ms("25s");

            return {
                ...node,
                sessionId: ids.get(node.id),
            };
        });
    },
};
