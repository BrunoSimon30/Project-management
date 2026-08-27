import { baseApi } from "./baseApi.js";

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    register: builder.mutation({
      query: (body) => ({
        url: "/auth/register",
        method: "POST",
        body,
        formData: true,
      }),
    }),
    login: builder.mutation({
      query: (body) => ({ url: "/auth/login", method: "POST", body }),
    }),
    verifyOtp: builder.mutation({
      query: (body) => ({ url: "/auth/verify", method: "POST", body }),
    }),
    resendOtp: builder.mutation({
      query: (body) => ({ url: "/auth/resend-otp", method: "POST", body }),
    }),
    forgotPassword: builder.mutation({
      query: (body) => ({ url: "/auth/forgot-password", method: "POST", body }),
    }),
    resetPassword: builder.mutation({
      query: (body) => ({ url: "/auth/reset-password", method: "POST", body }),
    }),
    updateProfile: builder.mutation({
      query: (formData) => ({
        url: "/auth/update-profile",
        method: "PUT",
        body: formData,
        formData: true,
      }),
    }),
  }),
});

export const {
  useRegisterMutation,
  useLoginMutation,
  useVerifyOtpMutation,
  useResendOtpMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useUpdateProfileMutation,
} = authApi;
