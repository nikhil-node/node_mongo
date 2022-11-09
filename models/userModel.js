const crypto = require("crypto");
const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "User name cannot be blank"],
    trim: true,
    maxlength: [20, "User name cannot be max than 20 character"],
    minlength: [3, "User name cannot be less than 3 character"],
  },
  email: {
    type: String,
    required: [true, "User email cannot be blank"],
    unique: [true, "Email already exists"],
    lowercase: true,
    trim: true,
    validate: [validator.isEmail, "Please provide a valid email"],
    maxlength: [20, "User name cannot be max than 20 character"],
    minlength: [3, "User name cannot be less than 3 character"],
  },
  photo: String,
  role: {
    type: String,
    enum: ["user", "guide", "lead-guide", "admin"],
    default: "user",
  },
  password: {
    type: String,
    required: [true, "Password cannot be blank"],
    minlength: 8,
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, "confirm password cannot be blank"],
    validate: {
      validator: function (el) {
        return el === this.password;
      },
      message: "Password and confirm password not match",
    },
  },
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
  active: {
    type: Boolean,
    default: true,
    select: false,
  },
});

userSchema.pre("save", async function (next) {
  // only run this function if password modified
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 12);

  this.passwordConfirm = undefined;
  next();
});
userSchema.pre(/^find/, function (next) {
  this.find({ active: { $ne: false } });
  next();
});
userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};
//To check password was changed after token was generated
userSchema.methods.changePasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedPassword = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    return changedPassword > JWTTimestamp;
  }
  return false;
};
//Forgot Password token generate
userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex");
  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;
  return resetToken;
};
//Update password change timestamp when password update
userSchema.pre("save", function (next) {
  if (!this.isModified("password")) return next();

  this.passwordChangedAt = Date.now() - 1000;
  next();
});
const User = mongoose.model("User", userSchema);

module.exports = User;
