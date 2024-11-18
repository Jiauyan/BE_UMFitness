const { db, storage } = require('../../../configs/firebaseDB');
const { collection, getDocs, addDoc, doc, deleteDoc, setDoc, getDoc, query, where, updateDoc,arrayRemove } = require("firebase/firestore");
const { ref, uploadBytes, getDownloadURL } = require("firebase/storage");
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

  const getRecommendedTrainingPrograms = async (fitnessLevel, fitnessGoal, favClass) => {
    try {

      const trainingProgramsRef = collection(db, 'TrainingPrograms');
      const q = query(trainingProgramsRef, 
        where('fitnessLevel', '==', fitnessLevel),
        where('fitnessGoal', '==', fitnessGoal),
        where('typeOfExercise', 'in', favClass)
      );
  
      const querySnapshot = await getDocs(q);
      const recommendedTrainingPrograms = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      return recommendedTrainingPrograms;
    } catch (error) {
      console.error('Error fetching training programs:', error);
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

const addTrainingProgram = async (
  uid,
  contactNum,
  title,
  typeOfTrainingProgram,
  capacity,
  feeType,
  feeAmount,
  venueType,
  venue,
  fitnessLevel, 
  fitnessGoal, 
  typeOfExercise, 
  desc, 
  slots,
  downloadUrl
) => {
  try {
    const timestamp = new Date().toISOString();
    const addTrainingProgram = await addDoc(collection(db, 'TrainingPrograms'), {
      uid,
      contactNum,
      title,
      typeOfTrainingProgram,
      capacity : Number(capacity),
      feeType,
      feeAmount : feeAmount,
      venueType,
      venue,
      fitnessLevel, 
      fitnessGoal, 
      typeOfExercise,
      desc,
      slots: slots.map(slot => ({
        time: slot.time,
        enrolled: slot.enrolled,
        capacity: Number(slot.capacity),
        status: false
      })),
      downloadUrl,
      createdAt: timestamp,
    });
    return { 
      id: addTrainingProgram.id, 
      uid,
      contactNum,
      title, 
      typeOfTrainingProgram,
      capacity,
      feeType,
      feeAmount,
      venueType,
      venue,
      fitnessLevel, 
      fitnessGoal, 
      typeOfExercise, 
      desc, 
      slots,
      downloadUrl,
      createdAt: timestamp
    };
  } catch (error) {
    console.error('Error adding trainingProgram:', error);
    throw error;
  }
};


const updateTrainingProgram = async (id, updates) => {
  try {
    // Extract slots if they exist
    const slots = updates.slots;

    const trainingProgramRef = doc(db, 'TrainingPrograms', id);

    // Build the fields to update, key by key
    const fieldsToUpdate = {};
    for (const key in updates) {
      if (updates[key] !== undefined && key !== 'slots') {
        fieldsToUpdate[key] = updates[key]; // Add all non-slot updates
      }
    }
     // If updates include 'capacity', convert it to a number and add it to fieldsToUpdate
    if (updates.capacity !== undefined) {
      const newCapacity = Number(updates.capacity);
      fieldsToUpdate.capacity = newCapacity;

      // Also update capacity of each parsed slot
      slots.forEach(slot => {
        slot.capacity = newCapacity; // Update capacity for each slot
        slot.status = slot.enrolled >= newCapacity;
      });

      for (const slot of slots) {
        const bookingsRef = collection(db, 'TrainingClassBooking');
        // Assuming you want to update bookings related to a specific slot, use slot.time or another unique slot identifier in your query.
        const q = query(bookingsRef,
            where('trainingClassID', '==', id),
            where('slot.time', '==', slot.time));  // Assuming each slot has a unique 'time' property that can be used for filtering.
    
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach(async (doc) => {
            const bookingData = doc.data();
            const updatedStatus = bookingData.slot.enrolled >= newCapacity; // Update status based on the new capacity
            await updateDoc(doc.ref, {
                'slot.capacity': newCapacity,
                'slot.status': updatedStatus
            });
        });
    }
  }

    // Add the parsed slots to the update fields
    fieldsToUpdate.slots = slots.map(slot => ({
      time: slot.time,
      enrolled: slot.enrolled,
      capacity: Number(slot.capacity),
      status: slot.status ? slot.status : false

    }));

    // Perform the update
    await updateDoc(trainingProgramRef, fieldsToUpdate);

    return { id, updates };
  } catch (error) {
    console.error('Error updating:', error);
    throw error;
  }
};

const deleteTrainingProgram = async (id) => {
  try {
    const deleteTrainingProgram = await deleteDoc(doc(db,'TrainingPrograms',id));
    return deleteTrainingProgram;
  } catch (error) {
    console.error('Error fetching:', error);
    throw error;
  }
}

const getStudentBySlot = async (id, slot) => {
  try {
    // Fetch the training program details first
    const trainingProgramRef = doc(db, 'TrainingPrograms', id); // Assuming the collection is 'TrainingPrograms'
    const trainingProgramSnap = await getDoc(trainingProgramRef);

    let trainingProgramName = 'Unknown Program'; // Default value

    if (trainingProgramSnap.exists()) {
      trainingProgramName = trainingProgramSnap.data().title || 'Unknown Program'; // Fallback if no name
    }

    // Fetch students based on slot and classID
    const bookingRef = collection(db, 'TrainingClassBooking');
    const q = query(
      bookingRef,
      where('trainingClassID', '==', id),
      where('slot.time', '==', slot)
    );

    const querySnapshot = await getDocs(q);
    const students = await Promise.all(
      querySnapshot.docs.map(async (docSnapshot) => {
        const studentData = docSnapshot.data();

        // Fetch user profile based on uid
        const userProfileRef = doc(db, 'Users', studentData.uid);
        const userProfileSnap = await getDoc(userProfileRef);

        let receiverData = {
          name: 'Unknown',
          photoURL: '/default-avatar.png', // Set a default value here
          uid: studentData.uid
        };

        if (userProfileSnap.exists()) {
          receiverData.name = userProfileSnap.data().name || 'Unknown';
          receiverData.photoURL = userProfileSnap.data().photoURL || '/default-avatar.png'; // Fallback if empty
        }

        return {
          bookingID : docSnapshot.id,
          name: studentData.name,
          contactNum: studentData.contactNum,
          slot: studentData.slot,
          uid: studentData.uid,
          photoURL: receiverData.photoURL,
          trainingProgramName ,// Include training program name in the result
          status : studentData.status
        };
      })
    );
    return students;
  } catch (error) {
    console.error('Error fetching:', error);
    throw error;
  }
};

const deleteSlot = async (id, slotToDelete) => {
  try {
    const docRef = doc(db, "TrainingPrograms", id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const slots = docSnap.data().slots;
      const slotDelete = slots.find(slot => slot.time === slotToDelete.time);

      if (slotDelete && slotToDelete.enrolled === 0) {
        await updateDoc(docRef, {
          slots: arrayRemove(slotDelete)
        });
        console.log("Slot deleted successfully");
        return { success: true };
      } else {
        console.log("Cannot delete slot: either no slot found or slot has enrolled students");
        return { success: false, reason: "Slot has enrolled students" };
      }
    } else {
      console.log("No document found with the specified ID");
    }
  } catch (error) {
    console.error('Error deleting slot:', error);
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
    getRecommendedTrainingPrograms,
    getStudentBySlot,
    deleteSlot
  };
  