package HotelApp.com.example.HotelApp.service;

import HotelApp.com.example.HotelApp.dto.*;
import HotelApp.com.example.HotelApp.exception.CustomException;
import HotelApp.com.example.HotelApp.model.Room;
import HotelApp.com.example.HotelApp.model.User;
import HotelApp.com.example.HotelApp.repository.RoomRepository;
import HotelApp.com.example.HotelApp.repository.UserRepository;
import HotelApp.com.example.HotelApp.security.JwtUtil;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;

import lombok.RequiredArgsConstructor;

import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final RoomRepository roomRepository;
    private final PasswordEncoder passwordEncoder;
    private final Cloudinary cloudinary;
    private final JwtUtil jwtUtil;


    // -------------------------------------------------------------
    // SIGNUP
    // -------------------------------------------------------------
    public SignupResponseDTO signup(SignupRequestDTO dto) {

        if (userRepository.existsByEmail(dto.getEmail())) {
            throw new CustomException("Email already exists", HttpStatus.BAD_REQUEST);
        }

        if (userRepository.existsByUsername(dto.getUsername())) {
            throw new CustomException("Username already exists", HttpStatus.BAD_REQUEST);
        }

        User user = new User();
        user.setUsername(dto.getUsername());
        user.setEmail(dto.getEmail());
        user.setPassword(passwordEncoder.encode(dto.getPassword()));
        user.setRole("USER");
        user.setCreatedAt(System.currentTimeMillis());

        userRepository.save(user);

        return new SignupResponseDTO(
                user.getId(), user.getUsername(), user.getEmail(), user.getRole()
        );
    }


    // -------------------------------------------------------------
    // LOGIN
    // -------------------------------------------------------------
    public LoginResponseDTO login(LoginRequestDTO dto) {

        User user = userRepository.findByEmail(dto.getEmail())
                .orElseThrow(() -> new CustomException("Invalid credentials", HttpStatus.UNAUTHORIZED));

        if (!passwordEncoder.matches(dto.getPassword(), user.getPassword())) {
            throw new CustomException("Invalid credentials", HttpStatus.UNAUTHORIZED);
        }

        String token = jwtUtil.generateToken(user.getEmail(), user.getRole());

        return new LoginResponseDTO(
                user.getId(), user.getUsername(), user.getEmail(), user.getRole(), token
        );
    }


    // -------------------------------------------------------------
    // GET PROFILE
    // -------------------------------------------------------------
    public ProfileResponseDTO getProfile(String email) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new CustomException("User not found", HttpStatus.NOT_FOUND));

        return new ProfileResponseDTO(
                user.getId(), user.getUsername(), user.getEmail(), user.getRole(), null
        );
    }


    // -------------------------------------------------------------
    // UPDATE PROFILE
    // -------------------------------------------------------------
    public UpdateProfileResponseDTO updateProfile(String currentEmail, UpdateProfileRequestDTO dto) {

        User user = userRepository.findByEmail(currentEmail)
                .orElseThrow(() -> new CustomException("User not found", HttpStatus.NOT_FOUND));

        if (!user.getUsername().equals(dto.getUsername()) &&
                userRepository.existsByUsername(dto.getUsername())) {
            throw new CustomException("Username already exists", HttpStatus.BAD_REQUEST);
        }

        if (!user.getEmail().equals(dto.getEmail()) &&
                userRepository.existsByEmail(dto.getEmail())) {
            throw new CustomException("Email already exists", HttpStatus.BAD_REQUEST);
        }

        user.setUsername(dto.getUsername());
        user.setEmail(dto.getEmail());
        userRepository.save(user);

        return new UpdateProfileResponseDTO(
                user.getId(), user.getUsername(), user.getEmail(), user.getRole()
        );
    }


    // -------------------------------------------------------------
    // BECOME SELLER
    // -------------------------------------------------------------
    public ProfileResponseDTO becomeSeller(String email) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new CustomException("User not found", HttpStatus.NOT_FOUND));

        if ("SELLER".equals(user.getRole())) {
            throw new CustomException("Already seller", HttpStatus.BAD_REQUEST);
        }

        user.setRole("SELLER");
        userRepository.save(user);

        String newToken = jwtUtil.generateToken(user.getEmail(), "SELLER");

        return new ProfileResponseDTO(
                user.getId(), user.getUsername(), user.getEmail(), "SELLER", newToken
        );
    }


    // -------------------------------------------------------------
