const express = require("express");
const router = express.Router();

const authRouter = require("./auth");
const goalsRouter = require("./goals");

router.use("/auth", authRouter);
router.use("/goals", goalsRouter);

module.exports = router;
