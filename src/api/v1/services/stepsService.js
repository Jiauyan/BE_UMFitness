const {db} = require('../../../configs/firebaseDB');
const { setDoc, doc } = require("firebase/firestore");

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


module.exports = {
    storeStep
}