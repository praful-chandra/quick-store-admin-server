const express = require("express");
require("./src/mongo/mongo");

const authRoute = require("./src/routes/adminRoutes/authRoute");
const addShopRoute = require("./src/routes/adminRoutes/addshop.route");
const updateShopRoute = require("./src/routes/adminRoutes/updateShop.route");
const getShopRoute = require("./src/routes/adminRoutes/getShop.route");
const serveImageRoute = require("./src/routes/serveImage.route");
const RemoveShopRoute = require("./src/routes/adminRoutes/removeShop.route");
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
app.use("/api/admin/shop",RemoveShopRoute);
app.use("/api/admin/get",getShopRoute);



app.use("/api/serveImage/",serveImageRoute);