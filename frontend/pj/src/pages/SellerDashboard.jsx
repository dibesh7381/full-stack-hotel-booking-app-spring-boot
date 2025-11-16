// import { useState } from "react";
// import SellerRoomCard from "../components/SellerRoomCard";
// import {
//   useCreateRoomMutation,
//   useMyRoomsQuery,
//   useUpdateRoomMutation,
//   useDeleteRoomMutation,
// } from "../services/authApi";

// export default function SellerDashboard() {
//   const [createRoom, { isLoading }] = useCreateRoomMutation();
//   const [updateRoom] = useUpdateRoomMutation();
//   const [deleteRoom] = useDeleteRoomMutation();

//   const { data: myRoomsData, isLoading: roomsLoading } = useMyRoomsQuery();

//   // LocalStorage keys
//   const LS1 = "step1Form";
//   const LS2 = "step2Form";
//   const LS3 = "step3Form";
//   const LS4 = "step4Form";

//   const defaultForm = {
//     roomTitle: "",
//     hotelName: "",
//     roomType: "",
//     acType: "",
//     country: "",
//     state: "",
//     city: "",
//     fullAddress: "",
//     zipCode: "",
//     maxGuests: "",
//     bedType: "",
//     numberOfBeds: "",
//     roomSize: "",
//     availabilityStatus: "AVAILABLE",
//     basePricePerNight: "",
//     discountPrice: "",
//     cancellationPolicy: "",
//     images: [null, null, null],
//   };

//   const [form, setForm] = useState(defaultForm);
//   const [step, setStep] = useState(1);
//   const [editRoomId, setEditRoomId] = useState(null);

//   const [previewImages, setPreviewImages] = useState([null, null, null]);

//   const updateField = (name, value) => {
//     setForm((prev) => ({ ...prev, [name]: value }));
//   };

//   // -------------------------------
//   // SIMPLE LOCAL STORAGE FUNCTIONS
//   // -------------------------------

//   const saveStep1 = () => localStorage.setItem(LS1, JSON.stringify(form));
//   const saveStep2 = () => localStorage.setItem(LS2, JSON.stringify(form));
//   const saveStep3 = () => localStorage.setItem(LS3, JSON.stringify(form));
//   const saveStep4 = () => localStorage.setItem(LS4, JSON.stringify(form));

//   const loadStep1 = () => {
//     const data = localStorage.getItem(LS1);
//     if (data) setForm(JSON.parse(data));
//   };

//   const loadStep2 = () => {
//     const data = localStorage.getItem(LS2);
//     if (data) setForm(JSON.parse(data));
//   };

//   const loadStep3 = () => {
//     const data = localStorage.getItem(LS3);
//     if (data) setForm(JSON.parse(data));
//   };

//   // eslint-disable-next-line no-unused-vars
//   const loadStep4 = () => {
//     const data = localStorage.getItem(LS4);
//     if (data) {
//       const parsed = JSON.parse(data);
//       setForm(parsed);
//       setPreviewImages(parsed.images || [null, null, null]);
//     }
//   };

//   // -------------------------------
//   // NEXT BUTTON
//   // -------------------------------
//   const handleNext = () => {
//     if (step === 1) saveStep1();
//     if (step === 2) saveStep2();
//     if (step === 3) saveStep3();
//     if (step === 4) saveStep4();

//     setStep(step + 1);
//     window.scrollTo({ top: 0, behavior: "smooth" });
//   };

//   // -------------------------------
//   // BACK BUTTON
//   // -------------------------------
//   const handleBack = () => {
//     if (step === 2) loadStep1();
//     if (step === 3) loadStep2();
//     if (step === 4) loadStep3();

//     setStep(step - 1);
//     window.scrollTo({ top: 0, behavior: "smooth" });
//   };

//   // -------------------------------
//   // IMAGE UPLOAD
//   // -------------------------------

//   const convertToBase64 = (file) =>
//     new Promise((resolve, reject) => {
//       const reader = new FileReader();
//       reader.readAsDataURL(file);
//       reader.onload = () => resolve(reader.result);
//       reader.onerror = reject;
//     });

//   const handleImage = async (index, file) => {
//     if (!file) return;

//     const base64 = await convertToBase64(file);

//     const previews = [...previewImages];
//     previews[index] = base64;

//     setPreviewImages(previews);
//     updateField("images", previews);

//     saveStep4();
//   };

//   const removeImage = (index) => {
//     const previews = [...previewImages];
//     previews[index] = null;

//     setPreviewImages(previews);
//     updateField("images", previews);

