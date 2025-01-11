import { type APIButtonComponentWithCustomId, ComponentType, ButtonStyle } from "seyfert/lib/types/index.js";
import { type ComponentContext, ComponentCommand, Middlewares, ActionRow, Button } from "seyfert";
import { getLoopState } from "#stelle/utils/functions/utils.js";

@Middlewares(["checkNodes", "checkVoiceChannel", "checkBotVoiceChannel", "checkPlayer"])
export default class ToggleLoopComponent extends ComponentCommand {
    componentType = "Button" as const;

    async run(ctx: ComponentContext<typeof this.componentType>): Promise<void> {
        const { client } = ctx;

        if (!ctx.guildId) {
            return;
        }

        const player = client.manager.getPlayer(ctx.guildId);
        if (!player) {
            return;
        }

        const { messages } = await ctx.getLocale();

        await player.setRepeatMode(getLoopState(player.repeatMode));

        // Sussy code, but works
        const components = ctx.interaction.message.components[0].toJSON();
        const newComponents = ctx.interaction.message.components[1].toJSON();

        const row = new ActionRow<Button>().setComponents(
            components.components.map((button) => new Button(button as APIButtonComponentWithCustomId))
        );
        const newRow = new ActionRow<Button>().setComponents(
            newComponents.components
                .filter((r) => r.type === ComponentType.Button && r.style !== ButtonStyle.Link)
                .map((button) => {
                    if ((button as APIButtonComponentWithCustomId).custom_id === "player-toggleLoop") {
                        (button as APIButtonComponentWithCustomId).label = messages.events.trackStart.components.loop({
                            type: messages.commands.loop.loopType[player.repeatMode]
                        });
                    }

                    return new Button(button as APIButtonComponentWithCustomId);
                })
        );

        await ctx.interaction.message.edit({ components: [row, newRow] });
        await ctx.interaction.deferUpdate();
    }

    filter(ctx: ComponentContext<typeof this.componentType>): boolean {
        return ctx.customId === "player-toggleLoop";
    }
}
