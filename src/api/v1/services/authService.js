const {auth} = require('../../../configs/firebaseDB');
const  {signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, sendPasswordResetEmail} = require("firebase/auth")
const { getFirestore, doc, setDoc, getDoc, alert } = require('firebase/firestore');

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

const forgotPassword = async (email) => {
    try {
        await sendPasswordResetEmail(auth, email);
        return "Password reset email sent successfully";
    } catch (error) {
        console.log("Printing error code:" + error.code);
        console.log("Printing error message:" + error.message);
        return error.message;
    }
}

const registerAcc = async (email, password) => {
  try {
 
    const newUser = await createUserWithEmailAndPassword(auth, email, password);
    const user = newUser.user;

    await setDoc(doc(db, "Users", user.uid), {
      email: user.email,
    });
    
    return { status: true, uid: user.uid, email: user.email };  // Return a success status and user data
  } catch (error) {
    console.error("Registration failed:", error);
    throw new Error(error.message);  // Rethrowing the error with a clear message
  }
};

const completeProfile = async (
  uid,
  role, 
  name,
  username,
  age,
  gender, 
  dateOfBirth, 
  weight, 
  height) => {
  const userRef = doc(db, 'Users', uid);
  try {
    const addUserInfo = await setDoc(userRef, {  
      role, 
      name,
      username,
      age,
      gender, 
      dateOfBirth, 
      weight, 
      height
     }, 
     { merge: true });

    return addUserInfo;
    
  } catch (error) {
    console.error('Error fetching:', error);
    throw error;
  }
}

const fitnessLevelService = async (uid, fitnessLevel) => {
  const userRef = doc(db, 'Users', uid);
  try {
    const addFitnessLevel = await setDoc(userRef, { fitnessLevel }, { merge: true });
    return addFitnessLevel;

  } catch (error) {
    console.error('Error updating fitness level:', error);
    throw error;
  }
}

const fitnessGoalService = async (uid, fitnessGoal) => {
  const userRef = doc(db, 'Users', uid);
  try {
    const addFitnessGoal = await setDoc(userRef, { fitnessGoal }, { merge: true });
    return addFitnessGoal;

  } catch (error) {
    console.error('Error updating fitness goal:', error);
    throw error;
  }
}

const favClassService = async (uid, favClass) => {
  const userRef = doc(db, 'Users', uid);
  try {
    const addFavClass = await setDoc(userRef, { favClass }, { merge: true });
    return addFavClass;

  } catch (error) {
    console.error('Error updating exercise type:', error);
    throw error;
  }
}

const getUserByIdService = async (uid) => {
  try {
    const getUser = await getDoc(doc(db,'Users',uid));
    const user = {uid: getUser.uid, ...getUser.data()};
    return user;
  } catch (error) {
    console.error('Error fetching:', error);
    throw error;
  }
}

  module.exports = {
    registerAccount,
    saveUserDetails,
    getUserDetails ,
    loginAccount,
    logoutAccount,
    forgotPassword,
    registerAcc,
    completeProfile,
    fitnessLevelService,
    fitnessGoalService,
    favClassService,
    getUserByIdService
  };
  