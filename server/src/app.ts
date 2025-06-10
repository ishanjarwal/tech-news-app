import express from "express";
import { env } from "./config/env";
import connectDB from "./config/connectDB";
import postRouter from "./routes/Post";

const app = express();

connectDB();

// middlewares
app.use(express.json());

// routes
app.use("/api/v1/post", postRouter);

app.listen(env.PORT, (error) => {
  if (error) {
    console.error("Something went wrong while starting the server\n", error);
  } else {
    console.log("Server running on port 8080");
  }
});

export default app;
