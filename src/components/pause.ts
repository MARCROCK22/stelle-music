import { ActionRow, Button, ComponentCommand, type ComponentContext } from "seyfert";
import { StelleOptions } from "#stelle/decorators";

import { type APIButtonComponentWithCustomId, ButtonStyle, ComponentType } from "seyfert/lib/types/index.js";
import { PAUSE_STATE } from "#stelle/data/Constants.js";

@StelleOptions({ inVoice: true, sameVoice: true, checkPlayer: true, checkNodes: true })
export default class PauseTrackComponent extends ComponentCommand {
    componentType = "Button" as const;

    filter(ctx: ComponentContext<typeof this.componentType>): boolean {
        return ctx.customId === "player-pauseTrack";
    }

    async run(ctx: ComponentContext<typeof this.componentType>) {
        const { client, guildId } = ctx;

        if (!guildId) return;

        const { messages } = await ctx.getLocale();

        const player = client.manager.getPlayer(guildId);
        if (!player) return;

        if (player.paused) await player.resume();
        else await player.pause();

        const components = ctx.interaction.message.components[0].toJSON();
        const newComponents = ctx.interaction.message.components[1].toJSON();

        const row = new ActionRow<Button>().setComponents(
            components.components.map((button) => new Button(button as APIButtonComponentWithCustomId)),
        );
        const newRow = new ActionRow<Button>().setComponents(
            newComponents.components
                .filter((row) => row.type === ComponentType.Button && row.style !== ButtonStyle.Link)
                .map((button) => {
                    if ((button as APIButtonComponentWithCustomId).custom_id === "player-pauseTrack") {
                        (button as APIButtonComponentWithCustomId).style = player.paused ? ButtonStyle.Secondary : ButtonStyle.Primary;
                        (button as APIButtonComponentWithCustomId).label =
                            messages.events.trackStart.components.paused[PAUSE_STATE(player.paused)];
                    }

                    return new Button(button as APIButtonComponentWithCustomId);
                }),
        );

        await ctx.interaction.deferUpdate();
        await ctx.interaction.message.edit({ components: [row, newRow] });
    }
}
