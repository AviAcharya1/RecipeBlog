const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const connectDB = require("./db/config");

dotenv.config();
const router = express.Router();

const app = express();
app.use(express.json());
app.use(cors({
  origin: "*",
  methods: ["POST", "GET", "PUT", "DELETE"],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

connectDB();

const Home = require("./controllers/controllers");
const LoginRoute = require("./routes/LoginRoute");
const RegisterRoute = require("./routes/RegisterRoute");
const verifyToken = require("./Middleware/middleware");
const RecipeRoute = require("./routes/RecipeRoute");
const ForgotPassword = require("./routes/forgotPassword");

app.use("/auth", RegisterRoute);
app.use("/auth", LoginRoute);
app.use("/auth", RecipeRoute);
app.use("/auth", router);
app.use("/auth", ForgotPassword);


app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

router.get("/", verifyToken, Home.Home);

app.get('/', (req, res) => {
  res.send('Backend is running');
});
// Export the app for Vercel
module.exports = app;

// You can also listen to the port locally when not on Vercel
// if (process.env.NODE_ENV !== 'production') {
//   app.listen(process.env.PORT, () => {
//     console.log(`Server started on port ${process.env.PORT}`);
//   });
// }
