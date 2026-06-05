import { z } from "zod";

const playerSchema = z.object({
  name: z.string(),
  uuid: z.string(),
});

const blueMapPlayersSchema = z.object({
  players: z.array(playerSchema),
});

export type BlueMapPlayers = z.infer<typeof blueMapPlayersSchema>;

export const fetchBlueMapPlayers = async (
  baseUrl: string,
): Promise<BlueMapPlayers> => {
  const response = await fetch(`${baseUrl}/maps/world/live/players.json`);

  if (!response.ok) {
    throw new Error(`BlueMap returned ${response.status}`);
  }

  return blueMapPlayersSchema.parse(await response.json());
};
