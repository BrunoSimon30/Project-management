import { z } from "zod";




const loginValidator = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters long"),
});

const registerValidator = z.object({
  fullName: z.string().min(3, "Full name must be at least 3 characters long"),
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .max(100, "Password cannot exceed 100 characters"),
   department: z.string().nonempty("Department is required").optional(),
  role: z.enum(["superadmin", "admin", "department_head", "project_manager", "team_lead", "team_member"]).optional(),
});


const verifyOtpValidator = z.object({
  reason: z.enum(["register", "forgetPassword" ]).optional(),
  otpcode: z.string().min(4, "OTP must be 4 characters long"),
});

export { registerValidator ,verifyOtpValidator,loginValidator};
