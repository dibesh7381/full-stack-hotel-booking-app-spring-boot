import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const authApi = createApi({
  reducerPath: "authApi",

  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:8080/api/auth",
    credentials: "include",
  }),

  // ⭐ Rooms + Profile ke liye tags
  tagTypes: ["Profile", "Rooms"],

  endpoints: (builder) => ({

    // -------------------------
    // AUTH
    // -------------------------
    signup: builder.mutation({
      query: (body) => ({
        url: "/signup",
        method: "POST",
        body,
      }),
    }),

    login: builder.mutation({
      query: (body) => ({
        url: "/login",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Profile"],
    }),

    logout: builder.mutation({
      query: () => ({
        url: "/logout",
        method: "POST",
      }),
      invalidatesTags: ["Profile"],
    }),

    profile: builder.query({
      query: () => "/profile",
      providesTags: ["Profile"],
    }),

    updateProfile: builder.mutation({
      query: (body) => ({
        url: "/profile/update",
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Profile"],
    }),

    becomeSeller: builder.mutation({
      query: () => ({
        url: "/become-seller",
        method: "POST",
      }),
      invalidatesTags: ["Profile"],
    }),

    homePage: builder.query({
      query: () => "/homepage",
    }),

    // -----------------------------------------------------
    // ⭐ ROOMS API CALLS
    // -----------------------------------------------------

    // ⭐ CREATE ROOM
    createRoom: builder.mutation({
      query: (body) => ({
        url: "/rooms",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Rooms"],
    }),

    // ⭐ UPDATE ROOM
    updateRoom: builder.mutation({
      query: ({ roomId, body }) => ({
        url: `/rooms/${roomId}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Rooms"],
    }),

    // ⭐ DELETE ROOM
    deleteRoom: builder.mutation({
      query: (roomId) => ({
        url: `/rooms/${roomId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Rooms"],
    }),

    // ⭐ GET MY ROOMS (seller)
    myRooms: builder.query({
      query: () => "/rooms/my",
      providesTags: ["Rooms"],
    }),

    // ⭐ GET ALL ROOMS (public)
    allRooms: builder.query({
      query: () => "/rooms",
      providesTags: ["Rooms"],
    }),

  }),
});

// Export hooks
export const {
  useSignupMutation,
  useLoginMutation,
  useLogoutMutation,
  useProfileQuery,
  useUpdateProfileMutation,
  useBecomeSellerMutation,
  useHomePageQuery,

  // ⭐ ROOM HOOKS
  useCreateRoomMutation,
  useUpdateRoomMutation,
  useDeleteRoomMutation,
  useMyRoomsQuery,
  useAllRoomsQuery,
} = authApi;



