package com.example.banking.backend.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.simp.config.ChannelRegistration;
import org.springframework.messaging.simp.stomp.StompCommand;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.ChannelInterceptor;
import org.springframework.messaging.support.MessageHeaderAccessor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

import com.example.banking.backend.security.jwt.JwtUtils;
import com.example.banking.backend.security.service.UserDetailsImpl;
import com.example.banking.backend.security.service.UserDetailsServiceImpl;

import lombok.RequiredArgsConstructor;

@Configuration
@Order(Ordered.HIGHEST_PRECEDENCE + 99)
@RequiredArgsConstructor
public class WebSocketAuthenticationConfig implements WebSocketMessageBrokerConfigurer {

    private final JwtUtils jwtUtils;
    private final UserDetailsServiceImpl userDetailsService;    @Override
    public void configureClientInboundChannel(ChannelRegistration registration) {
        registration.interceptors(new ChannelInterceptor() {
            @Override
            public Message<?> preSend(Message<?> message, MessageChannel channel) {                StompHeaderAccessor accessor = MessageHeaderAccessor.getAccessor(message, StompHeaderAccessor.class);
                  if (accessor != null && StompCommand.CONNECT.equals(accessor.getCommand())) {
                    System.out.println("\n=== WebSocket Connection Attempt ===");
                    System.out.println("Headers: " + accessor.toNativeHeaderMap());
                    String authorizationHeader = accessor.getFirstNativeHeader("Authorization");
                    
                    if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
                        String token = null;
                        try {
                            token = authorizationHeader.substring(7);
                            System.out.println("Validating token...");
                            
                            if (jwtUtils.validateJwtToken(token)) {
                                String username = jwtUtils.getUsernameFromJwtToken(token);
                                System.out.println("Token valid for user: " + username);
                                
                                UserDetailsImpl userDetails = (UserDetailsImpl) userDetailsService.loadUserByUsername(username);
                                System.out.println("User details loaded: " + userDetails.getId());
                                
                                UsernamePasswordAuthenticationToken authentication = 
                                    new UsernamePasswordAuthenticationToken(
                                        userDetails, 
                                        null, 
                                        userDetails.getAuthorities()
                                    );
                                
                                SecurityContextHolder.getContext().setAuthentication(authentication);
                                accessor.setUser(authentication);
                                
                                System.out.println("WebSocket authentication successful");
                                System.out.println("User ID: " + userDetails.getId());
                                System.out.println("Username: " + userDetails.getUsername());
                                System.out.println("Authorities: " + userDetails.getAuthorities());
                            } else {
                                System.err.println("Token validation failed");
                            }
                        } catch (Exception e) {
                            System.err.println("\n=== WebSocket Authentication Error ===");
                            System.err.println("Error type: " + e.getClass().getSimpleName());
                            System.err.println("Error message: " + e.getMessage());
                            System.err.println("Token: " + (token != null ? token.substring(0, Math.min(10, token.length())) + "..." : "null"));
                            e.printStackTrace();
                        }
                    } else {
                        System.err.println("No valid authorization header found");
                        System.err.println("Header value: " + authorizationHeader);
                    }
                    System.out.println("=================================\n");
                }                
                return message;
            }
        });
    }
}