// ⭐ CREATE ROOM — List<String> images
// -------------------------------------------------------------
    public RoomResponseDTO createRoom(String sellerEmail, RoomCreateRequestDTO dto) {

        User seller = userRepository.findByEmail(sellerEmail)
                .orElseThrow(() -> new CustomException("Seller not found", HttpStatus.NOT_FOUND));

        if (!"SELLER".equals(seller.getRole())) {
            throw new CustomException("Only sellers can add rooms", HttpStatus.FORBIDDEN);
        }

        Room room = new Room();

        // ⭐ Seller ID store (not email)
        room.setSellerId(seller.getId());

        room.setRoomTitle(dto.getRoomTitle());
        room.setHotelName(dto.getHotelName());
        room.setRoomType(dto.getRoomType());
        room.setAcType(dto.getAcType());
        room.setCountry(dto.getCountry());
        room.setState(dto.getState());
        room.setCity(dto.getCity());
        room.setFullAddress(dto.getFullAddress());
        room.setZipCode(dto.getZipCode());
        room.setMaxGuests(dto.getMaxGuests());
        room.setBedType(dto.getBedType());
        room.setNumberOfBeds(dto.getNumberOfBeds());
        room.setRoomSize(dto.getRoomSize());
        room.setAvailabilityStatus(dto.getAvailabilityStatus());
        room.setBasePricePerNight(dto.getBasePricePerNight());
        room.setDiscountPrice(dto.getDiscountPrice());
        room.setCancellationPolicy(dto.getCancellationPolicy());

        // ⭐ Upload each base64 image
        List<String> uploadedUrls = new ArrayList<>();

        if (dto.getImages() != null && !dto.getImages().isEmpty()) {

            for (String base64 : dto.getImages()) {
                try {
                    Map upload = cloudinary.uploader().upload(
                            base64,
                            ObjectUtils.asMap("folder", "hotel-app/rooms")
                    );
                    uploadedUrls.add(upload.get("secure_url").toString());

                } catch (Exception e) {
                    throw new CustomException("Image upload failed: " + e.getMessage(), HttpStatus.BAD_REQUEST);
                }
            }
        }

        room.setImages(uploadedUrls);
        room.setCreatedAt(System.currentTimeMillis());

        Room saved = roomRepository.save(room);
        return mapRoom(saved);
    }

    // -------------------------------------------------------------
// ⭐ UPDATE ROOM — List<String> images
// -------------------------------------------------------------
    public RoomResponseDTO updateRoom(String sellerEmail, String roomId, RoomUpdateRequestDTO dto) {

        Room room = roomRepository.findById(roomId)
                .orElseThrow(() -> new CustomException("Room not found", HttpStatus.NOT_FOUND));

        User seller = userRepository.findByEmail(sellerEmail)
                .orElseThrow(() -> new CustomException("User not found", HttpStatus.NOT_FOUND));

        // ⭐ Check based on sellerId (user.id)
        if (!room.getSellerId().equals(seller.getId())) {
            throw new CustomException("Unauthorized", HttpStatus.UNAUTHORIZED);
        }

        room.setRoomTitle(dto.getRoomTitle());
        room.setHotelName(dto.getHotelName());
        room.setRoomType(dto.getRoomType());
        room.setAcType(dto.getAcType());
        room.setCountry(dto.getCountry());
        room.setState(dto.getState());
        room.setCity(dto.getCity());
        room.setFullAddress(dto.getFullAddress());
        room.setZipCode(dto.getZipCode());
        room.setMaxGuests(dto.getMaxGuests());
        room.setBedType(dto.getBedType());
        room.setNumberOfBeds(dto.getNumberOfBeds());
        room.setRoomSize(dto.getRoomSize());
        room.setAvailabilityStatus(dto.getAvailabilityStatus());
        room.setBasePricePerNight(dto.getBasePricePerNight());
        room.setDiscountPrice(dto.getDiscountPrice());
        room.setCancellationPolicy(dto.getCancellationPolicy());

        // ⭐ CASE 1 → KEEP OLD IMAGES
        if (dto.getImages() == null || dto.getImages().isEmpty()) {
            // keep existing images
        }

        // ⭐ CASE 2 → NEW IMAGES UPLOAD
        else {

            List<String> uploadedUrls = new ArrayList<>();

            for (String img : dto.getImages()) {

                if (img == null || img.trim().isEmpty()) continue;

                // ⭐ Already URL → keep it
                if (img.startsWith("http")) {
                    uploadedUrls.add(img);
                    continue;
                }

                try {
                    Map upload = cloudinary.uploader().upload(
                            img,
                            ObjectUtils.asMap("folder", "hotel-app/rooms")
                    );
                    uploadedUrls.add(upload.get("secure_url").toString());

                } catch (Exception e) {
                    throw new CustomException("Image upload failed: " + e.getMessage(), HttpStatus.BAD_REQUEST);
                }
            }

            room.setImages(uploadedUrls);
        }

        Room updated = roomRepository.save(room);
        return mapRoom(updated);
    }

    // -------------------------------------------------------------
