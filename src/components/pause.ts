import { type APIButtonComponentWithCustomId, ComponentType, ButtonStyle } from "seyfert/lib/types/index.js";
import { type ComponentContext, ComponentCommand, Middlewares, ActionRow, Button } from "seyfert";
import { getPauseState } from "#stelle/utils/functions/utils.js";

@Middlewares(["checkNodes", "checkVoiceChannel", "checkBotVoiceChannel", "checkPlayer"])
export default class PauseTrackComponent extends ComponentCommand {
    componentType = "Button" as const;

    async run(ctx: ComponentContext<typeof this.componentType>) {
        const { client, guildId } = ctx;

        if (!guildId) {
            return;
        }

        const { messages } = await ctx.getLocale();

        const player = client.manager.getPlayer(guildId);
        if (!player) {
            return;
        }

        if (player.paused) {
            await player.resume();
        } else {
            await player.pause();
        }

        const components = ctx.interaction.message.components[0].toJSON();
        const newComponents = ctx.interaction.message.components[1].toJSON();

        const row = new ActionRow<Button>().setComponents(
            components.components.map((button) => new Button(button as APIButtonComponentWithCustomId))
        );
        const newRow = new ActionRow<Button>().setComponents(
            newComponents.components
                .filter((r) => r.type === ComponentType.Button && r.style !== ButtonStyle.Link)
                .map((button) => {
                    if ((button as APIButtonComponentWithCustomId).custom_id === "player-pauseTrack") {
                        (button as APIButtonComponentWithCustomId).style = player.paused
                            ? ButtonStyle.Secondary
                            : ButtonStyle.Primary;
                        (button as APIButtonComponentWithCustomId).label =
                            messages.events.trackStart.components.paused[getPauseState(player.paused)];
                    }

                    return new Button(button as APIButtonComponentWithCustomId);
                })
        );

        await ctx.interaction.deferUpdate();
        await ctx.interaction.message.edit({ components: [row, newRow] });
    }

    filter(ctx: ComponentContext<typeof this.componentType>): boolean {
        return ctx.customId === "player-pauseTrack";
    }
}
