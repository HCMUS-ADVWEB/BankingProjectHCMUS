package com.example.banking.backend.security.jwt;

import com.example.banking.backend.model.User;
import com.example.banking.backend.security.service.UserDetailsImpl;
import io.jsonwebtoken.*;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.sql.Date;
import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneId;

@Component
@Slf4j
public class JwtUtils {

    @Value("${security.jwt.secret}")
    private String jwtSecret;

    @Value("${security.jwt.expiration}")
    private int jwtExpiration;

    public String generateAccessToken(UserDetailsImpl userDetails) {
        return Jwts.builder()
                .setSubject(userDetails.getUsername())
                .claim("id", userDetails.getId())
                .claim("email", userDetails.getEmail())
                .claim("isActive", userDetails.getIsActive())
                .setIssuedAt(Date.valueOf(LocalDate.now(ZoneId.of("Asia/Ho_Chi_Minh"))))
                .setExpiration(Date.from(Instant.now().plusSeconds(jwtExpiration)))
                .signWith(key(), SignatureAlgorithm.HS256)
                .compact();
    }

    public String generateAccessToken(User user) {
        UserDetailsImpl userDetails = UserDetailsImpl.build(user);
        return generateAccessToken(userDetails);
    }

    private Key key() {
        return Keys.hmacShaKeyFor(Decoders.BASE64.decode(jwtSecret));
    }

    public String getUsernameFromJwtToken(String token) {
        return Jwts.parserBuilder().setSigningKey(key()).build()
                .parseClaimsJws(token).getBody().getSubject();
    }

    public String getUserIdFromJwtToken(String token) {
        return Jwts.parserBuilder().setSigningKey(key()).build()
                .parseClaimsJws(token).getBody().get("id", String.class);
    }

    public String getUserEmailFromJwtToken(String token) {
        return Jwts.parserBuilder().setSigningKey(key()).build()
                .parseClaimsJws(token).getBody().get("email", String.class);
    }

    public boolean validateJwtToken(String authToken) {
        try {
            Jwts.parserBuilder().setSigningKey(key()).build().parse(authToken);
            return true;
        } catch (MalformedJwtException e) {
            log.error("Invalid JWT token: {}", e.getMessage());
        } catch (ExpiredJwtException e) {
            log.error("JWT token is expired: {}", e.getMessage());
        } catch (UnsupportedJwtException e) {
            log.error("JWT token is unsupported: {}", e.getMessage());
        } catch (IllegalArgumentException e) {
            log.error("JWT claims string is empty: {}", e.getMessage());
        } catch (Exception e) {
            log.error("Invalid JWT: {}", e.getMessage());
        }
        return false;
    }
}
