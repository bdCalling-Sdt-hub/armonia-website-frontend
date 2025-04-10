import { baseApi } from "../../api/baseApi";

const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    registration: builder.mutation({
      query: (data) => {
        return {
          url: `auth/register`,
          method: "POST",
          body: data,
        };
      },
      invalidatesTags: ["auth"],
    }),
    postLogin: builder.mutation({
      query: (data) => {
        return {
          url: `auth/login`,
          method: "POST",
          body: data,
        };
      },
      invalidatesTags: ["auth"],
    }),
    forgotPassword: builder.mutation({
      query: (data) => {
        return {
          url: `auth/forgot`,
          method: "POST",
          body: data,
        };
      },
      invalidatesTags: ["auth"],
    }),
    verifyEmail: builder.mutation({
      query: (data) => {
        return {
          url: `otp/verify`,
          method: "POST",
          body: data,
        };
      },
      invalidatesTags: ["auth"],
    }),
    resetPassword: builder.mutation({
      query: ({ body, endpoint }) => {
        const token = sessionStorage.getItem("verify-token");
        return {
          url: `auth/password/${endpoint}`,
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body,
        };
      },
      invalidatesTags: ["auth"],
    }),
    getProfile: builder.query({
      query: () => {
        return {
          url: `/users/me`,
          method: "GET",
        };
      },
      providesTags: ["auth"],
    }),
    updateProfile: builder.mutation({
      query: ({ body }) => {
        return {
          url: "profiles/me",
          method: "PUT",
          body,
        };
      },
      invalidatesTags: ["auth"],
    }),
    updateImageName: builder.mutation({
      query: ({ body }) => {
        return {
          url: "users/me",
          method: "PUT",
          body,
        };
      },
      invalidatesTags: ["auth"],
    }),
  }),
});

export const {
  useGetProfileQuery,
  useRegistrationMutation,
  usePostLoginMutation,
  useForgotPasswordMutation,
  useVerifyEmailMutation,
  useResetPasswordMutation,
  useUpdateProfileMutation,
  useUpdateImageNameMutation,
  // useChangePasswordMutation,
} = authApi;
