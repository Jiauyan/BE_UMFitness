const {db} = require('../../../configs/firebaseDB');
const { collection, getDocs, addDoc, doc, deleteDoc, setDoc, getDoc, query, where, orderBy, updateDoc} = require("firebase/firestore");

// add training class booking
const addTrainingClassBooking = async (uid, name, contactNum, slot, trainingClassID, status) => {
    try {
        const addNewTrainingClassBooking = await addDoc(collection(db, 'TrainingClassBooking'), {
            uid,
            name,
            contactNum,
            slot,
            trainingClassID,
            status
        });

        const trainingClassBookingID = addNewTrainingClassBooking.id;

        return { uid, name, contactNum, slot, trainingClassID, trainingClassBookingID, status};
    } catch (err) {
        console.log('Error creating new training class booking:', err);
        throw err;
    }
}

// get all training class bookings by UID
const getAllTrainingClassBookingsByUID = async (uid) => {
    try {
      const trainingClassBookingRef = collection(db, 'TrainingClassBooking');
      const q = query(trainingClassBookingRef, where('uid', '==', uid));
      const querySnapshot = await getDocs(q);
  
      const trainingClassBooking = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  
      return trainingClassBooking;
    } catch (err) {
      throw new Error('Error fetching training class bookings');
    }
};

// delete training class booking
const deleteTrainingClassBooking = async (id) => {
    try {
        const deleteTrainingClassBooking = await deleteDoc(doc(db, 'TrainingClassBooking', id));
        return id;
    }catch (err) {
        console.error('Error fetching:', err);
        throw err;
    }
}

// get all bookings
const getAllBookingsById = async (id) => {
    try {
        const bookingsQuery = query(
            collection(db, 'TrainingClassBooking'),
            where('trainingClassID', '==', id)
        );

        // Execute the query
        const querySnapshot = await getDocs(bookingsQuery);

        // Map querySnapshot to a list of booking objects
        const allBookings = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        return allBookings;
    } catch (error) {
        console.error('Error fetching bookings:', error);
        throw error;
    }
}

const getBookingById = async (id) => {
    try {
      const bookingSnap = await getDoc(doc(db,'TrainingClassBooking',id));
      const booking = {id: bookingSnap.id, ...bookingSnap.data()};
      return booking;
    } catch (error) {
      console.error('Error fetching:', error);
      throw error;
    }
}

const updateBooking = async (id, updates) => {
    try {
      const bookingRef = doc(db, 'TrainingClassBooking', id); 
  
      // Prepare fields to update
      const fieldsToUpdate = { ...updates };
  
      await updateDoc(bookingRef, fieldsToUpdate);
  
      return { id, updates};
    } catch (error) {
      console.error('Error fetching:', error);
      throw error;
    }
  }

module.exports = {
    addTrainingClassBooking,
    getAllTrainingClassBookingsByUID,
    deleteTrainingClassBooking,
    getAllBookingsById,
    getBookingById,
    updateBooking
};