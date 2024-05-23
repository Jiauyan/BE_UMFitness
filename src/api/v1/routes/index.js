const express = require("express");
const router = express.Router();

const authRouter = require("./auth");
const goalsRouter = require("./goals");
const profileRouter = require("./profile");
const tipsRouter = require("./tips");

router.use("/auth", authRouter);
router.use("/goals", goalsRouter);
router.use("/profile", profileRouter);
router.use("/tips", tipsRouter);

module.exports = router;
