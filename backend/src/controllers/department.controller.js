import { asyncHandler } from "../utils/asyncHandler.js";
import { Department } from "../models/department.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import constants from "../constants.js";

const createDepartment = asyncHandler(async (req, res, next) => {
  const { name, description } = req.body;
  const department = await Department.create({ name, description });
  res
    .status(constants.CREATED)
    .json(
      new ApiResponse(
        constants.CREATED,
        { department },
        constants.DEPARTMENT_CREATED_SUCCESSFULLY,
      ),
    );
});

const getDepartments = asyncHandler(async (req, res, next) => {
  const departments = await Department.find();
  res
    .status(constants.OK)
    .json(
      new ApiResponse(
        constants.OK,
        { departments },
        constants.DEPARTMENTS_FETCHED_SUCCESSFULLY,
      ),
    );
});

const updateDepartment = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { name, description } = req.body;
  const department = await Department.findByIdAndUpdate(
    id,
    { name, description },
    { new: true },
  );
  res
    .status(constants.OK)
    .json(
      new ApiResponse(
        constants.OK,
        { department },
        constants.DEPARTMENT_UPDATED_SUCCESSFULLY,
      ),
    );
});

const deleteDepartment = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const department = await Department.findByIdAndDelete(id);
  res
    .status(constants.OK)
    .json(
      new ApiResponse(
        constants.OK,
        { department },
        constants.DEPARTMENT_DELETED_SUCCESSFULLY,
      ),
    );
});

export { createDepartment, getDepartments, deleteDepartment, updateDepartment };
