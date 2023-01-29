const mongoose = require("mongoose");
const express = require("express");
const app = express();
const dotenv = require("dotenv");
const dummyUsers = require("./Data/dummyUser");
const dummyProducts = require("./Data/dummyData");
const userSchema = require("./models/userSchema");
const productSchema = require("./models/productSchema");
const orderSchema = require("./models/orderModelSchema");

dotenv.config();
app.use(express.json());

mongoose.connect(process.env.MONGODB_URL);
const db = mongoose.connection;
db.once("error", (err) => console.error(err));
db.on("open", () => console.log("Database connected"));

const importData = async () => {
  try {
    await userSchema.deleteMany();
    await productSchema.deleteMany();
    await orderSchema.deleteMany();

    const createdUsers = await userSchema.insertMany(dummyUsers);

    const adminUsers = createdUsers[0]._id;
    const sampleProducts = dummyProducts.map((product) => {
      return { ...product, user: adminUsers };
    });
    await productSchema.insertMany(sampleProducts);
    console.log("Data imported");
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};
const destroyData = async () => {
  try {
    await userSchema.deleteMany();
    await productSchema.deleteMany();
    await orderSchema.deleteMany();

    console.log("Data destroy");
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

if (process.argv[2] === "-d") {
  destroyData();
} else {
  importData();
}
