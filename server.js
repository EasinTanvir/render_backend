//common js and es modules
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const productRoutes = require("./routes/productRoutes");
const HttpError = require("./helper/HttpError");
const authRoute = require("./routes/user");
const orderItems = require("./routes/orderRoutes");
const path = require("path");

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, PUT, DELETE"
  );

  next();
});

app.use(express.json());
dotenv.config();

app.use("/uploads", express.static(path.join("uploads")));

mongoose.connect(process.env.MONGODB_URL);
const db = mongoose.connection;
db.once("error", (err) => console.error(err));
db.on("open", () => console.log("Database connected"));

//routes
app.use("/api/products", productRoutes);
app.use("/api/auth", authRoute);
app.use("/api/orders", orderItems);
//paypal api
app.get("/api/config/paypal", (req, res) =>
  res.send(process.env.PAYPAL_CLIENT_ID)
);

app.use((req, res, next) => {
  const errors = new HttpError("no routes found for this path  ", 404);
  return next(errors);
});

app.use((error, req, res, next) => {
  if (res.headerSent) {
    return next(error);
  }
  res.status(error.code || 500);
  res.json({ message: error.message || "unknown error occured" });
});

app.listen(process.env.PORT);
