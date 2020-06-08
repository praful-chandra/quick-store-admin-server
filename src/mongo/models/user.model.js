const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jsonWebToken = require("jsonwebtoken");
const SaltOrKey = process.env.SALT_OR_KEY;

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    provider: String,
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
      required: true,
    },
    loggedIn: [
      {
        token: {
          type: String,
          required: true,
        },
      },
    ],
    cart: [
      {
        type: mongoose.Types.ObjectId,
        ref: "product",
      },
    ],
    address: [
      {
        houseNo: String,
        address: String,
        isPrimary: {
          type: Boolean,
          default: false,
        },
        title: String,
      },
    ],
  },
  {
    timestamps: true,
  }
);

//Hash USerPassword before Saving
UserSchema.pre("save", async function (next) {
  let user = this;

  if (user.provider === "google") {
    next();
  }

  if (user.isModified("password")) {
    const hash = await bcrypt.hash(user.password, 8);
    user.password = hash;
  }

  next();
});

//Create A new Token and add it to user
UserSchema.methods.genToken = async function () {
  let user = this;

  let token = await jsonWebToken.sign(
    { _id: user._id, name: user.name },
    SaltOrKey
  );
  user.loggedIn = user.loggedIn.concat({ token });

  return token;
};

//returns User if Password matches or throws Error
UserSchema.statics.getUserByCredentials = async function (email, password) {
  const existingUser = await User.findOne({ email });

  let isAuthenticated = await bcrypt.compare(password, existingUser.password);

  if (isAuthenticated) {
    return existingUser;
  } else {
    throw new Error("Not Authorized");
  }
};

UserSchema.methods.toJSON = function () {
  let user = this.toObject();

  delete user.password;

  return user;
};

const User = mongoose.model("user", UserSchema);

module.exports = User;
