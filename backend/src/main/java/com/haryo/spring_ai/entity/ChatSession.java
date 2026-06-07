package com.haryo.spring_ai.entity;


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
@Table(name = "chat_session")
@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class ChatSession {

    @Id
    private UUID id;

    private String title;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;
}