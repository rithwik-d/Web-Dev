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
  database: "checklist",
  password: "#Rkspvn@123",
  port: 5433,
});

db.connect();

let items = [
  { id: 1, title: "Buy milk" },
  { id: 2, title: "Finish homework" },];

app.get("/", async (req, res) => {
  try{
      const result = await db.query("SELECT * FROM todolist ORDER BY id ASC");
      items = result.rows;
      res.render("index.ejs", {
        listTitle: "Today",
        listItems: items,
      });
  }catch(err){
    console.error("Error fetching items from database:", err);
    res.status(500).send("Internal Server Error");
  }
});

app.post("/add", (req, res) => {
  const item = req.body.newItem;
  //items.push({ title: item });
  try {
    db.query("INSERT INTO todolist (item) VALUES ($1)", [item], (err, result) => {
      if (err) {
        console.error("Error inserting item into database:", err);
        res.status(500).send("Internal Server Error");
      } else {
        res.redirect("/");
      }
    });
  } catch (err) {
    console.error("Error processing add item request:", err);
    res.status(500).send("Internal Server Error");
  }
});

app.post("/edit", (req, res) => {
  const item = req.body.updatedItemTitle;
  const id = req.body.updatedItemId;
  try{
    db.query("UPDATE todolist SET item = ($1) WHERE id = $2", [item, id]);
    res.redirect("/");
  } catch (err) {
    console.error("Error processing edit item request:", err);
    res.status(500).send("Internal Server Error");
  }
});

app.post("/delete", (req, res) => {
  const id = req.body.deleteItemId;
  try{
    db.query('DELETE FROM todolist WHERE id = $1', [id]);
    res.redirect("/");
  }
    catch (err) {
    console.error("Error processing delete item request:", err);
    res.status(500).send("Internal Server Error");
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
