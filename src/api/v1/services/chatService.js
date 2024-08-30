const { db, database } = require('../../../configs/firebaseDB');
const { collection, getDocs, serverTimestamp, getDoc,doc, query, where } = require("firebase/firestore");
const { ref, push, onValue, get, child , set} = require('firebase/database');

//Fetch all users with their information
const getAllUsersWithInfo = async () => {
  try {
    const usersRef = collection(db, 'Users');
    const querySnapshot = await getDocs(usersRef);
  
    const users = [];
    querySnapshot.forEach(doc => {
      const userData = doc.data();
      users.push({
        username: userData.username,
        photoURL: userData.photoURL,
        uid: doc.id
      });
    });
  
    return users;
  } catch (error) {
    throw new Error('Error getting all users with info: ' + error.message);
  }
};

const createChatroomId = (uid1, uid2) => {
  return [uid1, uid2].sort().join('_'); // Ensure consistent order
};

// Function to create a new chatroom or return an existing one
const createChatroom = async (senderUID, receiverUID) => {
  try {
    const chatroomId = createChatroomId(senderUID, receiverUID);
    const chatroomRef = ref(database, `CHATROOM/${chatroomId}`);
    
    const snapshot = await get(chatroomRef);
    if (snapshot.exists()) {
      // If the chatroom already exists, return it
      return { chatroomId, ...snapshot.val() };
    }

    // Initialize the chatroom structure
    const chatroomData = {
      messages: {}, // Empty messages node to start with
    };

    // Save the new chatroom data to the database
    await set(chatroomRef, chatroomData);

    return {
      chatroomId: chatroomId,
      ...chatroomData,
    };
  } catch (error) {
    console.error('Failed to create chatroom:', error);
    throw new Error('Error creating new chatroom: ' + error.message);
  }
};

const getAllUsers = async (senderUID) => {
  try {
    //console.log(senderUID);
    const usersRef = collection(db, 'Users');
    const q = query(usersRef, where('role', '==', 'Student'));
    const querySnapshot = await getDocs(q);
    
    let users = [];
    querySnapshot.forEach(doc => {
      const userData =doc.data();
      if (doc.id !== senderUID) {  
        users.push({
          username: userData.username,
          photoURL: userData.photoURL,
          uid: doc.id,
          role: userData.role
        });
      }
    });
  
    console.log(users);
    return users;
  } catch (error) {
    throw new Error('Error getting all users with info: ' + error.message);
  }
};


const getUsersWithMessagesFromSender = async (senderUID) => {
  const chatroomsRef = ref(database, 'CHATROOM');
  const usersWithMessages = new Set();

  try {
    const snapshot = await get(chatroomsRef);
    if (snapshot.exists()) {
      const chatrooms = snapshot.val();

      for (let chatroomId in chatrooms) {
        const messagesSnapshot = await get(child(ref(database), `CHATROOM/${chatroomId}/messages`));
        if (messagesSnapshot.exists()) {
          const messages = messagesSnapshot.val();
          for (let messageId in messages) {
            if (messages[messageId].senderUID === senderUID) {
              usersWithMessages.add(messages[messageId].receiverUID);
            }
          }
        }
      }
    }
    return usersWithMessages;
  } catch (error) {
    console.error('Failed to fetch users with messages:', error);
    throw error;
  }
};

const getAllUsersWithoutMessagesFromSender = async (senderUID) => {
  try {
    const allStudents = await getAllUsers(senderUID);  
    console.log(allStudents);
    const usersWithMessages = await getUsersWithMessagesFromSender(senderUID);

    const studentsWithoutMessages = allStudents.filter(student => !usersWithMessages.has(student.uid));
    return studentsWithoutMessages;
  } catch (error) {
    console.error('Error getting students without messages:', error);
    throw error;
  }
};

const getMessages = (chatroomId) => {
  return new Promise((resolve, reject) => {
    try {
      const messagesRef = ref(database, `CHATROOM/${chatroomId}/messages`);
      
      onValue(messagesRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          const loadedMessages = Object.keys(data).map((key) => ({
            id: key,
            ...data[key],
          }));
          resolve(loadedMessages);
        } else {
          console.log("No messages found for this chatroom.");
          resolve([]);  // Resolve with an empty array if no messages
        }
      }, (error) => {
        console.error('Error fetching messages:', error);
        reject('Failed to fetch messages');
      });
    } catch (error) {
      console.error('Error setting up listener:', error);
      reject('Failed to set up listener');
    }
  });
};


const sendMessage = async (chatroomId, messageData) => {
  const chatroomRef = ref(database, `CHATROOM/${chatroomId}/messages`);
  const timestamp = new Date().toISOString();
  // Push the new message to the chatroom's messages
  const newMessageRef = await push(chatroomRef, {
    ...messageData,
    timestamp: timestamp, 
  });

  // Fetch the newly created message, including the generated ID and timestamp
  const newMessageSnapshot = await get(newMessageRef);
  const newMessage = {
    id: newMessageSnapshot.key, // Get the unique ID of the message
    ...newMessageSnapshot.val()  // Get the message data
  };

  return newMessage;
};

const getChatroomsBySender = async (senderUID) => {
  const chatroomsRef = ref(database, 'CHATROOM');
  try {
    const snapshot = await get(chatroomsRef);
    if (snapshot.exists()) {
      const chatrooms = snapshot.val();
      const senderChatrooms = [];

      for (let chatroomId in chatrooms) {
        const messagesRef = child(ref(database), `CHATROOM/${chatroomId}/messages`);
        const messagesSnapshot = await get(messagesRef);

        if (messagesSnapshot.exists()) {
          const messages = messagesSnapshot.val();
          
          for (let messageId in messages) {
            if (messages[messageId].senderUID === senderUID.uid) {
              const receiverUID = messages[messageId].receiverUID;

              // Fetch receiver's details
              const receiverRef = doc(db, "Users", receiverUID);
              const receiverSnapshot = await getDoc(receiverRef);

              let receiverData = {
                username: 'Unknown',
                photoURL: '',
                uid:''
              };

              if (receiverSnapshot.exists()) {
                receiverData = {
                  username: receiverSnapshot.data().username,
                  photoURL: receiverSnapshot.data().photoURL,
                  uid: receiverUID
                };
              }

              senderChatrooms.push({
                chatroomId: chatroomId,
                chatroomDetails: chatrooms[chatroomId],  // Assuming chatrooms[chatroomId] holds the chatroom details
                receiverDetails: receiverData  // Add receiver's details
              });

              break;  // Stop checking further once we find the sender in this chatroom
            }
          }
        }
      }
      
      return senderChatrooms;
    } else {
      console.log("No chatrooms found.");
      return [];
    }
  } catch (error) {
    console.error('Failed to fetch chatrooms:', error);
    throw error;
  }
};

module.exports = {
  getAllUsersWithInfo,
  getAllUsers,
  getMessages,
  sendMessage,
  getChatroomsBySender,
  getAllUsersWithoutMessagesFromSender,
  createChatroom,
};
