package HotelApp.com.example.HotelApp.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class LoginResponseDTO {
    private String id;
    private String username;
    private String email;
    private String role;
    private String token;   // 🔥 token added here
}

