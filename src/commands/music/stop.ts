import { Command, type CommandContext, Declare, LocalesT, Middlewares } from "seyfert";
import { StelleOptions } from "#stelle/decorators";
import { StelleCategory } from "#stelle/types";

@Declare({
    name: "stop",
    description: "Stop the player.",
    integrationTypes: ["GuildInstall"],
    contexts: ["Guild"],
    aliases: ["sp"],
})
@StelleOptions({ cooldown: 5, category: StelleCategory.Music })
@LocalesT("locales.stop.name", "locales.stop.description")
@Middlewares(["checkNodes", "checkVoiceChannel", "checkBotVoiceChannel", "checkPlayer"])
export default class StopCommand extends Command {
    public override async run(ctx: CommandContext) {
        const { client, guildId } = ctx;

        if (!guildId) return;

        const { messages } = await ctx.getLocale();

        const player = client.manager.getPlayer(guildId);
        if (!player) return;

        await player.destroy();
        await ctx.editOrReply({
            embeds: [
                {
                    description: messages.commands.stop,
                    color: client.config.color.success,
                },
            ],
        });
    }
}