//     saveStep4();
//   };

//   // -------------------------------
//   // SUBMIT FINAL FORM
//   // -------------------------------
//   const handleSubmit = async () => {
//     const finalData = {
//       ...form,
//       images: form.images.filter((img) => img !== null),
//     };

//     if (editRoomId) {
//       await updateRoom({ roomId: editRoomId, body: finalData }).unwrap();
//       alert("Room updated successfully!");
//     } else {
//       await createRoom(finalData).unwrap();
//       alert("Room added successfully!");
//     }

//     // CLEAR ALL LS
//     localStorage.removeItem(LS1);
//     localStorage.removeItem(LS2);
//     localStorage.removeItem(LS3);
//     localStorage.removeItem(LS4);

//     setForm(defaultForm);
//     setPreviewImages([null, null, null]);
//     setEditRoomId(null);
//     setStep(1);
//   };

//   // -------------------------------
//   // EDIT MODE
//   // -------------------------------
//   const handleEdit = (room) => {
//     setEditRoomId(room.id);

//     const imgs = [
//       room.images?.[0] || null,
//       room.images?.[1] || null,
//       room.images?.[2] || null,
//     ];

//     const filled = { ...room, images: imgs };

//     setForm(filled);
//     setPreviewImages(imgs);

//     saveStep1();
//     saveStep2();
//     saveStep3();
//     saveStep4();

//     setStep(1);
//     window.scrollTo({ top: 0, behavior: "smooth" });
//   };

//   const handleDelete = async (id) => {
//     if (!confirm("Are you sure?")) return;
//     await deleteRoom(id).unwrap();
//     alert("Room deleted successfully!");
//   };

//   // ---------------------------------------
//   // UI BELOW (same as yours)
//   // ---------------------------------------

//   return (
//     <div className="max-w-4xl mx-auto p-6 min-h-screen">
//       <h1 className="text-3xl font-bold text-center mb-6">
//         {editRoomId ? "Edit Room" : "Seller Dashboard – Add New Room"}
//       </h1>

//       {/* STEP INDICATOR */}
//       <div className="flex justify-between mb-6">
//         {[1, 2, 3, 4].map((s) => (
//           <div
//             key={s}
//             className={`w-8 h-8 flex items-center justify-center rounded-full ${
//               step === s ? "bg-blue-600 text-white" : "bg-gray-300 text-gray-700"
//             }`}
//           >
//             {s}
//           </div>
//         ))}
//       </div>

//       {/* ---------------- STEP 1 ---------------- */}
//       {step === 1 && (
//         <div className="flex flex-col gap-4">
//           <input
//             className="border p-2 rounded"
//             placeholder="Room Title"
//             value={form.roomTitle}
//             onChange={(e) => updateField("roomTitle", e.target.value)}
//           />

//           <input
//             className="border p-2 rounded"
//             placeholder="Hotel Name"
//             value={form.hotelName}
//             onChange={(e) => updateField("hotelName", e.target.value)}
//           />

//           <select
//             className="border p-2 rounded"
//             value={form.roomType}
//             onChange={(e) => updateField("roomType", e.target.value)}
//           >
//             <option value="">Select Room Type</option>
//             <option>Single Room</option>
//             <option>Double Room</option>
//             <option>Deluxe Room</option>
//             <option>Suite</option>
//           </select>

//           <select
//             className="border p-2 rounded"
//             value={form.acType}
//             onChange={(e) => updateField("acType", e.target.value)}
//           >
//             <option value="">Select AC Type</option>
//             <option value="AC">AC</option>
//             <option value="NON_AC">NON AC</option>
//           </select>
//         </div>
//       )}

//       {/* ---------------- STEP 2 ---------------- */}
//       {step === 2 && (
//         <div className="flex flex-col gap-4">
//           <input
//             className="border p-2 rounded"
//             placeholder="Country"
//             value={form.country}
//             onChange={(e) => updateField("country", e.target.value)}
//           />

//           <input
//             className="border p-2 rounded"
//             placeholder="State"
//             value={form.state}
//             onChange={(e) => updateField("state", e.target.value)}
//           />

//           <input
//             className="border p-2 rounded"
//             placeholder="City"
//             value={form.city}
//             onChange={(e) => updateField("city", e.target.value)}
//           />

//           <input
//             className="border p-2 rounded"
//             placeholder="Full Address"
//             value={form.fullAddress}
//             onChange={(e) => updateField("fullAddress", e.target.value)}
//           />

