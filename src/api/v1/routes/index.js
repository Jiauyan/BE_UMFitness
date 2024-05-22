const express = require("express");
const router = express.Router();

const authRouter = require("./auth");
const goalsRouter = require("./goals");
const profileRouter = require("./profile");

router.use("/auth", authRouter);
router.use("/goals", goalsRouter);
router.use("/profile", profileRouter);

module.exports = router;
