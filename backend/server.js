const express = require("express");
const dotenv = require("dotenv");
const dbConnect = require("./utils/db");
const userRoutes = require("./routes/user");

const cors = require("cors");

dotenv.config();

dbConnect();

const app = express();

const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api/users", userRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