//           <input
//             className="border p-2 rounded"
//             placeholder="Zip Code"
//             value={form.zipCode}
//             onChange={(e) => updateField("zipCode", e.target.value)}
//           />
//         </div>
//       )}

//       {/* ---------------- STEP 3 ---------------- */}
//       {step === 3 && (
//         <div className="flex flex-col gap-4">
//           <input
//             className="border p-2 rounded"
//             placeholder="Max Guests"
//             value={form.maxGuests}
//             onChange={(e) => updateField("maxGuests", e.target.value)}
//           />

//           <select
//             className="border p-2 rounded"
//             value={form.bedType}
//             onChange={(e) => updateField("bedType", e.target.value)}
//           >
//             <option value="">Select Bed Type</option>
//             <option>King</option>
//             <option>Queen</option>
//             <option>Single</option>
//           </select>

//           <input
//             className="border p-2 rounded"
//             placeholder="Number of Beds"
//             value={form.numberOfBeds}
//             onChange={(e) => updateField("numberOfBeds", e.target.value)}
//           />

//           <input
//             className="border p-2 rounded"
//             placeholder="Room Size"
//             value={form.roomSize}
//             onChange={(e) => updateField("roomSize", e.target.value)}
//           />
//         </div>
//       )}

//       {/* ---------------- STEP 4 ---------------- */}
//       {step === 4 && (
//         <div className="flex flex-col gap-4">
//           <select
//             className="border p-2 rounded"
//             value={form.availabilityStatus}
//             onChange={(e) => updateField("availabilityStatus", e.target.value)}
//           >
//             <option>AVAILABLE</option>
//             <option>BLOCKED</option>
//           </select>

//           <input
//             className="border p-2 rounded"
//             placeholder="Base Price"
//             value={form.basePricePerNight}
//             onChange={(e) => updateField("basePricePerNight", e.target.value)}
//           />

//           <input
//             className="border p-2 rounded"
//             placeholder="Discount Price"
//             value={form.discountPrice}
//             onChange={(e) => updateField("discountPrice", e.target.value)}
//           />

//           <select
//             className="border p-2 rounded"
//             value={form.cancellationPolicy}
//             onChange={(e) => updateField("cancellationPolicy", e.target.value)}
//           >
//             <option value="">Select Cancellation</option>
//             <option>Free Cancellation</option>
//             <option>No Refund</option>
//           </select>

//           {/* IMAGE INPUTS */}
//           {[0, 1, 2].map((i) => (
//             <div key={i}>
//               <p className="font-semibold mb-1">Image {i + 1}</p>

//               <input
//                 type="file"
//                 accept="image/*"
//                 className="border p-2 rounded w-full"
//                 onChange={(e) => handleImage(i, e.target.files[0])}
//               />

//               {previewImages[i] && (
//                 <div className="relative mt-2 inline-block">
//                   <img
//                     src={previewImages[i]}
//                     className="h-24 w-24 object-cover rounded border"
//                   />

//                   <button
//                     onClick={() => removeImage(i)}
//                     className="absolute top-1 right-1 bg-red-600 text-white rounded-full px-2 py-1 text-xs"
//                   >
//                     X
//                   </button>
//                 </div>
//               )}
//             </div>
//           ))}
//         </div>
//       )}

//       {/* BUTTONS */}
//       <div className="flex justify-between mt-8">
//         {step > 1 ? (
//           <button
//             className="bg-gray-400 text-white px-4 py-2 rounded"
//             onClick={handleBack}
//           >
//             Back
//           </button>
//         ) : (
//           <div></div>
//         )}

//         {step < 4 ? (
//           <button
//             className="bg-blue-600 text-white px-4 py-2 rounded"
//             onClick={handleNext}
//           >
//             Next
//           </button>
//         ) : (
//           <button
//             onClick={handleSubmit}
//             disabled={isLoading}
//             className="bg-green-600 w-full text-white px-4 py-2 rounded"
//           >
//             {editRoomId ? "Update Room" : "Submit"}
//           </button>
//         )}
//       </div>

//       {/* ROOMS LIST */}
//       <h2 className="text-2xl font-bold mt-16 mb-4">Your Rooms</h2>

//       {roomsLoading ? (
//         <p>Loading rooms...</p>
//       ) : myRoomsData?.data?.length === 0 ? (
//         <p className="text-gray-600">No rooms added yet.</p>
//       ) : (
//         <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-4">
//           {myRoomsData.data.map((r) => (
//             <SellerRoomCard
//               key={r.id}
//               room={r}
//               onEdit={() => handleEdit(r)}
//               onDelete={() => handleDelete(r.id)}
//             />
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }


