import { env } from "@/config/envConfig";
import mongoose, { ConnectOptions } from "mongoose";

export async function connectDB() {
  const url: string = env.MONGO_URI;
  const options: ConnectOptions = {};

  return new Promise<void>((resolve, reject) => {
    mongoose.connect(url, options);

    const db = mongoose.connection;

    db.on("error", reject);

    db.once("open", () => {
      console.log(`Connected to database`);
      resolve();
    });

    db.on("disconnected", () => {
      console.log(`Disconnected from database`);
    });

    db.on("reconnected", () => {
      console.log(`Reconnected to database`);
    });

    db.on("close", () => {
      console.log(`Connection to database closed`);
    });
  });
}
