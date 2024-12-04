import { format, transports } from "winston";
import { createServer } from "node:http";
import { createApp, logger } from "./src/index.js";
import fs from "node:fs";

logger.add(
  new transports.Console({
    format: format.combine(format.colorize(), format.splat(), format.simple()),
  })
);

const httpServer = createServer();

await createApp(httpServer, {
  postgres: {
    host: process.env.POSTGRES_HOST || "localhost",
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
  cors: {
    origin: ["http://localhost:5173"],
    credentials: true,
  },
});

httpServer.listen(3000, () => {
  logger.info("server listening at http://localhost:3000");
});
