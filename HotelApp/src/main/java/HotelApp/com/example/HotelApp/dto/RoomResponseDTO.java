package HotelApp.com.example.HotelApp.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class RoomResponseDTO {

    private String id;
    private String sellerId;

    private String roomTitle;
    private String hotelName;
    private String roomType;
    private String acType;

    private String country;
    private String state;
    private String city;
    private String fullAddress;
    private String zipCode;

    private int maxGuests;
    private String bedType;
    private int numberOfBeds;
    private double roomSize;

    private String availabilityStatus;
    private double basePricePerNight;
    private Double discountPrice;
    private String cancellationPolicy;

    // ⭐ list of URLs
    private List<String> images;

    private long createdAt;
}



