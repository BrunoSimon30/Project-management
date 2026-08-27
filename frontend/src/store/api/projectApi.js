import { baseApi } from "./baseApi.js";

export const projectApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getProjects: builder.query({
      query: () => ({ url: "/project/get-projects", method: "GET" }),
      providesTags: ["Project"],
    }),
    getProjectById: builder.query({
      query: (id) => ({ url: `/project/get-project/${id}`, method: "GET" }),
      providesTags: ["Project"],
    }),
    createProject: builder.mutation({
      query: (body) => ({ url: "/project/create", method: "POST", body }),
      invalidatesTags: ["Project"],
    }),
    updateProject: builder.mutation({
      query: ({ id, body }) => ({ url: `/project/update/${id}`, method: "PUT", body }),
      invalidatesTags: ["Project"],
    }),
    deleteProject: builder.mutation({
      query: (id) => ({ url: `/project/delete/${id}`, method: "DELETE" }),
      invalidatesTags: ["Project"],
    }),
  }),
});

export const {
  useGetProjectsQuery,
  useGetProjectByIdQuery,
  useCreateProjectMutation,
  useUpdateProjectMutation,
  useDeleteProjectMutation,
} = projectApi;
