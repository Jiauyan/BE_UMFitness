const {db} = require('../../../configs/firebaseDB');
const { collection, getDocs, addDoc, doc, deleteDoc, setDoc, getDoc, query, where, orderBy, updateDoc, runTransaction} = require("firebase/firestore");

const addTrainingClassBooking = async (uid, name, contactNum, slot, trainingClassID, status, feeAmount, paymentStatus, transactionId) => {
    try {
        // First, create a new booking in the TrainingClassBooking collection
        const newSlot = {
            ...slot,
            enrolled: slot.enrolled + 1  // Prepare the updated slot with incremented enrolled
        };

       // Check if the updated enrolled count meets the capacity
        if (newSlot.enrolled >= newSlot.capacity) {
            newSlot.status = true; // Set slot status to true if capacity is met
        } else {
            newSlot.status = false; // Keep slot status as false if capacity is not met
        }

        const addNewTrainingClassBooking = await addDoc(collection(db, 'TrainingClassBooking'), {
            uid,
            name,
            contactNum,
            slot: newSlot,
            trainingClassID,
            status,
            feeAmount,
            paymentStatus,
            transactionId
        });

        // Then, update the specific slot in all other bookings in the TrainingClassBooking collection
        const bookingsRef = collection(db, 'TrainingClassBooking');
        const q = query(bookingsRef, 
            where('trainingClassID', '==', trainingClassID), 
            where('slot.time', '==', slot.time));

        const querySnapshot = await getDocs(q);
        querySnapshot.forEach(async (doc) => {
            await updateDoc(doc.ref, {
                slot: newSlot
            });
        });

        // Then, update the specific slot in the TrainingPrograms document
        const trainingProgramRef = doc(db, 'TrainingPrograms', trainingClassID);
        await runTransaction(db, async (transaction) => {
            const trainingProgramDoc = await transaction.get(trainingProgramRef);
            if (!trainingProgramDoc.exists()) {
                throw "Document does not exist!";
            }

            const slots = trainingProgramDoc.data().slots;
            const slotIndex = slots.findIndex(s => s.time === slot.time); // Find index of the slot to update

            if (slotIndex === -1) {
                throw "Slot not found!";
            }

            // Update only the enrolled count of the found slot
            const updatedSlot = { ...slots[slotIndex], enrolled: slots[slotIndex].enrolled + 1 };
            // Check if the updated enrolled count meets the capacity
            if (updatedSlot.enrolled >= updatedSlot.capacity) {
                updatedSlot.status = true; // Change status to true if capacity is met
            }else{
                updatedSlot.status = false;
            }
            const updatedSlots = [
                ...slots.slice(0, slotIndex),
                updatedSlot,
                ...slots.slice(slotIndex + 1)
            ];

            transaction.update(trainingProgramRef, { slots: updatedSlots });
        });

        const trainingClassBookingID = addNewTrainingClassBooking.id;

        return { 
            uid, 
            name, 
            contactNum, 
            slot: newSlot, 
            trainingClassID, 
            trainingClassBookingID, 
            status,
            feeAmount,
            paymentStatus,
            transactionId
        };
    } catch (err) {
        console.error('Error creating new training class booking:', err);
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
        
        // First, retrieve the booking to be deleted to access its slot and trainingClassID
        const bookingRef = doc(db, 'TrainingClassBooking', id);
        const bookingDoc = await getDoc(bookingRef);
        if (!bookingDoc.exists()) {
            throw "Booking does not exist!";
        }
        const { slot, trainingClassID } = bookingDoc.data();

        // Delete the booking
        await deleteDoc(bookingRef);

        // Query to find all other bookings in the same training class with the same slot time
        const bookingsRef = collection(db, 'TrainingClassBooking');
        const q = query(bookingsRef, 
            where('trainingClassID', '==', trainingClassID), 
            where('slot.time', '==', slot.time));

        const querySnapshot = await getDocs(q);
        querySnapshot.forEach(async (doc) => {
            const updatedEnrolled = Math.max(doc.data().slot.enrolled - 1, 0);
            const updatedStatus = updatedEnrolled >= doc.data().slot.capacity;
            await updateDoc(doc.ref, {
                'slot.enrolled': updatedEnrolled,
                'slot.status' : updatedStatus
            });
        });

        // Update the slot in the TrainingPrograms document
        const trainingProgramRef = doc(db, 'TrainingPrograms', trainingClassID);
        await runTransaction(db, async (transaction) => {
            const trainingProgramDoc = await transaction.get(trainingProgramRef);
            if (!trainingProgramDoc.exists()) {
                throw "Training program document does not exist!";
            }

            const slots = trainingProgramDoc.data().slots;
            const slotIndex = slots.findIndex(s => s.time === slot.time); // Find index of the slot to update

            if (slotIndex === -1) {
                throw "Slot not found!";
            }

            // Update only the enrolled count of the found slot
            const updatedSlot = { ...slots[slotIndex], enrolled: slots[slotIndex].enrolled - 1 };
            if (updatedSlot.enrolled >= updatedSlot.capacity) {
                updatedSlot.status = true; // Change status to true if capacity is met
            }else{
                updatedSlot.status = false;
            }
            const updatedSlots = [
                ...slots.slice(0, slotIndex),
                updatedSlot,
                ...slots.slice(slotIndex + 1)
            ];

            transaction.update(trainingProgramRef, { slots: updatedSlots });
        });

        return id;
    } catch (err) {
        console.error('Error in deleting and updating booking:', err);
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
      const bookingSnap = await getDoc(doc(db, 'TrainingClassBooking', id));
      const booking = { id: bookingSnap.id, ...bookingSnap.data() };
  
      const trainingClassID = booking.trainingClassID;
  
      const trainingProgramSnap = await getDoc(doc(db, 'TrainingPrograms', trainingClassID));
      const trainingProgram = { id: trainingProgramSnap.id, ...trainingProgramSnap.data() };
  
      return { booking, trainingProgram };
    } catch (error) {
      console.error('Error fetching:', error);
      throw error;
    }
  };

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