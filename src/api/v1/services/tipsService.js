const { db, storage } = require('../../../configs/firebaseDB');
const { collection, getDocs, addDoc, doc, deleteDoc, setDoc, getDoc, query, where } = require("firebase/firestore");
const { ref, uploadBytes } = require("firebase/storage");
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


const addTip = async (uid, title, desc, downloadUrl) => {
  try {
    const addTip = await addDoc(collection(db, 'Tips'), {
      uid,
      title,
      desc,
      downloadUrl
    });
    return { id: addTip.id, uid, title, desc, downloadUrl};
  } catch (error) {
    console.error('Error adding tip:', error);
    throw error;
  }
};


const updateTip = async (id, uid, title, desc, downloadUrl) => {
  try {
    await setDoc(doc(db,'Tips',id),{
      uid,
      title,
      desc,
      downloadUrl
    })
    return { id, title, uid, desc, downloadUrl };
  } catch (error) {
    console.error('Error fetching:', error);
    throw error;
  }
}


const deleteTip = async (id) => {
  try {
    const deleteTip = await deleteDoc(doc(db,'Tips',id));
    console.log("Tip deleted successfully");
    return deleteTip;
  } catch (error) {
    console.error('Error fetching:', error);
    throw error;
  }
}

const uploadTipImage = async (tipImage) => {
  try {
    const tipImageRef = ref(storage, `tipImages/${tipImage.filename}`);

    // Assuming you are using Node.js and have the file system module available
    const buffer = fs.readFileSync(tipImage.path);  // Read the file into a buffer

    const metadata = {
      contentType: tipImage.mimetype, 
    };
    await uploadBytes(tipImageRef, buffer, metadata);
    console.log("Sharing tip image uploaded");
  } catch (error) {
    console.error('Error uploading:', error);
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
  