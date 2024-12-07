import { createApp, logger } from "./src/index.js";
import { createServer } from "node:http";
import { format, transports } from "winston";

logger.add(
  new transports.Console({
    format: format.combine(format.timestamp(), format.splat(), format.json()),
  })
);

const httpServer = createServer();

const { close } = await createApp(httpServer, {
  postgres: {
    host: process.env.POSTGRES_HOST || "db",
    user: "postgres",
    password: process.env.POSTGRES_PASSWORD || "changeit",
    ssl: process.env.RDS_CERT_PATH
      ? {
          require: true,
          rejectUnauthorized: true,
          ca: fs.readFileSync(process.env.RDS_CERT_PATH).toString(),
        }
      : false,
  },
  sessionSecrets: ["changeit"],
});

process.on("SIGTERM", async () => {
  logger.info("SIGTERM signal received");

  await close();
});

httpServer.listen(3000, () => {
  logger.info("server listening at http://localhost:3000");
});
