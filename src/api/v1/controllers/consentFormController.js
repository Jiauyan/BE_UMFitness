const consentFormService = require("../services/consentFormService");

// Add consent form
const upsertConsentForm = async (req, res) => {
    try {
        const { uid, name, date, emergencyContactName, emergencyContactPhoneNumber } = req.body;

        const addNewConsentForm = await consentFormService.upsertConsentForm(
            uid,
            name,
            date,
            emergencyContactName,
            emergencyContactPhoneNumber
        );
  
        return res.status(200).json(addNewConsentForm);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// get consent form by UID
const getConsentFormByUID = async (req, res) => {
    try {
      const { uid } = req.params;
      const consentForm = await consentFormService.getConsentFormByUID(uid);
      return res.status(200).json(consentForm);
    } catch (err) {
      console.error('Error fetching consent form:', err);
      return res.status(400).json({ message: err.message });
    }
};

  // delete consent form
const deleteConsentForm = async (req, res) => {
    try {
      const { id } = req.params;
      const deleteConsentForm = await consentFormService.deleteConsentForm(id);
      return res.status(200).json(deleteConsentForm);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
};

module.exports = {
    upsertConsentForm,
    getConsentFormByUID,
    deleteConsentForm
};
