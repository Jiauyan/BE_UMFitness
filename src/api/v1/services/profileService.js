const {db} = require('../../../configs/firebaseDB');
const { getFirestore, doc, setDoc, getDoc, alert, updateDoc } = require('firebase/firestore');

const updateProfile = async (uid, updates) => {
  try {
     const userRef = doc(db, 'Users', uid);

    // Create an object with only the defined fields
    const fieldsToUpdate = {};
    for (const key in updates) {
      if (updates[key] !== undefined) {
        fieldsToUpdate[key] = updates[key];
      }
    }

    // Log the fields to be updated
    console.log('Updating fields:', fieldsToUpdate);

    // Update the document with the filtered fields
    await updateDoc(userRef, fieldsToUpdate);

    return { message: 'Profile updated successfully' };
  } catch (error) {
    console.error('Error updating profile:', error);
    throw error;
  }
}

const updateWater = async (uid, currentHydration) => {
  try {
    const userRef = doc(db, 'Users', uid);

    // Create an object with only the defined field
    const currentHydrationUpdate = {};
    if (currentHydration !== undefined) {
      currentHydrationUpdate.currentHydration = currentHydration;
    }

    // Log the fields to be updated
    console.log('Updating fields:', currentHydrationUpdate);

    // Update the document with the filtered fields
    await updateDoc(userRef, currentHydrationUpdate);

    return { message: 'Current Hydration updated successfully' };
  } catch (error) {
    console.error('Error updating water:', error);
    throw error;
  }
}

module.exports = {
    updateProfile,
    updateWater
}