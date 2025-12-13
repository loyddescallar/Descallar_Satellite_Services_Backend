const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const path = require("path");
require("dotenv").config();

const authRoutes = require("./routes/authRoutes");
const ticketRoutes = require("./routes/ticketRoutes");
const technicianRoutes = require("./routes/technicianRoutes");
const troubleshootRoutes = require("./routes/troubleshootRoutes");
const loadRoutes = require("./routes/loadRoutes");
const customerRoutes = require("./routes/customerRoutes");

const app = express();
const PORT = process.env.PORT || 4000;

// Basic middleware
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files for uploaded message attachments
app.use(
  "/uploads/messages",
  express.static(path.join(__dirname, "uploads", "messages"))
);

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/tickets", ticketRoutes);
app.use("/api/technicians", technicianRoutes);
app.use("/api/troubleshoot", troubleshootRoutes);
app.use("/api/load", loadRoutes);
app.use("/api/customers", customerRoutes);

// 404 fallback
app.use((req, res) => {
  res.status(404).json({ error: "Endpoint not found" });
});

app.listen(PORT);
