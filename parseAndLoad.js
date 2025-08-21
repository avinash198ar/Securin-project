import fs from "fs";
import path from "path";
import dotenv from "dotenv";
import { MongoClient } from "mongodb";

dotenv.config();

const uri = process.env.MONGODB_URI || "mongodb://localhost:27017";
const dbName = process.env.MONGODB_DB || "recipes_db";
const jsonPath = process.env.RECIPES_JSON || "../US_recipes.json";

function cleanNumber(n) {
  if (n === null || n === undefined) return null;
  if (Number.isNaN(n)) return null;
  // strings like "NaN"
  if (typeof n === "string" && (n.trim().toLowerCase() === "nan" || n.trim() === "")) return null;
  const num = Number(n);
  return Number.isNaN(num) ? null : num;
}

function cleanseRecipe(r) {
  return {
    cuisine: r.cuisine ?? null,
    title: r.title ?? null,
    rating: cleanNumber(r.rating),
    prep_time: cleanNumber(r.prep_time),
    cook_time: cleanNumber(r.cook_time),
    total_time: cleanNumber(r.total_time),
    description: r.description ?? null,
    nutrients: r.nutrients ?? null,
    serves: r.serves ?? null
  };
}

async function run() {
  const resolved = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..", jsonPath);
  if (!fs.existsSync(resolved)) {
    console.error(`JSON file not found at: ${resolved}`);
    process.exit(1);
  }
  const raw = fs.readFileSync(resolved, "utf-8");
  const parsed = JSON.parse(raw);
  const records = Array.isArray(parsed) ? parsed : Object.values(parsed);
  const docs = records.map(cleanseRecipe);

  const client = new MongoClient(uri);
  await client.connect();
  const db = client.db(dbName);
  const coll = db.collection("recipes");

  await coll.deleteMany({}); // fresh load
  const batchSize = 1000;
  for (let i = 0; i < docs.length; i += batchSize) {
    await coll.insertMany(docs.slice(i, i + batchSize));
    console.log(`Inserted ${Math.min(i + batchSize, docs.length)}/${docs.length}`);
  }
  await client.close();
  console.log("Load complete.");
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
