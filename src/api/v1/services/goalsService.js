const {db} = require('../../../configs/firebaseDB');
const { collection, getDocs, addDoc, doc, deleteDoc, setDoc, getDoc, query, where } = require("firebase/firestore");

const getAllGoals = async () => {
    try {
      const querySnapshot = await getDocs(collection(db,'Goals'));
      const goals = querySnapshot.docs.map(doc => ({id: doc.id, ...doc.data()}))
      return goals;
    } catch (error) {
      console.error('Error fetching:', error);
      throw error;
    }
  }

  const getAllUserGoals = async (uid) => {
    try {
      const goalsRef = collection(db, 'Goals');
      const q = query(goalsRef, where('uid', '==', uid));
      const querySnapshot = await getDocs(q);

      const goals = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      return goals;
    } catch (error) {
      console.error('Error fetching goals:', error);
      throw error;
    }
  };

const getGoalById = async (id) => {
    try {
      const goalSnap = await getDoc(doc(db,'Goals',id));
      const goal = {id: goalSnap.id, ...goalSnap.data()};
      return goal;
    } catch (error) {
      console.error('Error fetching:', error);
      throw error;
    }
}


const addGoal = async (title, uid, status) => {
  try {
    const timestamp = new Date().toISOString();
    const addGoal = await addDoc(collection(db, 'Goals'), {
      title,
      uid,
      status,
      createdAt: timestamp
    });
    
    return { id: addGoal.id, title, uid, status, createdAt:timestamp };
  } catch (error) {
    console.error('Error adding goal:', error);
    throw error;
  }
};


const updateGoal = async (id, uid, title, status) => {
  try {
    const timestamp = new Date().toISOString();
    const updateGoal = await setDoc(doc(db,'Goals',id),{
      uid,
      title,
      status,
      createdAt: timestamp
    })
    return { id, title, uid, status };
  } catch (error) {
    console.error('Error fetching:', error);
    throw error;
  }
}


const deleteGoal = async (id) => {
  try {
    const deleteGoal = await deleteDoc(doc(db,'Goals',id));
    return id;
  } catch (error) {
    console.error('Error fetching:', error);
    throw error;
  }
}

// const completeGoal = async (id, uid, status) => {
//   try {
//     const completeGoal = await setDoc(doc(db,'Goals',id),{
//       uid,
//       status,
//     })
//     return completeGoal;
//   } catch (error) {
//     console.error('Error fetching:', error);
//     throw error;
//   }
// }


module.exports = {
    getAllGoals,
    getAllUserGoals,
    getGoalById,
    addGoal,
    updateGoal,
    deleteGoal,
    //completeGoal
  };
  