import "dotenv/config";
import { z } from "zod";

export const env = z
  .object({
    DISCORD_TOKEN: z.string().min(1),
    MINECRAFT_IP: z.string().min(1),
    BLUE_MAP_BASE_URL: z.string().min(1),
  })
  .parse(process.env);
