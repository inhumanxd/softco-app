import { env } from "@/config/envConfig";
import { app } from "@/server";
import { logger } from "./common/utils/logger";
import { connectDB } from "./config/database";

const server = app.listen(env.PORT, async () => {
  const { NODE_ENV, HOST, PORT } = env;

  logger.info(`Server (${NODE_ENV}) running on port http://${HOST}:${PORT}`);

  await connectDB();
});

const onCloseSignal = () => {
  logger.info("SIGINT received, shutting down");
  server.close(() => {
    logger.info("server closed");
    process.exit();
  });

  setTimeout(() => process.exit(1), 10000).unref(); // Forced shutdown after 10s
};

process.on("SIGINT", onCloseSignal);
process.on("SIGTERM", onCloseSignal);
