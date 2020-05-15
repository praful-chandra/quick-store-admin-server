const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jsonWebToken = require("jsonwebtoken");
const  SaltOrKey  = process.env.SALT_OR_KEY;


const AdminSchema = new mongoose.Schema(
    {
        isAdmin:{
            type : Boolean,
            default : true
        },
      userName: {
        type: String,
        required: true,
      },
      email: {
        type: String,
        required: true,
        validate: {
          validator: function (val) {
            if (!validator.isEmail(val)) {
              throw new Error("Email is not Valid");
            }
          },
        },
      },
      password: {
        type: String,
        required: true
      },
      loggedIn: [
        {
          token: {
            type: String,
            required: true,
          },
        },
      ],
    },
    {
      timestamps: true,
    }
  );

  //Hash USerPassword before Saving
AdminSchema.pre("save", async function (next) {
    let admin = this;
  
    if (admin.provider === "google") {
      next();
    }
  
    if (admin.isModified("password")) {
      const hash = await bcrypt.hash(admin.password, 8);
  
      admin.password = hash;
    }
  
    next();
  });

//Create A new Token and add it to user
AdminSchema.methods.genToken = async function () {
    let admin = this;
  
    let token = await jsonWebToken.sign(
      { _id: admin._id, name: admin.name },
      SaltOrKey
    );
    admin.loggedIn = admin.loggedIn.concat({ token });

      return token;
  };


  //returns User if Password matches or throws Error
AdminSchema.statics.getAdminByCredentials = async function (email, password) {
    const existingAdmin = await Admin.findOne({ email });
  
    let isAuthenticated = await bcrypt.compare(password, existingAdmin.password);
  
    if (isAuthenticated) {
      return existingAdmin;
    } else {
      throw new Error("Not Authorized");
    }
  };

AdminSchema.methods.toJSON = function () {  
    let admin = this.toObject();
  
    delete admin.password;
  
    return admin;
  };
  

const Admin = mongoose.model("admin", AdminSchema);

module.exports = Admin;