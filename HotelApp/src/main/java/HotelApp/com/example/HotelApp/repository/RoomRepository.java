package HotelApp.com.example.HotelApp.repository;

import HotelApp.com.example.HotelApp.model.Room;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface RoomRepository extends MongoRepository<Room, String> {

    // Fetch all rooms created by seller
    List<Room> findBySellerId(String sellerId);
}
