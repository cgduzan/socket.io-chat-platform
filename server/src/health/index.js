import { logger } from "../util.js";

export function initHealthChecks({ app }) {
  app.get("/health", (_req, res) => {
    logger.info("health check");

    res.status(200).send({
      status: "OK",
    });
  });
}
