const express = require("express");
const router = express.Router();
const Alluser = require("../Controllers/userControler");
const protectRoutes = require("../helper/protectRoutes");
const adminProtect = require("../helper/AdminProtect");

router.route("/login").post(Alluser.logIn);
router.route("/signup").post(Alluser.signUp);
router.use(protectRoutes);
router.route("/user").get(Alluser.getUserProfile);
router.route("/update").patch(Alluser.updateUser);
router.use(adminProtect);
router.route("/allusers").get(Alluser.getAllUsers);
router.route("/delete/:id").delete(Alluser.deleteUser);
router.route("/:id").get(Alluser.getUserbyId);
router.route("/adminupdate/:id").patch(Alluser.updateSingleUser);

module.exports = router;
