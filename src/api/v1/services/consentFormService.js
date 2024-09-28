const {db} = require('../../../configs/firebaseDB');
const { collection, getDocs, addDoc, doc, deleteDoc, setDoc, getDoc, query, where, orderBy } = require("firebase/firestore");

// add fitness activity - title & date
const addConsentForm = async (uid, q1, q2, q2_details, q3, q3_details) => {
    try {
        const addNewConsentForm = await addDoc(collection(db, 'ConsentForm'), {
            uid,
            q1,
            q2, 
            q2_details, 
            q3, 
            q3_details,
        });

        const id = addNewConsentForm.id;

        return { uid, id, q1, q2, q2_details, q3, q3_details };
    } catch (err) {
        console.log('Error creating new consent form:', err);
        throw err;
    }
}

// get consent form by UID
const getConsentFormByUID = async (uid) => {
    try {
        const consentFormRef = collection(db, 'ConsentForm');
        const q = query(consentFormRef, where('uid', '==', uid));
        const querySnapshot = await getDocs(q);
        
        // Check if there are any documents and return the first one
        if (!querySnapshot.empty) {
            const doc = querySnapshot.docs[0];
            return { id: doc.id, ...doc.data() };
        }
        
        // Return null if no document is found
        return null;
    } catch (err) {
        throw new Error('Error fetching consent form');
    }
};

// delete consent form
const deleteConsentForm = async (id) => {
    try {
        const deleteConsentForm = await deleteDoc(doc(db, 'ConsentForm', id));
        return id;
    }catch (err) {
        console.error('Error fetching:', err);
        throw err;
    }
}

module.exports = {
    addConsentForm,
    getConsentFormByUID,
    deleteConsentForm
};