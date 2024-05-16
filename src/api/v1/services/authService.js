const {auth} = require('../../../configs/firebaseDB');
const  {signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut} = require("firebase/auth")
const { getFirestore, doc, setDoc, getDoc } = require('firebase/firestore');

const db = getFirestore();

const loginAccount = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    return user;
  } catch (error) {
    throw error;
  }
};

const registerAccount = async (email, password) => {
  try {
    const newUser = await createUserWithEmailAndPassword(auth, email, password);
    return newUser.user;
  } catch (error) {
    console.log(error)
    throw error
  }
};

const saveUserDetails = async (uid, userDetails) => {
  try {
    // Validate userDetails here if needed
    const requiredFields = ['username', 'role', 'name', 'gender', 'dateOfBirth', 'height', 'weight', 'fitnessLevel', 'favClass', 'fitnessGoal'];
    for (const field of requiredFields) {
      if (!userDetails[field]) {
        throw new Error(`${field} is required`);
      }
    }

    const userDoc = doc(db, 'Users', uid);
    await setDoc(userDoc, userDetails);
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const getUserDetails = async (uid) => {
  try {
    const userDoc = doc(db, 'Users', uid);
    const userSnap = await getDoc(userDoc);
    if (userSnap.exists()) {
      return userSnap.data();
    } else {
      throw new Error('No such document!');
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const logoutAccount = async () => {
  try {
    const signout = await signOut(auth);
    console.log("User signed out successfully");
    return signout;
  } catch (error) {
    throw error;
  }
};

/* const getAllAccount = async () => {
     try {
       const usersSnapshot = await db.collection('user').get();
       const users = [];
       usersSnapshot.forEach((doc) => {
         users.push({ id: doc.id, ...doc.data() });
       });
       return users;
     } catch (error) {
       console.error('Error fetching users:', error);
       throw error;
     }
   };*/

  module.exports = {
    //getAllAccount,
    registerAccount,
    saveUserDetails,
    getUserDetails ,
    loginAccount,
    logoutAccount
  };
  