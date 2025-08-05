import express, { RequestHandler } from "express";
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
import homepageRouter from "./routes/Homepage";
import passport from "passport";
import cookieParser from "cookie-parser";
import cors from "cors";
import "./config/passport-jwt-strategy";
import "./config/passport-google-strategy";
import "./config/cloudinary";

const app = express();

app.use("/api/v1", (async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    console.error("DB Connection Error:", error);
    return res.status(500).json({ message: "Database connection error" });
  }
}) as RequestHandler);

// middlewares
app.use(express.json());
app.use(cookieParser());
// init passport auth
app.use(passport.initialize());

app.use(cors({ origin: env.FRONTEND_HOST, credentials: true }));

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
app.use("/api/v1/homepage", homepageRouter);

app.listen(env.PORT, (error) => {
  if (error) {
    console.error("Something went wrong while starting the server\n", error);
  } else {
    console.log("Server running on port 8080");
  }
});

export default app;
