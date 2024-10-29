const screeningFormService = require("../services/screeningFormService");

// Add and update screening form
const upsertScreeningForm = async (req, res) => {
    try {
        const { uid, q1, q2, q3, q4, q5, q6, q7 } = req.body;
  
        const addNewScreeningForm = await screeningFormService.upsertScreeningForm(
            uid,
            q1, 
            q2, 
            q3, 
            q4, 
            q5, 
            q6, 
            q7
        );
  
        return res.status(200).json(addNewScreeningForm);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// get screening form by UID
const getScreeningFormByUID = async (req, res) => {
    try {
      const { uid } = req.params;
      const screeningForm = await screeningFormService.getScreeningFormByUID(uid);
      return res.status(200).json(screeningForm);
    } catch (err) {
      console.error('Error fetching screening form:', err);
      return res.status(400).json({ message: err.message });
    }
};

  // delete fitness plan
const deleteScreeningForm = async (req, res) => {
    try {
      const { id } = req.params;
      const deleteScreeningForm = await screeningFormService.deleteScreeningForm(id);
      return res.status(200).json(deleteScreeningForm);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
};

module.exports = {
    upsertScreeningForm,
    getScreeningFormByUID,
    deleteScreeningForm
};
