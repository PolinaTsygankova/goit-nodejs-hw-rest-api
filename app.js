const express = require("express");
const logger = require("morgan");
const cors = require("cors");
require("dotenv").config();

const contactsRouter = require("./routes/api/contacts");
const authRouter = require("./routes/api/auth");

const app = express();

const formatsLogger = app.get("env") === "development" ? "dev" : "short";

app.use(logger(formatsLogger));
app.use(cors());
app.use(express.json());

app.use("/api/contacts", contactsRouter);
app.use("/api/auth", authRouter);

app.use((req, res) => {
   res.status(404).json({ message: "Not found" });
});

app.use((err, req, res, next) => {
   console.log(err.name);
   console.log(err.status);

   if (err.message.includes("E11000 duplicate key")) {
      return res.status(409).json({ message: "This data is already saved!" });
   }

   if (err.message === "ValidationError") {
      return res.status(400).json({ message: "Not valid data" });
   }

   res.status(500).json({ message: err.message });
});

module.exports = app;
