const {auth} = require('../../../configs/firebaseDB');
const  {signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut} = require("firebase/auth")


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
    const user = newUser.user;
    return user;
  } catch (error) {
    throw error
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

// const getAllAccount = async () => {
//     try {
//       const usersSnapshot = await db.collection('user').get();
//       const users = [];
//       usersSnapshot.forEach((doc) => {
//         users.push({ id: doc.id, ...doc.data() });
//       });
//       return users;
//     } catch (error) {
//       console.error('Error fetching users:', error);
//       throw error;
//     }
//   };

  module.exports = {
    //getAllAccount,
    registerAccount,
    loginAccount,
    logoutAccount
  };
  