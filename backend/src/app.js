const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const userRoutes = require("./routes/userRoutes");
const aiRoutes = require("./routes/aiRoutes");
const documentRoutes = require("./routes/documentRoutes");
const { notFoundHandler, errorHandler } = require("./middleware/errorHandler");

const app = express();

app.use(cors());
app.use(express.json({ limit: "1mb" }));
app.use(morgan("dev"));

app.use("/api/users", userRoutes)
app.use("/api/ai", aiRoutes);
app.use("/api/documents", documentRoutes);

app.get("/health", (req, res) => {
    res.json({
        success: true,
        message: "Server is running"
    });
});

app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;