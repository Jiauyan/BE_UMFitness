const express = require("express");
const router = express.Router();

const authRouter = require("./auth");
const goalsRouter = require("./goals");
const profileRouter = require("./profile");
const tipsRouter = require("./tips");
const stepsRouter = require("./steps");
const postRouter = require("./post");
const motivationalQuotesRouter = require("./motivationalQuotes");

router.use("/auth", authRouter);
router.use("/goals", goalsRouter);
router.use("/profile", profileRouter);
router.use("/tips", tipsRouter);
router.use("/steps", stepsRouter);
router.use("/posts", postRouter);
router.use("/motivationalQuotes", motivationalQuotesRouter);

module.exports = router;
