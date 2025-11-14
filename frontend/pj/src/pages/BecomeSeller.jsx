import { useBecomeSellerMutation } from "../services/authApi";
import { useNavigate } from "react-router-dom";

export default function BecomeSeller() {
  const navigate = useNavigate();

  // RTK Query mutation + auto states
  const [
    becomeSeller,
    { isLoading, isError, isSuccess, error }
  ] = useBecomeSellerMutation();

  const handleBecomeSeller = async () => {
    await becomeSeller().unwrap().then(() => {
      // Redirect after a short delay to show success message
      setTimeout(() => {
        navigate("/profile");
      }, 800);
    });
  };

  return (
    <div className="flex items-center justify-center min-h-[70vh] p-4">
      <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-6 text-center">

        <h1 className="text-2xl font-bold mb-4">Become a Seller</h1>
        <p className="text-gray-600 mb-6">
          Click the button below to upgrade your account to <strong>SELLER</strong>.
        </p>

        <button
          onClick={handleBecomeSeller}
          disabled={isLoading}
          className="bg-purple-600 cursor-pointer text-white w-full py-3 rounded-lg text-lg hover:bg-purple-700 disabled:bg-gray-400"
        >
          {isLoading ? "Processing..." : "Become Seller"}
        </button>

        {/* ⭐ ERROR MESSAGE */}
        {isError && (
          <p className="mt-4 text-red-500">
            {error?.data?.message || "Something went wrong"}
          </p>
        )}

        {/* ⭐ SUCCESS MESSAGE */}
        {isSuccess && (
          <p className="mt-4 text-green-600">
            Role updated successfully! Redirecting...
          </p>
        )}

      </div>
    </div>
  );
}

