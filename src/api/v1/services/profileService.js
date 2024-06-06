const { db, storage } = require('../../../configs/firebaseDB');
const { collection, getDocs, addDoc, doc, deleteDoc, setDoc, getDoc, query, where, updateDoc } = require("firebase/firestore");
const { ref, uploadBytes, getDownloadURL } = require("firebase/storage");
const { v4 } = require("uuid");
const fs = require('fs');

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

const uploadProfileImage = async (profileImage) => {
  try {
    const profileImageRef = ref(storage, `profileImages/${profileImage.filename}`);
    console.log(profileImage.path);
    // Assuming you are using Node.js and have the file system module available
    const buffer = fs.readFileSync(profileImage.path);  // Read the file into a buffer

    const metadata = {
      contentType: profileImage.mimetype, 
    };
    await uploadBytes(profileImageRef, buffer, metadata);
    console.log("Sharing profile image uploaded");
  } catch (error) {
    console.error('Error uploading:', error);
    throw error;
  }
}

const updateProfileInfo = async (uid, updates) => {
  try {
     const userRef = doc(db, 'Users', uid);

     const fieldsToUpdate = { ...updates };

     // Add downloadUrl to fieldsToUpdate if it's provided
    //  if (updates.downloadUrl) {
    //    fieldsToUpdate.downloadUrl = updates.downloadUrl;
    //  }

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

module.exports = {
    updateProfile,
    updateWater,
    uploadProfileImage,
    updateProfileInfo
}