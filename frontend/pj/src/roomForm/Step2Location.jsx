import { useSelector, useDispatch } from "react-redux";
import { updateField } from "../features/roomFormSlice";

export default function Step2Location() {
  const dispatch = useDispatch();
  const { form } = useSelector((state) => state.roomForm);

  const change = (name, value) =>
    dispatch(updateField({ name, value }));

  return (
    <div className="flex flex-col gap-4">

      <input
        className="border p-2 rounded"
        placeholder="Country"
        value={form.country}
        onChange={(e) => change("country", e.target.value)}
      />

      <input
        className="border p-2 rounded"
        placeholder="State"
        value={form.state}
        onChange={(e) => change("state", e.target.value)}
      />

      <input
        className="border p-2 rounded"
        placeholder="City"
        value={form.city}
        onChange={(e) => change("city", e.target.value)}
      />

      <input
        className="border p-2 rounded"
        placeholder="Full Address"
        value={form.fullAddress}
        onChange={(e) => change("fullAddress", e.target.value)}
      />

      <input
        className="border p-2 rounded"
        placeholder="Zip Code"
        value={form.zipCode}
        onChange={(e) => change("zipCode", e.target.value)}
      />

    </div>
  );
}
