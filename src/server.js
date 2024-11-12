const app = require("./app"); // Import the Express app
const { connectfirebaseDB } = require("./configs/firebaseDB");
const http = require("http"); // Import Node.js http module

const port = process.env.PORT || 3000;

// Create an HTTP server using the Express app
const server = http.createServer(app);

// Connect to Firebase and start the server
const start = async () => {
  try {
    await connectfirebaseDB();

    // Start listening for connections
    server.listen(port, () => console.log(`Server has started at ${port}`));
  } catch (err) {
    console.log("Error starting the server:", err);
  }
};

start();
