const {db} = require('../../../configs/firebaseDB');
const { collection, getDocs, addDoc, doc, deleteDoc, setDoc, getDoc, query, where, orderBy } = require("firebase/firestore");

// add fitness plan - title & date
const createFitnessPlan = async (uid, title, date, completeCount, totalCount) => {
    try {
        const timestamp = new Date().toISOString();
        const addNewFitnessPlan = await addDoc(collection(db, 'FitnessPlans'), {
            uid,
            title,
            date,
            completeCount,
            totalCount,
            createdAt: timestamp
        });

        const createdAt = timestamp;
        const id = addNewFitnessPlan.id;

        return { uid, title, date, id, completeCount, totalCount, createdAt };
    } catch (err) {
        console.log('Error creating new fitness plan:', err);
        throw err;
    }
}

// edit fitness plan
// createdAt - get from createFitnessPlan (to maintain list sequence after editing - based on add time,  not edit time)
const updateFitnessPlan = async (id, uid, title, date, completeCount, totalCount) => {
    try {
        const timestamp = new Date().toISOString();
        const createdAt = timestamp;
        const updateFitnessPlan = await setDoc(doc(db, 'FitnessPlans', id), {
            uid,
            title, 
            date,
            completeCount,
            totalCount,
            createdAt: timestamp
        })

        return { id, uid, title, date, completeCount, totalCount, createdAt };
    }catch (err) {
        console.error('Error fetching:', err);
        throw err;
    }
}

// get all fitness plans by uid
const getFitnessPlanByUid = async (uid) => {
    try {
        const fitnessPlansRef = collection(db, 'FitnessPlans');
        const q = query(fitnessPlansRef, where('uid', '==', uid));
        const querySnapshot = await getDocs(q);

        const fitnessPlans = querySnapshot.docs.map(doc => ({ id:doc.id, ...doc.data() }));

        return fitnessPlans;
    }catch (err) {
        console.error('Error fetching fitness plans:', err);
        throw err;
    }
}

// get fitness plan by id
const getFitnessPlanById = async (id) => {
    try {
        const fitnessPlanSnap = await getDoc(doc(db,'FitnessPlans',id));
        const fitnessPlan = {id: fitnessPlanSnap.id, ...fitnessPlanSnap.data()};
        return {
            ...fitnessPlan
        };
    }catch (err) {
        console.error('Error fetching:', err);
        throw err;
    }
}

// delete fitness plan
const deleteFitnessPlan = async (id) => {
    try {
        // Delete fitness activities associated with the plan id
        const fitnessActivityRef = collection(db, 'FitnessActivities');
        const fitnessActivityQuery = query(fitnessActivityRef, where('fitnessPlanID', '==', id));
        const fitnessActivitySnapshot = await getDocs(fitnessActivityQuery);
        
        fitnessActivitySnapshot.forEach(async (fitnessActivityDoc) => {
        await deleteDoc(fitnessActivityDoc.ref);
        });
        const deleteFitnessPlan = await deleteDoc(doc(db, 'FitnessPlans', id));
        return id;
    }catch (err) {
        console.error('Error fetching:', err);
        throw err;
    }
}

module.exports = {
    createFitnessPlan,
    updateFitnessPlan,
    getFitnessPlanByUid,
    getFitnessPlanById,
    deleteFitnessPlan
};
