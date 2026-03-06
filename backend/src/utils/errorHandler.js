const errorHandler = (err, req, res, next) => {
    let statusCode = err.statusCode || 500;
    let message = err.message || "Something went wrong";
  
    // Mongoose Validation Error
    if (err.name === "ValidationError") {
      const errors = Object.values(err.errors).map(e => e.message);
  
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors,
      });
    }
  
    // Mongoose Duplicate Key
    if (err.code === 11000) {
      const field = Object.keys(err.keyValue)[0];
  
      return res.status(400).json({
        success: false,
        message: `${field} already exists`,
      });
    }
  
    console.error(err);
  
    res.status(statusCode).json({
      success: false,
      message,
      ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
    });
  };
  
  export default errorHandler;
  