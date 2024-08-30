const app = require("./app"); // Import the Express app
const { connectfirebaseDB } = require("./configs/firebaseDB");
const http = require("http"); // Import Node.js http module
const { Server } = require("socket.io"); // Import Socket.io
const {socketHandlers} = require("./api/v1/controllers/chatController"); // Import the socket handlers

const port = process.env.PORT || 3000;

// Create an HTTP server using the Express app
const server = http.createServer(app);

// Initialize Socket.io with the server
const io = new Server(server, {
  cors: {
    origin: "*", // Allow all origins (you can restrict this to specific domains)
  },
});

// Connect to Firebase and start the server
const start = async () => {
  try {
    await connectfirebaseDB();

    // Set up Socket.io connection handlers
    socketHandlers(io);

    // Start listening for connections
    server.listen(port, () => console.log(`Server has started at ${port}`));
  } catch (err) {
    console.log("Error starting the server:", err);
  }
};

start();
