import { Lavalink, sessions } from "#stelle/classes";
import { DEBUG_MODE } from "#stelle/data/Constants.js";

export default new Lavalink({
    name: "playerDestroy",
    type: "manager",
    run: async (client, player) => {
        sessions.delete(player.guildId);

        const voice = await client.channels.fetch(player.voiceChannelId ?? player.options.voiceChannelId);
        if (voice.is(["GuildVoice"])) await voice.setVoiceStatus(null).catch(() => null);

        return DEBUG_MODE && client.logger.debug(`[Lavalink PlayerDestroy] Destroyed player for guild ${player.guildId}`);
    },
});
