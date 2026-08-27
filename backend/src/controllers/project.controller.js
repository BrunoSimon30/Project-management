import { asyncHandler } from "../utils/asyncHandler.js";
import {
  createProjectValidator,
  updateProjectValidator,
} from "../utils/Validator/projectValidator.js";
import { Project } from "../models/project.model.js";
import { FileUpload } from "../models/fileUpload.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import constants from "../constants.js";
import { ApiError } from "../utils/ApiError.js";

const createProject = asyncHandler(async (req, res, next) => {
  const user = req.user;

  if (!user) {
    return next(new ApiError(constants.UNAUTHORIZED_REQUEST, "Unauthorized"));
  }
  const result = createProjectValidator.safeParse(req.body);
  if (!result.success) {
    return next(
      new ApiError(constants.BAD_REQUEST, result.error.issues[0].message),
    );
  }
  const {
    name,
    description,
    status,
    startDate,
    endDate,
    department,
    projectManager,
    githubLink,
    liveLink,
  } = result.data;
  const project = await Project.create({
    name,
    description,
    status,
    startDate,
    endDate,
    department,
    projectManager,
    githubLink,
    liveLink,
    image: null,
  });
  if (req.file) {
    const file = await FileUpload.create({
      file: `/Uploads/${req.file.filename}`,
      fileType: req.file.mimetype,
      User: user._id,
    });
    project.image = file._id;
    await project.save();
  }

  res
    .status(constants.CREATED)
    .json(
      new ApiResponse(
        constants.CREATED,
        project,
        constants.PROJECT_CREATED_SUCCESSFULLY,
      ),
    );
});

const getProjects = asyncHandler(async (req, res, next) => {
  const projects = await Project.find()

    .populate({
      path: "department",
      select: "name",
    })
    .populate({
      path: "projectManager",
      select: "fullName role profileImage",
      populate: {
        path: "profileImage",
        select: "file",
      },
    })
    .populate({
      path: "image",
      select: "file",
    });

  res
    .status(constants.OK)
    .json(
      new ApiResponse(
        constants.OK,
        projects,
        constants.PROJECTS_FETCHED_SUCCESSFULLY,
      ),
    );
});

const getProjectById = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const project = await Project.findById(id)
    .populate({
      path: "department",
      select: "name",
    })
    .populate({
      path: "projectManager",
      select: "fullName role",
    })
    .populate({
      path: "image",
      select: "file",
    });

  if (!project) {
    return next(new ApiError(constants.NOT_FOUND, constants.PROJECT_NOT_FOUND));
  }

  res
    .status(constants.OK)
    .json(
      new ApiResponse(
        constants.OK,
        project,
        constants.PROJECT_FETCHED_SUCCESSFULLY,
      ),
    );
});

const updateProject = asyncHandler(async (req, res, next) => {
  const user = req.user;
  if (!user) {
    return next(new ApiError(constants.UNAUTHORIZED_REQUEST, "Unauthorized"));
  }

  const { id } = req.params;
  const result = updateProjectValidator.safeParse(req.body);
  if (!result.success) {
    return next(
      new ApiError(constants.BAD_REQUEST, result.error.issues[0].message),
    );
  }

  const payload = { ...result.data };
  const project = await Project.findById(id);
  if (!project) {
    return next(new ApiError(constants.NOT_FOUND, "Project not found"));
  }

  Object.assign(project, payload);

  if (req.file) {
    const file = await FileUpload.create({
      file: `/Uploads/${req.file.filename}`,
      fileType: req.file.mimetype,
      User: user._id,
    });
    project.image = file._id;
  }

  await project.save();
  res
    .status(constants.OK)
    .json(
      new ApiResponse(
        constants.OK,
        project,
        constants.PROJECT_UPDATED_SUCCESSFULLY,
      ),
    );
});

const deleteProject = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const project = await Project.findByIdAndDelete(id);
  if (!project) {
    return next(new ApiError(constants.NOT_FOUND, "Project not found"));
  }
  res
    .status(constants.OK)
    .json(
      new ApiResponse(
        constants.OK,
        project,
        constants.PROJECT_DELETED_SUCCESSFULLY,
      ),
    );
});

export {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject,
};
