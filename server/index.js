const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const connectDB = require("./db/config");

console.log('Starting server initialization...');

dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors({
  origin: "*",
  methods: ["POST", "GET", "PUT", "DELETE"],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

console.log('Middleware set up');

// Database connection
connectDB().then(() => {
  console.log('Database connected successfully');
}).catch(err => {
  console.error('Failed to connect to database:', err);
});

// Import routes
const Home = require("./controllers/controllers");
const LoginRoute = require("./routes/LoginRoute");
const RegisterRoute = require("./routes/RegisterRoute");
const verifyToken = require("./Middleware/middleware");
const RecipeRoute = require("./routes/RecipeRoute");
const ForgotPassword = require("./routes/forgotPassword");

console.log('Routes imported');

// Define routes
app.use("/auth", RegisterRoute);
app.use("/auth", LoginRoute);
app.use("/auth", RecipeRoute);
app.use("/auth", ForgotPassword);

// Home route (protected)
app.get("/auth", verifyToken, Home.Home);

// Test route
app.get('/', (req, res) => {
  res.send('Backend is running');
});

console.log('Routes defined');

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error occurred:', err.stack);
  res.status(500).send('Something broke!');
});

console.log('Error handling middleware set up');

// Export the app for Vercel
module.exports = app;

// Start server locally if not in production
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

console.log('Server initialization complete');