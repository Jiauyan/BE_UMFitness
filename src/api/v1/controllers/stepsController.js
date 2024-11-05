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

const updateStepGoal = async (req, res) => {
    try {
        const { uid } = req.params;
        const { stepGoal } = req.body;

        // Log the received data for debugging
        console.log('Received data for stepsGoal:', stepGoal);
        const updateResponse = await stepsService.updateStepGoal(uid, stepGoal);

        return res.status(200).json(updateResponse); // Use 200 for successful updates
    } catch (err) {
        console.error('Error in updateStepGoal:', err);
        res.status(500).json({ message: err.message });
    }
};

const getStepGoal = async (req, res) => {
    try {
        const { uid } = req.params;
        const steps = await stepsService.getStepGoalByUid(uid);  
        return res.status(200).json({ steps });
    } catch (err) {
        console.error('Error fetching step goal:', err);
        // Check if the error is about a missing step goal
        if (err.message.includes('No step goal found')) {
            return res.status(404).json({ message: err.message });
        }
        return res.status(500).json({ message: err.message });
    }
};

module.exports = {
    storeStepsCount,
    getStepsCount,
    updateStepGoal,
    getStepGoal
}