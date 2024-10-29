const express = require("express");
const router = express.Router();

const screeningFormController = require("../controllers/screeningFormController");

router.post("/upsertScreeningForm", screeningFormController.upsertScreeningForm);
router.get("/getScreeningFormByUID/:uid", screeningFormController.getScreeningFormByUID);
router.delete("/deleteScreeningForm/:id", screeningFormController.deleteScreeningForm);

module.exports = router;