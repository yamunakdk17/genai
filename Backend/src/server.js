require("dotenv").config();

const app = require("./app");
const connectToDB = require("./config/database");
const dns = require("dns");

dns.setServers(["1.1.1.1", "8.8.8.8"]);

// const { resume, selfDescription, jobDescription } = require("./services/temp");
// const generateInterviewReport = require("./services/ai.service");

connectToDB();

// generateInterviewReport({ resume, selfDescription, jobDescription });

app.listen(3000, () => {
    console.log("server is running on port 3000");
});