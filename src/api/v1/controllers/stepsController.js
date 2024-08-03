const stepsService = require("../services/stepsService");

const storeStepsCount = async (req, res) => {
    try {
        const { uid, stepCount } = req.body;
        const storeSteps = await stepsService.storeStep(
            uid, 
            stepCount
        );
        return res.status(200).json(storeSteps);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

const getStepsCount = async (req, res) => {
    try {
        const { uid } = req.params;
        // Assuming you have a function in stepsService to fetch step counts by uid
        const steps = await stepsService.getStepsByUid(uid);
        return res.status(200).json({ steps });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

module.exports = {
    storeStepsCount,
    getStepsCount
}