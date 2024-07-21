const { db, storage } = require('../../../configs/firebaseDB');
const { collection, getDocs, addDoc, doc, deleteDoc, setDoc, getDoc, query, where, updateDoc } = require("firebase/firestore");
const { ref, uploadBytes } = require("firebase/storage");
const { v4 } = require("uuid");
const fs = require('fs');


const getAllTrainingPrograms = async () => {
    try {
      const querySnapshot = await getDocs(collection(db,'TrainingPrograms'));
      const trainingPrograms = querySnapshot.docs.map(doc => ({id: doc.id, ...doc.data()}))
      return trainingPrograms;
    } catch (error) {
      console.error('Error fetching:', error);
      throw error;
    }
  }

  const getAllUserTrainingPrograms = async (uid) => {
    try {
      const trainingProgramsRef = collection(db, 'TrainingPrograms');
      const q = query(trainingProgramsRef, where('uid', '==', uid));
      const querySnapshot = await getDocs(q);

      const trainingPrograms = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      return trainingPrograms;
    } catch (error) {
      console.error('Error fetching trainingPrograms:', error);
      throw error;
    }
  };

const getTrainingProgramById = async (id) => {
    try {
      const trainingProgramSnap = await getDoc(doc(db,'TrainingPrograms',id));
      const trainingProgram = {id: trainingProgramSnap.id, ...trainingProgramSnap.data()};
      return trainingProgram;
    } catch (error) {
      console.error('Error fetching:', error);
      throw error;
    }
}


const addTrainingProgram = async (uid,title, downloadUrl,fitnessLevel, fitnessGoal, typeOfExercise, desc, slots
) => {
  try {
    const addTrainingProgram = await addDoc(collection(db, 'TrainingPrograms'), {
      uid,
      title,
      downloadUrl,
      fitnessLevel, 
      fitnessGoal, 
      typeOfExercise,
      desc,
      slots
    });
    return { id: addTrainingProgram.id, uid,title, downloadUrl,fitnessLevel, fitnessGoal, typeOfExercise, desc, slots};
  } catch (error) {
    console.error('Error adding trainingProgram:', error);
    throw error;
  }
};


const updateTrainingProgram = async (id, updates) => {
  try {
    const trainingProgramRef = doc(db, 'TrainingPrograms', id); 

    // Prepare fields to update
    const fieldsToUpdate = { ...updates };

    // Add downloadUrl to fieldsToUpdate if it's provided
    // if (updates.downloadUrl) {
    //   fieldsToUpdate.downloadUrl = updates.downloadUrl;
    // }

    // Update the document with the fields
    await updateDoc(trainingProgramRef, fieldsToUpdate);

    return { id, updates};
  } catch (error) {
    console.error('Error fetching:', error);
    throw error;
  }
}


const deleteTrainingProgram = async (id) => {
  try {
    const deleteTrainingProgram = await deleteDoc(doc(db,'TrainingPrograms',id));
    console.log("TrainingProgram deleted successfully");
    return deleteTrainingProgram;
  } catch (error) {
    console.error('Error fetching:', error);
    throw error;
  }
}

const uploadTrainingProgramImage = async (trainingProgramImage) => {
  try {
    const trainingProgramImageRef = ref(storage, `trainingProgramImages/${trainingProgramImage.filename}`);
    console.log(trainingProgramImage.path);
    // Assuming you are using Node.js and have the file system module available
    const buffer = fs.readFileSync(trainingProgramImage.path);  // Read the file into a buffer

    const metadata = {
      contentType: trainingProgramImage.mimetype, 
    };
    await uploadBytes(trainingProgramImageRef, buffer, metadata);
    console.log("Sharing trainingProgram image uploaded");
  } catch (error) {
    console.error('Error uploading:', error);
    throw error;
  }
}

module.exports = {
    getAllTrainingPrograms,
    getAllUserTrainingPrograms,
    getTrainingProgramById,
    addTrainingProgram,
    updateTrainingProgram,
    deleteTrainingProgram,
    uploadTrainingProgramImage
  };
  