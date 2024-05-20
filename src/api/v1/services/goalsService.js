const {db} = require('../../../configs/firebaseDB');
const { collection, getDocs, addDoc, doc, deleteDoc, setDoc, getDoc } = require("firebase/firestore"); 

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


const addGoal = async (title) => {
    try {
      const addNewGoal = await addDoc(collection(db,'Goals'),{
        title
      })
      return addNewGoal;
    } catch (error) {
      console.error('Error fetching:', error);
      throw error;
    }
}


const updateGoal = async (id, title) => {
  try {
    const updateGoal = await setDoc(doc(db,'Goals',id),{
      title
    })
    return updateGoal;
  } catch (error) {
    console.error('Error fetching:', error);
    throw error;
  }
}


const deleteGoal = async (id) => {
  try {
    const deleteGoal = await deleteDoc(doc(db,'Goals',id));
    return deleteGoal;
  } catch (error) {
    console.error('Error fetching:', error);
    throw error;
  }
}



module.exports = {
    getAllGoals,
    getGoalById,
    addGoal,
    updateGoal,
    deleteGoal
  };
  