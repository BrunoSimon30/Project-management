import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import constants from "../constants.js";
import { verifyToken } from "../utils/generateToken.js";
import { User } from "../models/user.model.js";

export const authMiddleware = asyncHandler(async (req, res, next) => {

  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return next(
      new ApiError(constants.UNAUTHORIZED_REQUEST, constants.UNAUTHORIZED)
    );
  }

  const token = authHeader.split(" ")[1];

  let decoded;

  try {
    decoded = verifyToken(token);
  } catch (error) {
    return next(
      new ApiError(constants.UNAUTHORIZED_REQUEST, constants.INVALID_TOKEN)
    );
  }

  const user = await User.findById(decoded.userId)

  if (!user) {
    return next(
      new ApiError(constants.NOT_FOUND, constants.USER_NOT_FOUND)
    );
  }

  // optional checks
  if (user.isBlocked) {
    return next(
      new ApiError(constants.UNAUTHORIZED_REQUEST, constants.USER_BLOCKED)
    );
  }

  req.user = user;

  next();
});
