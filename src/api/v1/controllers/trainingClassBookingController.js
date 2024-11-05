const trainingClassBookingService = require("../services/trainingClassBookingService");

// Add training class booking
const addTrainingClassBooking = async (req, res) => {
    try {
        const { uid, name, contactNum, slot, trainingClassID, status,feeAmount, paymentStatus,transactionId } = req.body;
        const addNewTrainingClassBooking = await trainingClassBookingService.addTrainingClassBooking(
            uid,
            name,
            contactNum,
            slot,
            trainingClassID,
            status,
            feeAmount,
            paymentStatus,
            transactionId
        );
  
        return res.status(200).json(addNewTrainingClassBooking);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// get all training class bookings by UID
const getAllTrainingClassBookingsByUID = async (req, res) => {
    try {
      const { uid } = req.params;
      const getAllBooking = await trainingClassBookingService.getAllTrainingClassBookingsByUID(uid);
      return res.status(200).json(getAllBooking);
    } catch (err) {
      console.error('Error fetching all training class bookings:', err);
      return res.status(400).json({ message: err.message });
    }
};

// delete training class booking
const deleteTrainingClassBooking = async (req, res) => {
    try {
      const { id } = req.params;
      const deleteTrainingClassBooking = await trainingClassBookingService.deleteTrainingClassBooking(id);
      return res.status(200).json(deleteTrainingClassBooking);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
};

// get all bookings
const getAllBookingsById= async (req, res) => {
  try {
    const { id } = req.params;
    const findAllBookings = await trainingClassBookingService.getAllBookingsById(id);
    return res.status(200).json(findAllBookings);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const getBookingById= async (req, res) => {
  try {
    const { id } = req.params;
    const findOneBooking = await trainingClassBookingService.getBookingById(id);
    return res.status(200).json(findOneBooking);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const updateBooking = async (req, res) => {
  try {
    console.log(req.body);
    const updates = req.body;
    const { id } = req.params;
    const updateBooking = await trainingClassBookingService.updateBooking(id, updates);
    return res.status(200).json(updateBooking);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};


module.exports = {
  addTrainingClassBooking,
  getAllTrainingClassBookingsByUID,
  deleteTrainingClassBooking,
  getAllBookingsById,
  getBookingById,
  updateBooking
};
