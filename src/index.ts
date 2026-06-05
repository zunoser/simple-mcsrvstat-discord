import { Client, Events, GatewayIntentBits } from "discord.js";
import { fetchBlueMapPlayers } from "./bluemap.js";
import { slashCommands } from "./commands.js";
import { env } from "./env.js";
import { fetchMinecraftStatus } from "./mcsrvstat.js";
import { md } from "./md.js";

const client = new Client({
  intents: [GatewayIntentBits.Guilds],
});

client.once(Events.ClientReady, async (readyClient) => {
  await readyClient.application.commands.set(slashCommands);
  console.log(`Discord app ready: ${readyClient.user.tag}`);
});

client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isChatInputCommand()) {
    return;
  }

  if (interaction.commandName === "mcstatus") {
    await interaction.deferReply();

    try {
      const status = await fetchMinecraftStatus(env.MINECRAFT_IP);
      const players = await fetchBlueMapPlayers(env.BLUE_MAP_BASE_URL);

      if (!status.online) {
        await interaction.editReply(`${env.MINECRAFT_IP} is offline.`);
        return;
      }

      const { online, max, list } = status.players;

      const content = md().add(`Players: ${online}/${max}`);
      if (players.players.length > 0) {
        content.addCodeBlock(
          players.players.map((user) => user.name).join("\n"),
        );
      }
      await interaction.editReply(content.toString());
    } catch (error) {
      console.error(error);
      await interaction.editReply("Failed to fetch Minecraft server status.");
    }
  }
});

await client.login(env.DISCORD_TOKEN);
