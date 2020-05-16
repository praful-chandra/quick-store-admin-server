const express = require("express");
require("./src/mongo/mongo");

const authRoute = require("./src/routes/authRoute");
const addShopRoute = require("./src/routes/addshop.route");
const updateShopRoute = require("./src/routes/updateShop.route");
const getShopRoute = require("./src/routes/getShop.route");
const app = express();

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log("Listening on port " + PORT);
});

app.use(express.json())

app.get("/", (req, res) => {
  res.json({ message: "Connected to quick-shop-admin-server" });
});

app.use("/api/admin/auth",authRoute);
app.use("/api/admin/shop",addShopRoute);
app.use("/api/admin/shop",updateShopRoute);
app.use("/api/admin/get",getShopRoute);