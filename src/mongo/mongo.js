const mongoose = require("mongoose");

mongoose.connect(process.env.MONGO_URI, {
  useFindAndModify : false,
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(()=>console.log("mongodb connected")).catch(err=>console.log(err));


require("./models/admin.model");
require("./models/category.model");
require("./models/products.model");
require("./models/campaign.model");
require("./models/sales.model");
require("./models/coupons.model");
require("./models/order.model");

require("./models/user.model");