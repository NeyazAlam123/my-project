const express = require("express")
const mongoose = require("mongoose")
const bodyParser = require("body-parser")
const path = require("path")
const app = express()
const PORT = 4000

mongoose.connect("mongodb://127.0.0.1:27017/userDB")
  .then(() => console.log("mongoDB connected"))
  .catch(err => console.err(err))

// middleware
app.use(bodyParser.urlencoded({extended:true}))
app.use(express.static(path.join(__dirname,"public")))
app.set("view engine","ejs")

// Routes
const User = require("./models/user")

app.get("/", async (req, res) => {
  const users = await User.find();
  res.render("index", { users });
});

app.get("/add", (req, res) => {
  res.render("add");
});

app.post("/add", async (req, res) => {
  await User.create(req.body);
  res.redirect("/");
});

app.get("/edit/:id", async (req, res) => {
  const user = await User.findById(req.params.id);
  res.render("edit", { user });
}); 

app.post("/edit/:id", async (req, res) => {
  await User.findByIdAndUpdate(req.params.id, req.body);
  res.redirect("/");
});

app.get("/delete/:id", async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.redirect("/");
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});