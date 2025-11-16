import { useSelector, useDispatch } from "react-redux";
import { updateField } from "../features/roomFormSlice";

export default function Step3Details() {
  const dispatch = useDispatch();
  const { form } = useSelector((state) => state.roomForm);

  const change = (n, v) => dispatch(updateField({ name: n, value: v }));

  return (
    <div className="flex flex-col gap-4">

      <input
        className="border p-2 rounded"
        placeholder="Max Guests"
        value={form.maxGuests}
        onChange={(e) => change("maxGuests", e.target.value)}
      />

      <select
        className="border p-2 rounded"
        value={form.bedType}
        onChange={(e) => change("bedType", e.target.value)}
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
        onChange={(e) => change("numberOfBeds", e.target.value)}
      />

      <input
        className="border p-2 rounded"
        placeholder="Room Size"
        value={form.roomSize}
        onChange={(e) => change("roomSize", e.target.value)}
      />

    </div>
  );
}
