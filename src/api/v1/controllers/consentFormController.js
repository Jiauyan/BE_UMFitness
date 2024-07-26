const consentFormService = require("../services/consentFormService");

// Add fitness activity
const addConsentForm = async (req, res) => {
    try {
        const { uid, q1, q2, q2_details, q3, q3_details } = req.body;

        // Validate q2 and q3 details based on their values
        if (q2 === 'yes' && !q2_details) {
            return res.status(400).json({ message: 'q2_details must not be null if q2 is yes' });
        }
        if (q3 === 'yes' && !q3_details) {
            return res.status(400).json({ message: 'q3_details must not be null if q3 is yes' });
        }
  
        const addNewConsentForm = await consentFormService.addConsentForm(
            uid,
            q1,
            q2, 
            q2_details, 
            q3, 
            q3_details,
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

  // delete fitness plan
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
    addConsentForm,
    getConsentFormByUID,
    deleteConsentForm
};
