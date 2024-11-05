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

    // Log the fields to be updated
    console.log('Updating fields:', fieldsToUpdate);

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

const updateSleep = async (uid, startTime, endTime, duration) => {
  try {

    if (!uid || !startTime || !endTime || !duration) {
      throw new Error('Invalid input: one or more required fields are missing');
    }

    const userRef = doc(db, 'Users', uid);

    // Fetch existing sleep data
    const userSnap = await getDoc(userRef);
    const currentSleepData = userSnap.exists() ? userSnap.data() : {};

    // Merge existing sleep data to avoid losing previous records
    const existingSleepByDay = currentSleepData.sleepByDay || {};
    const existingSleepByMonth = currentSleepData.sleepByMonth || {};

    // Use the passed-in date directly
    const date = new Date();
    date.setDate(date.getDate() - 1);
    const day = date.toISOString().split('T')[0];  // e.g. "2024-10-11"
    const year = new Date(date).getFullYear();
    const month = `${year}-${date.getMonth() + 1}`;  // e.g. "2024-10"

    console.log('Yesterday\'s date:', day);

    // Check if the user has already submitted sleep data for today
    if (existingSleepByDay[day]) {
      return { 
        message: 'You can only update your sleep record once per day. Please try again tomorrow.',
        data: currentSleepData
      };
    }

    // Update sleep records
    const updatedSleepByDay = {
      ...existingSleepByDay,
      [day]: {
        startTime: startTime,
        endTime: endTime,
        duration: duration,
        createdAt: new Date(), // Store the creation timestamp
      },
    };

    function parseDuration(durationString) {
      // Split the duration string into hours and minutes
      const [hours, minutes] = durationString
        .match(/(\d+) hours (\d+) minutes/)
        .slice(1)
        .map(Number);
      // Convert the total time to minutes
      return hours * 60 + minutes;
    }
    
    function formatDuration(totalMinutes) {
      // Calculate hours and remaining minutes
      const hours = Math.floor(totalMinutes / 60);
      const minutes = totalMinutes % 60;
      // Format the result as "X hours Y minutes"
      return `${hours} hours ${minutes} minutes`;
    }
    
    // Calculate total sleep hours for the month
    const existingSleepDuration = existingSleepByMonth[month] || "0 hours 0 minutes";
    const totalMinutes = parseDuration(existingSleepDuration) + parseDuration(duration);
    
    // Update the sleep data for the month
    const updatedSleepData = {
      sleepByDay: updatedSleepByDay,
      sleepByMonth: {
        ...existingSleepByMonth,
        [month]: formatDuration(totalMinutes),
      },
      lastUpdated: new Date(),
    };

    console.log('Updating sleep records:', updatedSleepData);
    await updateDoc(userRef, updatedSleepData);

    return { 
      message: 'Sleep records updated successfully',
      data: updatedSleepData
    };
  } catch (error) {
    console.error('Error updating sleep records:', error);
    throw error;
  }
}

const uploadProfileImage = async (profileImage) => {
  try {
    const profileImageRef = ref(storage, `profileImages/${profileImage.filename}`);
    console.log(profileImage.path);
    // Assuming you are using Node.js and have the file system module available
    const buffer = fs.readFileSync(profileImage.path);  // Read the file into a buffer

    const metadata = {
      contentType: profileImage.mimetype, 
    };
    await uploadBytes(profileImageRef, buffer, metadata);
    console.log("Sharing profile image uploaded");
  } catch (error) {
    console.error('Error uploading:', error);
    throw error;
  }
}

const updateProfileInfo = async (uid, updates) => {
  try {
     const userRef = doc(db, 'Users', uid);

     const fieldsToUpdate = { ...updates };

     // Add downloadUrl to fieldsToUpdate if it's provided
    //  if (updates.downloadUrl) {
    //    fieldsToUpdate.downloadUrl = updates.downloadUrl;
    //  }

    // Log the fields to be updated
    console.log('Updating fields:', fieldsToUpdate);

    // Update the document with the filtered fields
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
    uploadProfileImage,
    updateProfileInfo,
    updateCurrentMotivationalQuote
}