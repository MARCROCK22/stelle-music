import { type AnyContext, Embed, type PermissionStrings } from "seyfert";

import { EmbedColors, Formatter } from "seyfert/lib/common/index.js";
import { MessageFlags } from "seyfert/lib/types/index.js";

import { formatOptions } from "./formatter.js";

/**
 *
 * The Stelle's default error handler.
 * @param ctx The context of the command.
 * @param error The error that was thrown.
 * @returns
 */
export async function onRunError(ctx: AnyContext, error: unknown) {
    const { messages } = await ctx.getLocale();

    ctx.client.logger.error(error);

    return ctx.editOrReply({
        content: "",
        flags: MessageFlags.Ephemeral,
        embeds: [
            {
                description: messages.events.commandError,
                color: EmbedColors.Red,
            },
        ],
    });
}

/**
 *
 * The Stelle's default error handler for missing permissions.
 * @param ctx The context of the command.
 * @param permissions The permissions that the user is missing.
 * @returns
 */
export async function onPermissionsFail(ctx: AnyContext, permissions: PermissionStrings) {
    const { messages } = await ctx.getLocale();

    return ctx.editOrReply({
        content: "",
        flags: MessageFlags.Ephemeral,
        embeds: [
            {
                description: messages.events.permissions.user.description,
                color: EmbedColors.Red,
                fields: [
                    {
                        name: messages.events.permissions.user.field,
                        value: permissions.map((p) => `- ${messages.events.permissions.list[p]}`).join("\n"),
                    },
                ],
            },
        ],
    });
}

/**
 *
 * The Stelle's default error handler for missing bot permissions.
 * @param ctx The context of the command.
 * @param permissions The permissions that the bot is missing.
 * @returns
 */
export async function onBotPermissionsFail(ctx: AnyContext, permissions: PermissionStrings) {
    const { messages } = await ctx.getLocale();

    return ctx.editOrReply({
        content: "",
        flags: MessageFlags.Ephemeral,
        embeds: [
            {
                description: messages.events.permissions.bot.description,
                color: EmbedColors.Red,
                fields: [
                    {
                        name: messages.events.permissions.bot.field,
                        value: permissions.map((p) => `- ${messages.events.permissions.list[p]}`).join("\n"),
                    },
                ],
            },
        ],
    });
}

/**
 *
 * The Stelle's default error handler for invalid options.
 * @param ctx The context of the command.
 * @returns
 */
export async function onOptionsError(ctx: AnyContext) {
    if (!ctx.isChat()) return;

    const { messages } = await ctx.getLocale();

    const command = ctx.command.toJSON();
    const options = formatOptions(command.options, messages.events.optionTypes);

    const embed = new Embed()
        .setColor("Red")
        .setThumbnail(ctx.author.avatarURL())
        .setDescription(
            messages.events.invalidOptions({
                options: Formatter.codeBlock(options.map(({ option }) => option).join(" "), "js"),
                list: options.map(({ option, description, range }) => `* \`${option}\` \`[${range || "N/A"}]\`: ${description}`).join("\n"),
            }),
        )
        .setTimestamp();

    return ctx.editOrReply({
        content: "",
        flags: MessageFlags.Ephemeral,
        embeds: [embed],
    });
}
