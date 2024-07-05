const express = require("express");
const router = express.Router();

const authRouter = require("./auth");
const goalsRouter = require("./goals");
const profileRouter = require("./profile");
const tipsRouter = require("./tips");
const stepsRouter = require("./steps");
const postRouter = require("./post");


router.use("/auth", authRouter);
router.use("/goals", goalsRouter);
router.use("/profile", profileRouter);
router.use("/tips", tipsRouter);
router.use("/steps", stepsRouter);
router.use("/posts", postRouter);

module.exports = router;
