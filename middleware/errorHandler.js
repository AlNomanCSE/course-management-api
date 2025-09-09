const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;
  if (err.name === "ValidationError") {
    const message = Object.values(err.errors)
      .map((val) => val.message)
      .join(", ");
    error = { statusCode: 400, message };
  }
  if (err.code === 11000) {
    const message = "Duplicate field value entered";
    error = { statusCode: 400, message };
  }
  if (err.name === "JsonWebTokenError") {
    error = { statusCode: 401, message: "Invalid token" };
  }
  res
    .status(error.statusCode || 500)
    .json({ success: false, message: error.message || "Server Error" });
};

export default errorHandler;
