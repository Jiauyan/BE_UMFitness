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

module.exports = {
    storeStepsCount
}