const express = require("express");
const dotenv = require("dotenv");
const dbConnect = require("./utils/db");
const userRoutes = require("./routes/user");
const newsRoutes = require("./routes/news");

const cors = require("cors");

dotenv.config();

dbConnect();

const app = express();

const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/users", userRoutes);
app.use("/api/news", newsRoutes);

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({
    message: "Server is running successfully",
    timestamp: new Date().toISOString(),
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
