const HttpError = require("../helper/HttpError");
const userSchema = require("../models/userSchema");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const logIn = async (req, res, next) => {
  const { email, password } = req.body;
  let existingUser;
  try {
    existingUser = await userSchema.findOne({ email: email });
  } catch (err) {
    const errors = new HttpError("authonication failed", 500);
    return next(errors);
  }

  if (!existingUser) {
    const errors = new HttpError("No user found", 500);
    return next(errors);
  }
  let hashPass;

  try {
    hashPass = await bcrypt.compare(password, existingUser.password);
  } catch (err) {
    const errors = new HttpError("authonication failed", 500);
    return next(errors);
  }
  if (!hashPass) {
    const errors = new HttpError("Sorry invalid password", 500);
    return next(errors);
  }

  let token;

  try {
    token = jwt.sign(
      {
        _id: existingUser._id,
        email: existingUser.email,
        isAdmin: existingUser.isAdmin,
      },
      process.env.TOKEN_SECRET,
      { expiresIn: "1h" }
    );
  } catch (err) {
    const errors = new HttpError("token access failed", 500);
    return next(errors);
  }

  res.status(200).json({
    name: existingUser.name,
    _id: existingUser._id,
    email: existingUser.email,
    isAdmin: existingUser.isAdmin,
    token: token,
  });
};

const signUp = async (req, res, next) => {
  const { name, email, password } = req.body;

  let existingUser;
  try {
    existingUser = await userSchema.findOne({ email: email });
  } catch (err) {
    const errors = new HttpError("authonication failed", 500);
    return next(errors);
  }

  if (existingUser) {
    const errors = new HttpError("Sorry email already taken", 500);
    return next(errors);
  }
  let newUser;

  let hashPass;

  try {
    hashPass = await bcrypt.hash(password, 12);
  } catch (err) {
    const errors = new HttpError("password hashed failed", 500);
    return next(errors);
  }

  try {
    newUser = await userSchema.create({
      name,
      email,
      password: hashPass,
    });
  } catch (err) {
    const errors = new HttpError("create user failed", 500);
    return next(errors);
  }
  let token;

  try {
    token = jwt.sign(
      { _id: newUser._id, email: newUser.email, isAdmin: newUser.isAdmin },
      process.env.TOKEN_SECRET,
      { expiresIn: "1h" }
    );
  } catch (err) {
    const errors = new HttpError("token access failed", 500);
    return next(errors);
  }

  res.status(200).json({
    name: newUser.name,
    _id: newUser._id,
    email: newUser.email,
    isAdmin: newUser.isAdmin,
    token: token,
  });
};

const getUserProfile = async (req, res, next) => {
  let result;

  try {
    result = await userSchema.findById(req.userData._id);
  } catch (err) {
    const errors = new HttpError("fetch single user failed", 500);
    return next(errors);
  }

  res.status(200).json({
    _id: result._id,
    name: result.name,
    email: result.email,
    isAdmin: result.isAdmin,
  });
};

const updateUser = async (req, res, next) => {
  const { name, password } = req.body;

  let findUser;

  try {
    findUser = await userSchema.findById(req.userData._id);
  } catch (err) {
    const errors = new HttpError("fetch single user failed", 500);
    return next(errors);
  }

  findUser.name = name;

  if (password) {
    let hashPass;

    try {
      hashPass = await bcrypt.hash(password, 12);
    } catch (err) {
      const errors = new HttpError("password hashed failed", 500);
      return next(errors);
    }

    findUser.password = hashPass;
  }

  try {
    await findUser.save();
  } catch (err) {
    const errors = new HttpError("Update user failed", 500);
    return next(errors);
  }

  res.status(200).json({
    message: "User Update Successfully",
  });
};

const getAllUsers = async (req, res, next) => {
  let users;

  try {
    users = await userSchema.find();
  } catch (err) {
    const errors = new HttpError("fetch all users failed", 500);
    return next(errors);
  }
  res.status(200).json(users);
};

const getUserbyId = async (req, res, next) => {
  let user;

  try {
    user = await userSchema.findById(req.params.id).select("-password");
  } catch (err) {
    const errors = new HttpError("fetch all users failed", 500);
    return next(errors);
  }
  res.status(200).json(user);
};
//update as an admin for any user
const updateSingleUser = async (req, res, next) => {
  const { name, email, isAdmin } = req.body;

  let findUser;

  try {
    findUser = await userSchema.findById(req.params.id);
  } catch (err) {
    const errors = new HttpError("fetch single user failed", 500);
    return next(errors);
  }

  (findUser.name = name || findUser.name),
    (findUser.email = email || findUser.email);
  findUser.isAdmin = isAdmin;

  try {
    await findUser.save();
  } catch (err) {
    const errors = new HttpError("Update user failed", 500);
    return next(errors);
  }

  res.status(200).json({
    _id: findUser._id,
    name: findUser.name,
    email: findUser.email,
    isAdmin: findUser.isAdmin,
  });
};

const deleteUser = async (req, res, next) => {
  let user;

  try {
    user = await userSchema.findByIdAndDelete(req.params.id);
  } catch (err) {
    const errors = new HttpError("fetch user failed for delete", 500);
    return next(errors);
  }
  res.status(200).json({ message: "user delete sucessfully" });
};

module.exports = {
  logIn,
  signUp,
  getUserProfile,
  updateUser,
  getAllUsers,
  getUserbyId,
  deleteUser,
  updateSingleUser,
};