// ⭐ GET SELLER ROOMS
// -------------------------------------------------------------
    public List<RoomResponseDTO> getSellerRooms(String sellerEmail) {

        // ⭐ DB access service layer me (correct place)
        User user = userRepository.findByEmail(sellerEmail)
                .orElseThrow(() -> new CustomException("User not found", HttpStatus.NOT_FOUND));

        // ⭐ Actual sellerId = user.id
        String sellerId = user.getId();

        List<Room> rooms = roomRepository.findBySellerId(sellerId);

        List<RoomResponseDTO> list = new ArrayList<>();
        rooms.forEach(r -> list.add(mapRoom(r)));

        return list;
    }


    // -------------------------------------------------------------
// ⭐ GET ALL ROOMS (PUBLIC)
// -------------------------------------------------------------
    public List<RoomResponseDTO> getAllRooms() {

        List<Room> rooms = roomRepository.findAll();

        List<RoomResponseDTO> list = new ArrayList<>();
        rooms.forEach(r -> list.add(mapRoom(r)));

        return list;
    }

    // -------------------------------------------------------------
// ⭐ DELETE ROOM
// -------------------------------------------------------------
    public String deleteRoom(String sellerEmail, String roomId) {

        Room room = roomRepository.findById(roomId)
                .orElseThrow(() -> new CustomException("Room not found", HttpStatus.NOT_FOUND));

        User seller = userRepository.findByEmail(sellerEmail)
                .orElseThrow(() -> new CustomException("User not found", HttpStatus.NOT_FOUND));

        // ⭐ Only owner can delete
        if (!room.getSellerId().equals(seller.getId())) {
            throw new CustomException("Unauthorized", HttpStatus.UNAUTHORIZED);
        }

        roomRepository.delete(room);
        return "Room deleted successfully";
    }


    // -------------------------------------------------------------
    // MAP ROOM → DTO
    // -------------------------------------------------------------
    private RoomResponseDTO mapRoom(Room r) {
        return new RoomResponseDTO(
                r.getId(),
                r.getSellerId(),
                r.getRoomTitle(),
                r.getHotelName(),
                r.getRoomType(),
                r.getAcType(),
                r.getCountry(),
                r.getState(),
                r.getCity(),
                r.getFullAddress(),
                r.getZipCode(),
                r.getMaxGuests(),
                r.getBedType(),
                r.getNumberOfBeds(),
                r.getRoomSize(),
                r.getAvailabilityStatus(),
                r.getBasePricePerNight(),
                r.getDiscountPrice(),
                r.getCancellationPolicy(),
                r.getImages(),      // ⭐ LIST
                r.getCreatedAt()
        );
    }

    public HomePageDTO getHomePage(){
        return new HomePageDTO("This is HomePage","This page is visible for all users");
    }
}






