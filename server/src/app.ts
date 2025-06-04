import express from "express";
import { env } from "./config/env";

const app = express();

app.use(express.json());
app.get("/", async (req, res) => {
  res.send("<b>Hello World </b>");
});

app.listen(env.PORT, (error) => {
  if (error) {
    console.error("Something went wrong while starting the server\n", error);
  } else {
    console.log("Server running on port 8080");
  }
});

export default app;
