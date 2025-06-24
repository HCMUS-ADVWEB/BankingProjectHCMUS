package com.example.banking.backend.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.scheduling.concurrent.ThreadPoolTaskScheduler;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;
import org.springframework.context.annotation.Bean;

@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {
      @Bean
    public ThreadPoolTaskScheduler taskScheduler() {
        ThreadPoolTaskScheduler scheduler = new ThreadPoolTaskScheduler();
        scheduler.setPoolSize(2);
        scheduler.setThreadNamePrefix("websocket-heartbeat-thread-");
        return scheduler;
    }
    
    @Override
    public void configureMessageBroker(MessageBrokerRegistry config) {        
        config.enableSimpleBroker("/topic", "/queue", "/user")
            .setHeartbeatValue(new long[]{10000, 10000})
            .setTaskScheduler(taskScheduler());

        config.setApplicationDestinationPrefixes("/app");
        
        config.setUserDestinationPrefix("/user");
        
        System.out.println("""
            WebSocket configuration:
            - Message Broker: Simple Broker
            - Broker destinations: /topic/*, /queue/*, /user/*
            - Application prefix: /app
            - User destinations: /user/{userId}/queue/*, /user/{userId}/topic/*
            - Heartbeat: 10 seconds
            """);
    }

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        System.out.println("Configuring WebSocket endpoints...");
        
        registry.addEndpoint("/ws")
                .setAllowedOrigins("http://localhost:3000")
                .withSockJS()
                .setWebSocketEnabled(true)
                .setHeartbeatTime(10000) // 10 second heartbeat
                .setDisconnectDelay(30000)
                .setSessionCookieNeeded(false)
                .setStreamBytesLimit(512 * 1024)
                .setHttpMessageCacheSize(1000);
                
        System.out.println("WebSocket endpoints configured");
    }
}
