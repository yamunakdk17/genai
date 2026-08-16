const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser());

app.use(
    cors({
        origin: "https://project-genai.netlify.app",
        
        credentials: true,
    })
);
app.get("/", (req, res) => {
    res.send("AI Interview Report Generator Backend is Running 🚀");
});


// Routes
const authRouter = require("./routes/auth.routes");
const interviewRouter = require("./routes/interview.routes");

app.use("/api/auth", authRouter);
app.use("/api/interview", interviewRouter);

module.exports = app;