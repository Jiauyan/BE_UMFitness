const {db} = require('../../../configs/firebaseDB');
const { collection, getDocs, addDoc, doc, deleteDoc, setDoc, getDoc, query, where, orderBy } = require("firebase/firestore");

// add fitness activity - title & date
const addFitnessActivity = async (uid, task, duration, status, fitnessPlanID) => {
    try {
        const timestamp = new Date().toISOString();
        const addNewFitnessActivity = await addDoc(collection(db, 'Fitness Activity'), {
            uid,
            task,
            duration,
            status,
            fitnessPlanID,
            createdAt: timestamp
        });

        const createdAt = timestamp;
        const id = addNewFitnessActivity.id;

        return { uid, task, duration, id, status, fitnessPlanID, createdAt };
    } catch (err) {
        console.log('Error creating new fitness activity:', err);
        throw err;
    }
}

// edit fitness activity
// createdAt - get from addFitnessActivity (to maintain list sequence after editing, based on add time, not edit time)
const updateFitnessActivity = async (id, uid, task, duration, status, fitnessPlanID, createdAt) => {
    try {
        const updateFitnessActivity = await setDoc(doc(db, 'Fitness Activity', id), {
            uid,
            task, 
            duration,
            status,
            fitnessPlanID,
            createdAt
        })

        return { id, uid, task, duration, status, fitnessPlanID, createdAt };
    }catch (err) {
        console.error('Error fetching:', err);
        throw err;
    }
}

// get all fitness activities by uid and fitnessPlanID
const getFitnessActivityByUidAndPlanID = async (uid, fitnessPlanID) => {
    try {
      const fitnessActivitiesRef = collection(db, 'Fitness Activity');
      const q = query(fitnessActivitiesRef, where('uid', '==', uid), where('fitnessPlanID', '==', fitnessPlanID));
      const querySnapshot = await getDocs(q);
  
      const fitnessActivities = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  
      return fitnessActivities;
    } catch (err) {
      throw new Error('Error fetching fitness activities');
    }
  };
  

// get fitness activity by id
const getFitnessActivityById = async (id) => {
    try {
        const fitnessActivitySnap = await getDoc(doc(db,'Fitness Activity',id));
        const fitnessActivity = {id: fitnessActivitySnap.id, ...fitnessActivitySnap.data()};
        return {
            ...fitnessActivity
        };
    }catch (err) {
        console.error('Error fetching:', err);
        throw err;
    }
}

// delete fitness Activity
const deleteFitnessActivity = async (id) => {
    try {
        const deleteFitnessActivity = await deleteDoc(doc(db, 'Fitness Activity', id));
        return id;
    }catch (err) {
        console.error('Error fetching:', err);
        throw err;
    }
}

module.exports = {
    addFitnessActivity,
    updateFitnessActivity,
    getFitnessActivityByUidAndPlanID,
    getFitnessActivityById,
    deleteFitnessActivity
};
