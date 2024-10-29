const express = require("express");
const router = express.Router();

const authRouter = require("./auth");
const goalsRouter = require("./goals");
const profileRouter = require("./profile");
const tipsRouter = require("./tips");
const stepsRouter = require("./steps");
const postRouter = require("./post");
const chatRouter = require("./chat");
const motivationalQuotesRouter = require("./motivationalQuotes");
const fitnessPlanRouter = require("./fitnessPlan");
const fitnessActivityRouter = require("./fitnessActivity");
const trainingProgramsRouter = require("./trainingPrograms");
const screeningFormRouter = require("./screeningForm");
const trainingClassBookingRouter = require("./trainingClassBooking");
const consentFormRouter = require("./consentForm");

router.use("/auth", authRouter);
router.use("/goals", goalsRouter);
router.use("/profile", profileRouter);
router.use("/tips", tipsRouter);
router.use("/steps", stepsRouter);
router.use("/posts", postRouter);
router.use("/chat", chatRouter);
router.use("/motivationalQuotes", motivationalQuotesRouter);
router.use("/fitnessPlan", fitnessPlanRouter);
router.use("/fitnessActivity", fitnessActivityRouter);
router.use("/trainingPrograms", trainingProgramsRouter);
router.use("/screeningForm", screeningFormRouter);
router.use("/trainingClassBooking", trainingClassBookingRouter);
router.use("/consentForm", consentFormRouter);

module.exports = router;
