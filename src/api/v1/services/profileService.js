const { db, storage } = require('../../../configs/firebaseDB');
const { collection, getDocs, addDoc, doc, deleteDoc, setDoc, getDoc, query, where, updateDoc, arrayUnion  } = require("firebase/firestore");
const { ref, uploadBytes, getDownloadURL } = require("firebase/storage");
const { v4 } = require("uuid");
const fs = require('fs');

const updateProfile = async (uid, updates) => {
  try {
     const userRef = doc(db, 'Users', uid);

    // Create an object with only the defined fields
    const fieldsToUpdate = {};
    for (const key in updates) {
      if (updates[key] !== undefined) {
        fieldsToUpdate[key] = updates[key];
      }
    }

    // Update the document with the filtered fields
    await updateDoc(userRef, fieldsToUpdate);
    return { message: 'Profile updated successfully' };
  } catch (error) {
    console.error('Error updating profile:', error);
    throw error;
  }
}

const updateWater = async (uid, todayWater) => {
  try {

    const date = new Date();
    const day = date.toISOString().split('T')[0];  // e.g. "2024-10-11"
    const year = date.getFullYear();
    const month = `${year}-${date.getMonth() + 1}`;  // e.g. "2024-10"

    const userRef = doc(db, 'Users', uid);

    // Fetch existing hydration data
    const userSnap = await getDoc(userRef);
    const currentWaterData = userSnap.exists() ? userSnap.data() : {};

    // Get the last updated date
    const lastUpdatedDate = currentWaterData.lastUpdated ? new Date(currentWaterData.lastUpdated.toDate()) : null;
    const isNewDay = !lastUpdatedDate || lastUpdatedDate.toISOString().split('T')[0] !== day;

    // Retrieve existing water data by day and month
    const existingHydrationByDay = currentWaterData.waterByDay || {};
    const existingHydrationByMonth = currentWaterData.waterByMonth || {};

    // Reset today's water if it's a new day
    const previousDayWater = isNewDay ? 0 : (existingHydrationByDay[day] || 0);
    const newTodayWater = isNewDay ? 0 : todayWater;

    // Calculate the difference in hydration for today
    const hydrationDifference = newTodayWater - previousDayWater;

     const updatedHydrationByDay = {
      ...existingHydrationByDay,
      [day]: newTodayWater,
    };
    const updatedHydrationByMonth = {
      ...existingHydrationByMonth,
      [month]: (existingHydrationByMonth[month] || 0) + hydrationDifference,
    };
 
    const updatedWaterData = {
      waterByDay: updatedHydrationByDay,
      waterByMonth: updatedHydrationByMonth,
      lastUpdated: date,
      todayWater: newTodayWater,
      monthlyWater: updatedHydrationByMonth[month],
    };

    console.log('Updating current hydration:', updatedWaterData);
    await updateDoc(userRef, updatedWaterData);

    return { message: 'Current Hydration updated successfully' };
  } catch (error) {
    console.error('Error updating water:', error);
    throw error;
  }
}

const updateSleep = async (uid, startTime, endTime, duration, date) => {
  try {
    if (!uid || !date || !startTime || !endTime || !duration) {
      throw new Error('Invalid input: one or more required fields are missing');
    }

    const userRef = doc(db, 'Users', uid);

    // Fetch existing sleep data
    const userSnap = await getDoc(userRef);
    const currentSleepData = userSnap.exists() ? userSnap.data() : {};

    const existingSleepByDay = currentSleepData.sleepByDay || {};
    const existingSleepByMonth = currentSleepData.sleepByMonth || {};

    const day = new Date(date).toISOString().split('T')[0];
    const year = new Date(date).getFullYear();
    const month = `${year}-${new Date(date).getMonth() + 1}`;

    // Helper function to parse duration from "X hours Y minutes" format
    function parseDuration(durationString) {
      const [hours, minutes] = durationString
        .match(/(\d+) hours (\d+) minutes/)
        .slice(1)
        .map(Number);
      return hours * 60 + minutes;
    }

    // Helper function to format duration to "X hours Y minutes" format
    function formatDuration(totalMinutes) {
      const hours = Math.floor(totalMinutes / 60);
      const minutes = totalMinutes % 60;
      return `${hours} hours ${minutes} minutes`;
    }

    // Calculate the duration of the new record
    const newDurationMinutes = parseDuration(duration);

    // Check if there's an existing duration for this day (edit mode)
    const previousDurationString = existingSleepByDay[day]?.duration || "0 hours 0 minutes";
    const previousDurationMinutes = parseDuration(previousDurationString);

    // Update sleep record for the day
    const updatedSleepByDay = {
      ...existingSleepByDay,
      [day]: { 
        startTime: startTime,
        endTime: endTime,
        duration: duration,
        createdAt: new Date(),
      },
    };

    // Calculate adjusted total minutes for the month
    const existingMonthlyDuration = existingSleepByMonth[month] || "0 hours 0 minutes";
    const currentMonthTotalMinutes = parseDuration(existingMonthlyDuration);

    // Subtract previous day's duration, add new duration
    const adjustedMonthlyTotalMinutes = currentMonthTotalMinutes - previousDurationMinutes + newDurationMinutes;

    const updatedSleepData = {
      sleepByDay: updatedSleepByDay,
      sleepByMonth: {
        ...existingSleepByMonth,
        [month]: formatDuration(adjustedMonthlyTotalMinutes),
      },
      lastUpdated: new Date(),
    };

    console.log('Updating sleep records:', updatedSleepData);
    await updateDoc(userRef, updatedSleepData);

    return {
      message: 'Sleep records updated successfully',
      data: updatedSleepData,
    };
  } catch (error) {
    console.error('Error updating sleep records:', error);
    throw error;
  }
};

const updateProfileInfo = async (uid, updates) => {
  try {
     const userRef = doc(db, 'Users', uid);

     // Prepare fields to update
    const fieldsToUpdate = {};
    for (const key in updates) {
      if (updates[key] !== undefined) {
        fieldsToUpdate[key] = updates[key];
      }
    }

    await updateDoc(userRef, fieldsToUpdate);
    return { message: 'Profile updated successfully' };
  } catch (error) {
    console.error('Error updating profile:', error);
    throw error;
  }
}

const updateCurrentMotivationalQuote = async (uid, currentMotivationalQuote) => {
  try {
    const userRef = doc(db, 'Users', uid);

    // Pass the new value as an object to updateDoc
    const updateCurrentMotivationalQuote= await updateDoc(userRef, { currentMotivationalQuote: currentMotivationalQuote });

    return { currentMotivationalQuote };
  } catch (error) {
    console.error('Error updating profile:', error);
    throw error;
  }
};


module.exports = {
    updateProfile,
    updateWater,
    updateSleep,
    updateProfileInfo,
    updateCurrentMotivationalQuote
}