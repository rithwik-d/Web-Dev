import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import bcrypt from "bcrypt";
import passport from "passport";
import { Strategy } from "passport-local";
import session from "express-session";
import env from "dotenv";
import GoogleStrategy from "passport-google-oauth2";

const app = express();
const port = 3000;
const saltRounds = 10;

env.config();

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
  })
);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.use(passport.initialize());
app.use(passport.session());

// PostgreSQL Connection
const db = new pg.Client({
  user: process.env.PG_USER,
  host: process.env.PG_HOST,
  database: process.env.PG_DATABASE,
  password: process.env.PG_PASSWORD,
  port: process.env.PG_PORT,
});

db.connect();

// Home Page
app.get("/", (req, res) => {
  res.render("home.ejs");
});

// Login Page
app.get("/login", (req, res) => {
  res.render("login.ejs");
});

// Register Page
app.get("/register", (req, res) => {
  res.render("register.ejs");
});

// Protected Secrets Page
app.get("/secrets", (req, res) => {
  if (req.isAuthenticated()) {
    res.render("secrets.ejs");
  } else {
    res.redirect("/login");
  }
});

// Logout
app.get("/logout", (req, res, next) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
});

// Google OAuth
app.get("/auth/google", passport.authenticate("google", { scope: ["email", "profile"] }));

// Google OAuth Callback
app.get("/auth/google/secrets", passport.authenticate("google", {
  successRedirect: "/secrets",
  failureRedirect: "/login"
}))

// Register User
app.post("/register", async (req, res) => {
  const email = req.body.username;
  const password = req.body.password;

  try {
    const checkResult = await db.query(
      "SELECT * FROM users WHERE userid = $1",
      [email]
    );

    if (checkResult.rows.length > 0) {
      return res.send("User already registered. Please login.");
    }

    bcrypt.hash(password, saltRounds, async (err, hash) => {
      if (err) {
        console.error("Hash Error:", err);
      } else {
        const result = await db.query(
          "INSERT INTO users (userid, password) VALUES ($1, $2) RETURNING *",
          [email, hash]
        );

        const user = result.rows[0];

        req.login(user, (err) => {
          if (err) {
            console.log(err);
          } else {
            console.log("User Registered");
            res.redirect("/secrets");
          }
        });
      }
    });
  } catch (err) {
    console.log(err);
  }
});

// Login User
app.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/secrets",
    failureRedirect: "/login",
  })
);

// Passport Local Strategy
passport.use("local",
  new Strategy(async function verify(username, password, cb) {
    try {
      const result = await db.query(
        "SELECT * FROM users WHERE userid = $1",
        [username]
      );

      if (result.rows.length === 0) {
        return cb(null, false);
      }

      const user = result.rows[0];

      bcrypt.compare(password, user.password, (err, valid) => {
        if (err) {
          console.error(err);
          return cb(err);
        }

        if (valid) {
          return cb(null, user);
        } else {
          return cb(null, false);
        }
      });
    } catch (err) {
      return cb(err);
    }
  })
);

passport.use("google", new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: "http://localhost:3000/auth/google/secrets",
  userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo",
}, async (accessToken, refreshToken, profile, cb) => {
    try{
      const result = await db.query("SELECT * FROM users WHERE userid = $1", [profile.email]);
      if (result.rows.length === 0) {
        // User not found, create a new user
        const newUser = await db.query("INSERT INTO users (userid, password) VALUES ($1, $2) RETURNING *", [profile.email, "google"]);
        cb(null, newUser.rows[0]);
      }
      else {
        cb(null, result.rows[0]);
      }
    } catch (err) {
      cb(err);
    }
}));

// Serialize User
passport.serializeUser((user, cb) => {
  cb(null, user);
});

// Deserialize User
passport.deserializeUser((user, cb) => {
  cb(null, user);
});

// Start Server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
