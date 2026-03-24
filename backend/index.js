//Small backend tweak for branch
//UI branch test

console.log("RUNNING NEW FILTERED BACKEND");

const express = require("express");
const cors = require("cors");
require("dotenv").config();
const pool = require("./db");

const app = express();
const PORT = process.env.PORT || 5001;

/* ================= MIDDLEWARE ================= */

app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://final-project-zeta-woad.vercel.app"
  ],
  methods: ["GET","POST","DELETE"],
  credentials: true
}));
app.use(express.json());

app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

/* ================= ROUTES ================= */

// Root test
app.get("/", (req, res) => {
  res.send("Test Root Works");
});

// DB test
app.get("/test-db", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");
    res.json({ serverTime: result.rows[0] });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Database connection failed");
  }
});

// GET listings with filters
app.get("/listings", async (req, res) => {
  try {
    const { minPrice, maxPrice, city } = req.query;

    let query = `
  SELECT 
    id,
    title,
    description,
    city,
    price,
    rooms,
    size,
    floor,
    amenities,
    commute
  FROM listings
  WHERE 1=1
`;
    let values = [];

    if (minPrice) {
      values.push(minPrice);
      query += ` AND price >= $${values.length}`;
    }

    if (maxPrice) {
      values.push(maxPrice);
      query += ` AND price <= $${values.length}`;
    }

    if (city) {
      values.push(`%${city}%`);
      query += ` AND city ILIKE $${values.length}`;
    }

    const result = await pool.query(query, values);
    res.json(result.rows);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// CREATE listing
app.post("/listings", async (req, res) => {
  try {
    const { title, price, city } = req.body;

    if (!title || !price || !city)
      return res.status(400).json({ error: "Missing fields" });

    const result = await pool.query(
      "INSERT INTO listings (title, price, city) VALUES ($1,$2,$3) RETURNING *",
      [title, price, city]
    );

    res.json(result.rows[0]);

  } catch (err) {
    console.error(err.message);
    res.status(500).send("Error creating listing");
  }
});


// SAVE favorite
app.post("/favorites", async (req, res) => {
  try {
    const { user_id, listing_id } = req.body;

    const result = await pool.query(
      "INSERT INTO favorites (user_id, listing_id) VALUES ($1,$2) RETURNING *",
      [user_id, listing_id]
    );

    res.json(result.rows[0]);

  } catch (err) {
    console.error("Save favorite error:", err.message);
    res.status(500).send("Error saving favorite");
  }
});


// REMOVE favorite
app.delete("/favorites/:listing_id", async (req, res) => {
  try {
    const { listing_id } = req.params;
    const user_id = 1;

    await pool.query(
      "DELETE FROM favorites WHERE listing_id = $1 AND user_id = $2",
      [listing_id, user_id]
    );

    res.json({ message: "Removed from favorites" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});


app.get("/favorites", async (req, res) => {
  try {
    const user_id = req.query.user_id;

    const result = await pool.query(
      `SELECT listings.* FROM favorites
       JOIN listings ON favorites.listing_id = listings.id
       WHERE favorites.user_id = $1`,
      [user_id]
    );

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// ================= ADD REVIEW =================
app.post("/reviews", async (req, res) => {
  try {
    const { listing_id, rating, comment } = req.body;

    await pool.query(
      "INSERT INTO reviews (listing_id, rating, comment) VALUES ($1, $2, $3)",
      [listing_id, rating, comment]
    );

    res.json({ message: "Review added" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// ================= GET REVIEWS =================
app.get("/reviews/:listing_id", async (req, res) => {
  try {
    const listing_id = parseInt(req.params.listing_id);

    const result = await pool.query(
      "SELECT * FROM reviews WHERE listing_id = $1",
      [listing_id]
    );

    res.json(result.rows);
  } catch (err) {
    console.error("GET REVIEWS ERROR:", err);
    res.status(500).json({ error: "Server error" });
  }
});
/* ================= START SERVER ================= */

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});