const { db, storage } = require('../../../configs/firebaseDB');
const { collection, getDocs, addDoc, doc, deleteDoc, setDoc, getDoc, query, where, updateDoc } = require("firebase/firestore");
const { ref, uploadBytes, getDownloadURL } = require("firebase/storage");
const { v4 } = require("uuid");
const fs = require('fs');


const getAllTips = async () => {
    try {
      const querySnapshot = await getDocs(collection(db,'Tips'));
      const tips = querySnapshot.docs.map(doc => ({id: doc.id, ...doc.data()}))
      return tips;
    } catch (error) {
      console.error('Error fetching:', error);
      throw error;
    }
  }

  const getAllUserTips = async (uid) => {
    try {
      const tipsRef = collection(db, 'Tips');
      const q = query(tipsRef, where('uid', '==', uid));
      const querySnapshot = await getDocs(q);

      const tips = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      return tips;
    } catch (error) {
      console.error('Error fetching tips:', error);
      throw error;
    }
  };

const getTipById = async (id) => {
    try {
      const tipSnap = await getDoc(doc(db,'Tips',id));
      const tip = {id: tipSnap.id, ...tipSnap.data()};
      return tip;
    } catch (error) {
      console.error('Error fetching:', error);
      throw error;
    }
}


const addTip = async (uid, title, desc, shortDesc, username, userImageUrl, downloadUrl
) => {
  try {
    const timestamp = new Date().toISOString();
    const addTip = await addDoc(collection(db, 'Tips'), {
      uid,
      title,
      desc,
      downloadUrl,
      createdAt: timestamp,
      shortDesc, 
      username, 
      userImageUrl
    });
    return { id: addTip.id, uid, title, desc, downloadUrl, shortDesc, username, userImageUrl, createdAt: timestamp};
  } catch (error) {
    console.error('Error adding tip:', error);
    throw error;
  }
};


const updateTip = async (id, updates) => {
  try {
    const tipRef = doc(db, 'Tips', id); 

    // Prepare fields to update
    const fieldsToUpdate = { ...updates };

    // Update the document with the fields
    await updateDoc(tipRef, fieldsToUpdate);

    return { id, updates};
  } catch (error) {
    console.error('Error fetching:', error);
    throw error;
  }
}


const deleteTip = async (id) => {
  try {
    const deleteTip = await deleteDoc(doc(db,'Tips',id));
    return deleteTip;
  } catch (error) {
    console.error('Error fetching:', error);
    throw error;
  }
}

module.exports = {
    getAllTips,
    getAllUserTips,
    getTipById,
    addTip,
    updateTip,
    deleteTip,
    uploadTipImage
  };
  