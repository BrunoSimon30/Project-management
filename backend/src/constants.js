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
  UNAUTHORIZED : "Unauthorized",
  AUTHORIZED: "Authorized",
  LOGIN_SUCCESSFULLY: "Login successfully",





  // SMTP
  SMTP_HOST: process.env.SMTP_HOST,
  SMTP_PORT: process.env.SMTP_PORT,
  SMTP_USER: process.env.SMTP_USER,
  SMTP_PASS: process.env.SMTP_PASS,

  DB_NAME: "projectmanagement",
  PORT: process.env.PORT || 8080,
};
