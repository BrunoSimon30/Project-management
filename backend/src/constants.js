export default {
  // HTTP Status Codes
  ACCEPTED: 202,
  NO_CONTENT: 204,
  BAD_GATEWAY: 502,
  BAD_REQUEST: 400,
  CONFLICT: 409,
  CREATED: 201,
  FORBIDDEN: 403,
  GATEWAY_TIMEOUT: 504,
  INTERNAL_SERVER_ERROR: 500,
  NOT_FOUND: 404,
  NOT_IMPLEMENTED: 501,
  OK: 200,
  PAYMENT_REQUIRED: 402,
  PRECONDITION_FAILED: 412,
  PROXY_AUTHENTICATION_REQUIRED: 407,
  REQUEST_TOO_LONG: 413,
  REQUEST_URI_TOO_LONG: 414,
  SERVICE_UNAVAILABLE: 503,
  TOO_MANY_REQUESTS: 429,
  UNAUTHORIZED_REQUEST: 401,
  UNPROCESSABLE_ENTITY_REQUEST: 422,
  FORBIDDEN_REQUEST: 403,

  // Messages
  NO_RECORD_FOUND: "No record found for given details",
  VALIDATION_ERROR: "Validation Error",
  INVALID_CREDENTIALS: "Invalid Credentials, Please check and try again",
  EMAIL_EXIST: "Email is already in use by another account",
  INVALID_FILE_TYPE: "Invalid file type",
  INVALID_OTP: "OTP did not match",
  NOT_VERIFIED: "User is not verified",
  USER_DELETED: "User is Deleted/Inactive",
  USER_REGISTERED_SUCCESSFULLY: "User registered successfully",
  OTP_GENERATION_FAILED: "OTP generation failed",
  EMAIL_SEND_FAILED: "Email send failed",
  USER_NOT_FOUND: "User not found",
  OTP_NOT_FOUND: "OTP not found",
  OTP_EXPIRED: "OTP expired",
  OTP_ALREADY_USED: "OTP already used",
  OTP_VERIFIED_SUCCESSFULLY: "OTP verified successfully",
  UNAUTHORIZED: "Unauthorized",
  AUTHORIZED: "Authorized",
  LOGIN_SUCCESSFULLY: "Login successfully",
  OTP_RESENT_SUCCESSFULLY: "OTP sent successfully on your email",
  RESEND_OTP_COOLDOWN: "Please wait 60 seconds before requesting a new OTP.",
  REASON_REQUIRED: "Reason is required",
  INVALID_TOKEN: "Invalid or expired token",
  USER_BLOCKED: "User is blocked",
  PROFILE_UPDATED_SUCCESSFULLY: "Profile updated successfully",

  // Department Messages
  DEPARTMENT_CREATED_SUCCESSFULLY: "Department created successfully",
  DEPARTMENT_DELETED_SUCCESSFULLY: "Department deleted successfully",
  DEPARTMENT_UPDATED_SUCCESSFULLY: "Department updated successfully",

  // User Messages
  USERS_FETCHED_SUCCESSFULLY: "Users fetched successfully",
  USER_DELETED_SUCCESSFULLY: "User deleted successfully",
  USER_UPDATED_SUCCESSFULLY: "User updated successfully",

  // Project Messages
  PROJECT_CREATED_SUCCESSFULLY: "Project created successfully",
  PROJECT_FETCHED_SUCCESSFULLY: "Project fetched successfully",
  PROJECT_NOT_FOUND: "Project not found",
  PROJECT_DELETED_SUCCESSFULLY: "Project deleted successfully",
  PROJECT_UPDATED_SUCCESSFULLY: "Project updated successfully",



  // Task Messages
  TASK_CREATED_SUCCESSFULLY: "Task created successfully",
  TASK_FETCHED_SUCCESSFULLY: "Task fetched successfully",
  TASK_NOT_FOUND: "Task not found",
  TASK_DELETED_SUCCESSFULLY: "Task deleted successfully",
  TASK_UPDATED_SUCCESSFULLY: "Task updated successfully",

  // SMTP
  SMTP_HOST: process.env.SMTP_HOST,
  SMTP_PORT: process.env.SMTP_PORT,
  SMTP_USER: process.env.SMTP_USER,
  SMTP_PASS: process.env.SMTP_PASS,

  DB_NAME: "projectmanagement",
  PORT: process.env.PORT || 8080,
};
