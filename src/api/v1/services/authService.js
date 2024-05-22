const {auth, db} = require('../../../configs/firebaseDB');
const  {signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, sendPasswordResetEmail} = require("firebase/auth")
const { collection, getDocs, addDoc, doc, deleteDoc, setDoc, getDoc } = require("firebase/firestore"); 

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
    const requiredFields = ['username', 'role', 'name', 'age', 'gender', 'dateOfBirth', 'height', 'weight', 'fitnessLevel', 'favClass', 'fitnessGoal', 'currentHydration'];
    for (const field of requiredFields) {
      if (!userDetails[field]) {
        throw new Error(`${field} is required`);
      }
    }

    // Initialize currentHydration to 0 if not provided
    if (!userDetails.hasOwnProperty('currentHydration')) {
      userDetails.currentHydration = "";
    }

    const userDoc = doc(db, 'Users', uid);
    await setDoc(userDoc, userDetails);
  } catch (error) {
    console.error("Registration failed:", error);
    throw new Error(error.message);  // Rethrowing the error with a clear message
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
    
    return { uid: user.uid, email: user.email };  
  } catch (error) {
    console.error("Registration failed:", error);
    throw new Error(error.message);  
  }
};

const loginAcc = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Get the user document from Firestore
    const userDocRef = doc(db, "Users", user.uid);
    const userDocSnapshot = await getDoc(userDocRef);

    // Check if the document exists and retrieve the role
    if (userDocSnapshot.exists()) {
      const userData = userDocSnapshot.data();
      const userRole = userData.role;  // Access the role field

      // You can return both user and userRole if needed
      return { user, userRole};
    } else {
      throw new Error("User document does not exist.");
    }
  } catch (error) {
    throw error;
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
    loginAccount,
    logoutAccount,
    forgotPassword,
    registerAcc,
    loginAcc,
    completeProfile,
    fitnessLevelService,
    fitnessGoalService,
    favClassService,
    getUserByIdService
  };
  