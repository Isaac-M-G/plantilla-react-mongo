const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const app = express();
const cors = require("cors");
const connectToDatabase = require("./db");

const FeedbackRoutes = require("./Routes/FeedbackRoute");

// Conexión a la base de datos
connectToDatabase();

// Middlewares
app.use(express.json());
app.use(cors());

// Routes
app.use("/Feedback", FeedbackRoutes);

// Configuración del puerto
const port = process.env.PORT || 8080;
app.listen(port, console.log(`Listening on port ${port}...`));
