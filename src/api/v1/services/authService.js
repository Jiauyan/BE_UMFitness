const {auth} = require('../../../configs/firebaseDB');
const  {signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, sendPasswordResetEmail, GoogleAuthProvider, signInWithPopup,deleteUser} = require("firebase/auth")
const { getFirestore, doc, setDoc, getDoc, alert, deleteDoc } = require('firebase/firestore');
const db = getFirestore();
const user = auth.currentUser;

const loginAccount = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

     // Get the user document from Firestore
    const userDocRef = doc(db, "Users", user.uid);
    const userDocSnapshot = await getDoc(userDocRef);

     if (userDocSnapshot.exists()) {
      const userData = userDocSnapshot.data();
      return { userData, uid: user.uid };
    } else {
      throw new Error("User document does not exist.");
    }
  } catch (error) {
    throw error;
  }
};

const registerAccount = async (email, password) => {
  try {
    const newUser = await createUserWithEmailAndPassword(auth, email, password);
    const user = newUser.user;
    await setDoc(doc(db, "Users", user.uid), {
          email: user.email,
        });

    return { uid: user.uid, email: user.email };
  } catch (error) {
    console.log(error)
    throw error
  }
};

const saveUserDetails = async (uid, userDetails) => {
  try {
    // Validate userDetails here if needed
    const requiredFields = ['email', 'username', 'role', 'name', 'age', 'gender', 'height', 'weight', 'fitnessLevel', 'favClass', 'fitnessGoal', 'currentHydration', 'phoneNumber', 'photoURL'];
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

const deleteAccount = async (uid) => {
  const user = auth.currentUser;
  if (!user) {
    console.error("User is not authenticated");
    return;
  }
  try {
    await deleteDoc(doc(db, "Users", uid));
    await deleteUser(user);
    console.log("Account deleted successfully");
  } catch (error) {
    console.error("Error deleting account:", error);
  }
};

const registerAcc = async (email, password, downloadUrl) => {
  try {
 
    const newUser = await createUserWithEmailAndPassword(auth, email, password);
    const user = newUser.user;

    await setDoc(doc(db, "Users", user.uid), {
      email: user.email,
      downloadUrl
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
      const userRole = userData.role;  

      return { user, userRole, userData};
    } else {
      throw new Error("User document does not exist.");
    }
  } catch (error) {
    throw error;
  }
};

const signInWithGoogleService = async (user) => {
  try {
    // Get the user document from Firestore
    const userDocRef = doc(db, "Users", user.uid);
    const userDocSnapshot = await setDoc(userDocRef, user);

    if (userDocSnapshot.exists()) {
      const userData = userDocSnapshot.data();
      const userRole = userData.role;  

      return { user, userRole, userData};
    } else {
      throw new Error("User document does not exist.");
    }
  } catch (error) {
    throw error;
  }
};

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

const completeProfile = async (
  uid,
  role, 
  name,
  username,
  age,
  gender, 
  weight, 
  height,) => {
  const userRef = doc(db, 'Users', uid);
  try {
    const addUserInfo = await setDoc(userRef, {  
      role, 
      name,
      username,
      age,
      gender,  
      weight, 
      height,
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
    deleteAccount,
    registerAcc,
    loginAcc,
    signInWithGoogleService,
    completeProfile,
    fitnessLevelService,
    fitnessGoalService,
    favClassService,
    getUserByIdService,
    uploadTipImage
  };
  