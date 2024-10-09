const chatService = require('../services/chatService');

const socketHandlers = (io) => {
  io.on('connection', (socket) => {
    console.log(`User connected: ${socket.id}`);

    // Fetch all users with their information
    socket.on('getAllUsers', async () => {
      try {
        const users = await chatService.getAllUsersWithInfo();
        socket.emit('allUsers', users);
      } catch (error) {
        socket.emit('error', 'Failed to fetch users');
      }
    });

    // Fetch messages in a chatroom
    socket.on('getMessages', async (chatroomId) => {
      try {
        const messages = await chatService.getMessages(chatroomId);
        socket.emit('messages', messages);
      } catch (error) {
        socket.emit('error', 'Failed to fetch messages');
      }
    });

    // Send a message to a chatroom
    socket.on('sendMessage', async ({ chatroomId, messageData }) => {
      try {
        const message = await chatService.sendMessage(chatroomId, messageData);
        io.to(chatroomId).emit('newMessage', message);  // Broadcast the new message to the chatroom
      } catch (error) {
        socket.emit('error', 'Failed to send message');
      }
    });

    // Get chatrooms by sender UID
    socket.on('getChatroomsByUser', async (userUID) => {
      try {
        const chatRooms = await chatService.getChatroomsByUser(userUID);
        socket.emit('chatrooms', chatRooms);
      } catch (error) {
        socket.emit('error', 'Failed to fetch chatrooms');
      }
    });

    // Join a chatroom
    socket.on('joinRoom', (chatroomId) => {
      socket.join(chatroomId);
      console.log(`User joined chatroom: ${chatroomId}`);
    });

    // Handle disconnection
    socket.on('disconnect', () => {
      console.log(`User disconnected: ${socket.id}`);
    });
  });
};

const createChatroom = async (req, res) => {
  try {
    console.log(req.body);
    const {senderUID, receiverUID } = req.body;
    const chatroom= await chatService.createChatroom(senderUID, receiverUID); // Call user service function
    res.status(200).json(chatroom); // Send JSON response with all users
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

const getAllUsers = async (req, res) => {
    try {
      const users = await chatService.getAllUsersWithInfo(); // Call user service function
      res.status(200).json(users); // Send JSON response with all users
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
}

const getAllUsersWithoutMessagesFromOrToSender = async (req, res) => {
  try {
    const senderUID = req.params.uid;
    const users = await chatService.getAllUsersWithoutMessagesFromOrToSender(senderUID); // Call user service function
    res.status(200).json(users); // Send JSON response with all users
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

const sendMessage = async (req, res) => {
  try {
    const chatroomId = req.params.chatroomId;
    const messageData = req.body;  
    const message = await chatService.sendMessage(chatroomId, messageData);
    res.status(200).json(message);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getMessages = async (req, res) => {
  try {
    const chatroomID = req.params;
    const chatroomId = chatroomID.chatroomId
    const messages = await chatService.getMessages(chatroomId);
    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getChatroomsByUser = async (req, res) => {
  try {
    const  userUID  = req.params;
    const chatRooms = await chatService.getChatroomsByUser(userUID);
    res.status(200).json(chatRooms);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
    getAllUsers,
    sendMessage,
    getMessages,
    getChatroomsByUser,
    socketHandlers,
    createChatroom,
    getAllUsersWithoutMessagesFromOrToSender
};
