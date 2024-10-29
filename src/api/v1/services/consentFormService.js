const {db} = require('../../../configs/firebaseDB');
const { collection, getDocs, addDoc, doc, deleteDoc, setDoc, getDoc, query, where, orderBy } = require("firebase/firestore");

// add consent form
const upsertConsentForm = async (uid, name, date, emergencyContactName, emergencyContactPhoneNumber) => {
    // Validate that all fields are filled in
    if (!uid || !name || !date || !emergencyContactName || !emergencyContactPhoneNumber) {
        throw new Error('All fields must be filled in: uid, name, date, emergencyContactName, emergencyContactPhoneNumber');
    }

    try {
        // Create a reference to the specific document in the 'ConsentForm' collection
        const docRef = doc(collection(db, 'ConsentForm'), uid);

        // Set the data (update if exists, create if not) with merge option
        await setDoc(docRef, {
            uid,
            name,
            date,
            emergencyContactName,
            emergencyContactPhoneNumber
        }, { merge: true });

        // Return the added or updated consent form data
        return {
            uid,
            name,
            date,
            emergencyContactName,
            emergencyContactPhoneNumber
        };
    } catch (error) {
        console.log('Error creating or updating consent form:', err);
        throw error;
    }
};

// get consent form by UID
const getConsentFormByUID = async (uid) => {
    try {
        const consentFormRef = collection(db, 'ConsentForm');
        const q = query(consentFormRef, where('uid', '==', uid));
        const querySnapshot = await getDocs(q);
        
        if (!querySnapshot.empty) {
            const doc = querySnapshot.docs[0];
            return { id: doc.id, ...doc.data() };
        }
        
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
    upsertConsentForm,
    getConsentFormByUID,
    deleteConsentForm
};