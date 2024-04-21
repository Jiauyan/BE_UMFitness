const app = require("./app"); // Import the express app
const { connectfirebaseDB } = require("./configs/firebaseDB");

const port = process.env.PORT || 3000;
const start = async () => {
  try {
    await connectfirebaseDB ();
    app.listen(port, () => console.log(`Server has started at ${port}`));
  } catch (err) {
    console.log(err);
  }
};

start();
