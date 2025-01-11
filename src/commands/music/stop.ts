import { type CommandContext, Middlewares, LocalesT, Command, Declare } from "seyfert";
import { StelleOptions } from "#stelle/decorators";
import { StelleCategory } from "#stelle/types";

@Declare({
    name: "stop",
    description: "Stop the player.",
    integrationTypes: ["GuildInstall"],
    contexts: ["Guild"],
    aliases: ["sp"]
})
@Middlewares(["checkNodes", "checkVoiceChannel", "checkBotVoiceChannel", "checkPlayer"])
@StelleOptions({
    cooldown: 5,
    category: StelleCategory.Music
})
@LocalesT("locales.stop.name", "locales.stop.description")
export default class StopCommand extends Command {
    public override async run(ctx: CommandContext) {
        const { client, guildId } = ctx;

        if (!guildId) {
            return;
        }

        const { messages } = await ctx.getLocale();

        const player = client.manager.getPlayer(guildId);
        if (!player) {
            return;
        }

        await player.destroy();
        await ctx.editOrReply({
            embeds: [
                {
                    description: messages.commands.stop,
                    color: client.config.color.success
                }
            ]
        });
    }
}
