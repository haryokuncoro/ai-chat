package com.haryo.spring_ai.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "chat_message")
@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class ChatMessage {

    @Id
    private UUID id;

    private UUID sessionId;

    private String role;

    @Column(columnDefinition = "TEXT")
    private String content;

    private LocalDateTime createdAt;
}