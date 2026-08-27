import mongoose from "mongoose";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { Task } from "../models/task.model.js";
import { Project } from "../models/project.model.js";
import { User } from "../models/user.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import constants from "../constants.js";
import { createTaskValidator } from "../utils/Validator/taskValidator.js";

const taskPopulate = [
  { path: "projectId", select: "name status" },
  { path: "assigneeId", select: "fullName email profileImage" },
];

const createTask = asyncHandler(async (req, res, next) => {
  const user = req.user;
  if (!user) {
    return next(new ApiError(constants.UNAUTHORIZED_REQUEST, constants.UNAUTHORIZED));
  }

  const result = createTaskValidator.safeParse(req.body);
  if (!result.success) {
    return next(
      new ApiError(constants.BAD_REQUEST, result.error.issues[0].message),
    );
  }

  const { title, description, status, priority, projectId, assigneeId, dueDate } =
    result.data;

  if (!mongoose.Types.ObjectId.isValid(projectId)) {
    return next(new ApiError(constants.BAD_REQUEST, "Invalid project id"));
  }
  if (!mongoose.Types.ObjectId.isValid(assigneeId)) {
    return next(new ApiError(constants.BAD_REQUEST, "Invalid assignee id"));
  }

  const project = await Project.findById(projectId);
  if (!project) {
    return next(new ApiError(constants.NOT_FOUND, constants.PROJECT_NOT_FOUND));
  }

  const assignee = await User.findById(assigneeId);
  if (!assignee) {
    return next(new ApiError(constants.NOT_FOUND, constants.USER_NOT_FOUND));
  }

  const task = await Task.create({
    title,
    description,
    status,
    priority,
    projectId,
    assigneeId,
    dueDate,
  });

  const populated = await Task.findById(task._id).populate(taskPopulate);

  res
    .status(constants.CREATED)
    .json(
      new ApiResponse(
        constants.CREATED,
        populated,
        constants.TASK_CREATED_SUCCESSFULLY,
      ),
    );
});

const getTasks = asyncHandler(async (req, res, next) => {
  const tasks = await Task.find().populate(taskPopulate).sort({ createdAt: -1 });

  res
    .status(constants.OK)
    .json(
      new ApiResponse(constants.OK, tasks, constants.TASK_FETCHED_SUCCESSFULLY),
    );
});

const getTaskById = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return next(new ApiError(constants.BAD_REQUEST, "Invalid task id"));
  }

  const task = await Task.findById(id).populate(taskPopulate);
  if (!task) {
    return next(new ApiError(constants.NOT_FOUND, constants.TASK_NOT_FOUND));
  }

  res
    .status(constants.OK)
    .json(
      new ApiResponse(constants.OK, task, constants.TASK_FETCHED_SUCCESSFULLY),
    );
});

const updateTaskValidator = createTaskValidator.partial();

const updateTask = asyncHandler(async (req, res, next) => {
  const user = req.user;
  if (!user) {
    return next(new ApiError(constants.UNAUTHORIZED_REQUEST, constants.UNAUTHORIZED));
  }

  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return next(new ApiError(constants.BAD_REQUEST, "Invalid task id"));
  }

  const result = updateTaskValidator.safeParse(req.body);
  if (!result.success) {
    return next(
      new ApiError(constants.BAD_REQUEST, result.error.issues[0].message),
    );
  }

  const payload = result.data;
  if (Object.keys(payload).length === 0) {
    return next(new ApiError(constants.BAD_REQUEST, "No fields to update"));
  }

  const task = await Task.findById(id);
  if (!task) {
    return next(new ApiError(constants.NOT_FOUND, constants.TASK_NOT_FOUND));
  }

  if (payload.projectId) {
    if (!mongoose.Types.ObjectId.isValid(payload.projectId)) {
      return next(new ApiError(constants.BAD_REQUEST, "Invalid project id"));
    }
    const project = await Project.findById(payload.projectId);
    if (!project) {
      return next(new ApiError(constants.NOT_FOUND, constants.PROJECT_NOT_FOUND));
    }
  }

  if (payload.assigneeId) {
    if (!mongoose.Types.ObjectId.isValid(payload.assigneeId)) {
      return next(new ApiError(constants.BAD_REQUEST, "Invalid assignee id"));
    }
    const assignee = await User.findById(payload.assigneeId);
    if (!assignee) {
      return next(new ApiError(constants.NOT_FOUND, constants.USER_NOT_FOUND));
    }
  }

  Object.assign(task, payload);
  await task.save();

  const updated = await Task.findById(task._id).populate(taskPopulate);

  res
    .status(constants.OK)
    .json(
      new ApiResponse(
        constants.OK,
        updated,
        constants.TASK_UPDATED_SUCCESSFULLY,
      ),
    );
});

const deleteTask = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return next(new ApiError(constants.BAD_REQUEST, "Invalid task id"));
  }

  const task = await Task.findByIdAndDelete(id);
  if (!task) {
    return next(new ApiError(constants.NOT_FOUND, constants.TASK_NOT_FOUND));
  }

  res
    .status(constants.OK)
    .json(
      new ApiResponse(
        constants.OK,
        task,
        constants.TASK_DELETED_SUCCESSFULLY,
      ),
    );
});

export { createTask, getTasks, getTaskById, updateTask, deleteTask };
 