import { Router } from "express";
const router = Router();

// GET /api/recipes?page&limit - sorted by rating desc
router.get("/", async (req, res, next) => {
  try {
    const db = req.app.locals.db;
    const page = Math.max(parseInt(req.query.page) || 1, 1);
    const limit = Math.min(Math.max(parseInt(req.query.limit) || 10, 1), 100);
    const skip = (page - 1) * limit;

    const coll = db.collection("recipes");
    const cursor = coll.find({}).sort({ rating: -1, _id: 1 }).skip(skip).limit(limit);
    const [data, total] = await Promise.all([cursor.toArray(), coll.countDocuments()]);

    res.json({ page, limit, total, data });
  } catch (err) {
    next(err);
  }
});

// GET /api/recipes/search
// Query params: calories (<=400 / >=200 / =300), title (partial), cuisine (exact),
// total_time (<=minutes), rating (>=value)
router.get("/search", async (req, res, next) => {
  try {
    const db = req.app.locals.db;
    const { calories, title, cuisine, total_time, rating } = req.query;
    const query = {};

    if (title) query.title = { $regex: String(title), $options: "i" };
    if (cuisine) query.cuisine = String(cuisine);

    // numeric filters
    const numFilter = (raw, field, defaultOp) => {
      if (!raw) return;
      const m = String(raw).match(/^(<=|>=|=)?\s*(\d+(?:\.\d+)?)$/);
      if (!m) return;
      const op = m[1] || defaultOp;
      const val = Number(m[2]);
      if (Number.isNaN(val)) return;
      switch (op) {
        case "<=": query[field] = { ...(query[field]||{}), $lte: val }; break;
        case ">=": query[field] = { ...(query[field]||{}), $gte: val }; break;
        case "=":  query[field] = val; break;
      }
    };

    numFilter(calories, "nutrients.calories", "<=");
    numFilter(total_time, "total_time", "<=");
    numFilter(rating, "rating", ">=");

    const data = await db.collection("recipes").find(query).sort({ rating: -1, _id: 1 }).toArray();
    res.json({ data });
  } catch (err) {
    next(err);
  }
});

export default router;
