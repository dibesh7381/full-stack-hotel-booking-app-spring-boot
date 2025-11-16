import { useSelector, useDispatch } from "react-redux";
import { updateField } from "../features/roomFormSlice";

export default function Step1BasicInfo() {
  const dispatch = useDispatch();

  const { form } = useSelector((state) => state.roomForm);

  const change = (name, value) => {
    dispatch(updateField({ name, value }));
  };

  return (
    <div className="flex flex-col gap-4">

      <input
        className="border p-2 rounded"
        placeholder="Room Title"
        value={form.roomTitle}
        onChange={(e) => change("roomTitle", e.target.value)}
      />

      <input
        className="border p-2 rounded"
        placeholder="Hotel Name"
        value={form.hotelName}
        onChange={(e) => change("hotelName", e.target.value)}
      />

      <select
        className="border p-2 rounded"
        value={form.roomType}
        onChange={(e) => change("roomType", e.target.value)}
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
        onChange={(e) => change("acType", e.target.value)}
      >
        <option value="">Select AC Type</option>
        <option value="AC">AC</option>
        <option value="NON_AC">NON AC</option>
      </select>

    </div>
  );
}

