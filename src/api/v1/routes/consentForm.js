const express = require("express");
const router = express.Router();

const consentFormController = require("../controllers/consentFormController");

router.post("/upsertConsentForm", consentFormController.upsertConsentForm);
router.get("/getConsentFormByUID/:uid", consentFormController.getConsentFormByUID);
router.delete("/deleteConsentForm/:id", consentFormController.deleteConsentForm);

module.exports = router;