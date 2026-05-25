import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

const app = express();
const port = 3000;

const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "world",
  password: "#Rkspvn@123",
  port: 5433,
});

db.connect();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

async function checkVisited() {
  const result = await db.query(
    "SELECT country_code FROM travelled_countries"
  );

  let countries = [];

  result.rows.forEach((country) => {
    countries.push(country.country_code.toUpperCase());
  });

  return countries;
}

// Home Route
app.get("/", async (req, res) => {
  const countries = await checkVisited();

  res.render("index.ejs", {
    countries: countries,
    total: countries.length,
  });
});

// Add Country
app.post("/add", async (req, res) => {
  const input = req.body.country;

  try {

    // FIXED COLUMN NAME HERE
    const result = await db.query(
      "SELECT country_code FROM countries WHERE LOWER(country) LIKE '%' || $1 || '%';",
      [input.toLowerCase()]
    );

    // If country not found
    if (result.rows.length === 0) {

      const countries = await checkVisited();

      return res.render("index.ejs", {
        countries: countries,
        total: countries.length,
        error: "Country does not exist.",
      });
    }

    const countryCode = result.rows[0].country_code;

    try {

      await db.query(
        "INSERT INTO travelled_countries (country_code) VALUES ($1)",
        [countryCode]
      );

      res.redirect("/");

    } catch (err) {

      const countries = await checkVisited();

      res.render("index.ejs", {
        countries: countries,
        total: countries.length,
        error: "Country already added.",
      });
    }

  } catch (err) {
    console.log(err);
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});