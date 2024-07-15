const {db} = require('../../../configs/firebaseDB');
const { collection, getDocs, addDoc, doc, deleteDoc, setDoc, getDoc, query, where, orderBy, serverTimestamp } = require("firebase/firestore");

const getAllUsersWithInfo = async () => {
    try {
      const usersRef = collection(db, 'Users');
      const querySnapshot = await getDocs(usersRef);
  
      const users = [];
      querySnapshot.forEach(doc => {
        const userData = doc.data();
        users.push({
          username: userData.username,
          photoURL: userData.photoURL,
          uid: doc.id
        });
      });
  
      return users;
    } catch (error) {
      throw new Error('Error getting all users with info: ' + error.message);
    }
  };

  module.exports = {
      getAllUsersWithInfo
  };
