import { useSelector, useDispatch } from "react-redux";
import { updateField } from "../features/roomFormSlice";

export default function Step4ImagesPricing({
  previewImages,
  handleImage,
  removeImage
}) {

  const dispatch = useDispatch();
  const { form } = useSelector((state) => state.roomForm);

  const change = (n, v) => dispatch(updateField({ name: n, value: v }));

  return (
    <div className="flex flex-col gap-4">

      <select
        className="border p-2 rounded"
        value={form.availabilityStatus}
        onChange={(e) => change("availabilityStatus", e.target.value)}
      >
        <option>AVAILABLE</option>
        <option>BLOCKED</option>
      </select>

      <input
        className="border p-2 rounded"
        placeholder="Base Price"
        value={form.basePricePerNight}
        onChange={(e) => change("basePricePerNight", e.target.value)}
      />

      <input
        className="border p-2 rounded"
        placeholder="Discount Price"
        value={form.discountPrice}
        onChange={(e) => change("discountPrice", e.target.value)}
      />

      <select
        className="border p-2 rounded"
        value={form.cancellationPolicy}
        onChange={(e) => change("cancellationPolicy", e.target.value)}
      >
        <option value="">Select Cancellation</option>
        <option>Free Cancellation</option>
        <option>No Refund</option>
      </select>

      {[0, 1, 2].map((i) => (
        <div key={i}>
          <p className="font-semibold mb-1">Image {i + 1}</p>

          <input
            type="file"
            className="border p-2 rounded"
            onChange={(e) => handleImage(i, e.target.files[0])}
          />

          {previewImages[i] && (
            <div className="relative mt-2 inline-block">
              <img src={previewImages[i]} className="h-24 w-24 object-cover rounded border" />

              <button
                className="absolute top-1 right-1 bg-red-600 text-white text-xs px-2 py-1 rounded-full"
                onClick={() => removeImage(i)}
              >
                X
              </button>
            </div>
          )}
        </div>
      ))}

    </div>
  );
}
