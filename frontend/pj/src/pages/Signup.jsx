import { useSignupMutation } from "../services/authApi";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Signup() {
  const navigate = useNavigate();

  const [signup, { isError, isSuccess, error, data, isLoading }] =
    useSignupMutation();

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    await signup(form).unwrap().then(() => {
      setTimeout(() => {
        navigate("/login");
      }, 800);
    });
  };

  return (
    <div className="flex justify-center items-center min-h-[70vh] p-4">

      <div className="max-w-sm w-full bg-white shadow-lg rounded-lg p-6">

        <h1 className="text-xl mb-4 font-semibold text-center">Signup</h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">

          <input
            type="text"
            placeholder="Username"
            className="border p-2 rounded"
            onChange={(e) => setForm({ ...form, username: e.target.value })}
          />

          <input
            type="email"
            placeholder="Email"
            className="border p-2 rounded"
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />

          <input
            type="password"
            placeholder="Password"
            className="border p-2 rounded"
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />

          <button
            disabled={isLoading}
            className="bg-blue-600 text-white py-2 rounded disabled:bg-gray-400"
          >
            {isLoading ? "Signing up..." : "Signup"}
          </button>

        </form>

        {/* ERROR */}
        {isError && (
          <p className="mt-3 text-red-500 text-center">
            {error?.data?.message || "Signup failed!"}
          </p>
        )}

        {/* SUCCESS */}
        {isSuccess && (
          <p className="mt-3 text-green-600 text-center">
            {data?.message || "Signup successful!"}
          </p>
        )}

      </div>

    </div>
  );
}
