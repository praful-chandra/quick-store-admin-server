const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const UserModel = mongoose.model("user");

const doesContain = require("../../utils/doesContain.util");
const UserAuthMiddleware = require("../../middleware/userAuthMiddleware");

router.get("/test", (req, res) => {
  res.json({ message: "user auth route" });
});

router.post("/signup", async (req, res) => {
  const recived = req.body;

  let isValid = doesContain(["name", "email", "password"], recived);

  if (!isValid)
    return res.status(400).json({ error: "required fields not found" });

  let existingUser = await UserModel.find({ email: recived.email });

  if (existingUser.length > 0) {
    return res.status(400).send({ error: "email alredy exists" });
  }

  const newUser = new UserModel({
    name: recived.name,
    email: recived.email,
    password: recived.password,
    provider: "email",
  });

  const token = await newUser.genToken();
  console.log(token);

  newUser
    .save()
    .then((usr) => {
      res.status(201).json({
        user: usr,
        token,
      });
    })
    .catch((err) => {
      res.status(500).json({ error: err });
    });
});

router.post("/login", async (req, res) => {
  const recived = req.body;

  let isValid = doesContain(["email", "password"], recived);

  if (!isValid)
    return res.status(400).json({ error: "required fields not found" });

  const existingUser = await UserModel.findOne({ email: recived.email });

  if (existingUser.length === 0) {
    return res.status(404).json({ error: "Auth error" });
  }

  UserModel.getUserByCredentials(recived.email, recived.password)
    .then(async (user) => {
      const token = await user.genToken();

      user.save().then((data) => {
        res.json({
          user: data,
          token,
        });
      });
    })
    .catch((err) => {
      res.status(401).json({ error: "Auth error" });
    });
});

router.get("/validate",UserAuthMiddleware,async(req,res)=>{
    res.json(req.user);

})

module.exports = router;
