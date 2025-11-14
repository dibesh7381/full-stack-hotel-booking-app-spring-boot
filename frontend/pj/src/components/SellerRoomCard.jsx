import { useState } from "react";
import { Edit, Trash2, MapPin, BedDouble, ChevronLeft, ChevronRight } from "lucide-react";

function SellerRoomCard({ room, onEdit, onDelete }) {

  const images = room.images && room.images.length > 0 ? room.images : [
    "https://via.placeholder.com/500"
  ];

  const [index, setIndex] = useState(0);

  const nextSlide = () => {
    setIndex((prev) => (prev + 1) % images.length);
  };

  const prevSlide = () => {
    setIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <>
      <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition p-4 border">

        {/* ⭐ IMAGE SLIDER */}
        <div className="relative w-full h-56 rounded-xl overflow-hidden">

          {/* Current Image */}
          <img
            src={images[index]}
            alt="Room"
            className="w-full h-full object-cover transition-all duration-300"
          />

          {/* Prev Button */}
          {images.length > 1 && (
            <button
              onClick={prevSlide}
              className="absolute top-1/2 left-3 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white rounded-full p-2"
            >
              <ChevronLeft size={20} />
            </button>
          )}

          {/* Next Button */}
          {images.length > 1 && (
            <button
              onClick={nextSlide}
              className="absolute top-1/2 right-3 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white rounded-full p-2"
            >
              <ChevronRight size={20} />
            </button>
          )}

          {/* Dots Indicators */}
          <div className="absolute bottom-3 w-full flex justify-center gap-2">
            {images.map((_, i) => (
              <div
                key={i}
                className={`w-2.5 h-2.5 rounded-full transition 
                ${i === index ? "bg-white" : "bg-white/50"}`}
              />
            ))}
          </div>
        </div>

        {/* ⭐ ROOM DETAILS */}
        <h3 className="text-xl font-semibold text-gray-900 mt-3">{room.roomTitle}</h3>
        <p className="text-gray-600">{room.hotelName}</p>

        {/* ⭐ LOCATION */}
        <p className="flex items-center mt-1 text-gray-500 text-sm">
          <MapPin size={16} className="mr-1" />
          {room.city}, {room.country}
        </p>

        {/* ⭐ BED INFO */}
        <p className="flex items-center text-gray-500 text-sm mt-1">
          <BedDouble size={16} className="mr-1" />
          {room.bedType} • {room.numberOfBeds} Beds
        </p>

        {/* ⭐ PRICE + STATUS */}
        <div className="flex justify-between items-center mt-4">
          <span className="text-2xl font-bold text-blue-600">
            ₹{room.basePricePerNight}
          </span>

          <span
            className={`px-3 py-1 rounded-full text-xs font-semibold 
          ${room.availabilityStatus === "AVAILABLE"
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-600"
            }`}
          >
            {room.availabilityStatus}
          </span>
        </div>

        {/* ⭐ ACTION BUTTONS */}
        <div className="grid grid-cols-2 gap-3 mt-5">
          <button
            onClick={onEdit}
            className="flex items-center justify-center gap-1 bg-yellow-500 hover:bg-yellow-600 text-white font-medium py-2 rounded-lg transition"
          >
            <Edit size={18} /> Edit
          </button>

          <button
            onClick={onDelete}
            className="flex items-center justify-center gap-1 bg-red-600 hover:bg-red-700 text-white font-medium py-2 rounded-lg transition"
          >
            <Trash2 size={18} /> Delete
          </button>
        </div>

      </div>
    </>
  );
}

export default SellerRoomCard;

