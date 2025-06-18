import express from "express";
import { env } from "./config/env";
import connectDB from "./config/connectDB";
import postRouter from "./routes/Post";
import categoryRouter from "./routes/Category";
import tagRouter from "./routes/Tag";
import subCategoryRouter from "./routes/SubCategory";
import likeRouter from "./routes/Like";
import commentRouter from "./routes/Comment";
import adminRouter from "./routes/Admin";
import "./models"; // loads and registers all models once

const app = express();

connectDB();

// middlewares
app.use(express.json());

// routes
app.use("/api/v1/post", postRouter);
app.use("/api/v1/category", categoryRouter);
app.use("/api/v1/sub_category", subCategoryRouter);
app.use("/api/v1/tag", tagRouter);
app.use("/api/v1/like", likeRouter);
app.use("/api/v1/comment", commentRouter);
app.use("/api/v1/follow", commentRouter);
app.use("/api/v1/admin", adminRouter);
app.listen(env.PORT, (error) => {
  if (error) {
    console.error("Something went wrong while starting the server\n", error);
  } else {
    console.log("Server running on port 8080");
  }
});

export default app;
