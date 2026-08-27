import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import constants from "../constants.js";
import { User } from "../models/user.model.js";
import { FileUpload } from "../models/fileUpload.model.js";
import { Department } from "../models/department.model.js";

// Get All Users Controller
const getAllUsers = asyncHandler(async (req, res, next) => {
  const users = await User.find({ is_deleted: false });

  const usersWithFiles = await Promise.all(
    users.map(async (user) => {
      const data = await user.transform();
      const department = await Department.findById(user.department);
      const profileImage = await FileUpload.findById(user.profileImage);
      const coverImage = await FileUpload.findById(user.coverImage);
      data.profileImage = profileImage?.file || null;
      data.coverImage = coverImage?.file || null;
      data.department = department
        ? { _id: department._id, name: department.name }
        : null;
      return data;
    }),
  );

  res
    .status(constants.OK)
    .json(
      new ApiResponse(
        constants.OK,
        { users: usersWithFiles },
        constants.USERS_FETCHED_SUCCESSFULLY,
      ),
    );
});

const userUpdate = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { isVerified, role, department } = req.body;
  const user = await User.findByIdAndUpdate(
    id,
    { isVerified, role, department },
    { new: true },
  );
  const data = await user.transform();

  res
    .status(constants.OK)
    .json(
      new ApiResponse(
        constants.OK,
        { user: data },
        constants.USER_UPDATED_SUCCESSFULLY,
      ),
    );
});

const userDelete = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const user = await User.findByIdAndDelete(id);
  res
    .status(constants.OK)
    .json(
      new ApiResponse(
        constants.OK,
        { user },
        constants.USER_DELETED_SUCCESSFULLY,
      ),
    );
});

export { getAllUsers, userDelete, userUpdate };
