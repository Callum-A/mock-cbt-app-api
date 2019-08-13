// Import requirements and init the app.
const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const app = express();
const cors = require("cors");

// Import Routes
const authRoute = require("./routes/auth");
const userRoute = require("./routes/user");
const thoughtRoute = require("./routes/thought");
const profileRoute = require("./routes/profile");

dotenv.config();

// Connect to the DB and configure it
mongoose.connect(
    process.env.DB_CONNECT,
    {
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: false
    },
    () => console.log("Connected to DB...")
);

// Middleware allows server to read JSON
app.use(express.json());
app.use(cors());

// Route Middlewares
app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/thoughts", thoughtRoute);
app.use("/api/profiles", profileRoute);

// Listen on specified port

const port = process.env.PORT || 5000

app.listen(port, () => console.log("Server started on port " + port + "..."));