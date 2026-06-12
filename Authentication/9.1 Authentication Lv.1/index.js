import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "secret_users",
  password: "#Rkspvn@123",
  port: 5433,
});

db.connect();

app.get("/", (req, res) => {
  res.render("home.ejs");
});

app.get("/login", (req, res) => {
  res.render("login.ejs");
});

app.get("/register", (req, res) => {
  res.render("register.ejs");
});

app.post("/register", async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  const user = await db.query("SELECT * FROM users WHERE userid = $1", [username]);

  if (user.rows.length > 0) {
    return res.send("Username already exists");
  } else{
    const result = await db.query("INSERT INTO users (userid, password) VALUES ($1, $2)", 
    [username, password]);
    res.render("secrets.ejs");
    } 
});

app.post("/login", async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  const user = await db.query("SELECT * FROM users WHERE userid = $1", [username]);

  if (user.rows.length > 0) {
    if (user.rows[0].password === password) {
      res.render("secrets.ejs");
    } else {
      res.send("Incorrect password");
    }
  } else {
    res.send("User not found");
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
