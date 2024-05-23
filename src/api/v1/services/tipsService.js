const {db} = require('../../../configs/firebaseDB');
const { collection, getDocs, addDoc, doc, deleteDoc, setDoc, getDoc, query, where } = require("firebase/firestore");

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


const addTip = async (title, uid, desc, pic) => {
  try {
    const addTip = await addDoc(collection(db, 'Tips'), {
      uid,
      title,
      desc,
      //pic
    });
    
    return { id: addTip.id, title, uid, desc, pic };
  } catch (error) {
    console.error('Error adding tip:', error);
    throw error;
  }
};


const updateTip = async (id, uid, title, desc, pic) => {
  try {
    const updateTip = await setDoc(doc(db,'Tips',id),{
      uid,
      title,
      desc,
      //pic
    })
    return { id, title, uid, desc, pic };
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

module.exports = {
    getAllTips,
    getAllUserTips,
    getTipById,
    addTip,
    updateTip,
    deleteTip,
  };
  