import { type CommandContext, createStringOption, type Guild, Command, Declare, Options } from "seyfert";
import { MessageFlags } from "seyfert/lib/types/index.js";
import { StelleOptions } from "#stelle/decorators";

const cmdOptions = {
    event: createStringOption({
        description: "The event to emit.",
        required: true,
        choices: [
            {
                name: "guildCreate",
                value: "GUILD_CREATE"
            },
            {
                name: "guildDelete",
                value: "GUILD_DELETE"
            }
        ] as const
    })
};

@Declare({
    name: "emit",
    description: "Emit a event.",
    defaultMemberPermissions: ["ManageGuild", "Administrator"],
    integrationTypes: ["GuildInstall"],
    contexts: ["Guild"]
})
@StelleOptions({ onlyDeveloper: true })
@Options(cmdOptions)
export default class ReloadCommand extends Command {
    public override async run(ctx: CommandContext<typeof cmdOptions>): Promise<void> {
        const { options, client } = ctx;
        const { event } = options;

        await ctx.deferReply(true);

        const guild = await ctx.guild();
        if (!guild) {
            return;
        }

        switch (event) {
            case "GUILD_CREATE":
            case "GUILD_DELETE":
                await client.events.values[event]?.run(guild as unknown as Guild<"create">, client, ctx.shardId);
                await ctx.editOrReply({
                    flags: MessageFlags.Ephemeral,
                    content: "",
                    embeds: [
                        {
                            description: `\`✅\` The event \`${event}\` has been emitted.`,
                            color: client.config.color.success
                        }
                    ]
                });
                break;
        }
    }
}
