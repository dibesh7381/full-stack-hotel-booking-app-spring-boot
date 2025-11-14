package HotelApp.com.example.HotelApp.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.util.List;

@Data
@Document(collection = "rooms")
public class Room {

    @Id
    private String id;

    private String sellerId;

    private String roomTitle;
    private String hotelName;
    private String roomType;

    private String acType;   // AC / NON-AC

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

    // ⭐ MULTIPLE IMAGES — correct structure
    private List<String> images;

    private long createdAt;
}

