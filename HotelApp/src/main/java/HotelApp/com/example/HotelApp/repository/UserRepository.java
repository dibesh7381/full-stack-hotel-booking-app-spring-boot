package HotelApp.com.example.HotelApp.repository;

import HotelApp.com.example.HotelApp.model.User;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface UserRepository extends MongoRepository<User, String> {

    // Login ke liye email se user find karna
    Optional<User> findByEmail(String email);

    // Signup validation
    boolean existsByEmail(String email);

    boolean existsByUsername(String username);
}

