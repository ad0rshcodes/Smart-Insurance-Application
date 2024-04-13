const express = require("express");
const app = express();
const port = process.env.PORT || 3001; // Use the environment variable or 3001 as the default

// Middleware to parse JSON bodies
app.use(express.json());

// Basic route for testing the server
app.get("/", (req, res) => {
  res.send("Hello, World!");
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
