import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import constants from "../constants.js";

const roleMiddleware = (roles) => {
  return asyncHandler(async (req, res, next) => {
    const user = req.user;
    if (!roles.includes(user.role)) {
      return next(
        new ApiError(
          constants.FORBIDDEN_REQUEST,
          "You are not authorized to access this resource",
        ),
      );
    }
    next();
  });
};

export { roleMiddleware };
