const {db} = require('../../../configs/firebaseDB');
const { setDoc, doc, getDoc, updateDoc } = require("firebase/firestore");

const storeStep = async (uid, stepCount) => {
    try {
      const date = new Date();
      const day = date.toISOString().split('T')[0];  // e.g. "2024-10-11"
      const year = date.getFullYear();  // e.g. 2024
      const month = `${year}-${date.getMonth() + 1}`;  // e.g. "2024-10"
      
      const userStepsRef = doc(db, 'Steps', uid);
  
      // Fetch the existing steps (if available)
      const stepSnap = await getDoc(userStepsRef);
      let currentSteps = stepSnap.exists() ? stepSnap.data() : {};
  
      const previousDaySteps = currentSteps.stepsByDay?.[day] || 0;
      const previousMonthSteps = currentSteps.stepsByMonth?.[month] || 0;
  
      // Calculate the difference between the current and previously stored steps for the day
      const stepDifference = stepCount - previousDaySteps;
  
      // Update the step count for the day and add the difference to the monthly count
      const updatedStepsByDay = { ...currentSteps.stepsByDay, [day]: stepCount };
      const updatedStepsByMonth = { ...currentSteps.stepsByMonth, [month]: previousMonthSteps + stepDifference };
  
      await setDoc(userStepsRef, {
        uid,
        stepsByDay: updatedStepsByDay,
        stepsByMonth: updatedStepsByMonth,
        updatedAt: date,
        todayStep: stepCount,  // Step count for today
        monthlyStep: previousMonthSteps + stepDifference  // Total step count for the month
      }, { merge: true });
  
      return {
        uid,
        stepsByDay: updatedStepsByDay,
        stepsByMonth: updatedStepsByMonth,
        updatedAt: date,
        todayStep: stepCount,  // Step count for today
        monthlyStep: previousMonthSteps + stepDifference  // Total step count for the month
      };
    } catch (error) {
      console.error('Error storing steps:', error);
      throw error;
    }
  };  

  const getStepsByUid = async (uid) => {
    try {
      const date = new Date();
      const day = date.toISOString().split('T')[0]; // e.g., "2024-10-11"
      const year = date.getFullYear();
      const month = `${year}-${date.getMonth() + 1}`; // e.g., "2024-10"
  
      // Fetch the steps document from Firestore
      const stepSnap = await getDoc(doc(db, 'Steps', uid));
  
      // If document doesn't exist, return default values
      if (!stepSnap.exists()) {
        console.warn(`No steps found for user ${uid}`);
        return {
          uid,
          stepsToday: 0,
          stepsByDay: {},
          stepsByMonth: {},
        };
      }
  
      const stepData = stepSnap.data();
  
      // Get today's steps
      const stepsToday = stepData.stepsByDay?.[day] || 0;
  
      // Get step history for each day
      const stepsByDay = stepData.stepsByDay || {};
  
      // Get steps count by month
      const stepsByMonth = stepData.stepsByMonth || {};
  
      return {
        uid,
        stepsToday,
        stepsByDay,
        stepsByMonth,
      };
    } catch (err) {
      console.error(`Error fetching steps for user ${uid}:`, err);
      // Return default values in case of an error
      return {
        uid,
        stepsToday: 0,
        stepsByDay: {},
        stepsByMonth: {},
      };
    }
  };  

  const updateStepGoal = async (uid, stepGoal) => {
    try {
      const userRef = doc(db, 'Steps', uid);

      await setDoc(userRef, {
        uid,
        stepGoal,
      }, { merge: true });

      return { uid, stepGoal, message: 'Step goal updated successfully'};
    } catch (error) {
        console.error('Error updating step goal:', error);
        throw error;
    }
  }

  const getStepGoalByUid = async (uid) => {
    try {
      // Fetch the steps document from Firestore
      const stepSnap = await getDoc(doc(db, 'Steps', uid));
      if (!stepSnap.exists()) {
        throw new Error(`No step goal found for user ${uid}`);
      }
      const stepData = stepSnap.data();
      return {
        uid,
        stepGoal: stepData.stepGoal
    };
    } catch (err) {
      throw new Error(`Error fetching steps: ${err.message}`);
    }
  };

module.exports = {
    storeStep,
    getStepsByUid,
    updateStepGoal,
    getStepGoalByUid
}