const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();

//MiddleWares
const authMiddleWare = require("../../middleware/authMiddleWare");
//Models
const AdminModel = mongoose.model("admin");

//Test ROute
router.get("/test", (req, res) => {
  res.json({ message: "Admin Auth Route Works" });
});


router.post("/signin", async (req, res) => {
    const requiredFields = ["userName", "email", "password"];
    const recived = req.body;
    let isValid = requiredFields.every((field) =>
      Object.keys(recived).includes(field)
    );
  
    if (!isValid)
      return res.status(400).json({ error: "required fields not found" });
  
    let existingUser = await AdminModel.find({ email: recived.email });
  
    if (existingUser.length > 0) {
      return res.status(400).send({ error: "email alredy exists" });
    }
  
    const newAdmin = new AdminModel({
      userName: recived.userName,
      email: recived.email,
      password: recived.password,
    });
  
    const token = await newAdmin.genToken();
  
    newAdmin
      .save()
      .then((usr) => {
        res.status(201).json({
          admin: usr,
          token,
        });
      })
      .catch((err) => {
        res.json(err);
      });
  });


  router.post("/login", async (req, res) => {
    const requiredFields = ["email", "password"];
    const recived = req.body;
    let isValid = requiredFields.every((field) =>
      Object.keys(recived).includes(field)
    );
  
    if (!isValid)
      return res.status(400).json({ error: "required fields not found" });
  
    let existingUser = await AdminModel.find({ email: recived.email });
  
    if (existingUser.length === 0) {
      return res.status(401).json({ error: "Auth Error" });
    }
  
    AdminModel.getAdminByCredentials(recived.email, recived.password)
      .then(async (user) => {
        const token = await user.genToken();
  
        user.save().then((data) => {
          res.json({
            admin: data,
            token,
          });
        });
      })
      .catch((err) => {
        res.status(401).json({ error: "Auth Error" });
      });
  });

  router.post("/validate",authMiddleWare,async (req,res)=>{
    res.json(req.admin)
  })

module.exports = router;