import SellerRoomCard from "../components/SellerRoomCard";
import Step1BasicInfo from "../roomForm/Step1BasicInfo";
import Step2Location from "../roomForm/Step2Location";
import Step3Details from "../roomForm/Step3Details";
import Step4ImagesPricing from "../roomForm/Step4ImagesPricing";

import { useSelector, useDispatch } from "react-redux";

import {
  setStep,
  saveStepToLS,
  loadStepFromLS,
  addImage,
  removeImageAt,
  setEditMode,
  resetForm,
} from "../features/roomFormSlice";

import {
  useCreateRoomMutation,
  useMyRoomsQuery,
  useUpdateRoomMutation,
  useDeleteRoomMutation,
} from "../services/authApi";

export default function SellerDashboard() {
  const dispatch = useDispatch();

  const { form, step, editRoomId, previewImages } = useSelector(
    (state) => state.roomForm
  );

  const [createRoom, { isLoading }] = useCreateRoomMutation();
  const [updateRoom] = useUpdateRoomMutation();
  const [deleteRoom] = useDeleteRoomMutation();

  const { data: myRoomsData, isLoading: roomsLoading } = useMyRoomsQuery();

  // ---------------- STEP NAVIGATION ----------------
  const handleNext = () => {
    dispatch(saveStepToLS());
    dispatch(setStep(step + 1));
  };

  const handleBack = () => {
    dispatch(setStep(step - 1));
    dispatch(loadStepFromLS(step - 1));
  };

  // ---------------- IMAGE UPLOAD ----------------
  const convertToBase64 = (file) =>
    new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.readAsDataURL(file);
    });

  const handleImage = async (index, file) => {
    if (!file) return;

    const base64 = await convertToBase64(file);

    dispatch(addImage({ index, base64 }));
  };

  const removeImage = (index) => {
    dispatch(removeImageAt(index));
  };

  // ---------------- SUBMIT ----------------
  const handleSubmit = async () => {
    const finalData = {
      ...form,
      images: form.images.filter((img) => img !== null),
    };

    if (editRoomId) {
      await updateRoom({ roomId: editRoomId, body: finalData }).unwrap();
      alert("Room Updated Successfully!");
    } else {
      await createRoom(finalData).unwrap();
      alert("Room Added Successfully!");
    }

    dispatch(resetForm());
  };

  // ---------------- EDIT MODE ----------------
  const handleEdit = (room) => {
    dispatch(setEditMode(room));
  };

  // ---------------- DELETE ----------------
  const handleDelete = async (id) => {
    if (!confirm("Are you sure to delete?")) return;
    await deleteRoom(id).unwrap();
    alert("Deleted Successfully!");
  };

  return (
    <div className="max-w-4xl mx-auto p-6 min-h-screen">
      <h1 className="text-3xl font-bold text-center mb-6">
        {editRoomId ? "Edit Room" : "Seller Dashboard – Add Room"}
      </h1>

      {/* Step Indicator */}
      <div className="flex justify-between mb-6">
        {[1, 2, 3, 4].map((s) => (
          <div
            key={s}
            className={`w-8 h-8 flex items-center justify-center rounded-full ${
              step === s ? "bg-blue-600 text-white" : "bg-gray-300"
            }`}
          >
            {s}
          </div>
        ))}
      </div>

      {/* Steps */}
      {step === 1 && <Step1BasicInfo />}
      {step === 2 && <Step2Location />}
      {step === 3 && <Step3Details />}
      {step === 4 && (
        <Step4ImagesPricing
          previewImages={previewImages}
          handleImage={handleImage}
          removeImage={removeImage}
        />
      )}

      {/* Buttons */}
      <div className="flex justify-between mt-8">
        {step > 1 ? (
          <button
            className="bg-gray-400 px-4 py-2 text-white"
            onClick={handleBack}
          >
            Back
          </button>
        ) : (
          <div />
        )}

        {step < 4 ? (
          <button
            className="bg-blue-600 px-4 py-2 text-white"
            onClick={handleNext}
          >
            Next
          </button>
        ) : (
          <button
            className="bg-green-600 px-4 py-2 w-full text-white"
            disabled={isLoading}
            onClick={handleSubmit}
          >
            {editRoomId ? "Update Room" : "Submit"}
          </button>
        )}
      </div>

      {/* Rooms List */}
      <h2 className="text-2xl font-bold mt-16 mb-4">Your Rooms</h2>

      {roomsLoading ? (
        <p>Loading...</p>
      ) : myRoomsData?.data?.length === 0 ? (
        <p>No rooms added yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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

