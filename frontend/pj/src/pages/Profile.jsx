import { useProfileQuery, useUpdateProfileMutation } from "../services/authApi";
import { useEffect, useState } from "react";

export default function Profile() {
  const { data, isLoading, isError } = useProfileQuery();
  const [
    updateProfile,
    { isLoading: isUpdating, isError: isUpdateError, isSuccess, error }
  ] = useUpdateProfileMutation();

  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ username: "", email: "" });

  // Auto-fill form when profile data arrives
  useEffect(() => {
    if (data?.data) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setForm({
        username: data.data.username || "",
        email: data.data.email || "",
      });
    }
  }, [data?.data]);

  // Global loading
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[70vh]">
        <p className="text-gray-500">Loading profile...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex justify-center items-center min-h-[70vh]">
        <p className="text-red-500">Failed to load profile</p>
      </div>
    );
  }

  const user = data?.data;
  if (!user) {
    return (
      <div className="flex justify-center items-center min-h-[70vh]">
        <p className="text-red-500">Profile not found</p>
      </div>
    );
  }

  const handleUpdate = async (e) => {
    e.preventDefault();
    await updateProfile(form).unwrap();
    setEditing(false);
  };

  return (
    <div className="flex justify-center items-center min-h-[70vh] p-4">
      <div className="bg-white border rounded-lg shadow p-6 max-w-md w-full">

        <h1 className="text-2xl font-semibold mb-4 text-center">Your Profile</h1>

        {!editing ? (
          <>
            <div className="flex flex-col gap-3 mb-4">
              <div className="border p-3 rounded">
                <strong>Username:</strong> {user.username}
              </div>

              <div className="border p-3 rounded">
                <strong>Email:</strong> {user.email}
              </div>

              <div className="border p-3 rounded">
                <strong>Role:</strong> {user.role}
              </div>
            </div>

            <button
              onClick={() => setEditing(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded w-full"
            >
              Edit Profile
            </button>
          </>
        ) : (
          <form onSubmit={handleUpdate} className="flex flex-col gap-3">

            <input
              type="text"
              className="border p-2 rounded"
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
              placeholder="Username"
            />

            <input
              type="email"
              className="border p-2 rounded"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="Email"
            />

            <div className="flex gap-3 mt-2">
              <button
                type="submit"
                disabled={isUpdating}
                className="bg-green-600 text-white px-4 py-2 rounded w-full disabled:bg-gray-400"
              >
                {isUpdating ? "Updating..." : "Save"}
              </button>

              <button
                type="button"
                className="bg-gray-400 text-white px-4 py-2 rounded w-full"
                onClick={() => {
                  setForm({
                    username: user.username,
                    email: user.email,
                  });
                  setEditing(false);
                }}
              >
                Cancel
              </button>
            </div>

            {/* ⭐ Update Error */}
            {isUpdateError && (
              <p className="text-red-500 mt-2">
                {error?.data?.message || "Update failed"}
              </p>
            )}

            {/* ⭐ Update Success */}
            {isSuccess && (
              <p className="text-green-600 mt-2">
                Profile updated successfully!
              </p>
            )}
          </form>
        )}

      </div>
    </div>
  );
}



