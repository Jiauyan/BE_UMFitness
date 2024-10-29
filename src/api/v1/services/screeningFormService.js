const {db} = require('../../../configs/firebaseDB');
const { collection, getDocs, addDoc, doc, deleteDoc, setDoc, getDoc, query, where, orderBy } = require("firebase/firestore");

// Function to create or update the screening form
const upsertScreeningForm = async (uid, q1, q2, q3, q4, q5, q6, q7) => {
    try {
      // Create a reference to the specific document in the 'ScreeningForm' collection
      const docRef = doc(collection(db, 'ScreeningForm'), uid);
  
      // Set the data (update if exists, create if not) with merge option
      await setDoc(docRef, {
        uid, q1, q2, q3, q4, q5, q6, q7
      }, { merge: true });
  
      return { uid, q1, q2, q3, q4, q5, q6, q7 };
    } catch (error) {
      console.error('Error saving the form:', error);
      throw error;
    }
  }

// get screening form by UID
const getScreeningFormByUID = async (uid) => {
    try {
        const screeningFormRef = collection(db, 'ScreeningForm');
        const q = query(screeningFormRef, where('uid', '==', uid));
        const querySnapshot = await getDocs(q);
        
        // Check if there are any documents and return the first one
        if (!querySnapshot.empty) {
            const doc = querySnapshot.docs[0];
            return { id: doc.id, ...doc.data() };
        }
        
        // Return null if no document is found
        return null;
    } catch (err) {
        throw new Error('Error fetching screening form');
    }
};

// delete screening form
const deleteScreeningForm = async (id) => {
    try {
        const deleteScreeningForm = await deleteDoc(doc(db, 'ScreeningForm', id));
        return id;
    }catch (err) {
        console.error('Error fetching:', err);
        throw err;
    }
}

module.exports = {
    upsertScreeningForm,
    getScreeningFormByUID,
    deleteScreeningForm
};