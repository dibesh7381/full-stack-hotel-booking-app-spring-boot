import { useState } from "react";
import { MapPin, BedDouble, ChevronLeft, ChevronRight } from "lucide-react";
import { useProfileQuery } from "../services/authApi";   // ⭐ ADD THIS

function HotelCard({ room }) {

  const { data } = useProfileQuery();
  const role = data?.data?.role;    // ⭐ current user role

  const images = room.images && room.images.length > 0 ? room.images : [
    "https://via.placeholder.com/500"
  ];

  const [index, setIndex] = useState(0);

  const nextSlide = () => setIndex((prev) => (prev + 1) % images.length);
  const prevSlide = () => setIndex((prev) => (prev - 1 + images.length) % images.length);

  return (
    <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition p-4 border">

      {/* ⭐ IMAGE SLIDER */}
      <div className="relative w-full h-56 rounded-xl overflow-hidden">

        <img
          src={images[index]}
          alt="Room"
          className="w-full h-full object-cover"
        />

        {images.length > 1 && (
          <>
            <button
              onClick={prevSlide}
              className="absolute top-1/2 left-3 -translate-y-1/2 bg-black/40 hover:bg-black/60 p-2 rounded-full text-white"
            >
              <ChevronLeft size={20} />
            </button>

            <button
              onClick={nextSlide}
              className="absolute top-1/2 right-3 -translate-y-1/2 bg-black/40 hover:bg-black/60 p-2 rounded-full text-white"
            >
              <ChevronRight size={20} />
            </button>
          </>
        )}

        <div className="absolute bottom-3 w-full flex justify-center gap-2">
          {images.map((_, i) => (
            <div
              key={i}
              className={`w-2.5 h-2.5 rounded-full ${i === index ? "bg-white" : "bg-white/50"}`}
            />
          ))}
        </div>
      </div>

      {/* ⭐ HOTEL INFO */}
      <h3 className="text-xl font-semibold text-gray-900 mt-3">{room.roomTitle}</h3>
      <p className="text-gray-600 text-sm">{room.hotelName}</p>

      <p className="flex items-center mt-1 text-gray-500 text-sm">
        <MapPin size={16} className="mr-1" />
        {room.city}, {room.country}
      </p>

      <p className="flex items-center text-gray-500 text-sm mt-1">
        <BedDouble size={16} className="mr-1" />
        {room.bedType} • {room.numberOfBeds} Beds
      </p>

      <p className="text-blue-600 text-xl font-bold mt-3">
        ₹{room.basePricePerNight} / night
      </p>

      {/* ⭐ BOOK BUTTON (Disable if seller) */}
      <button
        disabled={role === "SELLER"}
        className={`w-full mt-4 p-2 rounded-xl font-semibold transition
          ${role === "SELLER"
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-blue-600 hover:bg-blue-700 text-white"
          }`}
      >
        {role === "SELLER" ? "Sellers cannot book" : "Book Now"}
      </button>
    </div>
  );
}

export default HotelCard;
