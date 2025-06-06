const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.DB_URI + "/" + process.env.DB_NAME)
    .then(() => console.log("Connected to MongoDB"))
    .catch((err) => console.error("MongoDB connection error : ", err));


// Import routes
app.use("/api/post", require("./routes/post"));

app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});