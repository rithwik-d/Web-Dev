import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import bcrypt from "bcrypt";

const app = express();
const port = 3000;
const saltRounds = 10;

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

// Register User
app.post("/register", async (req, res) => {
  const userid = req.body.username;
  const password = req.body.password;

  try {
    // Check if user already exists
    const checkResult = await db.query(
      "SELECT * FROM users WHERE userid = $1",
      [userid]
    );

    if (checkResult.rows.length > 0) {
      res.send("User already exists. Try logging in.");
    } else {
      // Hash the password before storing it
      bcrypt.hash(password, saltRounds, async (err, hash) => {
        if (err) {
          console.error("Error hashing password:", err);
          return res.send("An error occurred while registering.");
        }

        try {
          await db.query(
            "INSERT INTO users (userid, password) VALUES ($1, $2)",
            [userid, hash]
          );

          res.render("secrets.ejs");
        } catch (dbErr) {
          console.error(dbErr);
          res.send("Database error.");
        }
      });
    }
  } catch (err) {
    console.error(err);
    res.send("Something went wrong.");
  }
});

// Login User
app.post("/login", async (req, res) => {
  const userid = req.body.username;
  const loginPassword = req.body.password;

  try {
    const result = await db.query(
      "SELECT * FROM users WHERE userid = $1",
      [userid]
    );

    if (result.rows.length > 0) {
      const user = result.rows[0];
      const storedHashedPassword = user.password;

      // Compare entered password with stored hash
      bcrypt.compare(
        loginPassword,
        storedHashedPassword,
        (err, isMatch) => {
          if (err) {
            console.error("Error comparing passwords:", err);
            return res.send("Authentication error.");
          }

          if (isMatch) {
            res.render("secrets.ejs");
          } else {
            res.send("Incorrect Password");
          }
        }
      );
    } else {
      res.send("User not found.");
    }
  } catch (err) {
    console.error(err);
    res.send("Something went wrong.");
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});