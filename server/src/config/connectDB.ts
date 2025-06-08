import mongoose from "mongoose";
import { env } from "./env";

const connectDB = async () => {
  try {
    const dbOptions: mongoose.ConnectOptions = {
      dbName: "tech-news-app",
    };
    await mongoose.connect(env.DB_URL, dbOptions);
    console.log("connected to db");
  } catch (error) {
    console.log("error connecting to db server\n", error);
  }
};

export default connectDB;
