package HotelApp.com.example.HotelApp.controller;

import HotelApp.com.example.HotelApp.dto.*;
import HotelApp.com.example.HotelApp.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.http.ResponseCookie;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@CrossOrigin(value = "http://localhost:5173", allowCredentials = "true")
public class AuthController {

    private final AuthService authService;

    // ⭐ SIGNUP
    @PostMapping("/signup")
    @PreAuthorize("permitAll()")
    public ResponseEntity<ApiResponseDTO<SignupResponseDTO>> signup(@RequestBody SignupRequestDTO dto) {

        SignupResponseDTO response = authService.signup(dto);

        return ResponseEntity.ok(
                new ApiResponseDTO<>(true, "User registered successfully", response)
        );
    }

    // ⭐ LOGIN
    @PostMapping("/login")
    @PreAuthorize("permitAll()")
    public ResponseEntity<ApiResponseDTO<LoginResponseDTO>> login(@RequestBody LoginRequestDTO dto) {

        LoginResponseDTO userData = authService.login(dto);

        // Token cookie set
        ResponseCookie cookie = ResponseCookie.from("accessToken", userData.getToken())
                .httpOnly(true)
                .secure(false)
                .path("/")
                .sameSite("Lax")
                .maxAge(7 * 24 * 60 * 60)
                .build();

        return ResponseEntity.ok()
                .header("Set-Cookie", cookie.toString())
                .body(new ApiResponseDTO<>(true, "Login successful", userData));
    }

    // ⭐ LOGOUT
    @PostMapping("/logout")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponseDTO<String>> logout() {

        ResponseCookie clearCookie = ResponseCookie.from("accessToken", "")
                .httpOnly(true)
                .secure(false)
                .path("/")
                .sameSite("Lax")
                .maxAge(0)
                .build();

        return ResponseEntity.ok()
                .header("Set-Cookie", clearCookie.toString())
                .body(new ApiResponseDTO<>(true, "Logged out successfully", "OK"));
    }

    // ⭐ FETCH PROFILE
    @GetMapping("/profile")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponseDTO<ProfileResponseDTO>> profile() {

        String email = (String) SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getPrincipal();

        ProfileResponseDTO profile = authService.getProfile(email);

        return ResponseEntity.ok(
                new ApiResponseDTO<>(true, "Profile fetched successfully", profile)
        );
    }

    // ⭐ UPDATE PROFILE
    @PutMapping("/profile/update")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponseDTO<UpdateProfileResponseDTO>> updateProfile(
            @RequestBody UpdateProfileRequestDTO dto
    ) {

        String email = (String) SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getPrincipal();

        UpdateProfileResponseDTO updated = authService.updateProfile(email, dto);

        return ResponseEntity.ok(
                new ApiResponseDTO<>(true, "Profile updated successfully", updated)
        );
    }

    // ⭐ PUBLIC HOME PAGE
    @GetMapping("/home")
    @PreAuthorize("permitAll()")
    public ResponseEntity<ApiResponseDTO<?>> HomePage() {

        HomePageDTO dto = authService.getHomePage();

        return ResponseEntity.ok(
                new ApiResponseDTO<>(true, "Home page fetched successfully", dto)
        );
    }

    // ⭐ BECOME SELLER
    @PostMapping("/become-seller")
    @PreAuthorize("hasAuthority('USER')")
    public ResponseEntity<ApiResponseDTO<ProfileResponseDTO>> becomeSeller() {

        String email = (String) SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getPrincipal();

        // Service returns updated profile + NEW TOKEN inside it
        ProfileResponseDTO updated = authService.becomeSeller(email);

        // Set new token cookie
        ResponseCookie cookie = ResponseCookie.from("accessToken", updated.getToken())
                .httpOnly(true)
                .secure(false)
                .path("/")
                .sameSite("Lax")
                .maxAge(7 * 24 * 60 * 60)
                .build();

        return ResponseEntity.ok()
                .header("Set-Cookie", cookie.toString())
                .body(new ApiResponseDTO<>(true, "Role updated to SELLER", updated));
    }

    // ⭐ ROOM CONTROLLER ROUTES
    @PostMapping("/rooms")
    @PreAuthorize("hasAuthority('SELLER')")
    public ResponseEntity<ApiResponseDTO<RoomResponseDTO>> createRoom(
            @RequestBody RoomCreateRequestDTO dto
    ) {
        String email = (String) SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getPrincipal();

        RoomResponseDTO room = authService.createRoom(email, dto);

        return ResponseEntity.ok(
                new ApiResponseDTO<>(true, "Room created successfully", room)
        );
    }


    // ⭐ UPDATE ROOM
    @PutMapping("/rooms/{roomId}")
    @PreAuthorize("hasAuthority('SELLER')")
    public ResponseEntity<ApiResponseDTO<RoomResponseDTO>> updateRoom(
            @PathVariable String roomId,
            @RequestBody RoomUpdateRequestDTO dto
    ) {
        String email = (String) SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getPrincipal();

        RoomResponseDTO updated = authService.updateRoom(email, roomId, dto);

        return ResponseEntity.ok(
                new ApiResponseDTO<>(true, "Room updated successfully", updated)
        );
    }



    // ⭐ DELETE ROOM
    @DeleteMapping("/rooms/{roomId}")
    @PreAuthorize("hasAuthority('SELLER')")
    public ResponseEntity<ApiResponseDTO<String>> deleteRoom(
            @PathVariable String roomId
    ) {
        String email = (String) SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getPrincipal();

        authService.deleteRoom(email, roomId);

        return ResponseEntity.ok(
                new ApiResponseDTO<>(true, "Room deleted successfully", "OK")
        );
    }


    // ⭐ GET ROOMS OF LOGGED-IN SELLER
    @GetMapping("/rooms/my")
    @PreAuthorize("hasAuthority('SELLER')")
    public ResponseEntity<ApiResponseDTO<List<RoomResponseDTO>>> getMyRooms() {

        String email = (String) SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getPrincipal();

        // ⭐ Only pass email → no DB access here
        List<RoomResponseDTO> rooms = authService.getSellerRooms(email);

        return ResponseEntity.ok(
                new ApiResponseDTO<>(true, "Seller rooms fetched successfully", rooms)
        );
    }


    // ⭐ PUBLIC — GET ALL ROOMS (FOR HOME PAGE / BUYERS)
    @GetMapping("/rooms")
    @PreAuthorize("permitAll()")
    public ResponseEntity<ApiResponseDTO<List<RoomResponseDTO>>> getAllRooms() {

        List<RoomResponseDTO> rooms = authService.getAllRooms();

        return ResponseEntity.ok(
                new ApiResponseDTO<>(true, "All rooms fetched successfully", rooms)
        );
    }

    // ⭐ PUBLIC — HOME PAGE
    @GetMapping("/homepage")
    @PreAuthorize("permitAll()")
    public ResponseEntity<ApiResponseDTO<?>> homepage() {
        HomePageDTO dto = authService.getHomePage();
        ApiResponseDTO<?> homePage = new ApiResponseDTO<>(true, "Homepage fetched successfully", dto);
        return ResponseEntity.ok().body(homePage);
    }
}


