import { useState, useEffect } from "react";
import SellerRoomCard from "../components/SellerRoomCard";
import {
  useCreateRoomMutation,
  useMyRoomsQuery,
  useUpdateRoomMutation,
  useDeleteRoomMutation,
} from "../services/authApi";

export default function SellerDashboard() {
  const [createRoom, { isLoading }] = useCreateRoomMutation();
  const [updateRoom] = useUpdateRoomMutation();
  const [deleteRoom] = useDeleteRoomMutation();

  const { data: myRoomsData, isLoading: roomsLoading } = useMyRoomsQuery();

  const STORAGE_KEY = "roomFormData";

  const defaultForm = {
    roomTitle: "",
    hotelName: "",
    roomType: "",
    acType: "",
    country: "",
    state: "",
    city: "",
    fullAddress: "",
    zipCode: "",
    maxGuests: "",
    bedType: "",
    numberOfBeds: "",
    roomSize: "",
    availabilityStatus: "AVAILABLE",
    basePricePerNight: "",
    discountPrice: "",
    cancellationPolicy: "",
    images: [null, null, null], // ⭐ FIXED 3 slots
  };

  const [form, setForm] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : defaultForm;
  });

  const [step, setStep] = useState(1);
  const [editRoomId, setEditRoomId] = useState(null);

  // ⭐ Keep previewImages always 3 slots
  const [previewImages, setPreviewImages] = useState([null, null, null]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(form));
  }, [form]);

  const updateField = (name, value) => {
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // 🔥 Convert file → Base64
  const convertToBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
    });

  // 🔥 Handle upload for each slot
  const handleImage = async (fileIndex, file) => {
    if (!file) return;

    const base64 = await convertToBase64(file);

    const previews = [...previewImages];
    previews[fileIndex] = base64;

    setPreviewImages(previews);

    // ⭐ NO FILTER HERE → Keep nulls at correct positions
    updateField("images", previews);
  };

  // 🔥 Remove image at index
  const removeImage = (index) => {
    const previews = [...previewImages];
    previews[index] = null;

    setPreviewImages(previews);
    updateField("images", previews); // ⭐ Keep structure
  };

  // 🔥 Submit Room (Create + Update)
  const handleSubmit = async () => {
    const body = {
      ...form,
      // ⭐ Filter only at final submit
      images: form.images.filter((img) => img !== null),
    };

    if (editRoomId) {
      await updateRoom({ roomId: editRoomId, body }).unwrap();
      alert("Room Updated Successfully!");
    } else {
      await createRoom(body).unwrap();
      alert("Room Added Successfully!");
    }

    setEditRoomId(null);
    localStorage.removeItem(STORAGE_KEY);

    setPreviewImages([null, null, null]);
    setForm(defaultForm);
    setStep(1);
  };

  // 🔥 Edit mode → load room with fixed slots
  const handleEdit = (room) => {
    setEditRoomId(room.id);

    const imgArr = room.images ? [...room.images] : [];

    // ⭐ Always ensure 3 slots exist
    const fixed = [
      imgArr[0] || null,
      imgArr[1] || null,
      imgArr[2] || null,
    ];

    setPreviewImages(fixed);
    setForm({
      ...room,
      images: fixed,
    });

    setStep(1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // 🔥 Delete Room
  const handleDelete = async (id) => {
    if (!confirm("Are you sure to delete this room?")) return;
    await deleteRoom(id).unwrap();
    alert("Room Deleted Successfully!");
  };

  return (
    <div className="max-w-4xl mx-auto p-6 min-h-screen">
      <h1 className="text-3xl font-bold text-center mb-6">
        {editRoomId ? "Edit Room" : "Seller Dashboard – Add New Room"}
      </h1>

      {/* Step indicator */}
      <div className="flex justify-between mb-6">
        {[1, 2, 3, 4].map((s) => (
          <div
            key={s}
            className={`w-8 h-8 flex items-center justify-center rounded-full ${
              step === s ? "bg-blue-600 text-white" : "bg-gray-300 text-gray-700"
            }`}
          >
            {s}
          </div>
        ))}
      </div>

      {/* ---------------- STEP 1 ---------------- */}
      {step === 1 && (
        <div className="flex flex-col gap-4">
          <input
            className="border p-2 rounded"
            placeholder="Room Title"
            value={form.roomTitle}
            onChange={(e) => updateField("roomTitle", e.target.value)}
          />

          <input
            className="border p-2 rounded"
            placeholder="Hotel Name"
            value={form.hotelName}
            onChange={(e) => updateField("hotelName", e.target.value)}
          />

          <select
            className="border p-2 rounded"
            value={form.roomType}
            onChange={(e) => updateField("roomType", e.target.value)}
          >
            <option value="">Select Room Type</option>
            <option>Single Room</option>
            <option>Double Room</option>
            <option>Deluxe Room</option>
            <option>Suite</option>
          </select>

          <select
            className="border p-2 rounded"
            value={form.acType}
            onChange={(e) => updateField("acType", e.target.value)}
          >
            <option value="">Select AC Type</option>
            <option value="AC">AC</option>
            <option value="NON_AC">NON AC</option>
          </select>
        </div>
      )}

      {/* ---------------- STEP 2 ---------------- */}
      {step === 2 && (
        <div className="flex flex-col gap-4">
          <input
            className="border p-2 rounded"
            placeholder="Country"
            value={form.country}
            onChange={(e) => updateField("country", e.target.value)}
          />

          <input
            className="border p-2 rounded"
            placeholder="State"
            value={form.state}
            onChange={(e) => updateField("state", e.target.value)}
          />

          <input
            className="border p-2 rounded"
            placeholder="City"
            value={form.city}
            onChange={(e) => updateField("city", e.target.value)}
          />

          <input
            className="border p-2 rounded"
            placeholder="Full Address"
            value={form.fullAddress}
            onChange={(e) => updateField("fullAddress", e.target.value)}
          />

          <input
            className="border p-2 rounded"
            placeholder="Zip Code"
            value={form.zipCode}
            onChange={(e) => updateField("zipCode", e.target.value)}
          />
        </div>
      )}

      {/* ---------------- STEP 3 ---------------- */}
      {step === 3 && (
        <div className="flex flex-col gap-4">
          <input
            className="border p-2 rounded"
            placeholder="Max Guests"
            value={form.maxGuests}
            onChange={(e) => updateField("maxGuests", e.target.value)}
          />

          <select
            className="border p-2 rounded"
            value={form.bedType}
            onChange={(e) => updateField("bedType", e.target.value)}
          >
            <option value="">Select Bed Type</option>
            <option>King</option>
            <option>Queen</option>
            <option>Single</option>
          </select>

          <input
            className="border p-2 rounded"
            placeholder="Number of Beds"
            value={form.numberOfBeds}
            onChange={(e) => updateField("numberOfBeds", e.target.value)}
          />

          <input
            className="border p-2 rounded"
            placeholder="Room Size"
            value={form.roomSize}
            onChange={(e) => updateField("roomSize", e.target.value)}
          />
        </div>
      )}

      {/* ---------------- STEP 4 (Images Step) ---------------- */}
      {step === 4 && (
        <div className="flex flex-col gap-4">

          <select
            className="border p-2 rounded"
            value={form.availabilityStatus}
            onChange={(e) => updateField("availabilityStatus", e.target.value)}
          >
            <option>AVAILABLE</option>
            <option>BLOCKED</option>
          </select>

          <input
            className="border p-2 rounded"
            placeholder="Base Price"
            value={form.basePricePerNight}
            onChange={(e) => updateField("basePricePerNight", e.target.value)}
          />

          <input
            className="border p-2 rounded"
            placeholder="Discount Price"
            value={form.discountPrice}
            onChange={(e) => updateField("discountPrice", e.target.value)}
          />

          <select
            className="border p-2 rounded"
            value={form.cancellationPolicy}
            onChange={(e) => updateField("cancellationPolicy", e.target.value)}
          >
            <option value="">Select Cancellation</option>
            <option>Free Cancellation</option>
            <option>No Refund</option>
          </select>

          {/* IMAGE INPUTS */}
          {[0, 1, 2].map((index) => (
            <div key={index}>
              <p className="font-semibold mb-1">Image {index + 1}</p>

              <input
                type="file"
                accept="image/*"
                className="border p-2 rounded w-full"
                onChange={(e) => handleImage(index, e.target.files[0])}
              />

              {/* Preview */}
              {previewImages[index] && (
                <div className="relative mt-2 inline-block">
                  <img
                    src={previewImages[index]}
                    className="h-24 w-24 object-cover rounded border"
                  />
                  <button
                    onClick={() => removeImage(index)}
                    className="absolute top-1 right-1 bg-red-600 text-white rounded-full px-2 py-1 text-xs"
                  >
                    X
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Buttons */}
      <div className="flex justify-between mt-8">
        {step > 1 ? (
          <button
            className="bg-gray-400 text-white px-4 py-2 rounded"
            onClick={() => setStep(step - 1)}
          >
            Back
          </button>
        ) : (
          <div></div>
        )}

        {step < 4 ? (
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded"
            onClick={() => setStep(step + 1)}
          >
            Next
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={isLoading}
            className="bg-green-600 w-full text-white px-4 py-2 rounded"
          >
            {editRoomId ? "Update Room" : "Submit"}
          </button>
        )}
      </div>

      {/* Rooms List */}
      <h2 className="text-2xl font-bold mt-16 mb-4">Your Rooms</h2>

      {roomsLoading ? (
        <p>Loading rooms...</p>
      ) : myRoomsData?.data?.length === 0 ? (
        <p className="text-gray-600">No rooms added yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-4">
          {myRoomsData.data.map((r) => (
            <SellerRoomCard
              key={r.id}
              room={r}
              onEdit={() => handleEdit(r)}
              onDelete={() => handleDelete(r.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

