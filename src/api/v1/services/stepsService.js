const {db} = require('../../../configs/firebaseDB');
const { setDoc, doc, getDoc } = require("firebase/firestore");

const storeStep = async (uid, stepCount) => {
    try {
        const date = new Date();
        await setDoc(doc(db, 'Steps', uid), {
            uid,
            stepCount,
            date
        });
  
        return { uid, stepCount, date };
    } catch (error) {
      console.error('Error adding step:', error);
      throw error;
    }
};

const getStepsByUid = async (uid) => {
    try {
        const stepSnap = await getDoc(doc(db,'Steps',uid));
        const step = {uid: stepSnap.id, ...stepSnap.data()};
        return step;
    } catch (err) {
        throw new Error(`Error fetching steps: ${err.message}`);
    }
};


module.exports = {
    storeStep,
    getStepsByUid
}