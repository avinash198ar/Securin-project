import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import dotenv from "dotenv";
import { MongoClient } from "mongodb";
import recipesRouter from "./routes/recipes.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(morgan("dev"));

const uri = process.env.MONGODB_URI || "mongodb://localhost:27017";
const dbName = process.env.MONGODB_DB || "recipes_db";
const port = process.env.PORT || 3000;

const client = new MongoClient(uri);
let db;

async function start() {
  try {
    await client.connect();
    db = client.db(dbName);
    app.locals.db = db;
    app.get("/health", (req, res) => res.json({ ok: true }));
    app.use("/api/recipes", recipesRouter);

    app.use((err, req, res, next) => {
      console.error(err);
      res.status(err.status || 500).json({ error: err.message || "Server Error" });
    });

    app.listen(port, () => console.log(`Backend listening on http://localhost:${port}`));
  } catch (e) {
    console.error("Failed to start server:", e);
    process.exit(1);
  }
}
start();
