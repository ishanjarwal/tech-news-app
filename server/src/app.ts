import express from "express";
import connectDB from "./config/connectDB";
import { env } from "./config/env";
import "./models"; // loads and registers all models once
import adminRouter from "./routes/Admin";
import categoryRouter from "./routes/Category";
import commentRouter from "./routes/Comment";
import likeRouter from "./routes/Like";
import postRouter from "./routes/Post";
import subCategoryRouter from "./routes/SubCategory";
import tagRouter from "./routes/Tag";
import userRouter from "./routes/User";
import followRouter from "./routes/Follow";
import passport from "passport";
import cookieParser from "cookie-parser";

import "./config/passport-jwt-strategy";
import "./config/passport-google-strategy";

const app = express();

connectDB();

// middlewares
app.use(express.json());
app.use(cookieParser());
// init passport auth
app.use(passport.initialize());

// routes
app.use("/api/v1/post", postRouter);
app.use("/api/v1/category", categoryRouter);
app.use("/api/v1/subcategory", subCategoryRouter);
app.use("/api/v1/tag", tagRouter);
app.use("/api/v1/like", likeRouter);
app.use("/api/v1/comment", commentRouter);
app.use("/api/v1/follow", followRouter);
app.use("/api/v1/admin", adminRouter);
app.use("/api/v1/user", userRouter);

app.listen(env.PORT, (error) => {
  if (error) {
    console.error("Something went wrong while starting the server\n", error);
  } else {
    console.log("Server running on port 8080");
  }
});

export default app;
