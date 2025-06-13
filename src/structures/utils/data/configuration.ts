import type { StelleConfiguration, StelleEnvironment } from "#stelle/types";

import { Constants } from "#stelle/utils/data/constants.js";
import { InvalidConfiguration } from "#stelle/utils/errors.js";

import { join, resolve } from "node:path";
import { pathToFileURL } from "node:url";

// extract the environment variables from the .env file
const { TOKEN, DATABASE_URL, ERRORS_WEBHOOK, REDIS_HOST, REDIS_PORT, REDIS_PASSWORD } = process.env;

/**
 *
 * The extensions that the configuration files can have.
 * @type {string[]}
 * @default [".ts", ".js"]
 */
const extensions: string[] = [".ts", ".js"];

/**
 *
 * The filenames that the configuration files can have.
 * @type {string[]}
 * @default ["local.config", "default.config"]
 */
const filenames: string[] = ["local.config", "default.config"];

/**
 * The base directory where the configuration files are located.
 * @type {string}
 */
const base: string = join(Constants.WorkingDirectory(), "config");

/**
 *
 * The directory where the configuration files are located.
 * @type {string}
 */
const directory: string = resolve(process.cwd(), base);

/**
 * The configuration of the bot.
 * @type {StelleConfiguration}
 */
export const Configuration: StelleConfiguration = await Promise.any<StelleConfiguration>(
    extensions.map((ext) => {
        return Promise.any<StelleConfiguration>(
            filenames.map(async (filename) => {
                if (!filename.includes(".config")) throw new InvalidConfiguration(`Filename '${filename}' does not include '.config'`);

                const file = join(directory, `${filename}${ext}`);
                const i = await import(`${pathToFileURL(file)}`);

                return i.default ?? i;
            }),
        );
    }),
).catch(() => {
    throw new InvalidConfiguration(
        `No config file found in '/${base.replaceAll("\\", "/")}' with any of the filenames: \n- ${filenames.join("\n- ")}`,
    );
});

/**
 * The environment variables.
 * @type {StelleEnvironment}
 */
export const Environment: StelleEnvironment = {
    Token: TOKEN,
    DatabaseUrl: DATABASE_URL,
    ErrorsWebhook: ERRORS_WEBHOOK,
    RedisHost: REDIS_HOST,
    RedisPort: Number(REDIS_PORT),
    RedisPassword: REDIS_PASSWORD,
};
