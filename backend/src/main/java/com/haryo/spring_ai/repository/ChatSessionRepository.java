package com.haryo.spring_ai.repository;

import com.haryo.spring_ai.entity.ChatSession;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface ChatSessionRepository
        extends JpaRepository<ChatSession, UUID> {
}