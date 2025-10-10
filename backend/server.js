const express = require("express");
const dotenv = require("dotenv");
const dbConnect = require("./utils/db");

dotenv.config();

dbConnect();

const app = express();

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
