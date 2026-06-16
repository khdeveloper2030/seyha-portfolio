const express = require("express");
const app = express();
const port = 3000;
const db = require("./models");

db.sequelize
.authenticate()
.then(() => {
  console.log("Connection has been established successfully.");
})
.catch((err) => {
  console.error("Unable to connect to the database:", err);
});

app.use(express.json());

app.get("/users", (req, res) => {
  res.send("Get All Users");
});

app.post("/users", (req, res) => {
  res.send(`Name=${req.body.name}`);
});

app.put("/users", (req, res) => {
  res.send("Update a User");
});

app.delete("/users", (req, res) => {
  res.send("Delete a User");
});

app.all("/maintainance", (req, res) => {
  res.send("Handle all HTTP methods for /users");
});