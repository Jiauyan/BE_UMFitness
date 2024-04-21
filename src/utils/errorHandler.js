const errorHandler = (err, req, res, next) => {
  // logic to handle errors
  res.status(500).json({ message: "An error occurred" });
};

module.exports = errorHandler;
