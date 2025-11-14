import { useAllRoomsQuery } from "../services/authApi";
import HotelCard from "../components/HotelCard";

export default function ViewHotelsPage() {

  const { data, isLoading } = useAllRoomsQuery();

  if (isLoading) return <p className="text-center mt-10">Loading hotels...</p>;

  const rooms = data?.data || [];

  return (
    <div className="max-w-6xl mx-auto p-6 min-h-screen">

      <h1 className="text-3xl font-bold text-center mb-8">Available Hotels</h1>

      {rooms.length === 0 ? (
        <p className="text-center text-gray-600">No hotels found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {rooms.map((room) => (
            <HotelCard key={room.id} room={room} />
          ))}
        </div>
      )}
    </div>
  );
}
